import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cvData } = await req.json();

  const prompt = `You are a professional CV writer and career coach. Improve this CV data to be more professional, ATS-optimized, and recruiter-friendly. 

CV Data: ${JSON.stringify(cvData, null, 2)}

Return ONLY a JSON object with improved versions of:
- summary.summary (professional summary, 3-4 sentences)
- summary.objective (clear career objective)
- experience (each item's responsibilities and achievements rewritten with action verbs and metrics)
- projects (each item's description improved)

Keep all other fields unchanged. Return valid JSON only.`;

  try {
    const res = await fetch("https://api.muapi.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MUAPIAPP_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const clean = content.replace(/```json\n?|\n?```/g, "").trim();
    const improved = JSON.parse(clean);
    return NextResponse.json({ improved });
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json({ error: "AI improvement failed" }, { status: 500 });
  }
}
