"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LoanApplicationsPage() {
  const { loan } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [userName, setUserName] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);

    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/manager/applications",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const filtered = res.data.applications.filter(
      (a: any) => a.product_name === decodeURIComponent(loan as string)
    );

    setData(filtered);
  };

  const updateStatus = async (id: number, status: string) => {
    await axios.patch(
      `http://localhost:5000/api/manager/applications/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  return (
    <div className="min-h-screen  text-gray-800">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 md:px-16 py-4 bg-white border-b border-gray-200  sticky top-0">

        <h1
          onClick={() => router.push("/dashboard/manager")}
          className="text-xl font-semibold cursor-pointer"
        >
          SmartLoan
        </h1>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {userName?.charAt(0)}
          </div>
          <span>{userName}</span>

          <button
            onClick={() => {
              localStorage.clear();
              router.push("/auth/login");
            }}
            className="border px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          {loan} Applications
        </h1>

        {data.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border text-center text-gray-500">
            No applications found for this loan
          </div>
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b text-gray-500">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th>AI</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((app) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">

                    <td className="p-4">{app.full_name}</td>
                    <td>{app.email}</td>
                    <td>₹ {app.amount_requested}</td>
                    <td>{app.fuzzy_credit_score}</td>
                    <td>{app.risk_level}</td>

                    <td>
                      <button
                        onClick={() => setSelected(app)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>

                    <td className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app.id, "approved")}
                        className="text-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, "rejected")}
                        className="text-red-600"
                      >
                        Reject
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
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