"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  ArrowRight,
  Shield,
  Activity,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import GradientLoader from "@/app/components/GradientLoader";
import { logout } from "@/lib/api-client";
import toast from "react-hot-toast";

type Stats = {
  users: number;
  employers: number;
  jobs: number;
  applications: number;
  verifiedEmployers: number;
  activeJobs: number;
  activeSubscriptions: number;
  estimatedMrr: number;
  subscriptionsByPlan: Record<string, number>;
};

type MonthlyPoint = {
  month: string;
  key: string;
  users: number;
  employers: number;
  jobs: number;
  applications: number;
};

type Analytics = {
  monthly: MonthlyPoint[];
  distributions: {
    jobStatus: Record<string, number>;
    subscriptionPlans: Record<string, number>;
    subscriptionStatus: Record<string, number>;
    userRoles: Record<string, number>;
  };
  estimatedMrr: number;
};

const StatCard = ({
  title,
  value,
  icon,
  color,
  link,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link: string;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(link)}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#007BFF] transition-colors" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

const LineCompareChart = ({ data }: { data: MonthlyPoint[] }) => {
  const width = 560;
  const height = 240;
  const padding = 30;

  const maxValue = useMemo(
    () => Math.max(1, ...data.map((point) => Math.max(point.jobs, point.applications))),
    [data]
  );

  const toPoint = (index: number, value: number) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  };

  const jobsPath = data.map((point, idx) => toPoint(idx, point.jobs)).join(" ");
  const applicationsPath = data.map((point, idx) => toPoint(idx, point.applications)).join(" ");

  return (
    <div>
      <div className="flex items-center gap-6 mb-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          Jobs posted
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
          Applications
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 rounded-xl bg-gray-50">
        {[0, 1, 2, 3, 4].map((line) => {
          const y = padding + (line * (height - padding * 2)) / 4;
          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#d1d5db"
              strokeDasharray="3 6"
            />
          );
        })}

        <polyline fill="none" stroke="#1d4ed8" strokeWidth="3" points={jobsPath} strokeLinecap="round" />
        <polyline
          fill="none"
          stroke="#0891b2"
          strokeWidth="3"
          points={applicationsPath}
          strokeLinecap="round"
        />

        {data.map((point, idx) => {
          const [jx, jy] = toPoint(idx, point.jobs).split(",").map(Number);
          const [ax, ay] = toPoint(idx, point.applications).split(",").map(Number);
          return (
            <g key={point.key}>
              <circle cx={jx} cy={jy} r="4" fill="#1d4ed8" />
              <circle cx={ax} cy={ay} r="4" fill="#0891b2" />
              <text x={jx} y={height - 8} textAnchor="middle" className="fill-gray-500 text-[10px]">
                {point.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const DistributionBars = ({ title, data }: { title: string; data: Record<string, number> }) => {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#155DFC] to-[#00B8DB]"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    users: 0,
    employers: 0,
    jobs: 0,
    applications: 0,
    verifiedEmployers: 0,
    activeJobs: 0,
    activeSubscriptions: 0,
    estimatedMrr: 0,
    subscriptionsByPlan: {},
  });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in again");
        router.push("/login");
        return;
      }

      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics?months=6`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      if (!statsRes.ok) throw new Error(statsData.message || "Failed to fetch stats");
      if (!analyticsRes.ok) throw new Error(analyticsData.message || "Failed to fetch analytics");

      setStats(statsData.data);
      setAnalytics(analyticsData.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <GradientLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gray-50">
        <div className="w-full relative bg-[#002B6B] text-white overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/new1.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3e]/90 via-[#002b6b]/60 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] rounded-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Admin <span className="bg-gradient-to-r from-[#00A3FF] to-[#00E0FF] bg-clip-text text-transparent">Control Center</span>
                </h1>
              </div>
              <p className="text-base sm:text-lg text-blue-100">
                Monitor growth, moderate jobs, and manage subscriptions from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.users.toLocaleString()} icon={<Users className="w-6 h-6 text-white" />} color="bg-gradient-to-r from-[#007BFF] to-[#00CFFF]" link="/dashboard/admin/users" />
          <StatCard title="Verified Employers" value={stats.verifiedEmployers.toLocaleString()} icon={<Building2 className="w-6 h-6 text-white" />} color="bg-gradient-to-r from-[#00B8DB] to-[#00E0FF]" link="/dashboard/admin/employers" />
          <StatCard title="Active Jobs" value={stats.activeJobs.toLocaleString()} icon={<Briefcase className="w-6 h-6 text-white" />} color="bg-gradient-to-r from-[#155DFC] to-[#007BFF]" link="/dashboard/admin/jobs" />
          <StatCard title="MRR Estimate" value={`₹${stats.estimatedMrr.toLocaleString()}`} icon={<CreditCard className="w-6 h-6 text-white" />} color="bg-gradient-to-r from-[#0f766e] to-[#14b8a6]" link="/dashboard/admin/pricing" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#007BFF]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[{label:"Manage Users",icon:<Users className="w-5 h-5 text-[#007BFF]"/>,path:"/dashboard/admin/users"},{label:"Manage Employers",icon:<Building2 className="w-5 h-5 text-[#007BFF]"/>,path:"/dashboard/admin/employers"},{label:"Moderate Jobs",icon:<Briefcase className="w-5 h-5 text-[#007BFF]"/>,path:"/dashboard/admin/jobs"},{label:"Pricing Admin",icon:<CreditCard className="w-5 h-5 text-[#007BFF]"/>,path:"/dashboard/admin/pricing"}].map((action)=> (
              <button key={action.path} onClick={() => router.push(action.path)} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#007BFF] hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">{action.icon}<span className="font-medium text-gray-900">{action.label}</span></div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#007BFF]" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-[#007BFF]" />Jobs vs Applications (6 Months)</h2>
            {analytics?.monthly?.length ? <LineCompareChart data={analytics.monthly} /> : <p className="text-sm text-gray-500">Analytics unavailable</p>}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-[#007BFF]" />Platform Snapshot</h2>
            <div className="space-y-4">
              {[{label:"Total Applications", value: stats.applications.toLocaleString()},{label:"Paid Subscriptions", value: stats.activeSubscriptions.toLocaleString()},{label:"Total Employers", value: stats.employers.toLocaleString()},{label:"Total Jobs", value: stats.jobs.toLocaleString()}].map((x)=> (
                <div key={x.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><span className="text-gray-700">{x.label}</span><span className="font-semibold text-gray-900">{x.value}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DistributionBars title="Job Status Distribution" data={analytics?.distributions.jobStatus || {}} />
          <DistributionBars title="Subscription Plan Distribution" data={analytics?.distributions.subscriptionPlans || stats.subscriptionsByPlan || {}} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Admin Session</p>
            <p className="text-base font-semibold text-gray-900">Logout</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
