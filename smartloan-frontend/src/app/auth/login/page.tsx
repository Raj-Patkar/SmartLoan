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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4">

      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Login to continue to SmartLoan
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm sm:text-base font-semibold shadow-md transition"
          >
            Login
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-sm text-gray-500 mt-5 text-center">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}