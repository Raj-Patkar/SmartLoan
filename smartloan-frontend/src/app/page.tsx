import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/plexus.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-[#020617]/30 backdrop" />
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <h1 className="text-xl font-semibold tracking-wide">
          SmartLoan
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <button className="px-4 py-2 text-sm hover:text-cyan-400 transition">
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight font-[var(--font-playfair)]">
          AI-Powered Credit Scoring <br /> & Loan Intelligence
        </h1>

        <p className="mt-6 text-gray-300 max-w-xl font-[var(--font-inter)]">
          SmartLoan uses fuzzy logic and machine learning to assess your creditworthiness,
          predict default risk, and provide transparent loan decisions.
        </p>

        {/* CTA */}
        <div className="mt-8 flex gap-4">
          <Link href="/register">
            <button className="px-6 py-3 bg-white text-black rounded-xl font-semibold shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 transition">
              Start Assessment
            </button>
          </Link>

          <Link href="/login">
            <button className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-28 grid md:grid-cols-3 gap-8 px-6 md:px-16 pb-16">

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">Fuzzy Logic Scoring</h3>
          <p className="text-gray-300 text-sm">
            Advanced two-stage FIS system for accurate credit score generation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">Default Prediction</h3>
          <p className="text-gray-300 text-sm">
            Machine learning model predicts probability of default with precision.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">Explainable AI</h3>
          <p className="text-gray-300 text-sm">
            Human-readable insights to understand every decision.
          </p>
        </div>

      </div>
    </div>
  );
}