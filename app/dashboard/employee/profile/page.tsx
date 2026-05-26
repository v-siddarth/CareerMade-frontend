"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { User2, Edit, Mail, Phone, Globe, MapPin, Award, Building2, ArrowLeft, LogOut, CheckCircle, CreditCard } from "lucide-react";
import GradientLoader from "@/app/components/GradientLoader";
import toast from "react-hot-toast";
import { apiFetch, authStorage, logout } from "@/lib/api-client";

type PricingPlan = {
  id: string;
  displayName: string;
  price: number;
  featureList?: string[];
  displayLimits?: { displayValue?: string; label?: string }[];
  displayFeatures?: { label?: string }[];
  metadata?: { planLabel?: string; badgeText?: string };
};

type SubscriptionSummary = {
  plan?: string;
  planName?: string;
  status?: string;
  isActive?: boolean;
};

const EMPLOYER_PLAN_FALLBACK: PricingPlan[] = [
  { id: "Basic", displayName: "Basic", price: 300, featureList: ["5 active job posts", "Up to 100 applications"] },
  { id: "Premium", displayName: "Premium", price: 900, featureList: ["25 active job posts", "Priority support"] },
  { id: "Enterprise", displayName: "Enterprise", price: 1800, featureList: ["High-volume hiring", "Dedicated account support"] },
];

const formatPlanPrice = (price?: number) =>
  typeof price === "number" ? `₹${price.toLocaleString("en-IN")} / month` : "Pricing available on checkout";

const getPlanLines = (plan: PricingPlan) => {
  const limits = (plan.displayLimits || []).map((item) => item.displayValue || item.label).filter(Boolean);
  const features = (plan.displayFeatures || []).map((item) => item.label).filter(Boolean);
  const lines = [...limits, ...features, ...(plan.featureList || [])].filter(Boolean) as string[];
  return [...new Set(lines)].slice(0, 3);
};

