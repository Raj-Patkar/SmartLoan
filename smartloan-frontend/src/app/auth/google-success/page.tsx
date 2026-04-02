"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      // Save token
      localStorage.setItem("token", token);

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Signing you in...</p>
    </div>
  );
}