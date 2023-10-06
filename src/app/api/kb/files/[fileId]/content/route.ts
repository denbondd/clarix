import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { userId } = auth()

  const file = await prisma.files.findFirst({
    select: {
      content: true
    },
    where: {
      file_id: Number.parseInt(params.fileId),
      folders: {
        user_id: userId as string
      }
    }
  })

  return NextResponse.json(file)
}