export default function ViewEmployerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null);
  const MANDATORY_CERTIFICATE_NAMES = new Set([
    "Bombay Nursing Certificate",
    "Hospital Registration Certificate",
  ]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.allSettled([
      apiFetch<{ data?: { employer?: any } }>("/api/employer/profile"),
      apiFetch<{ data?: { plans?: PricingPlan[] } }>("/api/pricing/plans?audience=employer"),
      apiFetch<{ data?: { subscription?: SubscriptionSummary | null } }>("/api/pricing/my-subscription"),
    ])
      .then(([profileResult, plansResult, subscriptionResult]) => {
        if (profileResult.status === "fulfilled" && profileResult.value?.data?.employer) {
          setProfile(profileResult.value.data.employer);
        } else {
          setError("Profile not found");
        }

        if (plansResult.status === "fulfilled") {
          setPricingPlans((plansResult.value.data?.plans || []).filter((plan) => plan.price > 0));
        }

        if (subscriptionResult.status === "fulfilled") {
          setSubscription(subscriptionResult.value.data?.subscription || null);
        }
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [router]);

  const activeSubscription =
    subscription?.status === "Active" && subscription.isActive !== false ? subscription : null;
  const profilePlans = pricingPlans.length > 0 ? pricingPlans : EMPLOYER_PLAN_FALLBACK;
  const currentPlan = activeSubscription?.plan
    ? profilePlans.find((plan) => plan.id === activeSubscription.plan)
    : undefined;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <GradientLoader />
      </div>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard/employee/profile/create")}
            className="bg-[#8F59ED] hover:bg-[#7c4dd4] text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all"
          >
            Create Profile
          </button>
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      {/* ===== HEADER SECTION ===== */}
      <div className="bg-gray-50">
        <div className="w-full relative bg-[#002B6B] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{ backgroundImage: "url('/new1.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3e]/90 via-[#002b6b]/60 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Employer{" "}
                <span className="bg-gradient-to-r from-[#00A3FF] to-[#00E0FF] bg-clip-text text-transparent">
                  Profile
                </span>
              </h1>
              <p className="text-base sm:text-lg text-blue-100 mt-3">
                View and manage your professional profile
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-start sm:justify-end w-full sm:w-auto">
              <button
                onClick={() => router.push("/dashboard/employee/profile/create")}
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-white text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-red-200 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-70"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROFILE SECTION ===== */}
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ===== LEFT COLUMN - CARD ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-2 shadow-sm  border border-gray-100 sticky top-8">
              {/* Gradient Header */}
              <div className="h-20 bg-gradient-to-r from-[#007BFF] to-[#00CFFF]  rounded-xl mb-4"></div>

              {/* Profile Icon */}
              <div className="flex justify-center -mt-12 mb-4">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
              </div>

              {/* Organization Name */}
              <h2 className="text-center text-xl font-bold text-gray-900 mb-1">
                {profile.organizationName || "N/A"}
              </h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                {profile.organizationType === "Other"
                  ? profile.organizationTypeOther || "Other"
                  : profile.organizationType || "—"}
              </p>

              {/* Meta Info */}
              <div className="space-y-2 text-sm text-gray-600 text-center mb-4">
                {profile.foundedYear && (
                  <p>
                    <span className="font-medium">Est.</span> {profile.foundedYear}
                  </p>
                )}
                {profile.employeeCount && (
                  <p>
                    <span className="font-medium">{profile.employeeCount}</span> employees
                  </p>
                )}
                {typeof profile.numberOfBeds === "number" && (
                  <p>
                    <span className="font-medium">{profile.numberOfBeds}</span> beds
                  </p>
                )}
              </div>

              {/* Verification Badge */}
              {profile.verification?.isVerified && profile.verification?.verifiedAt && (
                <div className="text-center text-xs text-green-600 font-medium mb-6 pb-6 border-b border-gray-200">
                  ✓ Verified on{" "}
                  {new Date(profile.verification.verifiedAt).toLocaleDateString()}
                </div>
              )}

              <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Current Plan
                </p>
                <p className="mt-2 text-base font-bold text-gray-900">
                  {activeSubscription
                    ? activeSubscription.planName || currentPlan?.displayName || activeSubscription.plan
                    : "Free"}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {activeSubscription ? formatPlanPrice(currentPlan?.price) : "No active paid subscription"}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/pricing")}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                >
                  <CreditCard className="h-4 w-4" />
                  Manage pricing
                </button>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>

                {/* Email */}
                {profile.contactPerson?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <a
                        href={`mailto:${profile.contactPerson.email}`}
                        className="text-sm text-gray-700 hover:text-blue-600"
                      >
                        {profile.contactPerson.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {profile.contactPerson?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <a
                        href={`tel:${profile.contactPerson.phone}`}
                        className="text-sm text-gray-700 hover:text-blue-600"
                      >
                        {profile.contactPerson.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN - MAIN CONTENT ===== */}
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pricing Plan</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Your profile now reflects the same employer plans used at checkout.
                  </p>
                </div>
                {activeSubscription && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {activeSubscription.planName || currentPlan?.displayName || activeSubscription.plan} active
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {profilePlans.map((plan) => (
                  <article
                    key={plan.id}
                    className={`rounded-xl border p-4 ${
                      activeSubscription?.plan === plan.id
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {plan.metadata?.planLabel || plan.metadata?.badgeText || "Employer"}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">{plan.displayName}</h3>
                    <p className="mt-1 text-sm font-semibold text-blue-700">{formatPlanPrice(plan.price)}</p>
                    <div className="mt-3 space-y-1">
                      {getPlanLines(plan).map((line) => (
                        <p key={line} className="text-xs text-gray-600">{line}</p>
                      ))}
                    </div>
                    {activeSubscription?.plan === plan.id && (
                      <p className="mt-3 text-xs font-semibold text-emerald-700">Current plan</p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* About Organization */}
            {profile.description && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  About Organization
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {profile.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.foundedYear && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Founded
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.foundedYear}
                      </p>
                    </div>
                  )}
                  {profile.employeeCount && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Employee Count
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.employeeCount}
                      </p>
                    </div>
                  )}
                  {typeof profile.numberOfBeds === "number" && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Number of Beds
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.numberOfBeds}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Location */}
            {profile.address && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Location</h2>

                {profile.address?.street ||
                  profile.address?.city ||
                  profile.address?.state ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {[
                            profile.address?.street,
                            profile.address?.city,
                            profile.address?.state,
                            profile.address?.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {profile.address?.country && (
                          <p className="text-sm text-gray-500">
                            {profile.address.country}
                          </p>
                        )}
                      </div>
                    </div>
                    {profile.address?.street && (
                      <div className="flex gap-4">
                        <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {[
                              profile.address?.street,
                              profile.address?.city,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          {profile.address?.pincode && (
                            <p className="text-sm text-gray-500">
                              {profile.address?.state} - {profile.address?.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No location information</p>
                )}
              </section>
            )}

            {/* Medical Specialities */}
            {profile.specializations && profile.specializations.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Medical Specialities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.specializations.map((spec: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Accreditations & Certifications */}
            {profile.accreditations && profile.accreditations.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Accreditations & Certifications
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.accreditations.map((acc: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 border border-green-200 bg-green-50 rounded-xl"
                    >
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-900">
                        {acc.name || acc}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.employerCertificates && profile.employerCertificates.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Regulatory Certificates
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.employerCertificates.map((cert: any, idx: number) => {
                    const effectiveCategory = MANDATORY_CERTIFICATE_NAMES.has(cert.name)
                      ? "Mandatory"
                      : "Optional";
                    return (
                    <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900">
                          {cert.name === "Other" ? cert.customName || "Other" : cert.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            effectiveCategory === "Mandatory"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {effectiveCategory}
                        </span>
                      </div>
                      {cert.issuingBody && (
                        <p className="text-sm text-gray-600 mt-1">Issued by: {cert.issuingBody}</p>
                      )}
                      {cert.documentUrl && (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          Open Document
                        </a>
                      )}
                    </div>
                  );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
