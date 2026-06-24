"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheck } from "react-icons/fi";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    tag: "Most Popular",
    tagColor: "bg-blue-600",
    desc: "Split-column layout with colored header. Perfect for tech and business roles.",
    accent: "#1e40af",
    preview: "modern",
  },
  {
    id: "ats",
    name: "ATS Friendly",
    tag: "Best for Job Boards",
    tagColor: "bg-green-600",
    desc: "Single-column plain text. Passes all applicant tracking systems.",
    accent: "#1a1a1a",
    preview: "ats",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tag: "Clean & Elegant",
    tagColor: "bg-slate-500",
    desc: "Spacious layout with light borders. Ideal for creatives and designers.",
    accent: "#374151",
    preview: "minimalist",
  },
  {
    id: "corporate",
    name: "Corporate",
    tag: "Executive Style",
    tagColor: "bg-indigo-600",
    desc: "Georgia serif font with strong borders. Perfect for senior and management roles.",
    accent: "#1e3a5f",
    preview: "corporate",
  },
  {
    id: "tech",
    name: "Tech Resume",
    tag: "For Developers",
    tagColor: "bg-slate-800",
    desc: "Dark theme with monospace font. Designed for software engineers.",
    accent: "#3b82f6",
    preview: "tech",
  },
  {
    id: "creative",
    name: "Creative Professional",
    tag: "Stand Out",
    tagColor: "bg-violet-600",
    desc: "Side panel with pill tags. Great for designers and creative roles.",
    accent: "#7c3aed",
    preview: "creative",
  },
  {
    id: "international",
    name: "International CV",
    tag: "Global Standard",
    tagColor: "bg-teal-600",
    desc: "Includes photo, DOB, nationality. Standard format for Europe and Africa.",
    accent: "#0369a1",
    preview: "international",
  },
];

