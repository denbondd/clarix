import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI, PromptLayerChatOpenAI } from "langchain/chat_models/openai"
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema"
import { PromptTemplate } from "langchain/prompts"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { LangChainStream, Message, StreamingTextResponse } from 'ai';
import { BytesOutputParser } from 'langchain/schema/output_parser';

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { userId } = auth()

  const chatId = Number.parseInt(params.chatId)

  const chat = await prisma.chats.findFirst({
    where: {
      user_id: userId as string,
      chat_id: chatId
    },
    select: {
      user_id: true,
      name: true,
      chat_id: true,
      agents: {
        select: {
          agent_id: true,
          name: true
        }
      },
      messages: {
        select: {
          message_id: true,
          content: true,
          msg_roles: true,
          created_at: true,
          msg_sources: true,
        }
      }
    }
  })

  return NextResponse.json(chat)
}

const prompt = PromptTemplate.fromTemplate(
  `Context:
  {context}
  
  Question:
  {question}`
)

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { userId } = auth()
  const chatId = Number.parseInt(params.chatId)

  const allMessages: Message[] = (await req.json()).messages ?? []

  const chat = await prisma.chats.findFirst({
    where: {
      user_id: userId as string,
      chat_id: chatId
    },
    select: {
      chat_id: true,
      agent_id: true,
    }
  })
  const agent = await prisma.agents.findFirst({
    where: {
      user_id: userId as string,
      agent_id: chat?.agent_id
    },
    select: {
      system_prompt: true,
      temperature: true,
      models: true
    }
  })
  if (!chat || !agent) {
    return new NextResponse(null, { status: 400 })
  }

  // const embeddingModel = new OpenAIEmbeddings()
  // const questionEmb = await embeddingModel.embedQuery(question)
  // const contextData = await prisma.$queryRaw<{
  //   embedding_id: number,
  //   content: string,
  //   file_id: number,
  //   similarity: number
  // }[]>`
  //   SELECT
  //     embedding_id,
  //     content,
  //     file_id,
  //     1 - (embedding <=> ${questionEmb}::vector) as similarity
  //   FROM embeddings
  //   where 1 - (embedding <=> ${questionEmb}::vector) > .75
  //   ORDER BY  similarity DESC
  //   LIMIT 5;
  // `

  const chatModel = new PromptLayerChatOpenAI({
    temperature: agent.temperature / 10,
    modelName: agent.models.tech_name,
    streaming: true
  })

  await prisma.messages.create({
    data: {
      content: allMessages[allMessages.length - 1].content,
      chat_id: chatId,
      role_id: 2
    }
  })

  const { stream, handlers } = LangChainStream({
    async onCompletion(completion) {
      await prisma.messages.create({
        data: {
          content: completion,
          chat_id: chatId,
          role_id: 3
        }
      })
    },
  });

  chatModel.call(
    allMessages.map(m =>
      m.role == 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    ), {}, [handlers]
  )

  return new StreamingTextResponse(stream)
}
