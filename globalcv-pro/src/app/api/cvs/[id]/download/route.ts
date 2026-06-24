import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCVHtml } from "@/lib/templates";

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

  // Use stored HTML or generate fresh from CV data
  let html = cv.htmlContent;
  if (!html) {
    const cvData = {
      templateId: cv.templateId,
      personalInfo: JSON.parse(cv.personalInfo || "{}"),
      summary: JSON.parse(cv.summary || "{}"),
      education: JSON.parse(cv.education || "[]"),
      experience: JSON.parse(cv.experience || "[]"),
      internships: JSON.parse(cv.internships || "[]"),
      projects: JSON.parse(cv.projects || "[]"),
      skills: JSON.parse(cv.skills || "{}"),
      certifications: JSON.parse(cv.certifications || "[]"),
      languages: JSON.parse(cv.languages || "[]"),
      references: JSON.parse(cv.references || "[]"),
    };
    html = generateCVHtml(cvData);
    // Save for next time
    await prisma.cV.update({ where: { id }, data: { htmlContent: html } });
  }

  const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${cv.title}</title>
  <style>
    @page { margin: 0; size: A4; }
    @media print { body { margin: 0; padding: 0; } .no-print { display: none !important; } }
  </style>
</head>
<body>
  ${html}
  <div class="no-print" style="position:fixed;bottom:20px;right:20px;z-index:9999;">
    <button onclick="window.print()" style="background:#1e40af;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <script>
    // Auto-trigger print after small delay for better rendering
    setTimeout(() => { window.print(); }, 800);
  </script>
</body>
</html>`;

  return new Response(printHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${cv.title.replace(/[^a-z0-9]/gi, "_")}.html"`,
    },
  });
}
