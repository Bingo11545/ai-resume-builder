import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalUsers, totalCVs, pendingPayments, approvedPayments] = await Promise.all([
    prisma.user.count(),
    prisma.cV.count(),
    prisma.payment.count({ where: { status: "pending" } }),
    prisma.payment.findMany({ where: { status: "approved" } }),
  ]);

  const revenue = approvedPayments.reduce((sum, p) => sum + (p.currency === "ETB" ? p.amount / 55 : p.amount), 0);

  return NextResponse.json({ totalUsers, totalCVs, pendingPayments, revenue: revenue.toFixed(2) });
}
