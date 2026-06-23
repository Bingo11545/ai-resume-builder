"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiFileText, FiBell, FiLogOut, FiPlus, FiShield } from "react-icons/fi";
import { ADMIN_EMAIL } from "@/lib/config";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const links = [
    { name: "My CVs", href: "/dashboard", icon: <FiFileText size={16} /> },
    { name: "Notifications", href: "/dashboard/notifications", icon: <FiBell size={16} /> },
    ...(isAdmin ? [{ name: "Admin Panel", href: "/admin", icon: <FiShield size={16} /> }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-black text-sm">G</div>
            <span className="font-black text-blue-900 dark:text-white hidden sm:inline">GlobalCV Pro</span>
          </Link>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <nav className="flex items-center gap-1">
            {links.map(l => (
              <Link key={l.name} href={l.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${pathname === l.href ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}>
                {l.icon} <span className="hidden sm:inline">{l.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/cv/new"
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
            <FiPlus size={13} /> <span className="hidden sm:inline">New CV</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <FiLogOut size={13} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
