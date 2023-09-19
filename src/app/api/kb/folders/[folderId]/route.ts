import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { folderId: string } }) {
  const { userId } = auth()
  const folderId = Number.parseInt(params.folderId)

  const folder = await prisma.folders.findFirst({
    select: {
      folder_id: true,
      name: true,
      created_at: true,
      user_id: true,
      files: {
        select: {
          file_id: true,
          name: true,
          filestatuses: true,
          created_at: true,
          edited_at: true
        }
      }
    },
    where: {
      folder_id: folderId,
      AND: {
        user_id: userId as string
      }
    }
  })

  return NextResponse.json(folder)
}

export async function PUT(req: NextRequest, { params }: { params: { folderId: string } }) {
  const { userId } = auth()
  const folderId = Number.parseInt(params.folderId)
  const body: {
    name: string
  } = await req.json()

  const newFolder = await prisma.folders.update({
    where: {
      folder_id: folderId,
      AND: {
        user_id: userId as string
      }
    },
    data: {
      name: body.name,
    }
  })

  return NextResponse.json(newFolder, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: { folderId: string } }) {
  const { userId } = auth()
  const folderId = Number.parseInt(params.folderId)

  await prisma.folders.delete({
    where: {
      folder_id: folderId,
      AND: {
        user_id: userId as string
      }
    }
  })

  return new NextResponse()
}