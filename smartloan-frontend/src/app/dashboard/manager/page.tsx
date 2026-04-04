"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManagerDashboard() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("userName");

    if (name) setUserName(name);

    if (role !== "manager") {
      router.push("/dashboard");
    } else {
      init();
    }
  }, []);

  const init = async () => {
    try {
      const appRes = await axios.get(
        "http://localhost:5000/api/manager/applications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications(appRes.data.applications || []);

      // 🔥 FETCH ALL LOANS
      const loanRes = await axios.get(
        "http://localhost:5000/api/loans",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoans(loanRes.data.loans || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = applications.length;
  const approved = applications.filter(
    (a) => a.status?.toLowerCase().trim() === "approved"
  ).length;

  const rejected = applications.filter(
    (a) => a.status?.toLowerCase().trim() === "rejected"
  ).length;
  console.log(applications.map(a => a.status));
  const pending = applications.filter(
    (a) => a.status?.toLowerCase().trim() === "pending"
  ).length;

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen  text-gray-800">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-16 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">

        <h1
          onClick={() => router.push("/dashboard")}
          className="text-lg sm:text-xl md:text-2xl font-semibold hover:text-blue-600 cursor-pointer"
        >
          SmartLoan
        </h1>

        <div className="flex items-center gap-4">

          <span className="hidden md:block text-sm text-blue-600 font-medium">
            Manager
          </span>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {userName?.charAt(0)}
            </div>
            <span className="text-sm">{userName}</span>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              router.push("/auth/login");
            }}
            className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Loan Applications Overview
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor, review and manage all loan applications
          </p>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <StatCard title="Total Applications" value={total} />
          <StatCard title="Approved Applications" value={approved} color="green" />
          <StatCard title="Pending Applications" value={pending} color="yellow" />
          <StatCard title="Rejected Applications" value={rejected} color="red" />

        </div>

        {/* LOAN CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loans.map((loan) => (
            <div
              key={loan.id}
              onClick={() =>
                router.push(`/dashboard/manager/${encodeURIComponent(loan.name)}`)
              }
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
            >
              <h2 className="font-semibold text-lg">{loan.name}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Click to view applications
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, color = "blue" }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-bold text-${color}-600 mt-2`}>
        {value}
      </h2>
    </div>
  );
}