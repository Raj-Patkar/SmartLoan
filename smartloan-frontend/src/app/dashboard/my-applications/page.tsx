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
        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-6">
                My Loan Applications
            </h1>

            {applications.length === 0 ? (
                <p className="text-gray-600">
                    No applications found
                </p>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">

                            {/* PRODUCT NAME */}
                            <h2 className="text-lg font-bold text-gray-900">
                                {app.product_name}
                            </h2>

                            {/* STATUS */}
                            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium
                                ${app.status === "approved" ? "bg-green-100 text-green-700" :
                                  app.status === "rejected" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-100 text-yellow-700"}
                            `}>
                                {app.status.toUpperCase()}
                            </span>

                            {/* DETAILS */}
                            <div className="mt-4 text-sm text-gray-700 space-y-2">

                                <p>
                                    <span className="text-gray-500">Requested:</span>{" "}
                                    ₹ {Number(app.amount_requested).toLocaleString()}
                                </p>

                                <p>
                                    <span className="text-gray-500">Predicted Approval:</span>{" "}
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

                                <p className="text-xs text-gray-400 mt-2">
                                    Applied on: {new Date(app.applied_at).toLocaleString()}
                                </p>

                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}