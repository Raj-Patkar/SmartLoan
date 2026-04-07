"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LoanApplicationsPage() {
  const { loan } = useParams();
  const router = useRouter();
  const decodedLoan = decodeURIComponent(loan as string);
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [userName, setUserName] = useState("");

  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (name) setUserName(name);

    if (!t) {
      router.push("/auth/login");
      return;
    }

    setToken(t);

    fetchData(t); // ✅ correct usage
  }, []);


  // ✅ FIXED FUNCTION (NOW ACCEPTS TOKEN)
  const fetchData = async (authToken: string) => {
    const res = await axios.get(
      "http://localhost:5000/api/manager/applications",
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    const filtered = res.data.applications.filter(
      (a: any) => a.product_name === decodedLoan
    );

    setData(filtered);
  };


  // ✅ UPDATE STATUS ALSO USES TOKEN SAFELY
  const updateStatus = async (id: number, status: string) => {
    await axios.patch(
      `http://localhost:5000/api/manager/applications/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchData(token); // 🔥 IMPORTANT FIX
  };

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

        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
          {decodedLoan} Applications
        </h1>

        {data.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border text-center text-gray-500">
            No applications found for this loan
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden w-full">

            <div className="overflow-x-auto">

              <table className="min-w-[700px] md:min-w-[900px] w-full text-sm">

                {/* HEADER */}
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Applicant</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Email</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Amount</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Score</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Risk</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">AI Insight</th>
                    <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left">Actions</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="divide-y">

                  {data.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">

                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 font-medium text-gray-900">
                        {app.full_name}
                      </td>

                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-gray-500">
                        {app.email}
                      </td>

                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 font-medium">
                        ₹ {Number(app.amount_requested).toLocaleString()}
                      </td>

                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 font-semibold">
                        {app.fuzzy_credit_score}
                      </td>

                      {/* RISK */}
                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full
                ${app.risk_level === "Low" && "bg-green-100 text-green-700"}
                ${app.risk_level === "Medium" && "bg-yellow-100 text-yellow-700"}
                ${app.risk_level === "High" && "bg-red-100 text-red-700"}
              `}>
                          {app.risk_level}
                        </span>
                      </td>

                      {/* AI */}
                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                        <button
                          onClick={() => setSelected(app)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View Details
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() => updateStatus(app.id, "approved")}
                            className="px-4 py-2 text-xs font-medium rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            className="px-4 py-2 text-xs font-medium rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            Reject
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl max-w-lg shadow-lg">

            <h2 className="font-semibold mb-3">AI Explanation</h2>
            <p className="text-sm text-gray-700">{selected.explanation}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}