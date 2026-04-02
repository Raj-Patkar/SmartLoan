import Link from "next/link";

export default function Home() {


  return (
    <div className="relative min-h-screen text-gray-800 overflow-x-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e0f2fe] via-[#f5f9ff] to-white" />

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-16 py-4 bg-white/80 border-b border-gray-200 sticky top-0 z-50">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
          SmartLoan
        </h1>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/auth/login">
            <button className="text-sm sm:text-base md:text-lg hover:text-blue-600 transition">
              Login
            </button>
          </Link>

          <Link href="/auth/register">
            <button className="px-4 sm:px-6 py-2 rounded-xl 
          bg-gradient-to-r from-sky-400 to-blue-500 text-white 
          text-sm sm:text-base md:text-lg font-medium
          shadow-md hover:shadow-lg hover:scale-105 
          active:scale-95 transition duration-200">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="grid md:grid-cols-2 items-center mt-12 md:mt-20 px-4 sm:px-6 md:px-20 gap-10">

        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-gray-900">
            Smarter Loans <br />
            <span className="text-blue-600">Better Decisions</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
            AI-powered platform to evaluate creditworthiness, predict risk,
            and help you make better financial decisions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <Link href="/auth/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-xl 
            bg-gradient-to-r from-sky-400 to-blue-500 text-white 
            text-base sm:text-lg font-semibold
            shadow-md hover:shadow-xl hover:scale-105 
            active:scale-95 transition duration-200">
                Check Credit Score →
              </button>
            </Link>

            <Link href="/auth/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-10 py-3 rounded-xl 
            border border-gray-300 text-base sm:text-lg 
            hover:text-blue-600 hover:shadow-sm 
            active:scale-95 transition duration-200">
                Login
              </button>
            </Link>

          </div>
        </div>

        <div className="flex justify-center">
          <img src="/person.png" className="w-full max-w-md md:max-w-xl lg:max-w-2xl" />
        </div>

      </section>

      {/* WHAT IS CREDIT SCORE */}
      <section className="mt-20 md:mt-28 px-4 sm:px-6 md:px-20 grid md:grid-cols-2 gap-10 items-center">

        <img src="/loan.jpg" className="rounded-xl w-full" />

        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
            What is a Credit Score?
          </h2>

          <p className="text-base sm:text-lg text-gray-600">
            A credit score represents your financial trustworthiness.
            Lenders use it to evaluate your ability to repay loans.
          </p>

          <p className="mt-4 text-sm sm:text-base text-gray-500">
            SmartLoan enhances this using AI and fuzzy logic to provide
            accurate, explainable, and fair credit insights.
          </p>
        </div>

      </section>

      {/* WHY SMARTLOAN */}
      <section className="mt-20 md:mt-28 px-4 sm:px-6 md:px-20">

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-12 text-gray-900">
          Why SmartLoan?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            { title: "AI Credit Engine", desc: "Hybrid neural + fuzzy scoring system for accurate evaluation." },
            { title: "Risk Prediction", desc: "Predict default probability before applying." },
            { title: "Explainable AI", desc: "Understand exactly why your score is generated." },
            { title: "Instant Processing", desc: "Get results instantly with real-time analysis." },
            { title: "Secure System", desc: "Your financial data is encrypted and protected." },
            { title: "Scalable Platform", desc: "Built to handle growing users efficiently." },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">

              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                {item.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600">
                {item.desc}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* PROCESS */}
      <section className="mt-20 md:mt-28 px-4 sm:px-6 md:px-20 text-center">

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-12 text-gray-900">
          How It Works
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Sign Up</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Create your account and begin analysis.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Connect Data</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Provide your financial inputs.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Get Insights</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Receive your credit score instantly.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="mt-20 md:mt-28 mb-16 px-4 sm:px-6 text-center">

        <div className="bg-gradient-to-r from-sky-100 to-blue-100 border border-gray-200 rounded-xl p-8 sm:p-12">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
            Ready to Know Your Score?
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Take control of your financial future today.
          </p>

          <Link href="/auth/register">
            <button className="px-8 sm:px-10 py-3 rounded-xl 
          bg-gradient-to-r from-sky-400 to-blue-500 text-white 
          text-base sm:text-lg font-semibold
          shadow-md hover:shadow-xl hover:scale-105 
          active:scale-95 transition duration-200">
              Get Started Now
            </button>
          </Link>

        </div>

      </section>

    </div>
  );
}