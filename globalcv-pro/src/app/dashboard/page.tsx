"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { FiPlus, FiFileText, FiClock, FiCheckCircle, FiXCircle, FiDownload, FiEdit2, FiCopy, FiTrash2, FiBell } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600", icon: <FiEdit2 size={11} /> },
  submitted: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: <FiClock size={11} /> },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: <FiCheckCircle size={11} /> },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: <FiXCircle size={11} /> },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cvs, setCvs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { signIn(); return; }
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/cvs").then(r => r.json()),
        fetch("/api/notifications").then(r => r.json()),
      ]).then(([cvsData, notifData]) => {
        setCvs(Array.isArray(cvsData) ? cvsData : []);
        setNotifications(Array.isArray(notifData) ? notifData : []);
        setLoading(false);
      });
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this CV? This cannot be undone.")) return;
    await fetch(`/api/cvs?id=${id}`, { method: "DELETE" });
    setCvs(prev => prev.filter(c => c.id !== id));
    toast.success("CV deleted");
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch("/api/cvs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ duplicateId: id }) });
    if (res.ok) {
      const newCv = await res.json();
      setCvs(prev => [newCv, ...prev]);
      toast.success("CV duplicated");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">My CVs</h1>
            <p className="text-slate-500 text-sm mt-0.5">Welcome back, {session?.user?.name?.split(" ")[0]} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Link href="/dashboard/notifications" className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                <FiBell className="text-slate-600 dark:text-slate-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
              </Link>
            )}
            <Link href="/dashboard/cv/new"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-700/20">
              <FiPlus /> New CV
            </Link>
          </div>
        </div>

        {/* Notifications banner */}
        {notifications.filter(n => !n.read).slice(0, 1).map(n => (
          <div key={n.id} className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${n.type === "success" ? "bg-green-50 border-green-200 text-green-800" : n.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
            <FiBell className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{n.title}</p>
              <p className="text-xs mt-0.5 opacity-80">{n.message}</p>
            </div>
          </div>
        ))}

        {/* CVs Grid */}
        {cvs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <FiFileText className="mx-auto text-4xl text-slate-300 mb-4" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">No CVs yet</h3>
            <p className="text-slate-400 text-sm mb-6">Create your first professional CV in minutes</p>
            <Link href="/dashboard/cv/new" className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-800 transition">
              <FiPlus /> Create First CV
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map(cv => {
              const st = STATUS_CONFIG[cv.status] || STATUS_CONFIG.draft;
              return (
                <div key={cv.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${st.color}`}>
                      {st.icon} {st.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(cv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{cv.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">Template: {cv.templateId}</p>

                  {cv.status === "rejected" && cv.payment?.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 mb-3 text-xs text-red-600">
                      <strong>Rejected:</strong> {cv.payment.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/cv/${cv.id}`} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="Edit">
                        <FiEdit2 size={14} />
                      </Link>
                      <button onClick={() => handleDuplicate(cv.id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="Duplicate">
                        <FiCopy size={14} />
                      </button>
                      {cv.status === "approved" && (
                        <Link href={`/api/cvs/${cv.id}/download`} className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition" title="Download PDF">
                          <FiDownload size={14} />
                        </Link>
                      )}
                    </div>
                    <button onClick={() => handleDelete(cv.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
