"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import { FiSave, FiEye, FiEyeOff, FiSend, FiLoader, FiLayout, FiLock, FiDownload } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { TEMPLATES, COLOR_PRESETS } from "@/lib/config";
import Link from "next/link";

const DEFAULT_CV = {
  title: "My Professional CV",
  templateId: "modern",
  accentColor: "#1e40af",
  textColor: "#1e293b",
  personalInfo: { name: "", title: "", phone: "", email: "", city: "", country: "", linkedin: "", github: "", portfolio: "", dob: "", nationality: "", photo: "" },
  summary: { objective: "", summary: "", yearsOfExperience: "", targetRole: "" },
  education: [],
  experience: [],
  internships: [],
  projects: [],
  skills: { technical: { languages: [], frameworks: [], databases: [], cloud: [], tools: [], design: [] }, soft: [] },
  certifications: [],
  languages: [],
  references: [],
};

const TEXT_COLORS = [
  { name: "Slate Dark",  hex: "#1e293b" },
  { name: "Black",       hex: "#000000" },
  { name: "Dark Gray",   hex: "#374151" },
  { name: "Warm Dark",   hex: "#292524" },
  { name: "Navy",        hex: "#1e3a5f" },
  { name: "Dark Green",  hex: "#14532d" },
];

// Layout modes: form-left (default), form-right, form-top, preview-only
type LayoutMode = "form-left" | "form-right" | "form-top" | "preview-only";

