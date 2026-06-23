"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUsers, FiFileText, FiDollarSign, FiCheckCircle, FiXCircle, FiSearch, FiEye, FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { ADMIN_EMAIL } from "@/lib/config";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { signIn(); return; }
    if (status === "authenticated") {
      if (session?.user?.email !== ADMIN_EMAIL) { router.push("/dashboard"); return; }
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, paymentsRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/payments"),
    ]);
    setStats(await statsRes.json());
    setPayments(await paymentsRes.json());
    setLoading(false);
  };

  const handleApprove = async (paymentId: string, userId: string, cvId: string) => {
    setActionId(paymentId);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: "approve", userId, cvId }),
      });
      if (res.ok) {
        toast.success("Payment approved & email sent");
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "approved" } : p));
      }
    } catch { toast.error("Failed to approve"); }
    finally { setActionId(null); }
  };

  const handleReject = async (paymentId: string, userId: string) => {
    if (!rejectReason.trim()) { toast.error("Please enter a rejection reason"); return; }
    setActionId(paymentId);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action: "reject", userId, reason: rejectReason }),
      });
      if (res.ok) {
        toast.success("Payment rejected & email sent");
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "rejected", rejectionReason: rejectReason } : p));
        setRejectingId(null);
        setRejectReason("");
      }
    } catch { toast.error("Failed to reject"); }
    finally { setActionId(null); }
  };

  const filtered = payments.filter(p => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch = !search || p.user?.name?.toLowerCase().includes(search.toLowerCase()) || p.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading || !stats) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Toaster position="top-right" />
      {/* Admin Header */}
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">GlobalCV Pro — Admin</h1>
          <p className="text-blue-300 text-xs">{session?.user?.email}</p>
        </div>
        <a href="/dashboard" className="text-xs text-blue-300 hover:text-white transition">← Back to Dashboard</a>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "blue" },
            { label: "Total CVs", value: stats.totalCVs, icon: <FiFileText />, color: "purple" },
            { label: "Pending", value: stats.pendingPayments, icon: <FiDollarSign />, color: "amber" },
            { label: "Revenue", value: `$${stats.revenue}`, icon: <FiCheckCircle />, color: "green" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
              <div className={`text-${s.color}-600 text-xl mb-2`}>{s.icon}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="font-black text-slate-900 dark:text-white flex-1">Payment Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                  className="pl-8 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 focus:border-blue-500 outline-none w-48" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="py-2 px-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 focus:border-blue-500 outline-none">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  {["User", "CV", "Amount", "Date", "Status", "Screenshot", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(p => (
                  <>
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white text-xs">{p.user?.name}</p>
                        <p className="text-slate-400 text-[10px]">{p.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 max-w-[120px] truncate">{p.cv?.title}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-white">{p.amount} {p.currency}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{p.paymentDate || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          p.status === "approved" ? "bg-green-100 text-green-700" :
                          p.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {p.screenshotUrl ? (
                          <a href={p.screenshotUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 text-xs hover:underline">
                            <FiEye size={11} /> View
                          </a>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleApprove(p.id, p.userId, p.cvId)} disabled={actionId === p.id}
                              className="flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                              {actionId === p.id ? <FiLoader className="animate-spin" size={10} /> : <FiCheckCircle size={10} />} Approve
                            </button>
                            <button onClick={() => setRejectingId(rejectingId === p.id ? null : p.id)}
                              className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-red-600 transition">
                              <FiXCircle size={10} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {rejectingId === p.id && (
                      <tr key={`reject-${p.id}`} className="bg-red-50 dark:bg-red-900/10">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                              placeholder="Enter rejection reason..."
                              className="flex-1 px-3 py-2 border border-red-200 rounded-lg text-sm focus:border-red-400 outline-none bg-white dark:bg-slate-700" />
                            <button onClick={() => handleReject(p.id, p.userId)} disabled={actionId === p.id}
                              className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                              {actionId === p.id ? "Sending..." : "Send Rejection"}
                            </button>
                            <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                              className="text-xs text-slate-500 hover:text-slate-700 px-2">Cancel</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No payments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
