"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { apiFetch, authStorage, logout } from "@/lib/api-client";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

type TabId = "overview" | "personal" | "professional" | "documents" | "billing" | "settings" | "faq";

type ProfileHubProps = {
  initialTab?: TabId;
};

type JobSeekerProfile = {
  profileCompletion?: number;
  title?: string;
  bio?: string;
  specializations?: string[];
  resume?: { url?: string; filename?: string; uploadedAt?: string };
  coverLetter?: { url?: string; filename?: string; uploadedAt?: string };
  personalInfo?: {
    age?: number;
    maritalStatus?: string;
    alternateEmail?: string;
    alternatePhone?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: {
      line1?: string;
      line2?: string;
      country?: string;
      state?: string;
      city?: string;
      pincode?: string;
    };
  };
  professionalInfo?: {
    category?: string;
    otherCategory?: string;
    specifications?: string[];
    otherSpecification?: string;
    doctorSpecialization?: string;
    doctorSubSpecialty?: string;
    location?: { country?: string; state?: string; city?: string };
  };
  privacySettings?: {
    showContactInfo?: boolean;
    showCurrentSalary?: boolean;
    showProfileToEmployers?: boolean;
    allowDirectMessages?: boolean;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
};

type ApiResponse = {
  data?: {
    jobSeeker?: JobSeekerProfile;
    resume?: JobSeekerProfile["resume"];
    coverLetter?: JobSeekerProfile["coverLetter"];
  };
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Sparkles className="h-4 w-4" /> },
  { id: "personal", label: "Personal", icon: <UserRound className="h-4 w-4" /> },
  { id: "professional", label: "Professional", icon: <Briefcase className="h-4 w-4" /> },
  { id: "documents", label: "Documents", icon: <FileText className="h-4 w-4" /> },
  { id: "billing", label: "Pricing", icon: <CreditCard className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
];

const PLAN_SUMMARY = [
  { name: "Starter Care", price: 300, seats: "1 recruiter" },
  { name: "Growth Care", price: 600, seats: "3 recruiters" },
  { name: "Pro Care", price: 900, seats: "Unlimited" },
];

const splitCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ProfileHub({ initialTab = "overview" }: ProfileHubProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<"resume" | "coverLetter" | null>(null);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await apiFetch<ApiResponse>("/api/jobseeker/profile");
        const nextProfile = data?.data?.jobSeeker || null;
        if (mounted) {
          setProfile(nextProfile);
          if (nextProfile?.user) {
            authStorage.setUser(nextProfile.user);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch profile";
        toast.error(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const user = profile?.user || (authStorage.getUser<JobSeekerProfile["user"]>() ?? {});

  const completion = useMemo(() => {
    if (!profile) return 0;
    if (typeof profile.profileCompletion === "number") return Math.max(0, Math.min(100, profile.profileCompletion));

    const checks = [
      Boolean(user?.firstName),
      Boolean(user?.email),
      Boolean(profile.personalInfo?.dateOfBirth),
      Boolean(profile.personalInfo?.address?.city),
      Boolean(profile.professionalInfo?.category),
      Boolean(profile.specializations?.length),
      Boolean(profile.bio),
      Boolean(profile.resume?.url),
      Boolean(profile.coverLetter?.url),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, user]);

  const missingItems = useMemo(() => {
    if (!profile) return [] as { label: string; tab: TabId }[];

    const items: { label: string; tab: TabId }[] = [];
    if (!profile.personalInfo?.dateOfBirth) items.push({ label: "Date of birth", tab: "personal" });
    if (!profile.personalInfo?.address?.city) items.push({ label: "City", tab: "personal" });
    if (!profile.professionalInfo?.category) items.push({ label: "Professional category", tab: "professional" });
    if (!profile.specializations || profile.specializations.length === 0)
      items.push({ label: "Specializations", tab: "professional" });
    if (!profile.bio) items.push({ label: "Professional summary", tab: "professional" });
    if (!profile.resume?.url) items.push({ label: "Resume", tab: "documents" });
    if (!profile.coverLetter?.url) items.push({ label: "Cover letter", tab: "documents" });
    return items;
  }, [profile]);

  const updateProfile = (updater: (prev: JobSeekerProfile) => JobSeekerProfile) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const saveProfilePayload = async (payload: Record<string, unknown>, message: string) => {
    setSaving(true);
    try {
      const data = await apiFetch<ApiResponse>("/api/jobseeker/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const nextProfile = data?.data?.jobSeeker;
      if (nextProfile) {
        setProfile(nextProfile);
        if (nextProfile.user) authStorage.setUser(nextProfile.user);
      }
      toast.success(message);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(text);
    } finally {
      setSaving(false);
    }
  };

  const uploadDocument = async (field: "resume" | "coverLetter", file: File) => {
    const endpoint = field === "resume" ? "/api/jobseeker/resume" : "/api/jobseeker/cover-letter";
    const formData = new FormData();
    formData.append(field, file);

    try {
      const data = await apiFetch<ApiResponse>(endpoint, { method: "POST", body: formData });
      const nextDoc = field === "resume" ? data?.data?.resume : data?.data?.coverLetter;
      if (nextDoc) {
        updateProfile((prev) => ({
          ...prev,
          [field]: nextDoc,
        }));
      }
      toast.success(`${field === "resume" ? "Resume" : "Cover letter"} uploaded`);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed";
      toast.error(text);
    }
  };

  const deleteDocument = async (field: "resume" | "coverLetter") => {
    const endpoint = field === "resume" ? "/api/jobseeker/resume" : "/api/jobseeker/cover-letter";
    setDeletingDoc(field);
    try {
      await apiFetch(endpoint, { method: "DELETE" });
      updateProfile((prev) => ({
        ...prev,
        [field]: null,
      }));
      toast.success(`${field === "resume" ? "Resume" : "Cover letter"} removed`);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Delete failed";
      toast.error(text);
    } finally {
      setDeletingDoc(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">Loading profile...</div>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
          <p className="mt-2 text-sm text-gray-600">Create your profile to start applying with better visibility.</p>
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className="mt-5 rounded-xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-5 py-3 text-sm font-semibold text-white"
          >
            Start Profile Setup
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] text-white">
                {user?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-7 w-7" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {user?.firstName || "Jobseeker"} {user?.lastName || ""}
                </h1>
                <p className="mt-1 text-sm text-blue-700">{profile.title || "Healthcare Professional"}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{user?.email || "No email"}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{user?.phone || "No phone"}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profile.personalInfo?.address?.city || "City not set"}</span>
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <h2 className="text-sm font-semibold text-blue-900">Missing Information</h2>
              {missingItems.length === 0 ? (
                <p className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  All key sections are complete.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {missingItems.slice(0, 5).map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.tab)}
                        className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-xs text-gray-700 hover:bg-blue-100"
                      >
                        <span className="flex items-center gap-2">
                          <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
                          {item.label}
                        </span>
                        <span className="font-medium text-blue-700">Fix</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current Pricing</p>
              <p className="mt-2 text-lg font-bold text-gray-900">Growth Care · Rs 600 / month</p>
              <Link href="/pricing" className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline">
                Compare and upgrade plans
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>

          <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div role="tablist" aria-label="Profile sections" className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#155DFC] to-[#00B8DB] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Snapshot</h3>
                    <p className="mt-2 text-sm text-gray-600">{profile.bio || "Add a professional summary to strengthen your profile."}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile.specializations || []).map((item) => (
                        <span key={item} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 p-5">
                      <h4 className="font-semibold text-gray-900">Personal Status</h4>
                      <p className="mt-2 text-sm text-gray-600">DOB: {profile.personalInfo?.dateOfBirth ? new Date(profile.personalInfo.dateOfBirth).toLocaleDateString() : "Missing"}</p>
                      <p className="mt-1 text-sm text-gray-600">City: {profile.personalInfo?.address?.city || "Missing"}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5">
                      <h4 className="font-semibold text-gray-900">Professional Status</h4>
                      <p className="mt-2 text-sm text-gray-600">Category: {profile.professionalInfo?.category || "Missing"}</p>
                      <p className="mt-1 text-sm text-gray-600">Resume: {profile.resume?.url ? "Uploaded" : "Missing"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfilePayload(
                      {
                        personalInfo: profile.personalInfo,
                        privacySettings: profile.privacySettings,
                      },
                      "Personal information updated"
                    );
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      Alternate Email
                      <input
                        type="email"
                        value={profile.personalInfo?.alternateEmail || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, alternateEmail: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Alternate Phone
                      <input
                        type="text"
                        value={profile.personalInfo?.alternatePhone || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, alternatePhone: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Date of Birth
                      <input
                        type="date"
                        value={
                          profile.personalInfo?.dateOfBirth
                            ? new Date(profile.personalInfo.dateOfBirth).toISOString().slice(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                      <select
                        value={profile.personalInfo?.gender || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, gender: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      Address Line 1
                      <input
                        type="text"
                        value={profile.personalInfo?.address?.line1 || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              address: { ...prev.personalInfo?.address, line1: e.target.value },
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Address Line 2
                      <input
                        type="text"
                        value={profile.personalInfo?.address?.line2 || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              address: { ...prev.personalInfo?.address, line2: e.target.value },
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      City
                      <input
                        type="text"
                        value={profile.personalInfo?.address?.city || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              address: { ...prev.personalInfo?.address, city: e.target.value },
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      State
                      <input
                        type="text"
                        value={profile.personalInfo?.address?.state || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              address: { ...prev.personalInfo?.address, state: e.target.value },
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Personal Information"}
                  </button>
                </form>
              )}

              {activeTab === "professional" && (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfilePayload(
                      {
                        title: profile.title,
                        bio: profile.bio,
                        specializations: profile.specializations,
                        professionalInfo: profile.professionalInfo,
                      },
                      "Professional information updated"
                    );
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-gray-700">
                      Headline Title
                      <input
                        type="text"
                        value={profile.title || ""}
                        onChange={(e) => updateProfile((prev) => ({ ...prev, title: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Professional Category
                      <select
                        value={profile.professionalInfo?.category || ""}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            professionalInfo: { ...prev.professionalInfo, category: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      >
                        <option value="">Select category</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Technician">Technician</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Support">Support</option>
                        <option value="Admin">Admin</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                      Specializations (comma separated)
                      <input
                        type="text"
                        value={(profile.specializations || []).join(", ")}
                        onChange={(e) =>
                          updateProfile((prev) => ({
                            ...prev,
                            specializations: splitCommaList(e.target.value),
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                      Professional Summary
                      <textarea
                        value={profile.bio || ""}
                        onChange={(e) => updateProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        className="mt-1 min-h-[120px] w-full rounded-xl border border-gray-300 px-3 py-2"
                        placeholder="Write a clear summary of your strengths, years of experience, and preferred role."
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Professional Information"}
                  </button>
                </form>
              )}

              {activeTab === "documents" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900">Resume</h3>
                    {profile.resume?.url ? (
                      <div className="mt-3 space-y-2">
                        <a href={profile.resume.url} target="_blank" rel="noreferrer" className="block text-sm text-blue-700 underline">
                          {profile.resume.filename || "View resume"}
                        </a>
                        <button
                          type="button"
                          disabled={deletingDoc === "resume"}
                          onClick={() => deleteDocument("resume")}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                        >
                          {deletingDoc === "resume" ? "Removing..." : "Remove resume"}
                        </button>
                      </div>
                    ) : (
                      <label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-blue-300 bg-blue-50 p-4 text-center text-sm font-medium text-blue-700">
                        <Upload className="mx-auto mb-2 h-4 w-4" />
                        Upload Resume
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadDocument("resume", file);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900">Cover Letter</h3>
                    {profile.coverLetter?.url ? (
                      <div className="mt-3 space-y-2">
                        <a
                          href={profile.coverLetter.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-blue-700 underline"
                        >
                          {profile.coverLetter.filename || "View cover letter"}
                        </a>
                        <button
                          type="button"
                          disabled={deletingDoc === "coverLetter"}
                          onClick={() => deleteDocument("coverLetter")}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                        >
                          {deletingDoc === "coverLetter" ? "Removing..." : "Remove cover letter"}
                        </button>
                      </div>
                    ) : (
                      <label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-blue-300 bg-blue-50 p-4 text-center text-sm font-medium text-blue-700">
                        <Upload className="mx-auto mb-2 h-4 w-4" />
                        Upload Cover Letter
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadDocument("coverLetter", file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Choose a plan tailored for your hiring visibility and premium access.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {PLAN_SUMMARY.map((plan) => (
                      <article key={plan.name} className="rounded-2xl border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        <p className="mt-1 text-lg font-bold text-blue-700">Rs {plan.price}/month</p>
                        <p className="mt-1 text-xs text-gray-500">{plan.seats}</p>
                      </article>
                    ))}
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#155DFC] to-[#00B8DB] px-5 py-3 text-sm font-semibold text-white"
                  >
                    <CreditCard className="h-4 w-4" />
                    Manage Pricing & Upgrade
                  </Link>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900">Privacy Controls</h3>
                    <div className="mt-4 grid gap-3">
                      <label className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                        <span>Show contact info to employers</span>
                        <input
                          type="checkbox"
                          checked={profile.privacySettings?.showContactInfo ?? true}
                          onChange={(e) =>
                            updateProfile((prev) => ({
                              ...prev,
                              privacySettings: {
                                ...prev.privacySettings,
                                showContactInfo: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                        <span>Allow direct messages</span>
                        <input
                          type="checkbox"
                          checked={profile.privacySettings?.allowDirectMessages ?? true}
                          onChange={(e) =>
                            updateProfile((prev) => ({
                              ...prev,
                              privacySettings: {
                                ...prev.privacySettings,
                                allowDirectMessages: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                        <span>Email alerts</span>
                        <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        saveProfilePayload(
                          {
                            privacySettings: profile.privacySettings,
                          },
                          "Settings saved"
                        )
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
                    >
                      <Bell className="h-4 w-4" />
                      Save Settings
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout from account
                  </button>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="space-y-3">
                  {[
                    {
                      q: "How do I improve profile visibility?",
                      a: "Complete personal and professional details, upload both resume and cover letter, and keep your profile updated weekly.",
                    },
                    {
                      q: "Can I change my plan later?",
                      a: "Yes. Go to Pricing tab and switch plans anytime. Billing adjusts from the next cycle.",
                    },
                    {
                      q: "Is my contact information private?",
                      a: "Yes. You can control employer visibility from Settings > Privacy Controls.",
                    },
                  ].map((item) => (
                    <details key={item.q} className="rounded-xl border border-gray-200 p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-gray-900">{item.q}</summary>
                      <p className="mt-2 text-sm text-gray-600">{item.a}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
