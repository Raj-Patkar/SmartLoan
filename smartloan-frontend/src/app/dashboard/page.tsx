"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type FormType = {
  age: string;
  monthly_income: string;
  existing_emi: string;
  loan_amount_requested: string;
  employment_type: string;
  credit_history_length: string;
  num_existing_loans: string;
  total_assets: string;
  payment_history_pct: string;
  credit_utilization: string;
  num_inquiries: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
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

  const [loading, setLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.profile) {
        setForm(res.data.profile);
        setHasProfile(true);
      }
    } catch (error) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    // 🔥 ADD THIS BLOCK HERE
    const formattedData = {
      ...form,
      age: Number(form.age),
      monthly_income: Number(form.monthly_income),
      existing_emi: Number(form.existing_emi),
      loan_amount_requested: Number(form.loan_amount_requested),
      credit_history_length: Number(form.credit_history_length),
      num_existing_loans: Number(form.num_existing_loans),
      total_assets: Number(form.total_assets),
      payment_history_pct: Number(form.payment_history_pct),
      credit_utilization: Number(form.credit_utilization),
      num_inquiries: Number(form.num_inquiries)
    };

    try {
      if (hasProfile) {
        await axios.put("http://localhost:5000/api/profile", formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Profile updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/profile", formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Profile created successfully");
        setHasProfile(true);
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("Error saving profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {hasProfile
            ? "Update your financial profile"
            : "Fill your financial profile"}
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <Input name="age" label="Age" value={form.age} onChange={handleChange} />
          <Input name="monthly_income" label="Monthly Income" value={form.monthly_income} onChange={handleChange} />
          <Input name="existing_emi" label="Existing EMI" value={form.existing_emi} onChange={handleChange} />
          <Input name="loan_amount_requested" label="Loan Amount Requested" value={form.loan_amount_requested} onChange={handleChange} />

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Employment Type</label>
            <select
              name="employment_type"
              value={form.employment_type}
              onChange={handleChange}
              className="p-2 rounded border border-gray-300 bg-white"
            >
              <option value="">Select</option>
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-employed</option>
            </select>
          </div>

          <Input name="credit_history_length" label="Credit History Length" value={form.credit_history_length} onChange={handleChange} />
          <Input name="num_existing_loans" label="Number of Loans" value={form.num_existing_loans} onChange={handleChange} />
          <Input name="total_assets" label="Total Assets" value={form.total_assets} onChange={handleChange} />
          <Input name="payment_history_pct" label="Payment History %" value={form.payment_history_pct} onChange={handleChange} />
          <Input name="credit_utilization" label="Credit Utilization %" value={form.credit_utilization} onChange={handleChange} />
          <Input name="num_inquiries" label="Number of Inquiries" value={form.num_inquiries} onChange={handleChange} />

          <button className="col-span-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
            {hasProfile ? "Update Profile" : "Create Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
type InputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Input({ name, label, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="p-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}