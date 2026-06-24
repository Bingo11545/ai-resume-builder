import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const cvId = formData.get("cvId") as string;
    const transactionId = formData.get("transactionId") as string;
    const paymentDate = formData.get("paymentDate") as string;

    if (!file || !cvId) return NextResponse.json({ error: "Missing file or CV ID" }, { status: 400 });

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    // Convert to base64 data URL — works on Vercel serverless (no filesystem needed)
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const screenshotUrl = `data:${file.type};base64,${base64}`;

    // Check if payment record exists
    const existing = await prisma.payment.findUnique({ where: { cvId } });

    let payment;
    if (existing) {
      payment = await prisma.payment.update({
        where: { cvId },
        data: {
          screenshotUrl,
          transactionId: transactionId || existing.transactionId,
          paymentDate: paymentDate || existing.paymentDate,
          status: "pending",
          rejectionReason: null,
        },
      });
    } else {
      // Create payment record if not exists (shouldn't happen normally)
      const userId = (session.user as any).id;
      payment = await prisma.payment.create({
        data: {
          userId,
          cvId,
          amount: 300,
          currency: "ETB",
          screenshotUrl,
          transactionId,
          paymentDate,
          status: "pending",
        },
      });
    }

    // Update CV status to submitted
    await prisma.cV.updateMany({
      where: { id: cvId },
      data: { status: "submitted" },
    });

    // Return payment without the base64 data to keep response small
    const { screenshotUrl: _, ...paymentData } = payment;
    return NextResponse.json({
      ok: true,
      payment: { ...paymentData, screenshotUrl: "/screenshot-uploaded" },
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
