import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Resume Builder – Fast, Stylish & Shareable",
  description: "Tired of generic resume templates? Stand out from the crowd with AI. Craft an impressive, modern, and shareable resume in just a few minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
