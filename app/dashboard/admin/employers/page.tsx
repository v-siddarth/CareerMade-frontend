"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Eye,
  Filter,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import GradientLoader from "@/app/components/GradientLoader";
import toast from "react-hot-toast";

interface Employer {
  _id: string;
  organizationName: string;
  organizationType?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  foundedYear?: number;
  employeeCount?: string;
  contactPerson?: {
    name?: string;
    designation?: string;
    phone?: string;
    email?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  specializations?: string[];
  services?: Array<{
    name: string;
    description?: string;
  }>;
  accreditations?: Array<{
    name: string;
    issuingBody?: string;
    issueDate?: string;
    expiryDate?: string;
    certificateUrl?: string;
  }>;
  verification: {
    isVerified: boolean;
    verifiedAt?: string;
    documents?: Array<{
      type?: string;
      url?: string;
      filename?: string;
      uploadedAt?: string;
    }>;
  };
  subscription?: {
    plan?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
    features?: {
      maxJobPosts?: number;
      maxApplications?: number;
      advancedSearch?: boolean;
      prioritySupport?: boolean;
      customBranding?: boolean;
    };
  };
  stats?: {
    totalJobPosts?: number;
    activeJobPosts?: number;
    totalApplications?: number;
    totalHires?: number;
    profileViews?: number;
  };
  createdAt: string;
}

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const textOrDash = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{title}</h3>
    {children}
  </section>
);

