"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api-client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch<{ message: string }>("/api/auth/forgot-password/send-otp", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email }),
      });
      setOtpSent(true);
      setMessage(res.message);
      toast.success(res.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await apiFetch<{ message: string }>("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email, otp, password }),
      });
      toast.success(res.message);
      setMessage(res.message);
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setOtpSent(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          {otpSent ? "Enter OTP and set a new password" : "Enter your email to receive an OTP"}
        </p>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none"
            required
          />
        </div>

        {otpSent && (
          <>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none tracking-[0.3em]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                minLength={6}
                required
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
                required
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none"
              />
            </div>
          </>
        )}

        <button
          type="button"
          disabled={loading || !email}
          onClick={otpSent ? resetPasswordWithOtp : sendOtp}
          className="w-full bg-linear-to-r from-[#155DFC] to-[#00B8DB] text-white py-3 rounded-full font-semibold disabled:opacity-70"
        >
          {loading ? "Please wait..." : otpSent ? "Verify OTP & Reset Password" : "Send OTP"}
        </button>

        {otpSent && (
          <button
            type="button"
            disabled={loading}
            onClick={sendOtp}
            className="w-full text-sm text-[#155DFC] font-medium hover:underline"
          >
            Resend OTP
          </button>
        )}

        {message && <p className="text-sm text-center text-gray-700">{message}</p>}

        <p className="text-sm text-center text-gray-600">
          Back to{" "}
          <a href="/login" className="text-[#155DFC] hover:underline">
            login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
