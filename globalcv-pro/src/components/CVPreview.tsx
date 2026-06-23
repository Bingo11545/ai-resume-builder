"use client";
import { useRef } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import { generateCVHtml } from "@/lib/templates";

interface CVPreviewProps {
  htmlContent: string;
  cvData: any;
  templateId: string;
}

export default function CVPreview({ htmlContent, cvData, templateId }: CVPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const content = htmlContent || generateCVHtml({ ...cvData, templateId });

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
        {content && (
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition">
            <FiDownload size={12} /> Print / Save PDF
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto bg-slate-300 dark:bg-slate-700 p-4 flex justify-center items-start">
        {content ? (
          <>
            {/* Mobile: scrollable */}
            <div className="block sm:hidden w-full bg-white rounded shadow-lg overflow-hidden" style={{ height: "70vh" }}>
              <iframe ref={iframeRef} srcDoc={content} className="w-full h-full border-none"
                title="CV Preview" sandbox="allow-same-origin allow-scripts allow-modals allow-popups" />
            </div>
            {/* Desktop: A4 ratio */}
            <div className="hidden sm:block w-full max-w-[210mm] aspect-[210/297] bg-white rounded shadow-2xl overflow-hidden">
              <iframe ref={iframeRef} srcDoc={content} className="w-full h-full border-none"
                title="CV Preview" sandbox="allow-same-origin allow-scripts allow-modals allow-popups" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400">
            <FiLoader className="text-4xl mb-3 opacity-30" />
            <p className="text-sm">Fill in your details and click "Generate Preview"</p>
          </div>
        )}
      </div>
    </div>
  );
}
