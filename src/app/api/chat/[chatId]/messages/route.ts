import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { userId } = auth()

  const chatId = Number.parseInt(params.chatId)

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
    }
  })

  const parsedMessages: {
    message_id: number,
    created_at: Date,
    content: string,
    msg_roles: {
      msg_role_id: number,
      name: string,
    },
    msg_sources: {
      embedding_id: number,
      similarity: number,
      content: string;
      file_name: string,
      folder_name: string
    }[]
  }[] = messages.map(msg => {
    return {
      message_id: msg.message_id,
      created_at: msg.created_at,
      content: msg.content,
      msg_roles: {
        msg_role_id: msg.msg_roles.msg_role_id,
        name: msg.msg_roles.name,
      },
      msg_sources: msg.msg_sources.map(s => {
        return {
          embedding_id: s.embedding_id,
          similarity: s.similarity,
          content: s.embeddings.content,
          file_name: s.embeddings.files.name,
          folder_name: s.embeddings.files.folders.name
        }
      })
    }
  })

  return NextResponse.json(parsedMessages)
}