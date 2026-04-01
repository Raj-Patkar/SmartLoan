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
        <div className="p-8 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold mb-6">
                Manager Dashboard
            </h1>

            <div className="grid grid-cols-3 gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl shadow">

                        {/* USER */}
                        <h2 className="text-lg font-bold">
                            {app.full_name}
                        </h2>
                        <p className="text-sm text-gray-500">{app.email}</p>

                        {/* LOAN */}
                        <p className="mt-3 font-semibold text-blue-600">
                            {app.product_name}
                        </p>

                        {/* STATUS */}
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                            ${app.status === "approved" ? "bg-green-100 text-green-700" :
                                app.status === "rejected" ? "bg-red-100 text-red-700" :
                                    "bg-yellow-100 text-yellow-700"}
                        `}>
                            {app.status}
                        </span>

                        {/* AMOUNTS */}
                        <div className="mt-3 text-sm space-y-1">
                            <p>Requested: ₹{app.amount_requested}</p>
                            <p className="text-green-600">
                                Predicted: ₹{app.predicted_approval_amount}
                            </p>
                        </div>

                        {/* CREDIT INFO */}
                        <div className="mt-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm">
                                Score: <b>{app.fuzzy_credit_score}</b>
                            </p>
                            <p className="text-sm">
                                Risk: <b>{app.risk_level}</b>
                            </p>
                            <p className="text-sm">
                                Band: <b>{app.score_band}</b>
                            </p>
                        </div>

                        {/* ACTION BUTTONS */}
                        {app.status === "pending" && (
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => updateStatus(app.id, "approved")}
                                    className="flex-1 bg-green-600 text-white py-2 rounded"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => updateStatus(app.id, "rejected")}
                                    className="flex-1 bg-red-600 text-white py-2 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}