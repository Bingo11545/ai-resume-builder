import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCVHtml } from "@/lib/templates";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { cvId, cvData } = await req.json();

  const html = generateCVHtml(cvData);

  if (cvId) {
    await prisma.cV.updateMany({ where: { id: cvId, userId }, data: { htmlContent: html } });
  }

  return NextResponse.json({ html });
}
