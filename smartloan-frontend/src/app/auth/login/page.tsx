"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);

      const { token, user } = res.data;

      // ✅ store token + role
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.full_name);

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "manager") {
        router.push("/dashboard/manager");
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex items-center justify-center bg-[#1b58db] p-10">

        <div className="text-white text-center max-w-md">
          <img src="/login.jpg" className="w-full max-w-md md:max-w-lg lg:max-w-xl mb-6 rounded-xl" />

          <h2 className="text-5xl font-semibold mb-3">
            Make Smarter Financial Decisions
          </h2>

          <p className="text-blue-100 text-sm">
            SmartLoan AI-powered platform evaluates your creditworthiness, predicts risk, and helps you make better financial decisions, like securing the best loan rates and building long-term wealth. Get personalized AI insights upon analysis completion.
          </p>
        </div>

      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex items-center justify-center px-4 sm:px-6">

        <div className="w-full max-w-md p-6 sm:p-8">

          {/* LOGO */}
          <h1 className="text-xl font-semibold mb-6 text-gray-900">
            SmartLoan
          </h1>

          {/* HEADER */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Sign in to your account
          </h2>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back, please enter your details
          </p>

          {/* GOOGLE LOGIN */}
          <div className="mt-6 space-y-3">

            <a href="http://localhost:5000/api/auth/google">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl text-sm sm:text-base hover:bg-gray-50 transition">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
                Sign in with Google
              </button>
            </a>

          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* FORM */}
          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full py-3 sm:py-4 rounded-xl 
            bg-gradient-to-r from-sky-400 to-blue-500 text-white 
            text-sm sm:text-base font-semibold
            shadow-md hover:shadow-xl hover:scale-[1.02] 
            active:scale-95 transition duration-200"
            >
              Sign In
            </button>

          </div>

          {/* FOOTER */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}