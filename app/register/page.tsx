"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch, authStorage } from "@/lib/api-client";
import PasswordChecklist from "@/app/components/PasswordChecklist";
import { isPasswordValid } from "@/lib/password-rules";

const resolveRolePath = (role?: string) => {
    if (role === "jobseeker") return "/dashboard/jobseeker";
    if (role === "employer") return "/dashboard/employee/jobs";
    if (role === "admin") return "/dashboard/admin";
    return "/dashboard/jobseeker";
};

const Register = () => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "jobseeker",
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        let mounted = true;

        const redirectIfAuthenticated = async () => {
            const token = authStorage.getAccessToken();
            if (!token) return;

            const user = authStorage.getUser<{ role?: string }>();
            if (user?.role) {
                router.replace(resolveRolePath(user.role));
                return;
            }

            try {
                const profile = await apiFetch<{ data?: { user?: { role?: string } } }>("/api/auth/profile");
                const profileUser = profile?.data?.user;
                if (!mounted || !profileUser?.role) return;
                authStorage.setUser(profileUser);
                router.replace(resolveRolePath(profileUser.role));
            } catch {
                // Let register form render if session is invalid.
            }
        };

        redirectIfAuthenticated();

        return () => {
            mounted = false;
        };
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email" && otpSent) {
            setOtpSent(false);
            setOtp("");
            setMessage("Email changed. Please request a new OTP.");
        }
    };

    const handleGoogle = () => {
        const role = formData.role || "jobseeker";
        const backend = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
        const redirectUri = typeof window !== "undefined" ? window.location.origin : "";
        window.location.href = `${backend}/api/auth/google?role=${encodeURIComponent(role)}&redirectUri=${encodeURIComponent(redirectUri)}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const clientErrors: string[] = [];
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(formData.email)) {
                clientErrors.push("Please enter a valid email address");
            }

            if (!isPasswordValid(formData.password)) {
                clientErrors.push("Password must satisfy all listed rules");
            }

            if (formData.password !== confirmPassword) {
                clientErrors.push("Password and confirm password must match");
            }

            if (formData.firstName.trim().length < 2 || formData.firstName.trim().length > 50) {
                clientErrors.push("First name must be 2-50 characters");
            }
            if (formData.lastName.trim().length < 2 || formData.lastName.trim().length > 50) {
                clientErrors.push("Last name must be 2-50 characters");
            }

            if (!['jobseeker', 'employer'].includes(formData.role)) {
                clientErrors.push("Role must be either Job Seeker or Employer");
            }

            const phoneRegex = /^\+?[1-9]\d{0,15}$/;
            if (!phoneRegex.test(formData.phone)) {
                clientErrors.push("Please enter a valid phone number (digits only, optional +, cannot start with 0)");
            }

            if (otpSent && !/^\d{6}$/.test(otp)) {
                clientErrors.push("Please enter a valid 6-digit OTP");
            }

            if (clientErrors.length > 0) {
                setMessage(clientErrors.join("\n"));
                return;
            }

            if (!otpSent) {
                const sendOtpResponse = await apiFetch<{ message: string }>("/api/auth/register/send-otp", {
                    method: "POST",
                    skipAuth: true,
                    body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
                });
                setOtpSent(true);
                setMessage("✅ " + sendOtpResponse.message);
                toast.success("OTP sent to your email");
            } else {
                const data = await apiFetch<{
                    message: string;
                    data: { accessToken: string; user: unknown; nextPath?: string };
                }>("/api/auth/register/verify-otp", {
                    method: "POST",
                    skipAuth: true,
                    body: JSON.stringify({ ...formData, otp }),
                });
                setMessage("✅ " + data.message);
                authStorage.setAccessToken(data.data.accessToken);
                authStorage.setUser(data.data.user);
                toast.success("Registration successful!");
                router.push(data.data.nextPath || (formData.role === "employer"
                    ? "/dashboard/employee/profile/create"
                    : "/dashboard/jobseeker"));

                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    phone: "",
                    role: "jobseeker",
                });
                setConfirmPassword("");
                setOtp("");
                setOtpSent(false);
            }
        } catch (err) {
            console.error("Error:", err);
            const message = err instanceof Error ? err.message : "Server error. Please try again later.";
            toast.error(message);
            setMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Mobile Top Logo */}
            <div className="flex md:hidden w-full justify-center pt-6">
                <img src="/logo.png" alt="CareerMade" className="h-10" />
            </div>
            {/* LEFT SECTION - FORM */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -40 }}
                transition={{ duration: 0.8 }}
                className="order-2 md:order-1 flex flex-col justify-center items-center md:w-1/2 px-6 py-10 md:px-16"
            >
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="hidden md:flex items-center mb-8 space-x-3"
                >
                    {/* <div className="bg-[#155DFC] p-2 rounded-lg shadow-md">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                        CareerMade
                    </span> */}
                    <img src="/logo.png" alt="CareerMade" className="h-13" />
                </motion.div>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                    Create Your Account
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-sm leading-relaxed">
                    Join the CareerMade community and start connecting with the best doctors
                    and employers.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm space-y-5 bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-100"
                >
                    {/* First Name */}
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First name"
                            required
                            minLength={2}
                            maxLength={50}
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 transition-all bg-white"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            required
                            minLength={2}
                            maxLength={50}
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            required
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all"
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            required
                            pattern="^\+?[1-9]\d{0,15}$"
                            title="Digits only, optional leading +, cannot start with 0"
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all"
                        />
                    </div>

                    <PasswordChecklist
                        password={formData.password}
                        confirmPassword={confirmPassword}
                        showConfirmRule
                    />

                    {/* Role Selector */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-4 rounded-full border border-gray-300 bg-white focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700"
                    >
                        {/* Only allow roles accepted by backend */}
                        <option value="jobseeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                    </select>

                    {otpSent && (
                        <div className="space-y-3">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC] outline-none text-gray-700 bg-white transition-all tracking-[0.3em]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        const response = await apiFetch<{ message: string }>("/api/auth/register/send-otp", {
                                            method: "POST",
                                            skipAuth: true,
                                            body: JSON.stringify({ email: formData.email, firstName: formData.firstName }),
                                        });
                                        toast.success(response.message);
                                    } catch (err) {
                                        const resendMessage =
                                            err instanceof Error ? err.message : "Failed to resend OTP";
                                        toast.error(resendMessage);
                                    }
                                }}
                                className="w-full text-sm text-[#155DFC] font-medium hover:underline"
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-[#155DFC] to-[#00B8DB] text-white py-3 rounded-full font-semibold transition-all duration-300 shadow-md"
                    >
                        {loading ? (otpSent ? "Verifying OTP..." : "Sending OTP...") : (otpSent ? "Verify OTP & Register" : "Send OTP")}
                    </motion.button>

                    <div className="flex items-center gap-3">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-full font-medium transition"
                    >
                        Continue with Google
                    </button>

                    {/* Message */}
                    {message && (
                        <pre className="whitespace-pre-wrap text-center text-sm mt-3 text-gray-700 font-medium">
                            {message}
                        </pre>
                    )}

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{" "}
                        <a href="/login" className="text-[#155DFC] font-medium hover:underline">
                            Login here
                        </a>
                    </p>
                </form>
            </motion.div>

            {/* RIGHT SECTION - IMAGE */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 md:order-2 flex w-full md:w-1/2 justify-center items-center mb-6 md:mb-0"
            >
                <img
                    src="/newbg.png"
                    alt="Register illustration"
                    className="w-3/4 h-auto mb-10 md:mb-20 hover:scale-105 transition-transform duration-500"
                />
            </motion.div>
        </div>
    );
};

export default Register;
