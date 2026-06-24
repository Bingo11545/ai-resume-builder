"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import {
  FiSave, FiEye, FiEyeOff, FiSend, FiLoader,
  FiLock, FiDownload, FiColumns, FiChevronDown
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { TEMPLATES, COLOR_PRESETS } from "@/lib/config";
import { generateCVHtml } from "@/lib/templates";
import Link from "next/link";

const TEXT_COLORS = [
  { name: "Slate",      hex: "#1e293b" },
  { name: "Black",      hex: "#000000" },
  { name: "Dark Gray",  hex: "#374151" },
  { name: "Warm",       hex: "#292524" },
  { name: "Navy",       hex: "#1e3a5f" },
  { name: "Forest",     hex: "#14532d" },
];

type LayoutMode = "split-lr" | "split-rl" | "stacked" | "preview";

const DEFAULT_CV = {
  title: "My Professional CV",
  templateId: "modern",
  accentColor: "#1e40af",
  textColor: "#1e293b",
  personalInfo: { name: "", title: "", phone: "", email: "", city: "", country: "", linkedin: "", github: "", portfolio: "", dob: "", nationality: "", photo: "" },
  summary: { objective: "", summary: "", yearsOfExperience: "", targetRole: "" },
  education: [], experience: [], internships: [], projects: [],
  skills: { technical: { languages: [], frameworks: [], databases: [], cloud: [], tools: [], design: [] }, soft: [] },
  certifications: [], languages: [], references: [],
};

export default function CVBuilderPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <CVBuilderInner />
    </Suspense>
  );
}

