"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";

type Role = "jobseeker" | "employer";

function OAuthCompleteHandler() {
  const router = useRouter();
  const params = useSearchParams();

  const pendingCode = params.get("pending") || "";
  const preferredRole = params.get("role");
  const initialRole: Role = preferredRole === "employer" ? "employer" : "jobseeker";

  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canContinue = useMemo(() => /^\d{6}$/.test(otp), [otp]);

  const sendOtp = useCallback(async () => {
    if (!pendingCode) {
      toast.error("OAuth session is missing. Please continue with Google again.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>("/api/auth/oauth/send-otp", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ pendingCode }),
      });
      setOtpSent(true);
      toast.success(response.message || "OTP sent.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [pendingCode]);

  const completeOAuth = useCallback(async () => {
    if (!pendingCode) {
      toast.error("OAuth session is missing. Please continue with Google again.");
      return;
    }

    if (!canContinue) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch<{
        data: { accessToken: string; user: unknown; nextPath?: string };
      }>("/api/auth/oauth/complete", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({
          pendingCode,
          otp,
          role,
        }),
      });

      authStorage.setAccessToken(response.data.accessToken);
      authStorage.setUser(response.data.user);
      router.replace(response.data.nextPath || "/dashboard/jobseeker");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to complete login";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [canContinue, otp, pendingCode, role, router]);

  if (!pendingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">OAuth session not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please start again from Continue with Google.
          </p>
          <button
            className="mt-4 w-full rounded-full bg-[#155DFC] px-4 py-2 text-white"
            onClick={() => router.replace("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Complete Google Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Flow: Continue with Google, verify OTP, select role, and continue.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">Select user type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("jobseeker")}
              className={`rounded-lg border px-3 py-2 text-sm ${
                role === "jobseeker"
                  ? "border-[#155DFC] bg-blue-50 text-[#155DFC]"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              Jobseeker
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`rounded-lg border px-3 py-2 text-sm ${
                role === "employer"
                  ? "border-[#155DFC] bg-blue-50 text-[#155DFC]"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              Employer
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading || submitting}
            className="rounded-full border border-[#155DFC] px-4 py-2 text-sm text-[#155DFC] disabled:opacity-60"
          >
            {loading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
          </button>
          <button
            type="button"
            onClick={completeOAuth}
            disabled={submitting || !canContinue}
            className="rounded-full bg-[#155DFC] px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">Loading OAuth session...</p>
        </div>
      }
    >
      <OAuthCompleteHandler />
    </Suspense>
  );
}
