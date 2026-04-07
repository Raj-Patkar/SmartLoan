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
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4 sm:px-6 md:px-10 py-6 md:py-10">

            {/* CONTAINER */}
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 md:mb-10">

                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                            Loan Recommendations
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base md:text-lg">
                            Explore loan options tailored to your credit profile
                        </p>
                    </div>

                    <a
                        href="/dashboard/my-applications"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                    >
                        View My Applications →
                    </a>
                </div>

                {/* EMPTY STATE */}
                {loans.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow border border-gray-100 text-center">
                        <p className="text-gray-500 text-sm sm:text-base">
                            No loan recommendations available
                        </p>
                    </div>
                ) : (

                    /* GRID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {loans.map((loan) => (
                            <div
                                key={loan.id || loan.product_id}
                                className="group bg-white p-6 sm:p-7 rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >

                                {/* TOP */}
                                <div>

                                    {/* CATEGORY */}
                                    <span className="inline-block text-xs sm:text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                        {loan.category || "Loan"}
                                    </span>

                                    {/* TITLE */}
                                    <h2 className="text-lg sm:text-xl font-semibold mt-3 text-gray-900 group-hover:text-blue-600 transition">
                                        {loan.name}
                                    </h2>

                                    {/* DESCRIPTION */}
                                    <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
                                        {loan.description || "No description available"}
                                    </p>

                                    {/* HIGHLIGHT BOX (KEY INFO) */}
                                    <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">

                                        <div className="flex justify-between items-center">

                                            {/* INTEREST */}
                                            <div>
                                                <p className="text-xs text-gray-500">Interest</p>
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    {loan.interest_rate}%
                                                </p>
                                            </div>

                                            {/* TENURE */}
                                            <div>
                                                <p className="text-xs text-gray-500">Tenure</p>
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    {loan.tenure_months} mo
                                                </p>
                                            </div>

                                        </div>

                                        {/* AMOUNT (HIGHLIGHTED) */}
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500">Max Loan</p>
                                            <p className="text-lg sm:text-xl font-bold text-green-600">
                                                ₹ {Number(loan.max_loan_amount).toLocaleString()}
                                            </p>
                                        </div>

                                    </div>

                                    {/* BENEFITS */}
                                    <div className="mt-5 text-sm sm:text-base text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                        {loan.max_benefits || "Standard benefits"}
                                    </div>

                                </div>

                                {/* BUTTON */}
                                <button
                                    onClick={() => applyLoan(loan)}
                                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition-all duration-200 group-hover:shadow-lg"
                                >
                                    Apply Now →
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}