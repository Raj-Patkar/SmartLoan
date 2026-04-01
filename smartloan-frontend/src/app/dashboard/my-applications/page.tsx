"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("token");

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
            <div className="min-h-screen flex items-center justify-center">
                Loading applications...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4 sm:px-6 md:px-10 py-6 md:py-10">

            {/* CONTAINER */}
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        My Applications
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base md:text-lg">
                        Track the status of your loan applications
                    </p>
                </div>

                {/* EMPTY STATE */}
                {applications.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow border border-gray-100 text-center">
                        <p className="text-gray-500 text-sm sm:text-base">
                            No applications found
                        </p>
                    </div>
                ) : (

                    /* GRID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >

                                {/* TOP */}
                                <div>

                                    {/* TITLE */}
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {app.product_name}
                                    </h2>

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

                                    {/* DETAILS */}
                                    <div className="mt-5 space-y-2 text-sm sm:text-base text-gray-700">

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
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <p className="text-xs sm:text-sm text-gray-400">
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