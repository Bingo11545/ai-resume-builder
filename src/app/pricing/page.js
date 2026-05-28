"use client";

import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { IoCheckmarkCircleOutline, IoWalletOutline, IoInformationCircleOutline } from "react-icons/io5";

function PricingContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (success) {
      setAlertMsg("Payment successful! Your credits have been updated successfully.");
    } else if (canceled) {
      setAlertMsg("Payment was canceled. No credits were deducted.");
    }
  }, [success, canceled]);

  const handlePurchase = async (planId) => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating checkout");
    } finally {
      setLoadingPlan("");
    }
  };

  const PLANS = [
    {
      id: "basic",
      name: "Basic Pack",
      price: "$5.00",
      credits: 1000,
      features: [
        "1000 AI Generation Credits",
        "Approx. 55 complete AI resume rewrites",
        "High-performance Google font stacks",
        "Standard email/phone formatting support"
      ]
    },
    {
      id: "standard",
      name: "Standard Pack",
      price: "$10.00",
      credits: 2000,
      features: [
        "2000 AI Generation Credits",
        "Approx. 110 complete AI resume rewrites",
        "All templates unlocked",
        "Custom hex color swatches support",
        "Word docx export enabled"
      ]
    },
    {
      id: "pro",
      name: "Professional Pack",
      price: "$20.00",
      credits: 4000,
      popular: true,
      features: [
        "4000 AI Generation Credits",
        "Approx. 220 complete AI resume rewrites",
        "Priority LLM processing queue",
        "Word docx export enabled",
        "Public share link hosting"
      ]
    },
    {
      id: "business",
      name: "Business Pack",
      price: "$50.00",
      credits: 10000,
      features: [
        "10000 AI Generation Credits",
        "Approx. 550 complete AI resume rewrites",
        "Priority LLM processing queue",
        "Full portfolio gallery features",
        "Lifetime hosting for shared links",
        "Direct API webhook access"
      ]
    }
  ];

  return (
    <main className="flex-1 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
      {/* Alerts */}
      {alertMsg && (
        <div className="mb-10 rounded border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-sm text-emerald-800">
          <IoInformationCircleOutline className="h-5 w-5 shrink-0 text-emerald-600" />
          <p>{alertMsg}</p>
        </div>
      )}

      <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
        <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900">
          Choose Your Credit Plan
        </h1>
        <p className="text-slate-600 text-sm">
          Purchase credits one-time to generate, improve, and optimize your resume. 
          Each complete AI resume improve consumes <span className="font-bold text-emerald-600">18 credits</span>.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded border bg-white p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition duration-300 ${
              plan.popular 
                ? "border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                : "border-slate-200"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1 text-slate-900">
                  <span className="text-3xl font-extrabold font-outfit">{plan.price}</span>
                  <span className="text-xs text-slate-500">/ one-time</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded bg-slate-50 p-3 border border-slate-100">
                <IoWalletOutline className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600 font-mono">
                  {plan.credits} Credits
                </span>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 leading-relaxed">
                    <IoCheckmarkCircleOutline className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full rounded py-3 text-center text-xs font-extrabold tracking-wider uppercase transition shadow-md cursor-pointer ${
                  plan.popular
                    ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? "Processing..." : `Get ${plan.credits} Credits`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Pricing() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin"></div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
