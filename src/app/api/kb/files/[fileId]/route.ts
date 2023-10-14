import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const userId = await getServerSessionUserId()

  const file = await prisma.files.findFirst({
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId
      }
    }
  })

  return NextResponse.json(file)
}

export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
  const userId = await getServerSessionUserId()

  const newData = (await req.json()) as {
    name?: string,
    content?: string,
    folderId?: number
  }

  const newFile = await prisma.files.update({
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId
      }
    },
    data: {
      name: newData?.name,
      content: newData?.content,
      folder_id: newData?.folderId
    },
    include: {
      _count: {
        select: {
          embeddings: true
        }
      }
    }
  })

  return NextResponse.json(newFile)
}

export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
  const userId = await getServerSessionUserId()
  const fileId = Number.parseInt(params.fileId)

  prisma.files.delete({
    where: {
      file_id: fileId,
      folders: {
        user_id: userId
      }
    }
  })

  return new NextResponse()
}