import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const userId = await getServerSessionUserId()
  const allUserFolders = await prisma.folders.findMany({
    select: {
      folder_id: true,
      name: true,
      user_id: true,
      created_at: true,
      files: {
        include: {
          _count: {
            select: {
              embeddings: true
            }
          }
        }
      }
    },
    where: {
      user_id: {
        equals: userId
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return NextResponse.json(allUserFolders)
}

export async function POST(req: NextRequest) {
  const userId = await getServerSessionUserId()
  const body: {
    name: string
  } = await req.json()

  const newFolder = await prisma.folders.create({
    data: {
      name: body.name,
      user_id: userId
    }
  })

  return NextResponse.json(newFolder, { status: 201 })
}