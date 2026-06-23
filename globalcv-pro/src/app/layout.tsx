import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GlobalCV Pro — Create International Standard CVs That Get Interviews",
  description: "Build ATS-optimized, recruiter-friendly professional CVs in minutes. Trusted by Ethiopian students, graduates, and international job seekers.",
  keywords: "CV builder, resume builder, Ethiopia, international jobs, ATS resume, professional CV",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
