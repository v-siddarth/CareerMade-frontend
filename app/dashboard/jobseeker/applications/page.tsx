"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Eye,
  FileText,
  MapPin,
  SearchCheck,
  Search,
  TrendingUp,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

interface ApplicationDetail {
  _id: string;
  job: {
    _id: string;
    title: string;
    organizationName: string;
    department: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    location: {
      city: string;
      state: string;
      country: string;
    };
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    jobType: string;
    experienceLevel: string;
    postedDate: string;
    applicationDeadline: string;
  };
  status: "Applied" | "Under Review" | "Interview" | "Offered" | "Rejected";
  appliedAt: string;
  viewedAt?: string;
  notes?: string;
  resume?: { _id: string; title: string; url: string };
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  rejectionReason?: string;
  coverLetter?: string;
  offerDetails?: {
    salary: number;
    startDate: string;
    benefits: string[];
    offerExpiry: string;
  };
  lastUpdatedAt?: string;
}

type StatusValue = ApplicationDetail["status"];

const STATUS_OPTIONS: Array<"All" | StatusValue> = [
  "All",
  "Applied",
  "Under Review",
  "Interview",
  "Offered",
  "Rejected",
];

const statusMeta: Record<StatusValue, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Applied: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Clock className="h-4 w-4" />,
  },
  "Under Review": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Eye className="h-4 w-4" />,
  },
  Interview: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: <Calendar className="h-4 w-4" />,
  },
  Offered: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <Award className="h-4 w-4" />,
  },
  Rejected: {
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: <XCircle className="h-4 w-4" />,
  },
};

const progressMap: Record<StatusValue, number> = {
  Applied: 15,
  "Under Review": 45,
  Interview: 75,
  Offered: 100,
  Rejected: 100,
};

const formatAddress = (address?: { city?: string; state?: string; country?: string }) => {
  if (!address) return "Not specified";
  const values = [address.city, address.state, address.country].filter(Boolean);
  return values.length ? values.join(", ") : "Not specified";
};

const formatSalary = (salary?: { min?: number; max?: number; currency?: string }) => {
  if (!salary?.min || !salary?.max) return "Not specified";
  const currency = salary.currency || "INR";
  return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
};

const formatDate = (value?: string) => {
  if (!value) return "Not specified";
  return new Date(value).toLocaleDateString();
};

