"use client";
import { useRef } from "react";
import { FiDownload, FiLoader, FiLock, FiEye } from "react-icons/fi";
import { generateCVHtml } from "@/lib/templates";

interface CVPreviewProps {
  htmlContent: string;
  cvData: any;
  templateId: string;
  isApproved?: boolean;
  cvId?: string | null;
}

export default function CVPreview({ htmlContent, cvData, templateId, isApproved = false, cvId }: CVPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const content = htmlContent || generateCVHtml({ ...cvData, templateId });

  const handlePrint = () => {
    if (!isApproved) return;
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FiEye size={11} /> Live Preview
        </span>
        <div className="flex items-center gap-2">
          {isApproved ? (
            <>
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition px-2 py-1 rounded border border-slate-200 hover:border-blue-300">
                <FiDownload size={11} /> Print / Save PDF
              </button>
              {cvId && (
                <a href={`/api/cvs/${cvId}/download`} target="_blank"
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition px-2 py-1 rounded">
                  <FiDownload size={11} /> Download
                </a>
              )}
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1 rounded border border-slate-100 cursor-not-allowed" title="Complete payment to unlock">
              <FiLock size={11} /> Download locked
            </span>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-slate-300 dark:bg-slate-700 p-4 flex justify-center items-start relative">

        {content ? (
          <>
            {/* Mobile */}
            <div className="block sm:hidden w-full bg-white rounded shadow-lg overflow-hidden" style={{ height: "70vh" }}>
              <iframe ref={iframeRef} srcDoc={content} className="w-full h-full border-none"
                title="CV Preview" sandbox="allow-same-origin allow-scripts allow-modals allow-popups" />
            </div>
            {/* Desktop A4 */}
            <div className="hidden sm:block w-full max-w-[210mm] aspect-[210/297] bg-white rounded shadow-2xl overflow-hidden">
              <iframe ref={iframeRef} srcDoc={content} className="w-full h-full border-none"
                title="CV Preview" sandbox="allow-same-origin allow-scripts allow-modals allow-popups" />
            </div>

            {/* Lock overlay — shows on top of preview if not approved */}
            {!isApproved && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <FiLock size={11} /> Preview only — pay to download
              </div>
            )}
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
