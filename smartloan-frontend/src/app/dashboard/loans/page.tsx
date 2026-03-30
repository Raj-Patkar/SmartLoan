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
    console.log(loans);
    const applyLoan = async (loan: any) => {
        const token = localStorage.getItem("token");

        // 🔥 ask user input
        const amount = prompt(`Enter loan amount (Max ₹${loan.max_loan_amount})`);

        if (!amount) return;

        const amountNumber = Number(amount);

        // ❌ validation
        if (isNaN(amountNumber) || amountNumber <= 0) {
            alert("Invalid amount");
            return;
        }

        if (amountNumber > loan.max_loan_amount) {
            alert(`Amount cannot exceed ₹${loan.max_loan_amount}`);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/loans/apply",
                {
                    loan_product_id: loan.id,
                    amount_requested: amountNumber
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`✅ Applied for ₹${amountNumber} successfully!`);

        } catch (err: any) {
            console.error(err.response?.data || err.message);

            alert(
                err.response?.data?.message ||
                "❌ Failed to apply for loan"
            );
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-6">Recommended Loans</h1>

            {loans.length === 0 ? (
                <p className="text-gray-600">
                    No loan recommendations available
                </p>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {loans.map((loan) => (
                        <div key={loan.id || loan.product_id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">

                            {/* CATEGORY */}
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {loan.category || "Loan"}
                            </span>

                            {/* TITLE */}
                            <h2 className="text-lg font-bold mt-2 text-gray-900">
                                {loan.name}
                            </h2>

                            {/* DESCRIPTION */}
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {loan.description || "No description available"}
                            </p>

                            {/* DETAILS GRID */}
                            <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-700">

                                <div>
                                    <p className="text-gray-500">Interest</p>
                                    <p className="font-semibold">{loan.interest_rate}%</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Tenure</p>
                                    <p className="font-semibold">{loan.tenure_months} months</p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-gray-500">Max Loan Amount</p>
                                    <p className="font-semibold text-green-700">
                                        ₹ {Number(loan.max_loan_amount).toLocaleString()}
                                    </p>
                                </div>

                            </div>

                            {/* BENEFITS */}
                            <div className="mt-4 text-sm text-green-700 bg-green-50 p-2 rounded">
                                {loan.max_benefits || "Standard benefits"}
                            </div>

                            {/* ACTION */}
                            <button onClick={() => applyLoan(loan)} className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                                Apply Now
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}