import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRICING } from "@/lib/config";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { cvId } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const pricing = PRICING[(user?.country as keyof typeof PRICING) || "international"];

  const existing = await prisma.payment.findUnique({ where: { cvId } });
  if (existing && existing.status === "pending") {
    return NextResponse.json({ ok: true, paymentId: existing.id });
  }

  const payment = existing
    ? await prisma.payment.update({ where: { cvId }, data: { status: "pending", rejectionReason: null } })
    : await prisma.payment.create({
        data: { userId, cvId, amount: pricing.amount, currency: pricing.currency, status: "pending" },
      });

  await prisma.cV.updateMany({ where: { id: cvId, userId }, data: { status: "submitted" } });

  return NextResponse.json({ ok: true, paymentId: payment.id });
}
