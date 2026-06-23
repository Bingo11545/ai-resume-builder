"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { FiBell, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

const ICON_MAP: Record<string, React.ReactNode> = {
  success: <FiCheckCircle className="text-green-500 text-lg" />,
  error: <FiXCircle className="text-red-500 text-lg" />,
  info: <FiInfo className="text-blue-500 text-lg" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(data => {
      setNotifications(Array.isArray(data) ? data : []);
      setLoading(false);
      fetch("/api/notifications/read", { method: "POST" });
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <FiBell /> Notifications
        </h1>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FiBell className="mx-auto text-4xl mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-xl border flex items-start gap-3 ${n.read ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700" : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"}`}>
                <div className="shrink-0 mt-0.5">{ICON_MAP[n.type] || ICON_MAP.info}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
