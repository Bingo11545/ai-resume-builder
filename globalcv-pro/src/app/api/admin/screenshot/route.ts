import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/config";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  if (!paymentId) return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment?.screenshotUrl) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If it's a base64 data URL, return an HTML page that shows the image
  if (payment.screenshotUrl.startsWith("data:")) {
    const html = `<!DOCTYPE html><html><head><title>Payment Screenshot</title>
    <style>body{margin:0;background:#1e293b;display:flex;align-items:center;justify-content:center;min-height:100vh;}
    img{max-width:100%;max-height:100vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.5);}</style></head>
    <body><img src="${payment.screenshotUrl}" alt="Payment Screenshot" /></body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  return NextResponse.redirect(payment.screenshotUrl);
}
