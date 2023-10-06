import { NextRequest, NextResponse } from "next/server";

import { Prisma, embeddings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { auth } from "@clerk/nextjs";

// const vectorStore = PrismaVectorStore.withModel<embeddings>(prisma).create(new OpenAIEmbeddings(), {
//   prisma: Prisma,
//   tableName: 'embeddings',
//   vectorColumnName: 'embedding',
//   columns: {
//     embedding_id: PrismaVectorStore.IdColumn,
//     content: PrismaVectorStore.ContentColumn,
//     apartment_id: true
//   },
// })

export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
  const fileId = Number.parseInt(params.fileId)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 350,
    chunkOverlap: 40,
  })


  const { userId } = auth()
  const file = await prisma.files.findFirst({
    where: {
      file_id: fileId,
      folders: {
        user_id: userId as string
      }
    }
  })

  if (!file) return new NextResponse(null, { status: 404 })

  const embContents = await splitter.splitText(file.content)

  // TO AVOID BILLING WHILE TESTING
  // await vectorStore.addModels(
  //   await prisma.$transaction(
  //     embContents.map(c => prisma.embeddings.create({
  //       data: {
  //         content: c,
  //         file_id: fileId,
  //       }
  //     }))
  //   )
  // )

  return new NextResponse(null, { status: 204 })
}