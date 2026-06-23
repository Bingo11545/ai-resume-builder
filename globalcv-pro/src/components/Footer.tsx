import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base">G</div>
              <span className="font-black text-white text-lg">GlobalCV Pro</span>
            </div>
            <p className="text-sm leading-relaxed">Create International Standard CVs That Get Interviews.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="/#templates" className="block hover:text-white transition">Templates</Link>
              <Link href="/#pricing" className="block hover:text-white transition">Pricing</Link>
              <Link href="/#faq" className="block hover:text-white transition">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Account</h4>
            <div className="space-y-2 text-sm">
              <Link href="/login" className="block hover:text-white transition">Sign In</Link>
              <Link href="/register" className="block hover:text-white transition">Create Account</Link>
              <Link href="/dashboard" className="block hover:text-white transition">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>hailetadilo@gmail.com</p>
              <p>Support: 24h response</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} GlobalCV Pro. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