function CVBuilderInner() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isNew = id === "new";
  const templateParam = searchParams.get("template") || "modern";

  const [cvData, setCvData] = useState<any>({ ...DEFAULT_CV, templateId: templateParam });
  const [cvId, setCvId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>("split-lr");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  // Live preview: auto-regenerate whenever cvData changes
  const liveHtml = generateCVHtml(cvData);

  const isApproved = paymentStatus === "approved";

  useEffect(() => {
    if (status === "unauthenticated") { signIn(); return; }
    if (status === "authenticated" && !isNew) {
      fetch(`/api/cvs?id=${id}`).then(r => r.json()).then(data => {
        if (data.id) {
          setCvId(data.id);
          setPaymentStatus(data.payment?.status || null);
          setCvData({
            title: data.title,
            templateId: data.templateId,
            accentColor: data.accentColor || "#1e40af",
            textColor: data.textColor || "#1e293b",
            personalInfo: JSON.parse(data.personalInfo || "{}"),
            summary: JSON.parse(data.summary || "{}"),
            education: JSON.parse(data.education || "[]"),
            experience: JSON.parse(data.experience || "[]"),
            internships: JSON.parse(data.internships || "[]"),
            projects: JSON.parse(data.projects || "[]"),
            skills: JSON.parse(data.skills || "{}"),
            certifications: JSON.parse(data.certifications || "[]"),
            languages: JSON.parse(data.languages || "[]"),
            references: JSON.parse(data.references || "[]"),
          });
          if (data.htmlContent) setHtmlContent(data.htmlContent);
        }
      });
    }
  }, [status, id, isNew]);

  const handleSave = useCallback(async (data = cvData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cvs", {
        method: cvId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cvId, ...data }),
      });
      const saved = await res.json();
      if (saved.id && !cvId) {
        setCvId(saved.id);
        router.replace(`/dashboard/cv/${saved.id}`);
      }
      toast.success("Saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }, [cvData, cvId, router]);

  const handleAiImprove = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData }),
      });
      const data = await res.json();
      if (data.improved) {
        setCvData((prev: any) => ({ ...prev, ...data.improved }));
        toast.success("AI improvements applied!");
      }
    } catch { toast.error("AI improvement failed"); }
    finally { setAiLoading(false); }
  };

  const handleSubmitForPayment = async () => {
    if (!cvId) { toast.error("Save your CV first"); return; }
    setSubmitting(true);
    try {
      await handleSave();
      const res = await fetch("/api/payments/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });
      const data = await res.json();
      if (data.ok) { toast.success("CV submitted!"); router.push(`/dashboard/payment/${cvId}`); }
    } catch { toast.error("Submission failed"); }
    finally { setSubmitting(false); }
  };

  const updateCvField = (field: string, value: any) => {
    setCvData((prev: any) => ({ ...prev, [field]: value }));
  };

  // ── Layout definitions ──────────────────────────────────────────
  // Each layout gives explicit flex direction + sizes for form and preview
  const layouts: Record<LayoutMode, { label: string; icon: string; container: string; form: string; preview: string }> = {
    "split-lr": {
      label: "Form Left",
      icon: "▪️◻️",
      container: "flex-1 flex flex-row min-h-0",
      form: "w-1/2 flex flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-700",
      preview: "w-1/2 flex flex-col overflow-y-auto",
    },
    "split-rl": {
      label: "Preview Left",
      icon: "◻️▪️",
      container: "flex-1 flex flex-row-reverse min-h-0",
      form: "w-1/2 flex flex-col overflow-y-auto border-l border-slate-200 dark:border-slate-700",
      preview: "w-1/2 flex flex-col overflow-y-auto",
    },
    "stacked": {
      label: "Stacked",
      icon: "⬆️",
      container: "flex-1 flex flex-col min-h-0",
      form: "h-[50%] flex flex-col overflow-y-auto border-b border-slate-200 dark:border-slate-700",
      preview: "h-[50%] flex flex-col overflow-y-auto",
    },
    "preview": {
      label: "Preview Only",
      icon: "🖥️",
      container: "flex-1 flex flex-col min-h-0",
      form: "hidden",
      preview: "flex-1 flex flex-col overflow-y-auto",
    },
  };

  const L = layouts[layout];

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      {/* Outer fills remaining viewport height */}
      <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>

        {/* ── Top Bar ── */}
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 flex items-center gap-2 flex-wrap">

          {/* CV title */}
          <input value={cvData.title}
            onChange={e => updateCvField("title", e.target.value)}
            className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none text-sm w-36 sm:w-48 transition" />

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 hidden sm:block" />

          {/* Template */}
          <select value={cvData.templateId}
            onChange={e => updateCvField("templateId", e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hidden sm:block">
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 hidden sm:block" />

          {/* ── Accent color ── */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider hidden sm:block">Accent</span>
            <div className="flex gap-0.5 p-1 border border-slate-200 dark:border-slate-600 rounded-lg">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => updateCvField("accentColor", c.hex)}
                  style={{ backgroundColor: c.hex, width: 14, height: 14, borderRadius: "50%", border: cvData.accentColor === c.hex ? `2px solid white` : "2px solid transparent", outline: cvData.accentColor === c.hex ? `2px solid ${c.hex}` : "none", transition: "transform 0.1s" }}
                />
              ))}
            </div>
          </div>

          {/* ── Text color ── */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider hidden sm:block">Text</span>
            <div className="flex gap-0.5 p-1 border border-slate-200 dark:border-slate-600 rounded-lg">
              {TEXT_COLORS.map(c => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => updateCvField("textColor", c.hex)}
                  style={{ backgroundColor: c.hex, width: 14, height: 14, borderRadius: "50%", border: cvData.textColor === c.hex ? `2px solid white` : "2px solid transparent", outline: cvData.textColor === c.hex ? `2px solid ${c.hex}` : "none", transition: "transform 0.1s" }}
                />
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 hidden sm:block" />

          {/* ── Layout switcher — clickable icons ── */}
          <div className="flex items-center gap-0.5 p-1 border border-slate-200 dark:border-slate-600 rounded-lg">
            {(Object.entries(layouts) as [LayoutMode, typeof layouts[LayoutMode]][]).map(([key, l]) => (
              <button
                key={key}
                title={l.label}
                onClick={() => setLayout(key)}
                className={`w-8 h-7 rounded text-[10px] font-bold transition flex items-center justify-center ${
                  layout === key
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {key === "split-lr" && <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="0" width="7" height="12" fill="currentColor" opacity=".8" rx="1"/><rect x="9" y="0" width="7" height="12" fill="currentColor" opacity=".3" rx="1"/></svg>}
                {key === "split-rl" && <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="0" width="7" height="12" fill="currentColor" opacity=".3" rx="1"/><rect x="9" y="0" width="7" height="12" fill="currentColor" opacity=".8" rx="1"/></svg>}
                {key === "stacked" && <svg width="12" height="14" viewBox="0 0 12 14"><rect x="0" y="0" width="12" height="6" fill="currentColor" opacity=".8" rx="1"/><rect x="0" y="8" width="12" height="6" fill="currentColor" opacity=".3" rx="1"/></svg>}
                {key === "preview" && <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="0" width="16" height="12" fill="currentColor" opacity=".6" rx="1"/></svg>}
              </button>
            ))}
          </div>

          {/* Mobile preview toggle */}
          <button onClick={() => setShowMobilePreview(p => !p)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 transition sm:hidden">
            {showMobilePreview ? <FiEyeOff size={12} /> : <FiEye size={12} />}
          </button>

          <div className="flex-1" />

          {/* AI */}
          <button onClick={handleAiImprove} disabled={aiLoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition disabled:opacity-50">
            {aiLoading ? <FiLoader size={11} className="animate-spin" /> : <IoSparkles size={11} />}
            <span className="hidden sm:inline">AI</span>
          </button>

          {/* Save */}
          <button onClick={() => handleSave()} disabled={saving}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50">
            {saving ? <FiLoader size={11} className="animate-spin" /> : <FiSave size={11} />}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Download */}
          {isApproved ? (
            <a href={`/api/cvs/${cvId}/download`} target="_blank"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition">
              <FiDownload size={11} /> <span className="hidden sm:inline">Download</span>
            </a>
          ) : (
            <button disabled title="Pay first to download"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs font-bold cursor-not-allowed">
              <FiLock size={11} /> <span className="hidden sm:inline">Download</span>
            </button>
          )}

          {/* Submit & Pay */}
          {!isApproved && (
            <button onClick={handleSubmitForPayment} disabled={submitting}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition disabled:opacity-50">
              {submitting ? <FiLoader size={11} className="animate-spin" /> : <FiSend size={11} />}
              <span className="hidden sm:inline">Submit & Pay</span>
            </button>
          )}
        </div>

        {/* ── Banners ── */}
        {!isApproved && paymentStatus === "pending" && (
          <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2 text-xs text-amber-700">
            <FiLock size={11} />
            <span>Payment under review. Download unlocks after approval.</span>
            {cvId && <Link href={`/dashboard/payment/${cvId}`} className="font-bold underline">Check status →</Link>}
          </div>
        )}

        {/* ── Editor area — fills remaining height ── */}
        <div className={L.container}>

          {/* Form panel */}
          <div className={`${L.form} ${showMobilePreview ? "hidden sm:flex" : "flex"} bg-slate-50 dark:bg-slate-900`}>
            <CVForm
              cvData={cvData}
              onChange={setCvData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onGeneratePreview={() => {}} // live preview auto-updates
              aiLoading={aiLoading}
            />
          </div>

          {/* Preview panel */}
          <div className={`${L.preview} ${!showMobilePreview && layout !== "preview" ? "hidden sm:flex" : "flex"} bg-slate-200 dark:bg-slate-800`}>
            <CVPreview
              htmlContent={liveHtml}
              cvData={cvData}
              templateId={cvData.templateId}
              isApproved={isApproved}
              cvId={cvId}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