// Mini CV structure previews — inline SVG-like HTML snippets showing layout
function MiniPreview({ templateId, accent }: { templateId: string; accent: string }) {
  const isDark = templateId === "tech";
  const bg = isDark ? "#0f172a" : "white";
  const text = isDark ? "#e2e8f0" : "#1e293b";
  const subtext = isDark ? "#64748b" : "#94a3b8";
  const border = isDark ? "#1e293b" : "#e2e8f0";
  const sidebarBg = isDark ? "#0a0f1e" : "#f8fafc";

  const headerStyle = `background:${accent};padding:10px 12px;display:flex;align-items:center;gap:8px`;
  const circle = `<div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.25);flex-shrink:0"></div>`;
  const nameBlock = `<div><div style="height:6px;width:80px;background:rgba(255,255,255,.9);border-radius:2px;margin-bottom:3px"></div><div style="height:4px;width:55px;background:rgba(255,255,255,.5);border-radius:2px"></div></div>`;
  const sectionTitle = (w = 50) => `<div style="height:4px;width:${w}px;background:${accent};border-radius:1px;margin-bottom:5px"></div>`;
  const line = (w = 90, opacity = 1) => `<div style="height:3px;width:${w}%;background:${isDark ? "#1e293b" : "#e2e8f0"};border-radius:1px;margin-bottom:3px;opacity:${opacity}"></div>`;
  const tag = `<div style="display:inline-block;height:8px;width:28px;background:${accent}30;border:1px solid ${accent}40;border-radius:2px;margin:1px"></div>`;

  const layouts: Record<string, string> = {
    modern: `
      <div style="background:${bg};height:100%;font-size:0">
        <div style="${headerStyle}">${circle}${nameBlock}</div>
        <div style="display:grid;grid-template-columns:2fr 1fr;height:calc(100% - 50px)">
          <div style="padding:8px">
            ${sectionTitle(45)}${line(90)}${line(75)}${line(85)}
            <div style="height:4px"></div>
            ${sectionTitle(55)}${line(90)}${line(80)}${line(70)}
          </div>
          <div style="padding:8px;background:${sidebarBg};border-left:1px solid ${border}">
            ${sectionTitle(35)}${line(85)}${line(70)}
            <div style="height:4px"></div>
            <div>${tag}${tag}${tag}${tag}</div>
          </div>
        </div>
      </div>`,
    ats: `
      <div style="background:white;height:100%;padding:10px">
        <div style="text-align:center;margin-bottom:6px">
          <div style="height:6px;width:70px;background:#1a1a1a;border-radius:1px;margin:0 auto 3px"></div>
          <div style="height:3px;width:50px;background:#94a3b8;border-radius:1px;margin:0 auto"></div>
        </div>
        <div style="height:1px;background:#000;margin-bottom:6px"></div>
        ${sectionTitle(55)}${line(95)}${line(85)}${line(90)}
        <div style="height:1px;background:#e2e8f0;margin:5px 0"></div>
        ${sectionTitle(45)}${line(80)}${line(70)}
        <div style="height:1px;background:#e2e8f0;margin:5px 0"></div>
        ${sectionTitle(35)}<div style="display:flex;flex-wrap:wrap;gap:2px">${"<div style='height:5px;width:30px;background:#e2e8f0;border-radius:1px'></div>".repeat(6)}</div>
      </div>`,
    minimalist: `
      <div style="background:white;height:100%;padding:12px">
        <div style="height:7px;width:85px;background:#111;border-radius:1px;margin-bottom:2px"></div>
        <div style="height:4px;width:55px;background:${accent};border-radius:1px;margin-bottom:8px"></div>
        <div style="height:3px;width:100%;background:#e5e7eb;margin-bottom:6px"></div>
        <div style="height:3px;width:40px;background:#d1d5db;border-radius:1px;margin-bottom:4px"></div>
        ${line(95)}${line(80)}
        <div style="height:3px;width:100%;background:#e5e7eb;margin:5px 0"></div>
        <div style="height:3px;width:40px;background:#d1d5db;border-radius:1px;margin-bottom:4px"></div>
        ${line(90)}${line(75)}${line(85)}
        <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:2px">
          ${"<div style='height:6px;width:26px;border:1px solid #e5e7eb;border-radius:2px'></div>".repeat(5)}
        </div>
      </div>`,
    corporate: `
      <div style="background:white;height:100%">
        <div style="border-top:4px solid ${accent};padding:8px 10px;border-bottom:1px solid #e2e8f0">
          <div style="height:6px;width:75px;background:${accent};border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;width:50px;background:#94a3b8;border-radius:1px"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 60px">
          <div style="padding:8px">
            ${sectionTitle(50)}${line(90)}${line(80)}${line(85)}
            <div style="height:4px"></div>${sectionTitle(60)}${line(90)}${line(75)}
          </div>
          <div style="padding:8px;background:#fafbfc;border-left:1px solid #e2e8f0">
            ${sectionTitle(35)}${line(80)}${line(70)}
          </div>
        </div>
      </div>`,
    tech: `
      <div style="background:#0f172a;height:100%">
        <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:10px 12px;border-bottom:1px solid #1e293b">
          <div style="height:5px;width:70px;background:#60a5fa;border-radius:1px;margin-bottom:3px"></div>
          <div style="height:3px;width:45px;background:#334155;border-radius:1px"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 55px;height:calc(100% - 40px)">
          <div style="padding:8px">
            <div style="height:3px;width:40px;background:#3b82f6;border-radius:1px;margin-bottom:4px"></div>
            ${["90","75","85"].map(w=>`<div style="height:3px;width:${w}%;background:#1e293b;border-radius:1px;margin-bottom:3px"></div>`).join("")}
            <div style="height:3px;width:50px;background:#3b82f6;border-radius:1px;margin:5px 0 4px"></div>
            ${["80","70"].map(w=>`<div style="height:3px;width:${w}%;background:#1e293b;border-radius:1px;margin-bottom:3px"></div>`).join("")}
          </div>
          <div style="padding:6px;background:#0a0f1e;border-left:1px solid #1e293b">
            <div style="height:3px;width:35px;background:#334155;border-radius:1px;margin-bottom:4px"></div>
            ${"<div style='height:6px;width:30px;background:#1e293b;border:1px solid #3b82f630;border-radius:2px;margin-bottom:2px'></div>".repeat(4)}
          </div>
        </div>
      </div>`,
    creative: `
      <div style="background:white;height:100%">
        <div style="display:grid;grid-template-columns:30px 1fr;background:${accent}">
          <div style="background:${accent}dd;display:flex;align-items:center;justify-content:center;padding:8px">
            <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.3)"></div>
          </div>
          <div style="padding:8px">
            <div style="height:5px;width:70px;background:rgba(255,255,255,.9);border-radius:1px;margin-bottom:3px"></div>
            <div style="height:3px;width:45px;background:rgba(255,255,255,.5);border-radius:1px"></div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:55px 1fr;height:calc(100% - 46px)">
          <div style="padding:6px;background:#f1f5f9;border-right:2px solid ${accent}20">
            ${sectionTitle(35)}${line(85)}${line(75)}
            <div style="margin-top:3px">${tag}${tag}${tag}</div>
          </div>
          <div style="padding:8px">
            ${sectionTitle(50)}${line(90)}${line(80)}${line(85)}
            <div style="height:4px"></div>${sectionTitle(55)}${line(90)}${line(70)}
          </div>
        </div>
      </div>`,
    international: `
      <div style="background:white;height:100%">
        <div style="padding:8px 10px;border-bottom:2px solid ${accent}">
          <div style="height:5px;width:80px;background:#1a202c;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;width:55px;background:${accent};border-radius:1px;margin-bottom:4px"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px">
            ${[50,45,40].map(w=>`<div style="height:3px;width:${w}px;background:#e2e8f0;border-radius:1px"></div>`).join("")}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 60px;height:calc(100% - 55px)">
          <div style="padding:8px">
            <div style="float:right;width:20px;height:25px;background:#f7fafc;border:1px solid ${accent}30;margin:0 0 4px 6px"></div>
            ${sectionTitle(55)}${line(85)}${line(75)}${line(80)}
            <div style="clear:both;height:3px"></div>
            ${sectionTitle(60)}${line(85)}${line(70)}
          </div>
          <div style="padding:6px;background:#f7fafc;border-left:1px solid #e2e8f0">
            ${sectionTitle(35)}${line(80)}${line(70)}
            <div style="margin-top:3px">${tag}${tag}${tag}</div>
          </div>
        </div>
      </div>`,
  };

  return (
    <div
      className="w-full aspect-[210/297] rounded-lg overflow-hidden shadow-inner border border-slate-200"
      dangerouslySetInnerHTML={{ __html: layouts[templateId] || layouts.modern }}
    />
  );
}

