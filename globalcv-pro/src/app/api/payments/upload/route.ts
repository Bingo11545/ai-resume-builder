import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const cvId = formData.get("cvId") as string;
    const transactionId = formData.get("transactionId") as string;
    const paymentDate = formData.get("paymentDate") as string;

    if (!file || !cvId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");
    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    const screenshotUrl = `/uploads/payments/${filename}`;

    const payment = await prisma.payment.update({
      where: { cvId },
      data: { screenshotUrl, transactionId, paymentDate, status: "pending" },
    });

    return NextResponse.json({ ok: true, payment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
