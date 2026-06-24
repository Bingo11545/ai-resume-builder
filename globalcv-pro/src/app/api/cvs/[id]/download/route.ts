import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { id } = await params;

  const cv = await prisma.cV.findFirst({
    where: { id, userId },
    include: { payment: true },
  });

  if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cv.payment?.status !== "approved") return NextResponse.json({ error: "Payment not approved" }, { status: 403 });
  if (!cv.htmlContent) return NextResponse.json({ error: "CV not generated" }, { status: 400 });

  const printHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${cv.title}</title>
  <style>@media print{body{margin:0;padding:0;}}</style></head><body>${cv.htmlContent}
  <script>window.onload=()=>{window.print();}</script></body></html>`;

  return new Response(printHtml, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="${cv.title.replace(/\s+/g, "_")}.html"`,
    },
  });
}
