import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/plexus.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#020617]/50" />
      </div>

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 md:py-6 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">

        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          SmartLoan
        </h1>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/auth/login">
            <button className="text-sm sm:text-base hover:text-cyan-400 transition">
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button className="px-4 sm:px-5 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm sm:text-base">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-20 sm:mt-24 md:mt-28 px-4 sm:px-6">

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
          AI-Powered Credit Scoring <br /> & Loan Intelligence
        </h1>

        <p className="mt-5 sm:mt-6 text-gray-300 max-w-xl text-sm sm:text-base md:text-lg">
          SmartLoan uses fuzzy logic and machine learning to assess your creditworthiness,
          predict default risk, and provide transparent loan decisions.
        </p>

        {/* CTA */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

          <Link href="/auth/register">
            <button className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-xl font-semibold shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 transition">
              Start Assessment
            </button>
          </Link>

          <Link href="/auth/login">
            <button className="w-full sm:w-auto px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition">
              Login
            </button>
          </Link>

        </div>
      </div>

      {/* FEATURES */}
      <div className="mt-20 sm:mt-24 md:mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-16 pb-16">

        <div className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105 transition">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Fuzzy Logic Scoring
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Advanced two-stage FIS system for accurate credit score generation.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-105 transition">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Default Prediction
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Machine learning model predicts probability of default with precision.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 transition">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Explainable AI
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Human-readable insights to understand every decision.
          </p>
        </div>

      </div>
    </div>
  );
}