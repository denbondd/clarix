import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = auth()

  const body = (await req.json()) as {
    name: string;
    agentId: number;
  }

  const newChat = await prisma.chats.create({
    data: {
      user_id: userId as string,
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
  const { userId } = auth()

  const chats = await prisma.chats.findMany({
    where: {
      user_id: userId as string
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