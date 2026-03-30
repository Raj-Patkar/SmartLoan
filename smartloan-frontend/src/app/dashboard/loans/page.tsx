"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          "http://localhost:5000/api/loans/recommendations",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setLoans(res.data.eligible_products || []);
      } catch (err) {
        console.error("Error fetching loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading loans...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">Recommended Loans</h1>

      {loans.length === 0 ? (
        <p className="text-gray-600">
          No loan recommendations available
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {loans.map((loan, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h2 className="text-lg font-semibold mb-2">
                {loan.name}
              </h2>

              <p className="text-sm text-gray-600">
                Interest: {loan.interest_rate}%
              </p>
              

              <p className="text-sm text-gray-600">
                Tenure: {loan.tenure_months} months
              </p>

              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}