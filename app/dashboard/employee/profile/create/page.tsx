"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";
import { JOB_SPECIALIZATION_ENUM } from "@/lib/healthcare-taxonomy";

const ALLOWED_SPECIALIZATIONS = JOB_SPECIALIZATION_ENUM;

const ORGANIZATION_TYPES = [
  "Hospital",
  "Clinic",
  "Medical Center",
  "Nursing Home",
  "Diagnostic Center",
  "Pharmacy",
  "Healthcare Startup",
  "Medical Device Company",
  "Pharmaceutical Company",
  "Healthcare IT",
  "Telemedicine",
  "Rehabilitation Center",
  "Mental Health Center",
  "Dental Clinic",
  "Veterinary Clinic",
  "Government Healthcare",
  "NGO",
  "Other",
];

const CERTIFICATE_OPTIONS = [
  { name: "Bombay Nursing Certificate", category: "Mandatory" as const },
  { name: "Hospital Registration Certificate", category: "Mandatory" as const },
  { name: "NABH Entry Level Certificate", category: "Optional" as const },
  { name: "ISO Certification", category: "Optional" as const },
  { name: "NABH Full Accreditation", category: "Optional" as const },
  { name: "NABL Accreditation", category: "Optional" as const },
  { name: "Fire Safety NOC", category: "Optional" as const },
  { name: "Clinical Establishment License", category: "Optional" as const },
  { name: "Biomedical Waste Authorization", category: "Optional" as const },
  { name: "PCPNDT Certificate", category: "Optional" as const },
  { name: "AERB License", category: "Optional" as const },
  { name: "Other", category: "Optional" as const },
];

const MANDATORY_CERTIFICATES = CERTIFICATE_OPTIONS.filter(
  (item) => item.category === "Mandatory"
).map((item) => item.name);
const OPTIONAL_CERTIFICATE_OPTIONS = CERTIFICATE_OPTIONS.filter(
  (item) => item.category === "Optional"
);

type EmployerCertificate = {
  localId: string;
  name: string;
  customName: string;
  category: "Mandatory" | "Optional";
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  documentUrl: string;
  driveFileId?: string;
  uploadKey?: string;
  notes: string;
};

const makeLocalId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const buildDefaultMandatoryCertificates = (): EmployerCertificate[] =>
  CERTIFICATE_OPTIONS.filter((item) => item.category === "Mandatory").map((item) => ({
    localId: makeLocalId(),
    name: item.name,
    customName: "",
    category: "Mandatory",
    issuingBody: "",
    issueDate: "",
    expiryDate: "",
    documentUrl: "",
    notes: "",
  }));

const normalizeEmployerCertificates = (input: any[]): EmployerCertificate[] => {
  const normalizedInput = Array.isArray(input)
    ? input
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          name: item.name || "",
          category: MANDATORY_CERTIFICATES.includes(item.name || "")
            ? ("Mandatory" as const)
            : ("Optional" as const),
          localId: makeLocalId(),
          customName: item.customName || "",
          issuingBody: item.issuingBody || "",
          issueDate: item.issueDate
            ? new Date(item.issueDate).toISOString().split("T")[0]
            : "",
          expiryDate: item.expiryDate
            ? new Date(item.expiryDate).toISOString().split("T")[0]
            : "",
          documentUrl: item.documentUrl || "",
          driveFileId: item.driveFileId || "",
          notes: item.notes || "",
        }))
    : [];

  const ensuredMandatory = MANDATORY_CERTIFICATES.map((mandatoryName) => {
    const existing = normalizedInput.find((item) => item.name === mandatoryName);
    return (
      existing || {
        localId: makeLocalId(),
        name: mandatoryName,
        customName: "",
        category: "Mandatory" as const,
        issuingBody: "",
        issueDate: "",
        expiryDate: "",
        documentUrl: "",
        driveFileId: "",
        notes: "",
      }
    );
  });

  const optionals = normalizedInput.filter((item) => !MANDATORY_CERTIFICATES.includes(item.name));
  return [...ensuredMandatory, ...optionals];
};

