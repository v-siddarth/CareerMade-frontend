"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Eye,
  FileText,
  Filter,
  Mail,
  Phone,
  Search,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import GradientLoader from "@/app/components/GradientLoader";

type Status =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview"
  | "Offered"
  | "Rejected"
  | "Withdrawn";

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

type JobSeeker = {
  _id: string;
  title?: string;
  specializations?: string[];
  experience?: { totalYears?: number };
  resume?: { url?: string; filename?: string };
  coverLetter?: { url?: string; filename?: string };
  personalInfo?: {
    address?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  professionalInfo?: {
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  user?: User;
};

type Job = {
  _id: string;
  title?: string;
  organizationName?: string;
};

type Application = {
  _id: string;
  status: Status;
  rating?: number;
  appliedAt?: string;
  createdAt?: string;
  answers?: Array<{ question?: string; answer?: string }>;
  resume?: string | { url?: string; filename?: string };
  coverLetter?: string | { text?: string; fileUrl?: string; filename?: string };
  job?: Job;
  jobSeeker?: JobSeeker;
};

const STATUS_OPTIONS: Status[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
];

const statusClasses: Record<string, string> = {
  Applied: "bg-sky-100 text-sky-700 border-sky-200",
  "Under Review": "bg-amber-100 text-amber-700 border-amber-200",
  Shortlisted: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Interview: "bg-purple-100 text-purple-700 border-purple-200",
  Offered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 border-rose-200",
  Withdrawn: "bg-gray-100 text-gray-700 border-gray-200",
};

const formatRelativeTime = (value?: string) => {
  if (!value) return "N/A";
  const ts = new Date(value).getTime();
  if (!Number.isFinite(ts)) return "N/A";

  const mins = Math.max(1, Math.floor((Date.now() - ts) / (1000 * 60)));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
};

const getApplicantName = (app: Application) => {
  const user = app.jobSeeker?.user;
  const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return full || "Unknown Candidate";
};

const getApplicantExperience = (app: Application) => {
  const years = app.jobSeeker?.experience?.totalYears;
  if (typeof years === "number") return `${years} years`;
  return "N/A";
};

const getApplicantLocation = (app: Application) => {
  const preferred = app.jobSeeker?.professionalInfo?.location;
  const personal = app.jobSeeker?.personalInfo?.address;
  const source = preferred || personal;
  if (!source) return "N/A";
  const out = [source.city, source.state, source.country].filter(Boolean).join(", ");
  return out || "N/A";
};

const getResumeUrl = (app: Application) => {
  if (typeof app.resume === "string") return app.resume;
  if (app.resume?.url) return app.resume.url;
  return app.jobSeeker?.resume?.url;
};

const getCoverLetterAvailable = (app: Application) => {
  if (typeof app.coverLetter === "string") return Boolean(app.coverLetter);
  if (app.coverLetter?.fileUrl || app.coverLetter?.text) return true;
  return Boolean(app.jobSeeker?.coverLetter?.url);
};

const countByStatus = (items: Application[], status: Status) =>
  items.filter((item) => item.status === status).length;

export default function EmployerApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jobFilter, setJobFilter] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingKey, setSavingKey] = useState<string>("");

  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return;
    }

    let parsedUser: { role?: string } | null = null;
    try {
      parsedUser = JSON.parse(userRaw);
    } catch {
      parsedUser = null;
    }

    if (!parsedUser || parsedUser.role !== "employer") {
      toast.error("Access denied. Employers only.");
      router.push("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/employer?limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to load applications");
        }

        const items = Array.isArray(data?.data?.items) ? data.data.items : [];
        setApplications(items);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  const jobOptions = useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach((app) => {
      if (app.job?._id) {
        map.set(app.job._id, app.job.title || "Untitled Job");
      }
    });

    return Array.from(map.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return applications.filter((app) => {
      if (statusFilter && app.status !== statusFilter) return false;
      if (jobFilter && app.job?._id !== jobFilter) return false;
      if (minRating > 0 && (app.rating || 0) < minRating) return false;

      if (!query) return true;

      const name = getApplicantName(app).toLowerCase();
      const email = (app.jobSeeker?.user?.email || "").toLowerCase();
      const phone = (app.jobSeeker?.user?.phone || "").toLowerCase();
      const title = (app.jobSeeker?.title || "").toLowerCase();
      const jobTitle = (app.job?.title || "").toLowerCase();
      const specs = (app.jobSeeker?.specializations || []).join(" ").toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        title.includes(query) ||
        jobTitle.includes(query) ||
        specs.includes(query)
      );
    });
  }, [applications, searchTerm, statusFilter, jobFilter, minRating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, jobFilter, minRating]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const updateStatus = async (applicationId: string, status: Status) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in to continue.");
        return;
      }

      setSavingKey(`status:${applicationId}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update status");
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
      toast.success("Application status updated.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status.");
    } finally {
      setSavingKey("");
    }
  };

  const updateRating = async (applicationId: string, rating: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in to continue.");
        return;
      }

      setSavingKey(`rating:${applicationId}`);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/rating`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update rating");
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, rating } : app))
      );
      toast.success("Candidate rating updated.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update rating.");
    } finally {
      setSavingKey("");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setJobFilter("");
    setMinRating(0);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Received Applications
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review candidates, move applications through your hiring pipeline, and rate talent.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <SummaryCard label="Total" value={applications.length} accent="text-gray-900" />
          <SummaryCard
            label="New"
            value={countByStatus(applications, "Applied")}
            accent="text-sky-700"
          />
          <SummaryCard
            label="Review"
            value={countByStatus(applications, "Under Review")}
            accent="text-amber-700"
          />
          <SummaryCard
            label="Shortlisted"
            value={countByStatus(applications, "Shortlisted") + countByStatus(applications, "Interview")}
            accent="text-indigo-700"
          />
          <SummaryCard
            label="Offered"
            value={countByStatus(applications, "Offered")}
            accent="text-emerald-700"
          />
          <SummaryCard
            label="Rejected"
            value={countByStatus(applications, "Rejected")}
            accent="text-rose-700"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5 relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#155DFC] focus:border-transparent"
                placeholder="Search candidate, email, phone, job title"
              />
            </div>

            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#155DFC] focus:border-transparent"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#155DFC] focus:border-transparent"
              >
                <option value="">All job postings</option>
                {jobOptions.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 flex gap-2">
              <select
                value={String(minRating)}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#155DFC] focus:border-transparent"
              >
                <option value="0">Any rating</option>
                <option value="1">1★ and above</option>
                <option value="2">2★ and above</option>
                <option value="3">3★ and above</option>
                <option value="4">4★ and above</option>
                <option value="5">5★ only</option>
              </select>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                title="Clear filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">No applications found</h2>
              <p className="text-sm text-gray-500 mb-4">
                Try changing filters, or post more jobs to receive candidates.
              </p>
              <button
                onClick={() => router.push("/dashboard/employee/jobs")}
                className="px-4 py-2 rounded-lg bg-[#155DFC] text-white text-sm font-medium hover:bg-[#1e45f6]"
              >
                Go to My Job Postings
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[1300px] table-fixed">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-6 py-3 w-[21%]">Candidate</th>
                      <th className="px-6 py-3 w-[17%]">Applied For</th>
                      <th className="px-6 py-3 w-[18%]">Contact</th>
                      <th className="px-6 py-3 w-[15%]">Docs</th>
                      <th className="px-6 py-3 w-[10%]">Rating</th>
                      <th className="px-6 py-3 w-[11%]">Status</th>
                      <th className="px-6 py-3 w-[8%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedApplications.map((app) => {
                      const user = app.jobSeeker?.user;
                      const fullName = getApplicantName(app);
                      const email = user?.email || "N/A";
                      const phone = user?.phone || "N/A";
                      const title = app.jobSeeker?.title || "Candidate";
                      const location = getApplicantLocation(app);
                      const experience = getApplicantExperience(app);
                      const resumeUrl = getResumeUrl(app);
                      const hasCoverLetter = getCoverLetterAvailable(app);
                      const status = app.status || "Applied";
                      const appliedAt = app.appliedAt || app.createdAt;

                      return (
                        <tr key={app._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                {user?.profileImage ? (
                                  <img src={user.profileImage} alt={fullName} className="h-10 w-10 object-cover" />
                                ) : (
                                  <span className="text-sm font-semibold text-gray-700">
                                    {fullName.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
                                <p className="text-xs text-gray-500 truncate">{title}</p>
                                <div className="mt-1 text-xs text-gray-500 truncate">
                                  <span>{experience}</span>
                                  <span className="mx-1">•</span>
                                  <span>{location}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 align-top">
                            <p className="text-sm font-medium text-gray-900 truncate">{app.job?.title || "Untitled Job"}</p>
                            <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span className="truncate">{app.job?.organizationName || "Your Organization"}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Applied {formatRelativeTime(appliedAt)}</p>
                          </td>

                          <td className="px-6 py-4 align-top text-sm text-gray-700 whitespace-nowrap">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{email}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 min-w-0">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{phone}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-1.5">
                              <span className={`text-xs px-2 py-1 rounded-full border inline-flex w-fit ${resumeUrl ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                                Resume {resumeUrl ? "Available" : "Missing"}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full border inline-flex w-fit ${hasCoverLetter ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                                Cover letter {hasCoverLetter ? "Available" : "Not added"}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full border inline-flex w-fit bg-violet-50 text-violet-700 border-violet-200">
                                {app.answers?.length || 0} screening answers
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  disabled={savingKey === `rating:${app._id}`}
                                  onClick={() => updateRating(app._id, value)}
                                  className="disabled:opacity-50"
                                >
                                  <Star
                                    className={`h-4 w-4 ${value <= (app.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{app.rating ? `${app.rating}/5` : "Not rated"}</p>
                          </td>

                          <td className="px-6 py-4 align-top">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${statusClasses[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
                            >
                              {status}
                            </span>
                            <select
                              value={status}
                              disabled={savingKey === `status:${app._id}`}
                              onChange={(e) => updateStatus(app._id, e.target.value as Status)}
                              className="mt-2 w-full py-2 px-2.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-[#155DFC] focus:border-transparent"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-6 py-4 align-top text-right whitespace-nowrap">
                            <div className="inline-flex flex-row gap-2">
                              <button
                                onClick={() => router.push(`/dashboard/employee/applications/${app._id}`)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              {resumeUrl ? (
                                <a
                                  href={resumeUrl}
                                  download
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#155DFC] text-white text-sm hover:bg-[#1e45f6]"
                                >
                                  <FileText className="h-4 w-4" />
                                  Resume
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-gray-200 text-gray-500 text-sm cursor-not-allowed"
                                >
                                  <FileText className="h-4 w-4" />
                                  Resume
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredApplications.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length}
                </p>

                <div className="inline-flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="h-9 w-9 inline-flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="h-9 w-9 inline-flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
