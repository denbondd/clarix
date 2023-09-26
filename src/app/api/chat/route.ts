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
  })

  return NextResponse.json(chats)
}