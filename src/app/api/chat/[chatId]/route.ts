import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

import { PromptTemplate } from "langchain/prompts"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import OpenAI from 'openai';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';

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

  // const chat = await prisma.chats.findFirst({
  //   where: {
  //     user_id: userId as string,
  //     chat_id: chatId
  //   },
  //   select: {
  //     chat_id: true,
  //     agent_id: true,
  //   }
  // })
  // const agent = await prisma.agents.findFirst({
  //   where: {
  //     user_id: userId as string,
  //     agent_id: chat?.agent_id
  //   },
  //   select: {
  //     system_prompt: true,
  //     temperature: true,
  //     models: true
  //   }
  // })
  // if (!chat || !agent) {
  //   return new NextResponse(null, { status: 400 })
  // }

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

  await prisma.messages.create({
    data: {
      content: allMessages[allMessages.length - 1].content,
      chat_id: chatId,
      role_id: 2
    }
  })

  const response = await chatModel.chat.completions.create({
    messages: allMessages,
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
  })

  return new StreamingTextResponse(stream)
}
