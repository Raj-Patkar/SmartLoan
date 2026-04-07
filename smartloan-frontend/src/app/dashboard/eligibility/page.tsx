"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EligibilityPage() {
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [hasProfile, setHasProfile] = useState(false);
    const [assessment, setAssessment] = useState<any>(null);
    const [running, setRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loans, setLoans] = useState<any[]>([]);
    const [loanLoading, setLoanLoading] = useState(false);
    const [form, setForm] = useState<any>({
        age: "",
        monthly_income: "",
        existing_emi: "",
        loan_amount_requested: "",
        employment_type: "",
        credit_history_length: "",
        num_existing_loans: "",
        total_assets: "",
        payment_history_pct: "",
        credit_utilization: "",
        num_inquiries: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName");

        if (!token) {
            router.push("/auth/login");
            return;
        }

        if (name) setUserName(name);

        const init = async () => {
            try {
                const profile = await axios.get("http://localhost:5000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userProfile = profile.data?.profile;

                // ✅ check if profile actually has data
                if (userProfile && Object.keys(userProfile).length > 0) {
                    setForm(userProfile);
                    setHasProfile(true);
                } else {
                    setHasProfile(false);
                    setShowModal(true); // 🔥 force modal
                }

                const res = await axios.get(
                    "http://localhost:5000/api/assessment/latest",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setAssessment(res.data.assessment);
                if (res.data.assessment) {
                    setLoanLoading(true);

                    const loanRes = await axios.get(
                        "http://localhost:5000/api/loans/recommendations",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    

                    setLoans(loanRes.data.eligible_products || []);
                    setLoanLoading(false);
                }

            } catch { }
        };

        init();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const applyLoan = async (loan: any) => {
        const token = localStorage.getItem("token");

        const amount = prompt(`Enter loan amount (Max ₹${loan.max_loan_amount})`);
        if (!amount) return;

        const amountNumber = Number(amount);

        if (isNaN(amountNumber) || amountNumber <= 0) {
            alert("Invalid amount");
            return;
        }

        if (amountNumber > loan.max_loan_amount) {
            alert(`Amount cannot exceed ₹${loan.max_loan_amount}`);
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/loans/apply",
                {
                    loan_product_id: loan.id,
                    amount_requested: amountNumber
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`✅ Applied successfully!`);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to apply");
        }
    };
    const saveProfile = async () => {
        const token = localStorage.getItem("token");

        await axios.post("http://localhost:5000/api/profile", form, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setHasProfile(true);
        setShowModal(false);
    };

    const runAssessment = async () => {
        const token = localStorage.getItem("token");

        try {
            setRunning(true);

            // 🔹 Run assessment
            await axios.post(
                "http://localhost:5000/api/assessment/run",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 🔹 Get latest assessment
            const res = await axios.get(
                "http://localhost:5000/api/assessment/latest",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAssessment(res.data.assessment);

            // 🔹 Fetch loan recommendations
            if (res.data.assessment) {
                setLoanLoading(true);

                const loanRes = await axios.get(
                    "http://localhost:5000/api/loans/recommendations",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setLoans(loanRes.data.eligible_products || []);
                setLoanLoading(false);
            }

        } catch (err: any) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Something went wrong while running analysis"
            );
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="min-h-screen  text-gray-800">

            {/* NAVBAR */}
            <div className="flex justify-between items-center px-4 sm:px-6 md:px-16 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">

                {/* LOGO */}
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold hover:text-blue-600 transition cursor-pointer">
                    SmartLoan
                </h1>

                {/* RIGHT */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

                    {/* DASHBOARD (hide on small) */}


                    {/* USER */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                            {userName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                            {userName}
                        </span>
                    </div>
                    <span
                        onClick={() => router.push("/dashboard/my-applications")}
                        className="hidden md:block text-sm hover:text-blue-600 cursor-pointer transition"
                    >
                        My Applications
                    </span>
                    {/* LOGOUT */}
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

            <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto">

                {/* GRID */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">


                        <h2 className="text-2xl font-semibold mb-6">Credit Analysis</h2>

                        {assessment ? (
                            <>
                                <p className="text-gray-500">Your Credit Analysis</p>

                                <h1 className="text-6xl font-bold text-green-600 mt-2">
                                    {assessment.fuzzy_credit_score}
                                </h1>

                                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                                    {assessment.risk_level}
                                </span>

                                <div className="mt-6 p-5 bg-blue-50 rounded-xl border">
                                    <p className="font-semibold mb-2">Explanation</p>
                                    <p className="text-gray-700 text-sm">
                                        {assessment.explanation}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">
                                Run analysis to see your credit score
                            </p>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">

                        {/* PROFILE */}
                        {hasProfile ? (
                            <>
                                <div>
                                    <p className="font-semibold">Financial Profile Ready</p>
                                    <p className="text-sm text-gray-500">
                                        You can now run your credit analysis
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="text-blue-600 font-medium hover:underline transition"
                                >
                                    Edit Profile⚙️
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Create your financial profile
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Add your details to unlock credit insights and loan options
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    + Add
                                </button>
                            </>
                        )}

                        {/* RUN BUTTON */}
                        {hasProfile && (
                            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">

                                <button
                                    onClick={runAssessment}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow hover:shadow-lg hover:scale-[1.01] active:scale-95 transition"
                                >
                                    {running ? "Running..." : "Run Credit Analysis"}
                                </button>

                            </div>
                        )}

                    </div>

                </div>
                {assessment && (
                    <div className="mt-14">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">
                                Recommended Loans
                            </h2>

                            <span
                                onClick={() => router.push("/dashboard/my-applications")}
                                className="text-blue-600 cursor-pointer font-medium hover:underline"
                            >
                                View Applications →
                            </span>
                        </div>

                        {loanLoading ? (
                            <div className="bg-white p-6 rounded-2xl border text-center text-gray-500">
                                Loading loan recommendations...
                            </div>
                        ) : loans.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border text-center text-gray-500">
                                No loan recommendations available
                            </div>
                        ) : (

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                {loans.map((loan) => (
                                    <div
                                        key={loan.id || loan.product_id}
                                        className="group bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                                    >

                                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {loan.category || "Loan"}
                                        </span>

                                        <h3 className="mt-3 font-semibold text-lg group-hover:text-blue-600">
                                            {loan.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {loan.description}
                                        </p>

                                        <div className="mt-4 bg-gray-50 p-4 rounded-xl border">

                                            <div className="flex justify-between text-sm">
                                                <div>
                                                    <p className="text-gray-500">Interest</p>
                                                    <p className="font-semibold">{loan.interest_rate}%</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">Tenure</p>
                                                    <p className="font-semibold">{loan.tenure_months} mo</p>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-green-600 font-bold text-lg">
                                                ₹ {Number(loan.max_loan_amount).toLocaleString()}
                                            </p>

                                        </div>

                                        <button
                                            onClick={() => applyLoan(loan)}
                                            className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                                        >
                                            Apply Now →
                                        </button>

                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">

                    <div className="bg-white w-full sm:max-w-3xl h-[90vh] sm:h-auto overflow-y-auto p-6 sm:p-8 rounded-t-3xl sm:rounded-3xl shadow-xl relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                            Edit Financial Profile
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">

                            <Input label="Age" name="age" value={form.age} onChange={handleChange} />
                            <Input label="Monthly Income" name="monthly_income" value={form.monthly_income} onChange={handleChange} />
                            <Input label="Existing EMI" name="existing_emi" value={form.existing_emi} onChange={handleChange} />
                            <Input label="Loan Amount Requested" name="loan_amount_requested" value={form.loan_amount_requested} onChange={handleChange} />

                            <Select name="employment_type" value={form.employment_type} onChange={handleChange} />

                            <Input label="Credit History Length" name="credit_history_length" value={form.credit_history_length} onChange={handleChange} />
                            <Input label="Number of Loans" name="num_existing_loans" value={form.num_existing_loans} onChange={handleChange} />
                            <Input label="Total Assets" name="total_assets" value={form.total_assets} onChange={handleChange} />
                            <Input label="Payment History %" name="payment_history_pct" value={form.payment_history_pct} onChange={handleChange} />
                            <Input label="Credit Utilization %" name="credit_utilization" value={form.credit_utilization} onChange={handleChange} />
                            <Input label="Number of Inquiries" name="num_inquiries" value={form.num_inquiries} onChange={handleChange} />

                        </div>

                        <button
                            onClick={() => {
                                saveProfile();
                                setShowModal(false);
                            }}
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Save Profile
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

/* COMPONENTS */

function Input({ label, name, value, onChange }: any) {
    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">{label}</label>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                className="p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
    );
}

function Select({ name, value, onChange }: any) {
    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Employment Type</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-employed</option>
            </select>
        </div>
    );
}