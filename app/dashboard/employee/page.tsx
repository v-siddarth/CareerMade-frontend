"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  LogOut,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { apiFetch, authStorage } from "@/lib/api-client";

type SubscriptionSummary = {
  plan?: string;
  planName?: string;
  status?: string;
  isActive?: boolean;
};

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };
  const handleClick = () => {
    router.push("/dashboard/employee/jobs/create");
  }

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;

    apiFetch<{ data?: { items?: any[] } }>("/api/jobs?limit=5")
      .then((data) => {
        setJobs(data.data?.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    apiFetch<{ data?: { subscription?: SubscriptionSummary } }>("/api/pricing/my-subscription")
      .then((data) => setSubscription(data.data?.subscription || null))
      .catch(() => setSubscription(null));
  }, []);

  const formatSalary = (salaryObj?: any) => {
    if (!salaryObj) return "15-25 LPA";
    let { min, max, period } = salaryObj;
    
    min = typeof min === "string" ? Number(min.replace(/,/g, "").trim()) : min;
    max = typeof max === "string" ? Number(max.replace(/,/g, "").trim()) : max;

    const isMinValid = typeof min === "number" && Number.isFinite(min) && min > 0;
    const isMaxValid = typeof max === "number" && Number.isFinite(max) && max > 0;

    if (!isMinValid && !isMaxValid) return "15-25 LPA";

    const formatAmt = (amt: number) => {
      if (period === "Monthly") return `₹${amt.toLocaleString('en-IN')}/mo`;
      if (period === "Hourly") return `₹${amt.toLocaleString('en-IN')}/hr`;
      if (period === "Daily") return `₹${amt.toLocaleString('en-IN')}/day`;
      return `₹${(amt / 100000).toFixed(1)} LPA`;
    };

    const minStr = isMinValid ? formatAmt(min as number) : "";
    const maxStr = isMaxValid ? formatAmt(max as number) : "";

    if (isMinValid && isMaxValid) {
      if (min === max) return minStr;
      return `${minStr} - ${maxStr}`;
    }
    return minStr || maxStr || "15-25 LPA";
  };

  const colors = ["bg-blue-500", "bg-purple-600", "bg-green-500", "bg-gray-800"];
  const activeSubscription =
    subscription?.status === "Active" && subscription.isActive !== false ? subscription : null;

  return (
    <>

      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        {/* Header */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-10 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#8F59ED] p-2 rounded-lg">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Employee Dashboard
              </h1>
              {activeSubscription && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {activeSubscription.planName || activeSubscription.plan} active
                </div>
              )}
            </div>
          </div>

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClick}
            className="flex items-center gap-2 text-sm md:text-base bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Create Job
          </motion.button> */}
        </motion.header>

        {/* Section Title */}
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Job Listings</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center gap-2 text-[#155DFC] hover:underline text-sm font-medium"
            >
              <CreditCard className="h-4 w-4" />
              Manage plan
            </button>
            <button
              onClick={() => router.push("/dashboard/employee/applications")}
              className="text-[#155DFC] hover:underline text-sm font-medium"
            >
              Received applications
            </button>
            <button
              onClick={() => router.push("/dashboard/employee/jobs")}
              className="text-[#8F59ED] hover:underline text-sm font-medium"
            >
              View all
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-gray-600">Loading recent jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No jobs posted yet.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onClick={() =>
                    router.push(`/dashboard/employee/jobs/view/${job._id}`)
                  }
                  className="cursor-pointer bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition"
                >
                  {/* Color Bar */}
                  <div className={`h-2 ${colors[index % colors.length]}`}></div>

                  <div className="p-5">
                    {/* Title Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {job.hospital || "City General Hospital"}
                        </p>
                      </div>
                      <Bookmark className="w-5 h-5 text-gray-400 hover:text-[#8F59ED]" />
                    </div>

                    {/* Details */}
                    <div className="text-sm text-gray-500 flex flex-col gap-1 mb-3">
                      <p className="flex items-center gap-1">
                        <MapPin size={14} />{" "}
                        {job.location
                          ? `${job.location.city}, ${job.location.state}`
                          : "Remote"}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} /> {job.experience || "5-8 years"}
                      </p>
                      <p>{formatSalary(job.salary)}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {(job.specialization
                        ? [job.specialization]
                        : ["Cardiology", "Full-time", "Reception"]
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
