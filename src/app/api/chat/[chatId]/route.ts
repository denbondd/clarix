import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { PromptTemplate } from "langchain/prompts"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getParsedMessages } from "./messages/route";
import { MessageEntity } from "@/lib/entities";

const prompt = PromptTemplate.fromTemplate(
  `Please, generate response based on this context:
  {context}
  My question:
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
      models: true,
    }
  })
  if (!chat || !agent) {
    return new NextResponse(null, { status: 400 })
  }

  const history = await getParsedMessages(prisma, userId, chatId)
  const lastProvidedMessage = providedMessages[providedMessages.length - 1]

  const chatModel = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // if message has negative id, it was created on frontend. Otherwise it is already in DB
  if (lastProvidedMessage.message_id < 0)
    await prisma.messages.create({
      data: {
        content: lastProvidedMessage.content,
        chat_id: chatId,
        role_id: 2
      }
    })

  if (providedMessages[providedMessages.length - 1].role === 'assistant') {
    // regenerate
  } else if (providedMessages[providedMessages.length - 1].role === 'user') {
    // generate
    const embeddingModel = new OpenAIEmbeddings()
    const questionEmb = await embeddingModel.embedQuery(lastProvidedMessage.content)
    const contextData = await prisma.$queryRaw<{
      embedding_id: number,
      content: string,
      file_id: number,
      similarity: number
    }[]>`
    SELECT
      embeddings.embedding_id,
      embeddings.content,
      embeddings.file_id,
      1 - (embedding <=> ${questionEmb}::vector) as similarity
    FROM 
      embeddings
      INNER JOIN files ON files.file_id = embeddings.file_id
      INNER JOIN agent_has_folders ON files.folder_id = agent_has_folders.folder_id
    WHERE
      agent_has_folders.agent_id = ${chat.agent_id}
      AND 1 - (embedding <=> ${questionEmb}::vector) > .7
    ORDER BY similarity DESC
    LIMIT 5;
  `
    const promptText = await prompt.format({
      context: contextData.map(c => c.content).join('\n'),
      question: lastProvidedMessage.content
    })

    const messages = history.map(msg => {
      return {
        content: msg.content,
        role: msg.role,
      }
    }).concat([{ role: 'user', content: promptText }])
    // console.log(promptText)
    console.log(JSON.stringify(messages))

    const response = await chatModel.chat.completions.create({
      messages: messages,
      model: agent.models.tech_name,
      // model: 'gpt-3.5-turbo',
      stream: true
    })

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await prisma.$transaction(async tx => {
          const message = await tx.messages.create({
            data: {
              content: completion,
              chat_id: chatId,
              role_id: 3
            }
          })
          await tx.msg_sources.createMany({
            data: contextData.map(c => {
              return {
                message_id: message.message_id,
                embedding_id: c.embedding_id,
                similarity: c.similarity
              }
            })
          })
        })
      },
    })

    return new StreamingTextResponse(stream)
  }
}
