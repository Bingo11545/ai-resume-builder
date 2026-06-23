import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";
import { ADMIN_EMAIL } from "@/lib/config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payments = await prisma.payment.findMany({
    include: { user: true, cv: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { paymentId, action, userId, cvId, reason } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "approved" } });
    await prisma.cV.updateMany({ where: { id: cvId }, data: { status: "approved" } });
    await prisma.notification.create({
      data: {
        userId,
        title: "Payment Approved — Your CV is Ready!",
        message: "Your payment has been verified. You can now download your professional CV.",
        type: "success",
      },
    });
    try { await sendApprovalEmail(user.email!, user.name || "User"); } catch (e) { console.error("Email error:", e); }
  } else if (action === "reject") {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "rejected", rejectionReason: reason } });
    await prisma.cV.updateMany({ where: { id: cvId }, data: { status: "rejected" } });
    await prisma.notification.create({
      data: {
        userId,
        title: "Payment Verification Failed",
        message: `Your payment could not be verified. Reason: ${reason}`,
        type: "error",
      },
    });
    try { await sendRejectionEmail(user.email!, user.name || "User", reason); } catch (e) { console.error("Email error:", e); }
  }

  return NextResponse.json({ ok: true });
}
