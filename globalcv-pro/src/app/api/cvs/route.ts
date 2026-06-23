import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = (session.user as any).id;

  if (id) {
    const cv = await prisma.cV.findFirst({ where: { id, userId }, include: { payment: true } });
    if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cv);
  }
  const cvs = await prisma.cV.findMany({ where: { userId }, include: { payment: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(cvs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();

  if (body.duplicateId) {
    const src = await prisma.cV.findFirst({ where: { id: body.duplicateId, userId } });
    if (!src) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const dup = await prisma.cV.create({
      data: {
        userId, title: `${src.title} (Copy)`, templateId: src.templateId,
        personalInfo: src.personalInfo, summary: src.summary || "",
        education: src.education, experience: src.experience,
        internships: src.internships, projects: src.projects,
        skills: src.skills, certifications: src.certifications,
        languages: src.languages, references: src.references,
      },
    });
    return NextResponse.json(dup);
  }

  const cv = await prisma.cV.create({
    data: {
      userId,
      title: body.title || "My CV",
      templateId: body.templateId || "modern",
      personalInfo: JSON.stringify(body.personalInfo || {}),
      summary: JSON.stringify(body.summary || {}),
      education: JSON.stringify(body.education || []),
      experience: JSON.stringify(body.experience || []),
      internships: JSON.stringify(body.internships || []),
      projects: JSON.stringify(body.projects || []),
      skills: JSON.stringify(body.skills || {}),
      certifications: JSON.stringify(body.certifications || []),
      languages: JSON.stringify(body.languages || []),
      references: JSON.stringify(body.references || []),
    },
  });
  return NextResponse.json(cv);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();
  const { id, ...data } = body;

  const cv = await prisma.cV.updateMany({
    where: { id, userId },
    data: {
      title: data.title,
      templateId: data.templateId,
      personalInfo: JSON.stringify(data.personalInfo || {}),
      summary: JSON.stringify(data.summary || {}),
      education: JSON.stringify(data.education || []),
      experience: JSON.stringify(data.experience || []),
      internships: JSON.stringify(data.internships || []),
      projects: JSON.stringify(data.projects || []),
      skills: JSON.stringify(data.skills || {}),
      certifications: JSON.stringify(data.certifications || []),
      languages: JSON.stringify(data.languages || []),
      references: JSON.stringify(data.references || []),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await prisma.cV.deleteMany({ where: { id: id!, userId } });
  return NextResponse.json({ ok: true });
}
