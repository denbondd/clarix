import { getServerSessionUserId } from "@/lib/auth"
import { MessageEntity } from "@/lib/entities"
import { prisma } from "@/lib/prisma"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const userId = await getServerSessionUserId()
  const chatId = Number.parseInt(params.chatId)

  const parsedMessages = await getParsedMessages(prisma, userId, chatId)

  return NextResponse.json(parsedMessages)
}

export async function getParsedMessages(prisma: PrismaClient, userId: number, chatId: number): Promise<MessageEntity[]> {
  const messages = await prisma.messages.findMany({
    where: {
      chats: {
        user_id: userId,
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
                  file_id: true,
                  name: true,
                  folders: {
                    select: {
                      folder_id: true,
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
      msg_sources: msg.msg_sources.map(s => {
        return {
          embedding_id: s.embedding_id,
          similarity: s.similarity,
          content: s.embeddings.content,
          file: {
            id: s.embeddings.files.file_id,
            name: s.embeddings.files.name,
          },
          folder: {
            id: s.embeddings.files.folders.folder_id,
            name: s.embeddings.files.folders.name
          }
        }
      })
    }
  })

  return parsedMessages
}