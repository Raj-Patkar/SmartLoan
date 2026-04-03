"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen text-gray-800 overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[#F8FAFC]" />

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-16 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">

        {/* LOGO */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          SmartLoan
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
          <span onClick={() => router.push("/dashboard/eligibility")} className="hover:text-blue-600 cursor-pointer">Loans</span>

          {/* USER */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-sm font-medium">
              {userName || "User"}
            </span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/auth/login");
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition text-sm"
          >
            Logout
          </button>

        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden">

            <div className="flex flex-col p-4 gap-4">

              <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
              <span className="hover:text-blue-600 cursor-pointer">Loans</span>

              {/* USER */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-sm font-medium">
                  {userName || "User"}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/app");
                }}
                className="text-left px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition text-sm"
              >
                Logout
              </button>

            </div>

          </div>
        )}

      </div>

      {/* HERO */}
      <section className="px-4 sm:px-6 md:px-20 mt-10 md:mt-16 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-900">
            Financial Intelligence <br />
            <span className="text-blue-600">Built Around You</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
            Understand your financial behavior, explore smarter loan opportunities,
            and unlock better decisions with AI-driven insights.
          </p>
        </div>

        {/* BIGGER IMAGE */}
        <div className="flex justify-center">
          <img
            src="/dashboard.jpg"
            className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl object-contain"
          />
        </div>

      </section>

      {/* INFO CARDS (UPGRADED) */}
      <section className="px-4 sm:px-6 md:px-20 mt-14 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 ">

        {[
          {
            title: "Your Financial Profile",
            desc: "AI evaluates your income, liabilities and behavior to understand your real financial strength."
          },
          {
            title: "Loan Readiness",
            desc: "Know your approval chances before applying and avoid unnecessary rejections."
          },
          {
            title: "AI Risk Insights",
            desc: "Advanced models detect hidden risks beyond traditional scoring methods."
          },
          {
            title: "Smart Suggestions",
            desc: "Personalized tips to improve your eligibility and financial growth."
          },
          {
            title: "Behavior Tracking",
            desc: "Understand how your actions impact your borrowing capacity."
          },
          {
            title: "Explainable AI",
            desc: "Clear, human-readable insights — not just numbers."
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group p-6 rounded-3xl bg-white/80 backdrop-blur border-gray-800 shadow-sm hover:shadow-xl transition hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              {item.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}

      </section>

      {/* LOAN INFO */}
      <section className="px-4 sm:px-6 md:px-20 mt-16 md:mt-20 grid md:grid-cols-2 gap-10 items-center">

        <img src="/loan.jpg" className="rounded-2xl w-full shadow-md" />

        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            How Loans Actually Work
          </h2>

          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Loan approvals depend on multiple factors — not just income.
            Lenders analyze risk, repayment behavior, and financial stability.
          </p>

          <p className="mt-3 text-gray-500 text-sm sm:text-base">
            SmartLoan simplifies this using AI, helping you understand what lenders actually evaluate.
          </p>
        </div>

      </section>

      {/* CHART + CTA */}
      <section className="px-4 sm:px-6 md:px-20 mt-16 md:mt-20 grid lg:grid-cols-3 gap-6 md:gap-8">

        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-md border">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Financial Growth Insights
          </h2>

          <div className="h-52 sm:h-64 flex items-center justify-center text-gray-400">
            📊 Insights Visualization (Coming Soon)
          </div>
        </div>

        {/* 🔥 IMPROVED CTA */}
        <div
          onClick={() => router.push("/dashboard/eligibility")}
          className="group relative rounded-3xl overflow-hidden cursor-pointer transition hover:scale-[1.02]"
        >
          {/* BACKGROUND GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-sky-400 opacity-90 group-hover:opacity-100 transition" />

          {/* CONTENT */}
          <div className="relative p-6 sm:p-8 text-white h-full flex flex-col justify-between">

            <div>
              

              <h3 className="text-lg sm:text-6xl font-semibold">
                Check Your Loan Eligibility
              </h3>

              <p className="mt-2 text-sm opacity-90">
                See how much loan you can get and unlock personalized financial insights.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">

              <span className="text-xs sm:text-sm opacity-80">
                2 min process
              </span>

              <span className="font-semibold sm:text-2xl group-hover:translate-x-1 transition">
                Start →
              </span>

            </div>

          </div>
        </div>

      </section>

      {/* FINAL */}
      <section className="px-4 sm:px-6 md:px-20 mt-16 md:mt-20 mb-16 text-center">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
          Make Better Financial Decisions
        </h2>

        <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          SmartLoan gives you clarity, insights, and intelligent predictions —
          so you stay ahead financially.
        </p>

      </section>

    </div>
  );
}