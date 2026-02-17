"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

function OAuthHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = useCallback(async () => {
    const code = params.get("code");

    if (!code) {
      setError("Missing OAuth exchange code.");
      setProcessing(false);
      return;
    }

    try {
      const data = await apiFetch<{
        data: { accessToken: string; user: { role: string } };
      }>("/api/auth/oauth/exchange", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ code }),
      });
      const { accessToken, user } = data.data;
      authStorage.setAccessToken(accessToken);
      authStorage.setUser(user);

      if (user.role === "jobseeker") {
        router.replace("/dashboard/jobseeker");
      } else if (user.role === "employer") {
        router.replace("/dashboard/employee/jobs");
      } else {
        router.replace("/dashboard"); // Fallback
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      toast.error(`Authentication failed: ${errorMessage}`);
      setError(`Authentication failed: ${errorMessage}`);
      setProcessing(false);
    }
  }, [params, router]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  if (processing && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Signing you in…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-600">{error || "Something went wrong."}</p>
      <a href="/login" className="text-[#8F59ED] underline">
        Go to login
      </a>
    </div>
  );
}

export default function OAuthSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">Processing OAuth response…</p>
        </div>
      }
    >
      <OAuthHandler />
    </Suspense>
  );
}
