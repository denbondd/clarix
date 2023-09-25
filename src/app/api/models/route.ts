import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const models = await prisma.models.findMany()

  return NextResponse.json(models)
}