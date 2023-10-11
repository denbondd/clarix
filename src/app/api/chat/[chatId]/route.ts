import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { PromptTemplate } from "langchain/prompts"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import OpenAI from 'openai';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { getParsedMessages } from "./messages/route";
import { MessageEntity } from "@/lib/entities";

const prompt = PromptTemplate.fromTemplate(
  `Context:
  {context}
  
  Question:
  {question}`
)

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { userId } = auth()
  const chatId = Number.parseInt(params.chatId)

  const providedMessages: MessageEntity[] = (await req.json()).messages ?? []

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

  // const history = getParsedMessages(prisma, userId, chatId)

  // if (providedMessages[providedMessages.length - 1].role === 'assistant') {
  //   // regenerate
  // } else if (providedMessages[providedMessages.length - 1].role === 'user') {
  //   // 
  // }
  // return new NextResponse()

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

  const chatModel = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // console.log(providedMessages)
  // return new NextResponse()

  const lastMessage = providedMessages[providedMessages.length - 1]
  if (lastMessage.message_id < 0)
    await prisma.messages.create({
      data: {
        content: lastMessage.content,
        chat_id: chatId,
        role_id: 2
      }
    })

  const response = await chatModel.chat.completions.create({
    messages: providedMessages.map(msg => {
      return {
        content: msg.content,
        role: msg.role,
      }
    }),
    // model: agent.models.tech_name,
    model: 'gpt-3.5-turbo',
    stream: true
  })

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await prisma.messages.create({
        data: {
          content: completion,
          chat_id: chatId,
          role_id: 3
        }
      })
    },
    onFinal(completion) {
      console.log(`onFinal: ${completion}`)
    },
    onToken(token) {
      console.log(`onToken: ${token}`)
    },
    onStart() {
      console.log('onStart')
    },
  })

  return new StreamingTextResponse(stream)
}
