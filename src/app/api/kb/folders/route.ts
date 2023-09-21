import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth()

  const allUserFolders = await prisma.folders.findMany({
    select: {
      folder_id: true,
      name: true,
      user_id: true,
      created_at: true,
      _count: {
        select: {
          files: true
        }
      }
    },
    where: {
      user_id: {
        equals: userId as string
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return NextResponse.json(allUserFolders)
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  const body: {
    name: string
  } = await req.json()

  const newFolder = await prisma.folders.create({
    data: {
      name: body.name,
      user_id: userId as string
    }
  })

  return NextResponse.json(newFolder, { status: 201 })
}