"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManagerDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "manager") {
            router.push("/dashboard");
        } else {
            fetchApplications(); // only if manager
        }
    }, []);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchApplications = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/manager/applications",
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



    const updateStatus = async (id: number, status: "approved" | "rejected") => {
        try {
            await axios.patch(
                `http://localhost:5000/api/manager/applications/${id}/status`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`Application ${status}`);
            fetchApplications(); // refresh
        } catch (err) {
            alert("Error updating status");
        }
    };

    if (loading) {
        return <div className="p-10">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-200 px-4 sm:px-6 md:px-10 py-6 md:py-10">

            {/* CONTAINER */}
            <div className="max-w-12xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        Manager Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base md:text-lg">
                        Review and manage loan applications
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >

                            {/* TOP */}
                            <div>

                                {/* USER */}
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {app.full_name}
                                </h2>
                                <p className="text-sm text-gray-500">{app.email}</p>

                                {/* LOAN */}
                                <p className="mt-3 font-medium text-blue-600 text-sm sm:text-base">
                                    {app.product_name}
                                </p>

                                {/* STATUS */}
                                <span className={`inline-block mt-3 px-3 py-1 text-xs sm:text-sm rounded-full font-semibold
                ${app.status === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : app.status === "rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"}
              `}>
                                    {app.status.toUpperCase()}
                                </span>

                                {/* AMOUNTS */}
                                <div className="mt-5 space-y-2 text-sm sm:text-base text-gray-700">
                                    <p>
                                        <span className="text-gray-500">Requested:</span>{" "}
                                        ₹ {Number(app.amount_requested).toLocaleString()}
                                    </p>
                                    <p className="text-green-600 font-semibold">
                                        Predicted: ₹ {Number(app.predicted_approval_amount).toLocaleString()}
                                    </p>
                                </div>

                                {/* CREDIT INFO */}
                                <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">

                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Credit Score</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {app.fuzzy_credit_score}
                                        </p>
                                    </div>

                                    <p className="text-sm mt-2 text-gray-600">
                                        Risk:
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {app.risk_level}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Band:
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {app.score_band}
                                        </span>
                                    </p>

                                    {/* EXPLANATION */}
                                    {app.explanation && (
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <p className="text-sm font-semibold text-blue-700 mb-1">
                                                Explanation
                                            </p>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {app.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ACTIONS */}
                            {app.status === "pending" && (
                                <div className="flex gap-3 mt-6">

                                    <button
                                        onClick={() => updateStatus(app.id, "approved")}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => updateStatus(app.id, "rejected")}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md transition"
                                    >
                                        Reject
                                    </button>

                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}