export default function CVBuilderPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [cvData, setCvData] = useState<any>(DEFAULT_CV);
  const [cvId, setCvId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("form-left");
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

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
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }, [cvData, cvId, router]);

  const handleAiImprove = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData }),
      });
      const data = await res.json();
      if (data.improved) {
        setCvData((prev: any) => ({ ...prev, ...data.improved }));
        toast.success("AI improvements applied!");
      }
    } catch {
      toast.error("AI improvement failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/cvs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, cvData }),
      });
      const data = await res.json();
      if (data.html) {
        setHtmlContent(data.html);
        setShowPreview(true);
        toast.success("Preview generated!");
      }
    } catch {
      toast.error("Preview generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitForPayment = async () => {
    await handleSave();
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("CV submitted!");
        router.push(`/dashboard/payment/${cvId}`);
      }
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Layout grid classes
  const editorClass: Record<LayoutMode, string> = {
    "form-left":    "flex-1 flex flex-row overflow-hidden",
    "form-right":   "flex-1 flex flex-row-reverse overflow-hidden",
    "form-top":     "flex-1 flex flex-col overflow-hidden",
    "preview-only": "flex-1 flex flex-col overflow-hidden",
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col h-full">

        {/* ── Top Bar ── */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 no-print flex-wrap">
          <input value={cvData.title} onChange={e => setCvData((p: any) => ({ ...p, title: e.target.value }))}
            className="font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none text-base w-40 sm:w-56 min-w-0" />

          <div className="flex items-center gap-1.5 flex-wrap">

            {/* Template selector */}
            <select value={cvData.templateId} onChange={e => setCvData((p: any) => ({ ...p, templateId: e.target.value }))}
              className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 hidden md:block">
              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            {/* Accent color swatches */}
            <div className="hidden sm:flex items-center gap-0.5 border border-slate-200 dark:border-slate-600 rounded-lg px-1.5 py-1" title="Accent Color">
              {COLOR_PRESETS.map(c => (
                <button key={c.hex} title={c.name} onClick={() => setCvData((p: any) => ({ ...p, accentColor: c.hex }))}
                  style={{ backgroundColor: c.hex }}
                  className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${cvData.accentColor === c.hex ? "ring-2 ring-offset-1 ring-slate-400 scale-125" : ""}`} />
              ))}
            </div>

            {/* Text color swatches */}
            <div className="hidden sm:flex items-center gap-0.5 border border-slate-200 dark:border-slate-600 rounded-lg px-1.5 py-1" title="Text Color">
              <span className="text-[9px] text-slate-400 mr-1 font-bold">T</span>
              {TEXT_COLORS.map(c => (
                <button key={c.hex} title={c.name} onClick={() => setCvData((p: any) => ({ ...p, textColor: c.hex }))}
                  style={{ backgroundColor: c.hex }}
                  className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 ${cvData.textColor === c.hex ? "ring-2 ring-offset-1 ring-slate-400 scale-125" : ""}`} />
              ))}
            </div>

            {/* Layout switcher */}
            <div className="relative">
              <button onClick={() => setShowLayoutMenu(!showLayoutMenu)} onBlur={() => setTimeout(() => setShowLayoutMenu(false), 150)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <FiLayout size={12} /> <span className="hidden sm:inline">Layout</span>
              </button>
              {showLayoutMenu && (
                <div className="absolute right-0 top-9 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl p-1 z-50">
                  {([
                    { key: "form-left",    label: "📝 Form Left | Preview Right" },
                    { key: "form-right",   label: "👁 Preview Left | Form Right" },
                    { key: "form-top",     label: "⬆ Form Top | Preview Bottom" },
                    { key: "preview-only", label: "🖥 Preview Only" },
                  ] as { key: LayoutMode; label: string }[]).map(l => (
                    <button key={l.key} onClick={() => { setLayout(l.key); setShowLayoutMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${layout === l.key ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview toggle (mobile) */}
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition lg:hidden">
              {showPreview ? <FiEyeOff size={12} /> : <FiEye size={12} />}
            </button>

            {/* AI Improve */}
            <button onClick={handleAiImprove} disabled={aiLoading}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition disabled:opacity-50">
              {aiLoading ? <FiLoader size={12} className="animate-spin" /> : <IoSparkles size={12} />}
              <span className="hidden sm:inline">AI</span>
            </button>

            {/* Save */}
            <button onClick={() => handleSave()} disabled={saving}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50">
              {saving ? <FiLoader size={12} className="animate-spin" /> : <FiSave size={12} />}
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Download — only if approved */}
            {isApproved ? (
              <a href={`/api/cvs/${cvId}/download`} target="_blank"
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition">
                <FiDownload size={12} /> <span className="hidden sm:inline">Download</span>
              </a>
            ) : (
              <button disabled title="Complete payment to download"
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-400 text-xs font-bold cursor-not-allowed">
                <FiLock size={12} /> <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {/* Submit & Pay / Go to payment */}
            {isApproved ? null : (
              <button onClick={handleSubmitForPayment} disabled={submitting}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition disabled:opacity-50">
                {submitting ? <FiLoader size={12} className="animate-spin" /> : <FiSend size={12} />}
                <span className="hidden sm:inline">Submit & Pay</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Payment approval banner ── */}
        {!isApproved && paymentStatus === "pending" && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-700 no-print">
            <FiLock size={12} className="shrink-0" />
            <span>Payment under review — download and print will unlock after admin approval.</span>
            {cvId && <Link href={`/dashboard/payment/${cvId}`} className="font-bold underline ml-1">View payment status →</Link>}
          </div>
        )}
        {!isApproved && !paymentStatus && cvId && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-2 text-xs text-blue-700 no-print">
            <FiLock size={12} className="shrink-0" />
            <span>Download is locked until payment is approved. Build your CV and click <strong>Submit & Pay</strong>.</span>
          </div>
        )}

        {/* ── Editor area ── */}
        <div className={editorClass[layout]}>

          {/* Form panel — hidden in preview-only mode */}
          {layout !== "preview-only" && (
            <div className={`
              ${showPreview ? "hidden lg:flex" : "flex"} flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900
              ${layout === "form-top" ? "w-full h-1/2 border-b border-slate-200 dark:border-slate-700" : "w-full lg:w-1/2"}
            `}>
              <CVForm
                cvData={cvData}
                onChange={(updated: any) => setCvData(updated)}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onGeneratePreview={handleGeneratePreview}
                aiLoading={aiLoading}
              />
            </div>
          )}

          {/* Preview panel */}
          <div className={`
            ${layout === "preview-only" ? "flex w-full" : showPreview ? "flex" : "hidden lg:flex"}
            flex-col overflow-y-auto bg-slate-200 dark:bg-slate-800
            ${layout === "form-top" ? "w-full flex-1" : "w-full lg:w-1/2"}
            ${layout !== "form-top" && layout !== "preview-only" ? "border-l border-slate-200 dark:border-slate-700" : ""}
          `}>
            <CVPreview
              htmlContent={htmlContent}
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
