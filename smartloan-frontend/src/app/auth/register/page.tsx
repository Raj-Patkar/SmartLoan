"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      router.push("/auth/login");
    } catch (err: any) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE REGISTER */}
      <div className="flex items-center justify-center px-4 sm:px-6">

        <div className="w-full max-w-md p-6 sm:p-8">

          {/* LOGO */}
          <h1 className="text-xl font-semibold mb-6 text-gray-900">
            SmartLoan
          </h1>

          {/* HEADER */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Create your account
          </h2>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Start your SmartLoan journey
          </p>

          {/* GOOGLE SIGNUP */}
          <div className="mt-6 space-y-3">

            <a href="http://localhost:5000/api/auth/google">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl text-sm sm:text-base hover:bg-gray-50 transition">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
                Sign up with Google
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
              type="text"
              placeholder="Full Name"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition"
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* REGISTER BUTTON */}
            <button
              onClick={handleRegister}
              className="w-full py-3 sm:py-4 rounded-xl 
            bg-gradient-to-r from-yellow-400 to-yellow-500 text-white 
            text-sm sm:text-base font-semibold
            shadow-md hover:shadow-xl hover:scale-[1.02] 
            active:scale-95 transition duration-200"
            >
              Create Account
            </button>

          </div>

          {/* FOOTER */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-yellow-600 font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>

      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:flex items-center justify-center bg-[#C89116] p-6 md:p-10 lg:p-16">

        <div className="text-center max-w-lg lg:max-w-xl">

          <img
            src="/register.jpg"
            className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg mb-6 rounded-xl"
          />

          <h2 className="text-4xl font-semibold mb-3 text-white">
            Build Your Financial Foundation
          </h2>

          <p className="text-white text-sm">
            SmartLoan AI-powered platform provides clear asset evaluation, verified income analysis, and personalized loan structures to help you build your financial future. Register now to unlock exclusive insights for securing better loans and long-term investments.
          </p>

        </div>

      </div>

    </div>
  );
}