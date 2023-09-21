import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { userId } = auth()

  const file = await prisma.files.findFirst({
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId as string
      }
    }
  })

  return NextResponse.json(file)
}

export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { userId } = auth()

  const newData = (await req.json()) as {
    name?: string,
    content?: string,
    folderId?: number
  }

  const newFile = await prisma.files.update({
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId as string
      }
    },
    data: {
      name: newData?.name,
      content: newData?.content,
      folder_id: newData?.folderId
    }
  })

  return NextResponse.json(newFile)
}

export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { userId } = auth()

  const fileId = Number.parseInt(params.fileId)

  prisma.$transaction([
    prisma.embeddings.deleteMany({
      where: {
        file_id: fileId,
        files: {
          folders: {
            user_id: userId as string
          }
        }
      }
    }),
    prisma.files.delete({
      where: {
        file_id: fileId,
        folders: {
          user_id: userId as string
        }
      }
    }),
  ])


  return new NextResponse()
}