const daysSinceApplied = (appliedDate: string) => {
  const days = Math.floor((Date.now() - new Date(appliedDate).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

export default function MyApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationDetail[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | StatusValue>("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const items = (data.data?.items || data.items || []) as ApplicationDetail[];

        setApplications(items);
        setSelectedApp(items[0] || null);
      } catch (error) {
        console.error("Failed to fetch applications", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  const stats = useMemo(() => {
    return {
      totalApplications: applications.length,
      applied: applications.filter((app) => app.status === "Applied").length,
      underReview: applications.filter((app) => app.status === "Under Review").length,
      interview: applications.filter((app) => app.status === "Interview").length,
      offered: applications.filter((app) => app.status === "Offered").length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        app.job?.title?.toLowerCase().includes(q) ||
        app.job?.organizationName?.toLowerCase().includes(q) ||
        app.job?.department?.toLowerCase().includes(q);

      const matchesStatus = filterStatus === "All" || app.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, filterStatus, searchTerm]);

  useEffect(() => {
    if (!selectedApp) return;
    const stillVisible = filteredApplications.some((app) => app._id === selectedApp._id);
    if (!stillVisible) {
      setSelectedApp(filteredApplications[0] || null);
    }
  }, [filteredApplications, selectedApp]);

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff6ff_0%,#f8fdff_35%,#ffffff_70%)]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04]" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-16 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />

        <section className="relative overflow-hidden border-b border-[#0b2f5f]/20 bg-[#032a61] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/new1.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001634]/95 via-[#042f6f]/80 to-[#0850a3]/55" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 sm:py-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My{" "}
              <span className="bg-gradient-to-r from-[#70e7ff] via-[#1cd1ff] to-[#7ef3ff] bg-clip-text text-transparent">
                Applications
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-100/95 sm:text-base">
              Stay on top of every update, interview, and offer in one focused dashboard.
            </p>
          </div>
        </section>

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 py-6 sm:py-8">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Application statistics">
            {[
              { label: "Total", value: stats.totalApplications, icon: <SearchCheck className="h-4 w-4" /> },
              { label: "Applied", value: stats.applied, icon: <Clock className="h-4 w-4" /> },
              { label: "Under Review", value: stats.underReview, icon: <Eye className="h-4 w-4" /> },
              { label: "Interview", value: stats.interview, icon: <UserCheck className="h-4 w-4" /> },
              { label: "Offered", value: stats.offered, icon: <Award className="h-4 w-4" /> },
              { label: "Rejected", value: stats.rejected, icon: <TrendingUp className="h-4 w-4" /> },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-[#d8e8ff] bg-white/90 p-4 shadow-[0_14px_34px_-28px_rgba(11,81,168,0.75)] backdrop-blur-sm"
              >
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#45628f]">
                  {item.icon}
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#0b2752]">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="overflow-hidden rounded-3xl border border-[#d8e8ff] bg-white/90 shadow-[0_18px_40px_-30px_rgba(7,58,129,0.75)] backdrop-blur-sm">
              <div className="space-y-3 border-b border-[#e3eeff] bg-gradient-to-b from-[#f6fbff] to-white p-4">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6681a9]" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search role, company, department"
                    aria-label="Search applications"
                    className="w-full rounded-xl border border-[#c9dcfb] bg-white pl-9 pr-3 py-2.5 text-sm text-[#1e3659] placeholder:text-[#7792b4] outline-none transition focus:border-[#0e89dd] focus:ring-4 focus:ring-[#00b8db]/20"
                  />
                </label>

                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter applications by status">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilterStatus(status)}
                      aria-pressed={filterStatus === status}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00b8db]/25 ${
                        filterStatus === status
                          ? "border-[#0ea9da] bg-[#0ea9da] text-white shadow-sm"
                          : "border-[#d2e1fa] bg-[#f5f9ff] text-[#536c92] hover:border-[#b7cff1] hover:bg-[#ecf4ff]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-[#5e789f]">Loading applications...</div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-10 text-center text-sm text-[#5e789f]">No applications found.</div>
              ) : (
                <div className="max-h-[760px] divide-y divide-[#e7effd] overflow-y-auto" aria-live="polite">
                  {filteredApplications.map((app) => {
                    const active = selectedApp?._id === app._id;
                    const meta = statusMeta[app.status];
                    return (
                      <button
                        key={app._id}
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        aria-current={active ? "true" : undefined}
                        className={`w-full border-l-4 p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00b8db]/25 ${
                          active
                            ? "border-l-[#00a8d6] bg-gradient-to-r from-[#eaf7ff] to-[#f7fbff]"
                            : "border-l-transparent hover:bg-[#f8fbff]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-xl border p-2 ${meta.bg} ${meta.color} ${meta.border}`} aria-hidden="true">
                            {meta.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#102c56]">{app.job?.title || "Untitled role"}</p>
                            <p className="truncate text-xs text-[#526c92]">{app.job?.organizationName || "Organization"}</p>
                            <p className="mt-1 text-xs text-[#607da7]">Applied {daysSinceApplied(app.appliedAt)}</p>
                            <span
                              className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${meta.bg} ${meta.color} ${meta.border}`}
                            >
                              {meta.icon}
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <section className="min-h-[500px] overflow-hidden rounded-3xl border border-[#d8e8ff] bg-white/95 shadow-[0_24px_50px_-32px_rgba(7,58,129,0.82)] backdrop-blur-sm">
              {!selectedApp ? (
                <div className="flex h-full items-center justify-center p-10 text-[#5e789f]">
                  Select an application to view details.
                </div>
              ) : (
                <div className="space-y-6 p-5 sm:p-6">
                  <header className="flex flex-col gap-4 border-b border-[#e4eefc] pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0b2b58]">{selectedApp.job?.title}</h2>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#4f6a92]">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-4 w-4" aria-hidden="true" />
                          {selectedApp.job?.organizationName || "Healthcare Facility"}
                        </span>
                        <span className="text-[#b3c6e3]">•</span>
                        <span>{selectedApp.job?.department || "Department"}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusMeta[selectedApp.status].bg} ${statusMeta[selectedApp.status].color} ${statusMeta[selectedApp.status].border}`}
                    >
                      {statusMeta[selectedApp.status].icon}
                      {selectedApp.status}
                    </span>
                  </header>

                  <div className="rounded-2xl border border-[#cfe2ff] bg-gradient-to-br from-[#f6fbff] to-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#13305f]">Application Progress</p>
                      <p className="text-xs font-semibold text-[#48648e]">{progressMap[selectedApp.status]}%</p>
                    </div>
                    <div
                      className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e2ebf7]"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progressMap[selectedApp.status]}
                      aria-label="Application progress"
                    >
                      <div
                        className={`h-2.5 rounded-full ${
                          selectedApp.status === "Rejected" ? "bg-rose-500" : "bg-gradient-to-r from-[#1688f0] to-[#0fc2df]"
                        }`}
                        style={{ width: `${progressMap[selectedApp.status]}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 text-center sm:grid-cols-3">
                      <div className="rounded-lg border border-[#d6e6fb] bg-white p-2.5">
                        <p className="text-xs text-[#607da7]">Applied</p>
                        <p className="mt-1 text-xs font-semibold text-[#173764]">{formatDate(selectedApp.appliedAt)}</p>
                      </div>
                      <div className="rounded-lg border border-[#d6e6fb] bg-white p-2.5">
                        <p className="text-xs text-[#607da7]">Reviewed</p>
                        <p className="mt-1 text-xs font-semibold text-[#173764]">{selectedApp.viewedAt ? formatDate(selectedApp.viewedAt) : "Pending"}</p>
                      </div>
                      <div className="rounded-lg border border-[#d6e6fb] bg-white p-2.5">
                        <p className="text-xs text-[#607da7]">Updated</p>
                        <p className="mt-1 text-xs font-semibold text-[#173764]">{formatDate(selectedApp.lastUpdatedAt || selectedApp.appliedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-[#d8e8ff] bg-white p-4">
                      <h3 className="mb-3 text-sm font-semibold text-[#102f5d]">Job Overview</h3>
                      <div className="space-y-2 text-sm text-[#3f5b85]">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#6e8eb8]" aria-hidden="true" />
                          {formatAddress(selectedApp.job?.location)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-[#6e8eb8]" aria-hidden="true" />
                          {selectedApp.job?.jobType || "Not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#6e8eb8]" aria-hidden="true" />
                          {selectedApp.job?.experienceLevel || "Not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#6e8eb8]" aria-hidden="true" />
                          Deadline: {formatDate(selectedApp.job?.applicationDeadline)}
                        </p>
                      </div>
                    </article>

                    <article className="rounded-2xl border border-[#d8e8ff] bg-white p-4">
                      <h3 className="mb-3 text-sm font-semibold text-[#102f5d]">Compensation & Documents</h3>
                      <div className="space-y-2 text-sm text-[#3f5b85]">
                        <p>{formatSalary(selectedApp.job?.salary)}</p>
                        <p>Resume: {selectedApp.resume?.title || "Attached"}</p>
                        <p>Cover letter: {selectedApp.coverLetter ? "Submitted" : "Not submitted"}</p>
                        {selectedApp.status === "Interview" && selectedApp.interviewDate && (
                          <p>
                            Interview: {formatDate(selectedApp.interviewDate)}
                            {selectedApp.interviewTime ? ` at ${selectedApp.interviewTime}` : ""}
                          </p>
                        )}
                      </div>
                    </article>
                  </div>

                  {selectedApp.job?.description && (
                    <article className="rounded-2xl border border-[#d8e8ff] bg-white p-4">
                      <h3 className="mb-2 text-sm font-semibold text-[#102f5d]">Role Description</h3>
                      <p className="text-sm leading-6 text-[#425e88]">{selectedApp.job.description}</p>
                    </article>
                  )}

                  {selectedApp.rejectionReason && (
                    <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                      <h3 className="text-sm font-semibold text-rose-800">Rejection Note</h3>
                      <p className="mt-1 text-sm text-rose-700">{selectedApp.rejectionReason}</p>
                    </article>
                  )}

                  {selectedApp.offerDetails && (
                    <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <h3 className="text-sm font-semibold text-emerald-800">Offer Details</h3>
                      <div className="mt-2 space-y-1 text-sm text-emerald-700">
                        <p>
                          Salary: {selectedApp.offerDetails.salary?.toLocaleString?.() || selectedApp.offerDetails.salary}
                        </p>
                        <p>Start Date: {selectedApp.offerDetails.startDate ? formatDate(selectedApp.offerDetails.startDate) : "-"}</p>
                        <p>Offer Expiry: {selectedApp.offerDetails.offerExpiry ? formatDate(selectedApp.offerDetails.offerExpiry) : "-"}</p>
                      </div>
                    </article>
                  )}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/jobseeker/jobs/${selectedApp.job?._id}/view`)}
                      className="rounded-xl bg-gradient-to-r from-[#0f5fdf] to-[#08afd0] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(14,95,223,0.8)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f5fdf]/25"
                    >
                      View Job Details
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/jobseeker/?similar=${selectedApp.job?._id}`)}
                      className="rounded-xl border border-[#cbdcf5] bg-white px-4 py-2.5 text-sm font-semibold text-[#38557f] transition hover:bg-[#f2f7ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00b8db]/20"
                    >
                      View Similar Jobs
                    </button>
                  </div>
                </div>
              )}
            </section>
          </section>
        </main>
      </div>
    </>
  );
}
