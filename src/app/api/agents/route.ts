import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const userId = await getServerSessionUserId()
  const agents = await prisma.agents.findMany({
    select: {
      agent_id: true,
      user_id: true,
      name: true,
      description: true,
      system_prompt: true,
      temperature: true,
      created_on: true,
      models: true,
      agent_has_folders: true
    },
    where: {
      user_id: userId
    }
  })

  return NextResponse.json(agents)
}

export async function POST(req: NextRequest) {
  const userId  = await getServerSessionUserId()
  const body = (await req.json()) as {
    name: string;
    folderIds: number[];
    modelId: number;
    systemPrompt: string;
    temperature: number;
    description?: string | undefined;
  }

  const newAgent = await prisma.agents.create({
    data: {
      user_id: userId,
      name: body.name,
      description: body.description,
      model_id: body.modelId,
      system_prompt: body.systemPrompt,
      temperature: body.temperature,
      agent_has_folders: {
        create: body.folderIds.map(f => {
          return { folder_id: f }
        })
      }
    },
    select: {
      agent_id: true,
      user_id: true,
      name: true,
      description: true,
      system_prompt: true,
      temperature: true,
      created_on: true,
      models: true,
      agent_has_folders: true
    }
  })

  return NextResponse.json(newAgent)
}