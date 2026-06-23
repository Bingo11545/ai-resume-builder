"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { FiUpload, FiCheckCircle, FiClock, FiXCircle, FiLoader } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { PAYMENT_METHODS, PRICING } from "@/lib/config";

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const cvId = params.cvId as string;

  const [cv, setCv] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { signIn(); return; }
    if (status === "authenticated") {
      fetch(`/api/payments?cvId=${cvId}`).then(r => r.json()).then(data => {
        setCv(data.cv);
        setPayment(data.payment);
        setUser(data.user);
      });
    }
  }, [status, cvId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!screenshot) { toast.error("Please select a screenshot"); return; }
    if (!transactionId) { toast.error("Please enter transaction ID"); return; }
    if (!paymentDate) { toast.error("Please enter payment date"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("cvId", cvId);
      formData.append("transactionId", transactionId);
      formData.append("paymentDate", paymentDate);
      const res = await fetch("/api/payments/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        setPayment(data.payment);
        toast.success("Payment screenshot uploaded! Awaiting admin review.");
      } else throw new Error(data.error);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const country = user?.country || "international";
  const pricing = PRICING[country as keyof typeof PRICING] || PRICING.international;
  const methods = PAYMENT_METHODS[country as keyof typeof PAYMENT_METHODS] || PAYMENT_METHODS.international;

  if (!cv) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Payment Instructions</h1>
          <p className="text-slate-500 text-sm mt-1">Complete payment to download your professional CV</p>
        </div>

        {/* Payment Status */}
        {payment && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            payment.status === "approved" ? "bg-green-50 border-green-200" :
            payment.status === "rejected" ? "bg-red-50 border-red-200" :
            "bg-amber-50 border-amber-200"
          }`}>
            {payment.status === "approved" ? <FiCheckCircle className="text-green-600 text-xl shrink-0" /> :
             payment.status === "rejected" ? <FiXCircle className="text-red-600 text-xl shrink-0" /> :
             <FiClock className="text-amber-600 text-xl shrink-0 animate-pulse" />}
            <div>
              <p className="font-bold text-sm">
                {payment.status === "approved" ? "Payment Approved! Your CV is ready." :
                 payment.status === "rejected" ? "Payment Rejected" :
                 "Payment Under Review (24h max)"}
              </p>
              {payment.status === "rejected" && payment.rejectionReason && (
                <p className="text-xs text-red-600 mt-0.5">Reason: {payment.rejectionReason}</p>
              )}
              {payment.status === "approved" && (
                <a href={`/api/cvs/${cvId}/download`} className="inline-flex items-center gap-1.5 mt-2 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Download PDF CV
                </a>
              )}
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="bg-blue-700 text-white rounded-2xl p-6 mb-6">
          <p className="text-blue-200 text-sm mb-1">Amount to Pay</p>
          <p className="text-4xl font-black">{pricing.label}</p>
          <p className="text-blue-200 text-xs mt-1">One-time payment • No subscription</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {methods.map((m: any, i: number) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</p>
                <p className="text-blue-600 font-mono text-sm mt-0.5">{m.account}</p>
                <p className="text-xs text-slate-500 mt-0.5">Account holder: {m.holder || "GlobalCV Pro"}</p>
                {m.note && <p className="text-xs text-slate-400 mt-0.5">{m.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Upload screenshot */}
        {(!payment || payment.status === "rejected") && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Upload Payment Proof</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID / Reference</label>
                <input value={transactionId} onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN123456789"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Date</label>
                <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Screenshot</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-400 transition bg-slate-50 dark:bg-slate-700/50">
                  {preview ? (
                    <img src={preview} alt="Screenshot preview" className="h-full w-full object-contain rounded-xl p-1" />
                  ) : (
                    <div className="text-center">
                      <FiUpload className="mx-auto text-2xl text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">Click to upload screenshot</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <button onClick={handleUpload} disabled={uploading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? <><FiLoader className="animate-spin" /> Uploading...</> : <><FiUpload /> Submit Payment Proof</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
