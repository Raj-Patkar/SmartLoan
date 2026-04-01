"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type FormType = {
  age: string;
  monthly_income: string;
  existing_emi: string;
  loan_amount_requested: string;
  employment_type: string;
  credit_history_length: string;
  num_existing_loans: string;
  total_assets: string;
  payment_history_pct: string;
  credit_utilization: string;
  num_inquiries: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [form, setForm] = useState<FormType>({
    age: "",
    monthly_income: "",
    existing_emi: "",
    loan_amount_requested: "",
    employment_type: "",
    credit_history_length: "",
    num_existing_loans: "",
    total_assets: "",
    payment_history_pct: "",
    credit_utilization: "",
    num_inquiries: ""
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [view, setView] = useState<"form" | "dashboard">("form");
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    if (!token) {
      router.push("/login");
      return;
    }

    const init = async () => {
      try {
        // ✅ fetch profile
        const profileRes = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (profileRes.data?.profile) {
          setForm(profileRes.data.profile);
          setHasProfile(true);
          setView("dashboard");
        }

        // ✅ fetch assessment
        try {
          const res = await axios.get(
            "http://localhost:5000/api/assessment/latest",
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          setAssessment(res.data.assessment);
        } catch (err) {
          console.log("No assessment yet");
        }

      } catch (err) {
        setHasProfile(false);
      } finally {
        setLoading(false); // 🔥 THIS FIXES YOUR ISSUE
      }
    };

    init();
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.profile) {
        setForm(res.data.profile);
        setHasProfile(true);
        setView("dashboard");
      }
    } catch (error) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    // 🔥 ADD THIS BLOCK HERE
    const formattedData = {
      ...form,
      age: Number(form.age),
      monthly_income: Number(form.monthly_income),
      existing_emi: Number(form.existing_emi),
      loan_amount_requested: Number(form.loan_amount_requested),
      credit_history_length: Number(form.credit_history_length),
      num_existing_loans: Number(form.num_existing_loans),
      total_assets: Number(form.total_assets),
      payment_history_pct: Number(form.payment_history_pct),
      credit_utilization: Number(form.credit_utilization),
      num_inquiries: Number(form.num_inquiries)
    };

    try {
      if (hasProfile) {
        await axios.put("http://localhost:5000/api/profile", formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Profile updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/profile", formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Profile created successfully");
        setHasProfile(true);
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("Error saving profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        Loading...
      </div>
    );
  }

  const runAssessment = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/assessment/run",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      alert("Assessment completed!");

    } catch (err) {
      console.error(err);
      alert("Failed to run assessment");
    }
  };

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4 sm:px-6 md:px-10 py-6 md:py-10">

        {/* HEADER */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 md:mb-12">

          {/* LEFT */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base md:text-lg">
              Manage your credit profile and loan eligibility
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

            {/* BUTTON 1 */}
            <button
              onClick={runAssessment}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition"
            >
              Run Credit Score
            </button>

            {/* BUTTON 2 */}
            <button
              onClick={() => setView("form")}
              className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition"
            >
              Edit Profile
            </button>

            {/* PROFILE */}
            <div className="flex items-center justify-center md:justify-start gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">

              {/* ICON */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>

              {/* NAME */}
              <p className="text-sm font-medium text-gray-800 truncate">
                {userName || "User"}
              </p>

            </div>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* CREDIT CARD */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100">

            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6">
              Credit Score Overview
            </h2>

            {assessment ? (
              <>
                <div>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-600">
                    {assessment.fuzzy_credit_score}
                  </p>

                  <p className="mt-2 md:mt-3 text-sm sm:text-base md:text-lg text-gray-600">
                    Risk Level:
                    <span className="ml-2 font-semibold text-gray-900">
                      {assessment.risk_level}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                No credit score yet. Click "Run Credit Score"
              </p>
            )}

            {/* EXPLANATION */}
            {assessment?.explanation && (
              <div className="mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-blue-50 border border-blue-200 rounded-xl md:rounded-2xl">
                <p className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
                  Why this score?
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {assessment.explanation}
                </p>
              </div>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between">

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 md:mb-4">
                Quick Actions
              </h3>

              <p className="text-gray-500 text-xs sm:text-sm mb-4 md:mb-6">
                Explore loan options based on your credit profile
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard/loans")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition w-full"
            >
              View Loan Options
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* ================= FORM VIEW ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4 sm:px-6 md:px-10 py-6 md:py-10">

      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Financial Profile
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base md:text-lg">
            {hasProfile
              ? "Update your financial details"
              : "Provide your financial details"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100">

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
          >

            {/* INPUTS */}
            <Input name="age" label="Age" value={form.age} onChange={handleChange} />
            <Input name="monthly_income" label="Monthly Income" value={form.monthly_income} onChange={handleChange} />
            <Input name="existing_emi" label="Existing EMI" value={form.existing_emi} onChange={handleChange} />
            <Input name="loan_amount_requested" label="Loan Amount Requested" value={form.loan_amount_requested} onChange={handleChange} />

            {/* SELECT */}
            <div className="flex flex-col">
              <label className="text-sm sm:text-base text-gray-600 mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={form.employment_type}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="">Select</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-employed</option>
              </select>
            </div>

            <Input name="credit_history_length" label="Credit History Length" value={form.credit_history_length} onChange={handleChange} />
            <Input name="num_existing_loans" label="Number of Loans" value={form.num_existing_loans} onChange={handleChange} />
            <Input name="total_assets" label="Total Assets" value={form.total_assets} onChange={handleChange} />
            <Input name="payment_history_pct" label="Payment History %" value={form.payment_history_pct} onChange={handleChange} />
            <Input name="credit_utilization" label="Credit Utilization %" value={form.credit_utilization} onChange={handleChange} />
            <Input name="num_inquiries" label="Number of Inquiries" value={form.num_inquiries} onChange={handleChange} />

            {/* BUTTON */}
            <div className="col-span-1 sm:col-span-2 mt-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg font-semibold shadow-md transition">
                {hasProfile ? "Update Profile" : "Create Profile"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
type InputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Input({ name, label, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm sm:text-base text-gray-600 mb-2">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
      />
    </div>
  );
}