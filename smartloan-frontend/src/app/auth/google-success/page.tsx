"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Signing you in...</p>
    </div>
  );
}

export default function GoogleSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Signing you in...</p>
        </div>
      }
    >
      <GoogleSuccessContent />
    </Suspense>
  );
}