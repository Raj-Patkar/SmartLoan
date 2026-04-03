"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MyApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (name) setUserName(name);

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/loans/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-gray-800">

      {/* NAVBAR (CONSISTENT) */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-16 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">

        <h1
          onClick={() => router.push("/dashboard")}
          className="text-lg sm:text-xl md:text-2xl font-semibold hover:text-blue-600 cursor-pointer transition"
        >
          SmartLoan
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

          <span
            onClick={() => router.push("/dashboard")}
            className="hidden md:block text-sm hover:text-blue-600 cursor-pointer transition"
          >
            Dashboard
          </span>

          <span
            onClick={() => router.push("/dashboard/eligibility")}
            className="hidden md:block text-sm hover:text-blue-600 cursor-pointer transition"
          >
            Loans
          </span>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
              {userName?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs sm:text-sm">{userName}</span>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              router.push("/auth/login");
            }}
            className="text-xs sm:text-sm border px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Log Out
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            My Applications
          </h1>
          <p className="text-gray-500 mt-2">
            Track the status of your loan applications
          </p>
        </div>

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500">
              No applications found
            </p>
          </div>
        ) : (

          /* GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >

                {/* TOP */}
                <div>

                  {/* TITLE */}
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {app.product_name}
                  </h2>

                  {/* STATUS */}
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs sm:text-sm rounded-full font-semibold
                      ${app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {app.status.toUpperCase()}
                  </span>

                  {/* DETAILS */}
                  <div className="mt-5 space-y-2 text-sm text-gray-700">

                    <p>
                      <span className="text-gray-500">Requested:</span>{" "}
                      ₹ {Number(app.amount_requested).toLocaleString()}
                    </p>

                    <p>
                      <span className="text-gray-500">Predicted:</span>{" "}
                      ₹ {Number(app.predicted_approval_amount).toLocaleString()}
                    </p>

                    <p>
                      <span className="text-gray-500">Interest:</span>{" "}
                      {app.interest_rate}%
                    </p>

                    <p>
                      <span className="text-gray-500">Tenure:</span>{" "}
                      {app.tenure_months} months
                    </p>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Applied on: {new Date(app.applied_at).toLocaleString()}
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}