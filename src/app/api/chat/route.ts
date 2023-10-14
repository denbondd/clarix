import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = await getServerSessionUserId()
  const body = (await req.json()) as {
    name: string;
    agentId: number;
  }

  const newChat = await prisma.chats.create({
    data: {
      user_id: userId,
      name: body.name,
      agent_id: body.agentId,
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
      }
    }
  })

  return NextResponse.json(newChat, { status: 201 })
}

export async function GET() {
  const userId = await getServerSessionUserId()
  const chats = await prisma.chats.findMany({
    where: {
      user_id: userId
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
      }
    }
  })

  return NextResponse.json(chats)
}