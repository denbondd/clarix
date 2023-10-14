import { getServerSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const userId = await getServerSessionUserId()
  const file = await prisma.files.findFirst({
    select: {
      content: true
    },
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId
      }
    }
  })

  return NextResponse.json(file)
}