export default function EmployerProfileCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState<Record<string, File>>({});
  const [certificateQuery, setCertificateQuery] = useState("");
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    organizationTypeOther: "",
    description: "",
    website: "",
    foundedYear: "",
    employeeCount: "",
    numberOfBeds: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    specializations: [] as string[],
    employerCertificates: buildDefaultMandatoryCertificates(),
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please log in to continue.");
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser.role !== "employer") {
      toast.error("Access denied. Employers only.");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data?.data?.employer) {
          const p = data.data.employer;
          setFormData({
            organizationName: p.organizationName || "",
            organizationType: p.organizationType || "",
            organizationTypeOther: p.organizationTypeOther || "",
            description: p.description || "",
            website: p.website || "",
            foundedYear: p.foundedYear || "",
            employeeCount: p.employeeCount || "",
            numberOfBeds: p.numberOfBeds?.toString() || "",
            contactPersonEmail: p.contactPerson?.email || "",
            contactPersonPhone: p.contactPerson?.phone || "",
            street: p.address?.street || "",
            city: p.address?.city || "",
            state: p.address?.state || "",
            pincode: p.address?.pincode || "",
            country: p.address?.country || "",
            specializations: p.specializations || [],
            employerCertificates: normalizeEmployerCertificates(p.employerCertificates || []),
          });
          setIsEditing(true);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSpecialization = (spec: string) => {
    const trimmed = spec.trim();
    if (!trimmed) return;

    if (!ALLOWED_SPECIALIZATIONS.includes(trimmed)) {
      toast.error("Please select a specialization from the allowed list.");
      return;
    }

    if (!formData.specializations.includes(trimmed)) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, trimmed],
      });
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((s: string) => s !== spec),
    });
  };

  const addEmployerCertificate = (name: string) => {
    const matched = OPTIONAL_CERTIFICATE_OPTIONS.find((item) => item.name === name);
    if (!matched) return;
    if (formData.employerCertificates.some((item) => item.name === name)) {
      toast.error("Certificate already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      employerCertificates: [
        ...prev.employerCertificates,
        {
          localId: makeLocalId(),
          name: matched.name,
          customName: "",
          category: matched.category,
          issuingBody: "",
          issueDate: "",
          expiryDate: "",
          documentUrl: "",
          notes: "",
        },
      ],
    }));
  };

  const updateEmployerCertificate = (
    index: number,
    field: keyof EmployerCertificate,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      employerCertificates: prev.employerCertificates.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeEmployerCertificate = (index: number) => {
    setFormData((prev) => {
      const removed = prev.employerCertificates[index];
      if (removed?.category === "Mandatory") {
        return prev;
      }
      if (removed?.localId) {
        setCertificateFiles((existing) => {
          const next = { ...existing };
          delete next[removed.localId];
          return next;
        });
      }
      return {
        ...prev,
        employerCertificates: prev.employerCertificates.filter((_, i) => i !== index),
      };
    });
  };

  const setEmployerCertificateFile = (certificateLocalId: string, file?: File) => {
    setCertificateFiles((prev) => {
      const next = { ...prev };
      if (file) next[certificateLocalId] = file;
      else delete next[certificateLocalId];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.organizationName.trim()) {
      return toast.error("Organization name is required");
    }
    if (!formData.organizationType.trim()) {
      return toast.error("Organization type is required");
    }
    if (
      formData.organizationType === "Other" &&
      !formData.organizationTypeOther.trim()
    ) {
      return toast.error("Please specify organization type");
    }
    if (!formData.contactPersonEmail.trim()) {
      return toast.error("Contact email is required");
    }
    if (!formData.contactPersonPhone.trim()) {
      return toast.error("Contact phone is required");
    }
    if (!formData.street.trim()) {
      return toast.error("Street address is required");
    }
    if (!formData.city.trim()) {
      return toast.error("City is required");
    }
    if (!formData.state.trim()) {
      return toast.error("State is required");
    }
    if (!formData.pincode.trim()) {
      return toast.error("Pincode is required");
    }
    if (formData.numberOfBeds && Number(formData.numberOfBeds) < 0) {
      return toast.error("Number of beds cannot be negative");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please log in again");
      return;
    }
    setLoading(true);

    const invalidSpecializations = formData.specializations.filter(
      (s) => !ALLOWED_SPECIALIZATIONS.includes(s.trim())
    );
    if (invalidSpecializations.length > 0) {
      setLoading(false);
      toast.error(
        `Invalid specialization(s): ${invalidSpecializations.join(", ")}`
      );
      return;
    }

    const missingMandatoryCertificates = MANDATORY_CERTIFICATES.filter((name) => {
      const cert = formData.employerCertificates.find((item) => item.name === name);
      const hasUploadedFile = cert ? Boolean(certificateFiles[cert.localId]) : false;
      return !cert || (!cert.documentUrl.trim() && !hasUploadedFile);
    });
    if (missingMandatoryCertificates.length > 0) {
      setLoading(false);
      toast.error(
        `Upload mandatory certificates: ${missingMandatoryCertificates.join(", ")}`
      );
      return;
    }

    const invalidOtherCertificate = formData.employerCertificates.find(
      (item) => item.name === "Other" && !item.customName.trim()
    );
    if (invalidOtherCertificate) {
      setLoading(false);
      toast.error("Provide certificate name for Other certificate type");
      return;
    }

    const payload = {
      organizationName: formData.organizationName.trim(),
      organizationType: formData.organizationType.trim(),
      organizationTypeOther:
        formData.organizationType === "Other"
          ? formData.organizationTypeOther.trim()
          : "",
      description: formData.description.trim(),
      website: formData.website.trim(),
      foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
      employeeCount: formData.employeeCount,
      numberOfBeds: formData.numberOfBeds
        ? Number(formData.numberOfBeds)
        : undefined,
      contactPerson: {
        name: formData.organizationName.trim(),
        designation: "HR Representative", // Required field - provide default
        phone: formData.contactPersonPhone.trim(),
        email: formData.contactPersonEmail.trim(),
      },
      address: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        country: formData.country.trim() || "India",
      },
      specializations: formData.specializations.filter((s) => s.trim()),
      accreditations: formData.employerCertificates
        .filter((cert) => cert.name.trim())
        .map((cert) => ({
          name: cert.name === "Other" ? cert.customName.trim() || "Other" : cert.name,
          issuingBody: cert.issuingBody.trim() || "Self",
          issueDate: cert.issueDate
            ? new Date(cert.issueDate).toISOString()
            : new Date().toISOString(),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString() : undefined,
          certificateUrl: cert.documentUrl.trim() || undefined,
        })),
      employerCertificates: formData.employerCertificates.map((cert) => ({
        name: cert.name,
        customName: cert.customName.trim(),
        category: cert.category,
        issuingBody: cert.issuingBody.trim(),
        issueDate: cert.issueDate || undefined,
        expiryDate: cert.expiryDate || undefined,
        documentUrl: cert.documentUrl.trim(),
        driveFileId: cert.driveFileId || undefined,
        uploadKey: cert.localId,
        notes: cert.notes.trim(),
      })),
    };

    const formPayload = new FormData();
    formPayload.append("profile", JSON.stringify(payload));
    formData.employerCertificates.forEach((cert) => {
      const file = certificateFiles[cert.localId];
      if (!file) return;
      formPayload.append("employerCertificateFiles", file);
      formPayload.append("employerCertificateFileKeys", cert.localId);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEditing
            ? "Profile updated successfully!"
            : "Profile created successfully!"
        );
        router.push("/dashboard/employee/profile");
      } else {
        toast.error(data.message || "Failed to save profile");
        console.error("Error response:", data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 sm:p-8 mt-8 mb-8 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employer Profile
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your organization's information and your profile
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => router.push("/dashboard/employee/profile/")}
              className="px-6 py-2.5 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profileForm"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <form id="profileForm" onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Details */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Organization Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apollo Hospitals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {ORGANIZATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {formData.organizationType === "Other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specify Organization Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organizationTypeOther"
                    value={formData.organizationTypeOther}
                    onChange={handleChange}
                    required={formData.organizationType === "Other"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter organization type"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Year
                </label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1983"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Count
                </label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">500-1000</option>
                  <option value="1001-5000">1001-5000</option>
                  <option value="5000+">5000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Beds
                </label>
                <input
                  type="number"
                  min={0}
                  name="numberOfBeds"
                  value={formData.numberOfBeds}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Organization
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your organization..."
                rows={3}
              />
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="hr@apollohospitals.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="www.apollohospitals.com"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="123 Health Avenue, Medical District"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400001"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="India"
              />
            </div>
          </section>

          {/* Medical Specialities */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Medical Specialities
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                id="specInput"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type an allowed specialization"
                list="allowed-specializations"
              />
              <datalist id="allowed-specializations">
                {ALLOWED_SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("specInput") as HTMLInputElement;
                  addSpecialization(input.value);
                  input.value = "";
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(spec)}
                    className="font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Mandatory & Optional Regulatory Certificates */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Regulatory Certificates
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Mandatory: Bombay Nursing Certificate, Hospital Registration Certificate.
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Mandatory Certificates</h3>
              {formData.employerCertificates
                .filter((cert) => cert.category === "Mandatory")
                .map((cert, index) => {
                const realIndex = formData.employerCertificates.findIndex(
                  (item) => item.localId === cert.localId
                );
                return (
                <div key={`${cert.name}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="font-medium text-gray-900">
                      {cert.name}
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          cert.category === "Mandatory"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {cert.category}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cert.name === "Other" && (
                      <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                        Certificate Name <span className="text-red-500">*</span>
                        <input
                          type="text"
                          value={cert.customName}
                          onChange={(e) =>
                            updateEmployerCertificate(realIndex, "customName", e.target.value)
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Enter certificate name"
                        />
                      </label>
                    )}
                    <label className="text-sm font-medium text-gray-700">
                      Issuing Body
                      <input
                        type="text"
                        value={cert.issuingBody}
                        onChange={(e) =>
                          updateEmployerCertificate(realIndex, "issuingBody", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Issuing authority"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Issue Date
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) =>
                          updateEmployerCertificate(realIndex, "issueDate", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Expiry Date
                      <input
                        type="date"
                        value={cert.expiryDate}
                        onChange={(e) =>
                          updateEmployerCertificate(realIndex, "expiryDate", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Upload Document
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setEmployerCertificateFile(cert.localId, file);
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        aria-label={`Upload certificate document for ${
                          cert.name === "Other" ? cert.customName || "Other" : cert.name
                        }`}
                      />
                      {(certificateFiles[cert.localId]?.name || cert.documentUrl) && (
                        <p className="mt-1 text-xs text-green-700">
                          Selected: {certificateFiles[cert.localId]?.name || "Existing uploaded document"}
                        </p>
                      )}
                      {!certificateFiles[cert.localId]?.name && cert.documentUrl && (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                        >
                          View current uploaded document
                        </a>
                      )}
                    </label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                      Notes
                      <input
                        type="text"
                        value={cert.notes}
                        onChange={(e) =>
                          updateEmployerCertificate(realIndex, "notes", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Optional notes"
                      />
                    </label>
                  </div>
                </div>
              );
            })}

              <div className="mb-1 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <label
                  htmlFor="certificate-search"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Add optional certificate type
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="certificate-search"
                    list="certificate-options"
                    value={certificateQuery}
                    onChange={(e) => setCertificateQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const exact = OPTIONAL_CERTIFICATE_OPTIONS.find(
                          (item) => item.name.toLowerCase() === certificateQuery.trim().toLowerCase()
                        );
                        if (!exact) {
                          toast.error("Select a valid optional certificate from suggestions");
                          return;
                        }
                        addEmployerCertificate(exact.name);
                        setCertificateQuery("");
                      }
                    }}
                    className="flex-1 bg-white px-4 py-2 border-2 border-gray-400 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Search optional certificate (ISO, NABL, Fire Safety NOC...)"
                    aria-describedby="certificate-help"
                  />
                  <datalist id="certificate-options">
                    {OPTIONAL_CERTIFICATE_OPTIONS.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.category}
                      </option>
                    ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={() => {
                      const exact = OPTIONAL_CERTIFICATE_OPTIONS.find(
                        (item) => item.name.toLowerCase() === certificateQuery.trim().toLowerCase()
                      );
                      if (!exact) {
                        toast.error("Select a valid optional certificate from suggestions");
                        return;
                      }
                      addEmployerCertificate(exact.name);
                      setCertificateQuery("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    aria-label="Add selected certificate type"
                  >
                    Add Certificate
                  </button>
                </div>
                <p id="certificate-help" className="text-xs text-gray-700 mt-2">
                  Keyboard accessible: type to filter, use arrow keys to choose, press Enter to add.
                </p>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 pt-2">Optional Certificates</h3>
              {formData.employerCertificates
                .filter((cert) => cert.category === "Optional")
                .map((cert, index) => {
                  const realIndex = formData.employerCertificates.findIndex(
                    (item) => item.localId === cert.localId
                  );
                  return (
                  <div key={`${cert.name}-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <p className="font-medium text-gray-900">
                        {cert.name}
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Optional
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => removeEmployerCertificate(realIndex)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cert.name === "Other" && (
                        <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                          Certificate Name <span className="text-red-500">*</span>
                          <input
                            type="text"
                            value={cert.customName}
                            onChange={(e) =>
                              updateEmployerCertificate(realIndex, "customName", e.target.value)
                            }
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter certificate name"
                          />
                        </label>
                      )}
                      <label className="text-sm font-medium text-gray-700">
                        Issuing Body
                        <input
                          type="text"
                          value={cert.issuingBody}
                          onChange={(e) =>
                            updateEmployerCertificate(realIndex, "issuingBody", e.target.value)
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Issuing authority"
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Issue Date
                        <input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) =>
                            updateEmployerCertificate(realIndex, "issueDate", e.target.value)
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Expiry Date
                        <input
                          type="date"
                          value={cert.expiryDate}
                          onChange={(e) =>
                            updateEmployerCertificate(realIndex, "expiryDate", e.target.value)
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Upload Document
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setEmployerCertificateFile(cert.localId, file);
                          }}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          aria-label={`Upload certificate document for ${
                            cert.name === "Other" ? cert.customName || "Other" : cert.name
                          }`}
                        />
                        {(certificateFiles[cert.localId]?.name || cert.documentUrl) && (
                          <p className="mt-1 text-xs text-green-700">
                            Selected: {certificateFiles[cert.localId]?.name || "Existing uploaded document"}
                          </p>
                        )}
                        {!certificateFiles[cert.localId]?.name && cert.documentUrl && (
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                          >
                            View current uploaded document
                          </a>
                        )}
                      </label>
                      <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                        Notes
                        <input
                          type="text"
                          value={cert.notes}
                          onChange={(e) =>
                            updateEmployerCertificate(realIndex, "notes", e.target.value)
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Optional notes"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </form>
      </div>
    </>
  );
}
