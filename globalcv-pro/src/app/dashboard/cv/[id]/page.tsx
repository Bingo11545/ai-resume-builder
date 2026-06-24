"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CVForm from "@/components/CVForm";
import CVPreview from "@/components/CVPreview";
import { FiSave, FiEye, FiEyeOff, FiSend, FiLoader } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { TEMPLATES, COLOR_PRESETS } from "@/lib/config";

const DEFAULT_CV = {
  title: "My Professional CV",
  templateId: "modern",
  accentColor: "#1e40af",
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

export default function CVBuilderPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [cvData, setCvData] = useState<any>(DEFAULT_CV);
  const [cvId, setCvId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    if (status === "unauthenticated") { signIn(); return; }
    if (status === "authenticated" && !isNew) {
      fetch(`/api/cvs?id=${id}`).then(r => r.json()).then(data => {
        if (data.id) {
          setCvId(data.id);
          setCvData({
            title: data.title,
            templateId: data.templateId,
            accentColor: data.accentColor || "#1e40af",
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
        toast.success("CV submitted for payment review!");
        router.push(`/dashboard/payment/${cvId}`);
      }
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col h-full">
        {/* Top bar */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 no-print">
          <input value={cvData.title} onChange={e => setCvData((p: any) => ({ ...p, title: e.target.value }))}
            className="font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none text-lg w-full max-w-xs" />
          <div className="flex items-center gap-2 shrink-0">
            <select value={cvData.templateId} onChange={e => setCvData((p: any) => ({ ...p, templateId: e.target.value }))}
              className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 hidden sm:block">
              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {/* Color picker swatches */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1">
              {COLOR_PRESETS.map(c => (
                <button key={c.hex} title={c.name} onClick={() => setCvData((p: any) => ({ ...p, accentColor: c.hex }))}
                  style={{ backgroundColor: c.hex }}
                  className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${cvData.accentColor === c.hex ? "ring-2 ring-offset-1 ring-slate-400 scale-125" : ""}`} />
              ))}
            </div>
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              {showPreview ? <FiEyeOff size={12} /> : <FiEye size={12} />}
              <span className="hidden sm:inline">{showPreview ? "Hide" : "Preview"}</span>
            </button>
            <button onClick={handleAiImprove} disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition disabled:opacity-50">
              {aiLoading ? <FiLoader size={12} className="animate-spin" /> : <IoSparkles size={12} />}
              <span className="hidden sm:inline">AI Improve</span>
            </button>
            <button onClick={() => handleSave()} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50">
              {saving ? <FiLoader size={12} className="animate-spin" /> : <FiSave size={12} />}
              <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={handleSubmitForPayment} disabled={submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition disabled:opacity-50">
              {submitting ? <FiLoader size={12} className="animate-spin" /> : <FiSend size={12} />}
              <span className="hidden sm:inline">Submit & Pay</span>
            </button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Form panel */}
          <div className={`${showPreview ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-1/2 overflow-y-auto bg-slate-50 dark:bg-slate-900`}>
            <CVForm cvData={cvData} onChange={(updated: any) => setCvData(updated)} activeSection={activeSection} setActiveSection={setActiveSection} onGeneratePreview={handleGeneratePreview} aiLoading={aiLoading} />
          </div>

          {/* Preview panel */}
          <div className={`${showPreview ? "flex" : "hidden lg:flex"} flex-col w-full lg:w-1/2 overflow-y-auto bg-slate-200 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700`}>
            <CVPreview htmlContent={htmlContent} cvData={cvData} templateId={cvData.templateId} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