export default function EmployersManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  useEffect(() => {
    fetchEmployers();
  }, [page, verifiedFilter, appliedSearchQuery]);

  useEffect(() => {
    if (!selectedEmployer) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEmployer(null);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedEmployer]);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in again");
        router.push("/login");
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (appliedSearchQuery) params.append("q", appliedSearchQuery);
      if (verifiedFilter) params.append("isVerified", verifiedFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch employers");
      }

      setEmployers(data.data.items);
      setTotal(data.data.total);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load employers";
      console.error("Error fetching employers:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedSearchQuery(searchQuery);
  };

  const handleVerifiedFilterChange = (value: string) => {
    setPage(1);
    setVerifiedFilter(value);
  };

  const handleVerify = async (employerId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in again");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${employerId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify employer");
      }

      toast.success("Employer verified successfully");
      setSelectedEmployer((prev) =>
        prev && prev._id === employerId
          ? {
              ...prev,
              verification: { ...prev.verification, isVerified: true, verifiedAt: new Date().toISOString() },
            }
          : prev
      );
      fetchEmployers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to verify employer";
      console.error("Error verifying employer:", err);
      toast.error(message);
    }
  };

  const handleUnverify = async (employerId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please log in again");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/employers/${employerId}/unverify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to unverify employer");
      }

      toast.success("Employer unverified successfully");
      setSelectedEmployer((prev) =>
        prev && prev._id === employerId
          ? {
              ...prev,
              verification: { ...prev.verification, isVerified: false, verifiedAt: undefined },
            }
          : prev
      );
      fetchEmployers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to unverify employer";
      console.error("Error unverifying employer:", err);
      toast.error(message);
    }
  };

  if (loading && employers.length === 0) {
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
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{ backgroundImage: "url('/new1.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3e]/90 via-[#002b6b]/60 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Employers{" "}
                <span className="bg-gradient-to-r from-[#00A3FF] to-[#00E0FF] bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-base sm:text-lg text-blue-100 mt-3">
                Review complete employer profiles, then verify or unverify with confidence.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/admin")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-full text-sm sm:text-base font-semibold transition-all shadow-lg whitespace-nowrap"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#007BFF]" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Organization name, city, state..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Status</label>
              <select
                value={verifiedFilter}
                onChange={(e) => handleVerifiedFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            Apply Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employers.map((employer) => (
            <div
              key={employer._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#007BFF] to-[#00CFFF] p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#007BFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{employer.organizationName}</h3>
                      <p className="text-xs text-blue-100">{textOrDash(employer.organizationType)}</p>
                    </div>
                  </div>
                  {employer.verification.isVerified ? (
                    <ShieldCheck className="w-6 h-6 text-green-300" />
                  ) : (
                    <ShieldOff className="w-6 h-6 text-yellow-300" />
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                {employer.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{employer.email}</span>
                  </div>
                )}

                {(employer.phone || employer.contactPerson?.phone) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{employer.phone || employer.contactPerson?.phone}</span>
                  </div>
                )}

                {employer.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#007BFF] hover:underline truncate"
                    >
                      {employer.website}
                    </a>
                  </div>
                )}

                {employer.address && (employer.address.city || employer.address.state) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {[employer.address.city, employer.address.state, employer.address.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Joined {new Date(employer.createdAt).toLocaleDateString()}</span>
                    {employer.verification.isVerified && employer.verification.verifiedAt && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedEmployer(employer)}
                      className="w-full px-4 py-2 border-2 border-[#007BFF]/30 text-[#007BFF] rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      aria-label={`View details for ${employer.organizationName}`}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {employer.verification.isVerified ? (
                      <button
                        onClick={() => handleUnverify(employer._id)}
                        className="w-full px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldOff className="w-4 h-4" />
                        Unverify Employer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(employer._id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Verify Employer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {employers.length === 0 && !loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No employers found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {employers.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} employers
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEmployer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedEmployer(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="employer-details-title"
            className="mx-auto w-full max-w-6xl rounded-2xl bg-gray-50 border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 sm:px-6 py-4 rounded-t-2xl flex items-start justify-between gap-4">
              <div>
                <h2 id="employer-details-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                  {selectedEmployer.organizationName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {textOrDash(selectedEmployer.organizationType)} • Joined {formatDate(selectedEmployer.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployer(null)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                aria-label="Close employer details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 space-y-4">
                <SectionCard title="Organization Overview">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-gray-500">Organization:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.organizationName)}</span></p>
                    <p><span className="text-gray-500">Type:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.organizationType)}</span></p>
                    <p><span className="text-gray-500">Founded:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.foundedYear)}</span></p>
                    <p><span className="text-gray-500">Employee Size:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.employeeCount)}</span></p>
                  </div>
                  <div className="mt-3 text-sm text-gray-700 leading-6">
                    {selectedEmployer.description || "No organization description provided."}
                  </div>
                </SectionCard>

                <SectionCard title="Contact & Address">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Primary Contact</p>
                      <p className="font-medium text-gray-900">{textOrDash(selectedEmployer.contactPerson?.name)}</p>
                      <p className="text-gray-700">{textOrDash(selectedEmployer.contactPerson?.designation)}</p>
                      <p className="text-gray-700">{textOrDash(selectedEmployer.contactPerson?.email || selectedEmployer.email)}</p>
                      <p className="text-gray-700">{textOrDash(selectedEmployer.contactPerson?.phone || selectedEmployer.phone)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Address</p>
                      <p className="text-gray-900">{textOrDash(selectedEmployer.address?.street)}</p>
                      <p className="text-gray-900">
                        {[selectedEmployer.address?.city, selectedEmployer.address?.state, selectedEmployer.address?.pincode]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </p>
                      <p className="text-gray-900">{textOrDash(selectedEmployer.address?.country)}</p>
                      {selectedEmployer.website ? (
                        <a
                          href={selectedEmployer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1 text-[#007BFF] hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : null}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Clinical Focus">
                  {selectedEmployer.specializations && selectedEmployer.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployer.specializations.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No specializations listed.</p>
                  )}

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Services</p>
                    {selectedEmployer.services && selectedEmployer.services.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEmployer.services.map((service, index) => (
                          <div key={`${service.name}-${index}`} className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm">
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-gray-600 mt-1">{service.description || "No description"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No services listed.</p>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Accreditations & Verification Docs">
                  <div className="space-y-3">
                    {selectedEmployer.accreditations && selectedEmployer.accreditations.length > 0 ? (
                      selectedEmployer.accreditations.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-700">Issued by: {textOrDash(item.issuingBody)}</p>
                          <p className="text-gray-700">
                            {formatDate(item.issueDate)} to {formatDate(item.expiryDate)}
                          </p>
                          {item.certificateUrl ? (
                            <a
                              href={item.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#007BFF] hover:underline"
                            >
                              Open Certificate
                            </a>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No accreditations uploaded.</p>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Verification Documents</p>
                      {selectedEmployer.verification.documents &&
                      selectedEmployer.verification.documents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedEmployer.verification.documents.map((doc, index) => (
                            <div key={`${doc.filename || doc.url}-${index}`} className="text-sm text-gray-700">
                              <p className="font-medium text-gray-900">{textOrDash(doc.type)}</p>
                              <p>Uploaded: {formatDate(doc.uploadedAt)}</p>
                              {doc.url ? (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#007BFF] hover:underline"
                                >
                                  Open Document
                                </a>
                              ) : (
                                <p className="text-gray-500">No document URL available</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No verification documents uploaded.</p>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>

              <div className="space-y-4">
                <SectionCard title="Verification Status">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Current:</span>{" "}
                      {selectedEmployer.verification.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-semibold">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 font-semibold">
                          <ShieldOff className="w-3 h-3" /> Pending Verification
                        </span>
                      )}
                    </p>
                    <p><span className="text-gray-500">Verified At:</span> {formatDate(selectedEmployer.verification.verifiedAt)}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {selectedEmployer.verification.isVerified ? (
                      <button
                        onClick={() => handleUnverify(selectedEmployer._id)}
                        className="w-full px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldOff className="w-4 h-4" />
                        Unverify Employer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(selectedEmployer._id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#007BFF] to-[#00CFFF] hover:from-[#0066d9] hover:to-[#00B8E6] text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Verify Employer
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Subscription">
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="text-gray-500">Plan:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.subscription?.plan)}</span></p>
                    <p><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-900">{textOrDash(selectedEmployer.subscription?.status)}</span></p>
                    <p><span className="text-gray-500">Start:</span> {formatDate(selectedEmployer.subscription?.startDate)}</p>
                    <p><span className="text-gray-500">End:</span> {formatDate(selectedEmployer.subscription?.endDate)}</p>
                    <p><span className="text-gray-500">Auto Renew:</span> {selectedEmployer.subscription?.autoRenew ? "Enabled" : "Disabled"}</p>
                  </div>

                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                    <p>Max Jobs: {textOrDash(selectedEmployer.subscription?.features?.maxJobPosts)}</p>
                    <p>Max Applications: {textOrDash(selectedEmployer.subscription?.features?.maxApplications)}</p>
                    <p>Advanced Search: {selectedEmployer.subscription?.features?.advancedSearch ? "Yes" : "No"}</p>
                    <p>Priority Support: {selectedEmployer.subscription?.features?.prioritySupport ? "Yes" : "No"}</p>
                    <p>Custom Branding: {selectedEmployer.subscription?.features?.customBranding ? "Yes" : "No"}</p>
                  </div>
                </SectionCard>

                <SectionCard title="Hiring Stats">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-gray-500">Total Posts</p>
                      <p className="font-semibold text-gray-900">{textOrDash(selectedEmployer.stats?.totalJobPosts ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-gray-500">Active Posts</p>
                      <p className="font-semibold text-gray-900">{textOrDash(selectedEmployer.stats?.activeJobPosts ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-gray-500">Applications</p>
                      <p className="font-semibold text-gray-900">{textOrDash(selectedEmployer.stats?.totalApplications ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-gray-500">Total Hires</p>
                      <p className="font-semibold text-gray-900">{textOrDash(selectedEmployer.stats?.totalHires ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 col-span-2">
                      <p className="text-gray-500">Profile Views</p>
                      <p className="font-semibold text-gray-900">{textOrDash(selectedEmployer.stats?.profileViews ?? 0)}</p>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
