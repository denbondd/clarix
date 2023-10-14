import { NextRequest, NextResponse } from "next/server";

import { Prisma, embeddings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getServerSessionUserId } from "@/lib/auth";

const vectorStore = PrismaVectorStore.withModel<embeddings>(prisma).create(new OpenAIEmbeddings(), {
  prisma: Prisma,
  tableName: 'embeddings',
  vectorColumnName: 'embedding',
  columns: {
    embedding_id: PrismaVectorStore.IdColumn,
    content: PrismaVectorStore.ContentColumn,
    apartment_id: true
  },
})

export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
  const fileId = Number.parseInt(params.fileId)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 40,
  })

  const userId = await getServerSessionUserId()
  const file = await prisma.files.findFirst({
    include: {
      embeddings: true
    },
    where: {
      file_id: fileId,
      folders: {
        user_id: userId
      }
    }
  })

  if (!file) return new NextResponse(null, { status: 404 })

  const newContents = await splitter.splitText(file.content)
  const existingContents = file.embeddings.map(e => e.content)

  // insert only embeddings with unique content in case when user changes only part of file content
  const contentsToInsert = newContents.filter(nc => !existingContents.includes(nc))
  const newEmbeddings = await prisma.$transaction(
    contentsToInsert.map(cont => prisma.embeddings.create({
      data: {
        content: cont,
        file_id: file.file_id
      }
    }))
  )
  // new file embeddings is all embeddings that are about new content
  const fileEmbeddings = file.embeddings.filter(em => newContents.includes(em.content))
    .concat(newEmbeddings)

  // populate new embeddings with vectors and then (if success) delete embeddings that are not about new content
  await vectorStore.addModels(newEmbeddings)
    .then(() => prisma.embeddings.deleteMany({
      where: {
        file_id: file.file_id,
        embedding_id: {
          notIn: fileEmbeddings.map(fe => fe.embedding_id)
        }
      }
    }))

  return new NextResponse(null, { status: 204 })
}