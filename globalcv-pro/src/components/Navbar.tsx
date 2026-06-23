"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/#templates" },
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center text-white font-black text-base">G</div>
          <span className="font-black text-blue-900 dark:text-white text-lg">GlobalCV Pro</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.name} href={l.href}
              className={`text-sm font-semibold transition ${pathname === l.href ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400"}`}>
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                {session.user?.image ? (
                  <img src={session.user.image} className="w-6 h-6 rounded-full" alt="avatar" />
                ) : (
                  <FiUser className="text-slate-500" size={16} />
                )}
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{session.user?.name?.split(" ")[0]}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl p-1 z-50">
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                    <FiSettings size={14} /> Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <FiLogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 transition">Sign In</Link>
              <Link href="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-full text-sm transition shadow-md shadow-blue-700/20">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl p-4 space-y-2 z-40">
          {links.map(l => (
            <Link key={l.name} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              {l.name}
            </Link>
          ))}
          <div className="h-px bg-slate-100 dark:bg-slate-700 my-2" />
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block w-full text-center bg-blue-700 text-white font-bold px-4 py-3 rounded-xl text-sm hover:bg-blue-800 transition">Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
