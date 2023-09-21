import { FileEntity } from "@/lib/entities";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const params = (await req.json()) as {
    name: string,
    content: string,
    folderId: number
  }

  const newFile: Record<string, any> = await prisma.files.create({
    data: {
      name: params.name,
      folder_id: params.folderId,
      content: params.content,
    }
  })
  newFile._count = {embeddings: 1}

  return NextResponse.json(newFile, { status: 201 })
}
