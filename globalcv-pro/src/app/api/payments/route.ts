import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const cvId = searchParams.get("cvId");

  const cv = await prisma.cV.findFirst({ where: { id: cvId!, userId } });
  const payment = await prisma.payment.findUnique({ where: { cvId: cvId! } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return NextResponse.json({ cv, payment, user });
}
