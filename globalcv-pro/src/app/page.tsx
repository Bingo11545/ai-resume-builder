import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiCheckCircle, FiStar, FiArrowRight, FiUsers, FiFileText, FiGlobe } from "react-icons/fi";

const FEATURES = [
  { icon: "🎯", title: "ATS Optimized", desc: "Beat applicant tracking systems with keyword-rich, properly formatted CVs." },
  { icon: "🌍", title: "International Standard", desc: "Formats accepted by employers in Ethiopia, Europe, USA, Canada, and beyond." },
  { icon: "🤖", title: "AI Powered", desc: "AI rewrites your descriptions, improves grammar, and adds recruiter keywords." },
  { icon: "📄", title: "7 Premium Templates", desc: "Modern, Minimalist, Corporate, Tech, Creative, ATS, and International." },
  { icon: "⚡", title: "Live Preview", desc: "See your CV update in real-time as you fill in your details." },
  { icon: "🔒", title: "Secure Payment", desc: "Simple screenshot verification. Pay once, download forever." },
];

const TESTIMONIALS = [
  { name: "Yonas Tesfaye", role: "Software Engineer", country: "🇪🇹 Ethiopia", text: "Got my dream job at a top tech company. The CV template was exactly what international employers expect.", rating: 5 },
  { name: "Sara Mulugeta", role: "Recent Graduate", country: "🇪🇹 Ethiopia", text: "The AI helped me write a professional summary I never could have written myself. Worth every birr!", rating: 5 },
  { name: "James Okonkwo", role: "Product Manager", country: "🇳🇬 Nigeria", text: "Clean, professional, ATS-friendly. Got 3 interview calls within a week of updating my CV.", rating: 5 },
];

const FAQS = [
  { q: "How does the payment work?", a: "After building your CV, you'll see payment instructions. Transfer the fee via bank or Telebirr, upload a screenshot, and our admin verifies within 24 hours." },
  { q: "How long does approval take?", a: "Most payments are approved within a few hours. Maximum 24 hours on business days." },
  { q: "Can I edit my CV after downloading?", a: "Yes. You can come back anytime, edit your CV, and request a new download after re-submitting." },
  { q: "What format is the CV downloaded in?", a: "High-quality A4 PDF, print-ready and ATS-compatible." },
  { q: "Is my data safe?", a: "Yes. Your data is encrypted, never sold, and you can delete your account at any time." },
  { q: "Do you support Amharic?", a: "The interface supports English and Amharic. CV content is in English for international compatibility." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/40 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 backdrop-blur-sm">
            <FiStar className="text-yellow-400" />
            Trusted by 10,000+ job seekers across Africa & beyond
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Create International Standard CVs<br />
            <span className="text-blue-300">That Get Interviews.</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered CV builder designed for Ethiopian students, graduates, and international job seekers. ATS-optimized. Recruiter-approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-full text-base hover:bg-blue-50 transition shadow-xl shadow-blue-900/30">
              Build My CV Free <FiArrowRight />
            </Link>
            <Link href="#templates" className="inline-flex items-center justify-center gap-2 bg-blue-600/40 border border-blue-400/40 text-white font-bold px-8 py-4 rounded-full text-base hover:bg-blue-600/60 transition backdrop-blur-sm">
              View Templates
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> No subscription</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> 300 ETB or $5 USD</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> Download in PDF</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-green-400" /> Approved within 24h</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-900 text-white py-10 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: <FiUsers />, value: "10,000+", label: "CVs Created" },
            { icon: <FiFileText />, value: "7", label: "Premium Templates" },
            { icon: <FiGlobe />, value: "50+", label: "Countries" },
            { icon: <FiStar />, value: "4.9/5", label: "User Rating" },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="text-blue-400 text-xl flex justify-center">{s.icon}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-blue-300 text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">Everything You Need to Land the Job</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Professional tools designed specifically for Ethiopian and international job markets.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">7 Professional CV Templates</h2>
            <p className="text-slate-500">Choose the template that matches your industry and career level.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Modern Professional", "ATS Friendly", "Minimalist", "Corporate", "Tech Resume", "Creative Pro", "International CV"].map((t, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-center hover:border-blue-400 hover:shadow-md transition cursor-pointer">
                <div className="aspect-[210/297] bg-gradient-to-b from-blue-50 to-slate-100 dark:from-blue-900/20 dark:to-slate-700 rounded-lg mb-3 flex items-center justify-center">
                  <FiFileText className="text-blue-400 text-2xl" />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{t}</p>
              </div>
            ))}
            <div className="rounded-xl bg-blue-600 p-4 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition">
              <FiArrowRight className="text-white text-2xl mb-2" />
              <p className="text-xs font-bold text-white">Start Building</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up free with email or Google in seconds." },
              { step: "02", title: "Build Your CV", desc: "Fill in your details with AI assistance and live preview." },
              { step: "03", title: "Pay & Submit", desc: "Pay 300 ETB or $5 USD and upload your payment screenshot." },
              { step: "04", title: "Download PDF", desc: "Get approved within 24h and download your professional CV." },
            ].map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm mx-auto">{s.step}</div>
                <h3 className="font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
          <p className="text-blue-200 mb-12">One-time payment. No subscription. Download your CV forever.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
              <div className="text-4xl mb-2">🇪🇹</div>
              <h3 className="font-black text-xl mb-1">Ethiopia</h3>
              <div className="text-4xl font-black text-blue-300 my-4">300 ETB</div>
              <p className="text-blue-200 text-sm mb-6">Pay via CBE, Telebirr, or Awash Bank</p>
              <Link href="/register" className="block bg-white text-blue-900 font-bold py-3 rounded-full hover:bg-blue-50 transition">Get Started</Link>
            </div>
            <div className="bg-white text-blue-900 rounded-2xl p-8 shadow-2xl shadow-blue-900/50">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-black text-xl mb-1">International</h3>
              <div className="text-4xl font-black text-blue-700 my-4">$5 USD</div>
              <p className="text-slate-500 text-sm mb-6">Pay via PayPal or Wise</p>
              <Link href="/register" className="block bg-blue-700 text-white font-bold py-3 rounded-full hover:bg-blue-800 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role} · {t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-blue-200 mb-8">Join thousands of professionals who got hired with GlobalCV Pro.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-10 py-4 rounded-full text-base hover:bg-blue-50 transition shadow-xl">
            Build My CV Now <FiArrowRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
