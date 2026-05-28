"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { IoMenu, IoClose, IoSparkles, IoWalletOutline, IoAlbumsOutline } from "react-icons/io5";
import { SiVercel } from "react-icons/si";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[150] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-tr from-lime-400 via-emerald-500 to-teal-500 shadow-md">
            <IoSparkles className="h-5 w-5 text-zinc-950" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-slate-800">
            AI Resume Builder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            Workspace
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            Gallery
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            Pricing
          </Link>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Vercel Deploy Button */}
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition"
          >
            <SiVercel className="h-3 w-3 text-slate-950" />
            Deploy
          </a>

          {status === "authenticated" ? (
            <>
              {/* Credits Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-inner">
                <IoWalletOutline className="h-4 w-4 text-emerald-600" />
                <span>Credits:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  {session.user.credits ?? 0}
                </span>
              </div>

              {/* Profile / Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded bg-slate-100 hover:bg-slate-200 hover:text-slate-950 text-slate-700 border border-slate-200 px-4 py-2 text-sm font-semibold tracking-tight transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded bg-gradient-to-r from-lime-400 to-emerald-500 text-zinc-950 font-bold px-5 py-2 text-sm tracking-tight shadow-md hover:brightness-110 active:scale-95 transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-3">
          {status === "authenticated" && (
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-inner">
              <span className="font-bold text-emerald-600 font-mono">{session.user.credits ?? 0}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition"
          >
            {mobileMenuOpen ? <IoClose className="h-6 w-6" /> : <IoMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Absolute Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-[200] border-b border-slate-200 bg-white/95 backdrop-blur-lg px-4 py-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded p-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <IoSparkles className="h-5 w-5 text-emerald-500" />
              Editor Workspace
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded p-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <IoAlbumsOutline className="h-5 w-5 text-emerald-500" />
              Creations Gallery
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded p-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <IoWalletOutline className="h-5 w-5 text-emerald-500" />
              Buy Credits
            </Link>

            <div className="my-2 border-t border-slate-100"></div>

            {status === "authenticated" ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full rounded bg-slate-100 hover:bg-slate-200 py-3 text-center text-sm font-bold text-slate-700 transition"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signIn("google");
                }}
                className="w-full rounded bg-gradient-to-r from-lime-400 to-emerald-500 py-3 text-center text-sm font-bold text-zinc-950 tracking-tight transition"
              >
                Sign In with Google
              </button>
            )}

            {/* Vercel Deploy in Mobile Menu */}
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 rounded border border-slate-200 p-3 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <SiVercel className="h-3 w-3" />
              Deploy on Vercel
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
