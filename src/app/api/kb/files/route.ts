import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const params = (await req.json()) as {
//     name: string,
//     content: string,
//     folderId: number
//   }

//   const newFile = await prisma.files.create({
//     data: {
//       name: params.name,
//       folder_id: params.folderId,
//       content: params.content
//     }
//   })

//   return NextResponse.json(newFile, { status: 201 })
// }
