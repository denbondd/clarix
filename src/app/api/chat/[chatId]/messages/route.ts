import { MessageEntity } from "@/lib/entities"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { userId } = auth()

  const chatId = Number.parseInt(params.chatId)

  const parsedMessages = await getParsedMessages(prisma, userId, chatId)

  return NextResponse.json(parsedMessages)
}

export async function getParsedMessages(prisma: PrismaClient, userId: string | null, chatId: number): Promise<MessageEntity[]> {
  const messages = await prisma.messages.findMany({
    where: {
      chats: {
        user_id: userId as string,
      },
      chat_id: chatId
    },
    select: {
      message_id: true,
      content: true,
      msg_roles: true,
      created_at: true,
      msg_sources: {
        select: {
          embedding_id: true,
          similarity: true,
          embeddings: {
            select: {
              content: true,
              files: {
                select: {
                  name: true,
                  folders: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          },
        }
      },
    },
    orderBy: {
      created_at: "asc"
    }
  })

  const parsedMessages: MessageEntity[] = messages.map(msg => {
    return {
      message_id: msg.message_id,
      created_at: msg.created_at,
      content: msg.content,
      role: msg.msg_roles.name as 'user' | 'assistant' | 'system',
      msg_sources: [{
        content: 'test source',
        embedding_id: 123,
        file_name: 'haha.txt',
        folder_name: 'hafold',
        similarity: 0.81
      }]
      // msg_sources: msg.msg_sources.map(s => {
      //   return {
      //     embedding_id: s.embedding_id,
      //     similarity: s.similarity,
      //     content: s.embeddings.content,
      //     file_name: s.embeddings.files.name,
      //     folder_name: s.embeddings.files.folders.name
      //   }
      // })
    }
  })

  return parsedMessages
}