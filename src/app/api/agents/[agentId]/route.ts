import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { agentId: string } }) {
  const { userId } = auth()

  const agentId = Number.parseInt(params.agentId)
  const body = (await req.json()) as {
    name: string;
    folderIds: number[];
    modelId: number;
    systemPrompt: string;
    temperature: number;
    description?: string | undefined;
  }

  const [deletedFolders, agent] = await prisma.$transaction([
    prisma.agent_has_folders.deleteMany({
      where: {
        agent_id: agentId
      }
    }),
    prisma.agents.update({
      where: {
        user_id: userId as string,
        agent_id: agentId
      },
      data: {
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
        agent_has_folders: {
          where: {
            agent_id: agentId
          },
        }
      }
    })
  ])

  return NextResponse.json(agent)
}