import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { folderId: string } }) {
  const userId = await getServerSessionUserId()
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
          created_at: true,
          edited_at: true,
          _count: {
            select: {
              embeddings: true
            }
          }
        },
        orderBy: {
          edited_at: "desc"
        }
      }
    },
    where: {
      folder_id: folderId,
      user_id: userId
    },
  })

  if (!folder) return new NextResponse(null, { status: 404 })
  else return NextResponse.json(folder)
}

export async function PUT(req: NextRequest, { params }: { params: { folderId: string } }) {
  const userId = await getServerSessionUserId()
  const folderId = Number.parseInt(params.folderId)
  const body: {
    name: string
  } = await req.json()

  const newFolder = await prisma.folders.update({
    where: {
      folder_id: folderId,
      user_id: userId
    },
    data: {
      name: body.name,
    }
  })

  return NextResponse.json(newFolder, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: { folderId: string } }) {
  const userId = await getServerSessionUserId()
  const folderId = Number.parseInt(params.folderId)

  await prisma.folders.delete({
    where: {
      folder_id: folderId,
      user_id: userId
    }
  })

  return new NextResponse()
}