export default function TemplateGallery() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleUseTemplate = (templateId: string) => {
    if (session) {
      router.push(`/dashboard/cv/new?template=${templateId}`);
    } else {
      router.push(`/register?template=${templateId}`);
    }
  };

  return (
    <section id="templates" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
            7 Professional CV Templates
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Choose the template that matches your industry and career level. Click to preview, then start building.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelected(selected === t.id ? null : t.id)}
              className={`group relative bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                ${selected === t.id
                  ? "border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:shadow-lg"}`}
            >
              {/* Tag */}
              <div className={`absolute top-3 left-3 z-10 ${t.tagColor} text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full`}>
                {t.tag}
              </div>

              {/* Selected checkmark */}
              {selected === t.id && (
                <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                  <FiCheck size={12} className="text-white" />
                </div>
              )}

              {/* Mini CV Preview */}
              <div className="p-3 pb-1">
                <MiniPreview templateId={t.id} accent={t.accent} />
              </div>

              {/* Info */}
              <div className="p-3 pt-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">{t.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
              </div>

              {/* Use Template button — shown on hover or selection */}
              <div className={`px-3 pb-3 transition-all ${selected === t.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                <button
                  onClick={e => { e.stopPropagation(); handleUseTemplate(t.id); }}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  Use This Template <FiArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handleUseTemplate(selected)}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-full text-base transition shadow-lg shadow-blue-700/20"
            >
              Build CV with {TEMPLATES.find(t => t.id === selected)?.name} <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
