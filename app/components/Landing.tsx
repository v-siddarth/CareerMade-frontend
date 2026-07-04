"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, TrendingUp, Users, Briefcase, DollarSign, Award, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api-client";

type UserRole = "jobseeker" | "employer" | "admin" | null;

const OPPORTUNITY_CARDS = [
  {
    title: "Doctors & Physicians",
    subtitle: "General, Surgery, Pediatrics",
    positions: "157",
    image: "/man.png",
    iconBg: "bg-orange-100",
    accent: "text-[#2B7FFF]",
    specialties: ["General Medicine", "General Surgery", "Pediatrics", "Internal Medicine"],
    titleFilter: "Doctor",
  },
  {
    title: "Nursing Staff",
    subtitle: "RNs, LPNs, CNAs, Nurse Practitioners",
    positions: "162",
    image: "/woman.png",
    iconBg: "bg-red-100",
    accent: "text-[#F6339A]",
    specialties: ["Nursing", "Staff Nurse", "ICU Nurse"],
    titleFilter: "Nurse",
  },
  {
    title: "Technicians",
    subtitle: "Lab Techs, X-Ray, MRI, Ultrasound",
    positions: "125",
    image: "/micro.png",
    iconBg: "bg-yellow-100",
    accent: "text-[#00C950]",
    specialties: ["Medical Laboratory Technician", "Radiology Technician", "Pathology"],
    titleFilter: "Technician",
  },
  {
    title: "Admin & Support",
    subtitle: "Medical Billing, Reception, Management",
    positions: "67",
    image: "/pad.png",
    iconBg: "bg-purple-100",
    accent: "text-[#AD46FF]",
    specialties: ["Hospital Administrator", "Medical Billing Officer", "Patient Care Assistant"],
    titleFilter: "Admin",
  },
  {
    title: "Diagnostics",
    subtitle: "Pathology, Radiology, Laboratory",
    positions: "146",
    image: "/scope.png",
    iconBg: "bg-blue-100",
    accent: "text-[#00B8DB]",
    specialties: ["Pathology", "Radiology"],
    titleFilter: "Technician",
  },
  {
    title: "Therapists",
    subtitle: "Physical, Occupational, Speech",
    positions: "98",
    image: "/pill.png",
    iconBg: "bg-gray-100",
    accent: "text-[#FF6900]",
    specialties: ["Physical Therapy", "Occupational Therapy", "Speech Therapy"],
    titleFilter: "Other",
  },
  {
    title: "Dental & Optometry",
    subtitle: "Dentists, Hygienists, Optometrists",
    positions: "112",
    image: "/teeth.png",
    iconBg: "bg-indigo-100",
    accent: "text-[#615FFF]",
    specialties: ["General Dentistry", "Optometrist", "Dental Hygienist"],
    titleFilter: "Doctor",
  },
  {
    title: "Research & Development",
    subtitle: "Clinical Research, Medical Writing",
    positions: "26",
    image: "/graph.png",
    iconBg: "bg-teal-100",
    accent: "text-[#00BBA7]",
    specialties: ["Clinical Research Medical Officer", "Medical Affairs", "Molecular Diagnostics Technician"],
    titleFilter: "Other",
  },
];

export default function CareerMedLanding() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole>(null);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("user");
            if (!rawUser) {
                setRole(null);
                return;
            }
            const parsed = JSON.parse(rawUser) as { role?: UserRole };
            setRole(parsed?.role || null);
        } catch {
            setRole(null);
        }
    }, []);

    const openJobsByCategory = (card: { title: string; specialties: string[]; titleFilter: string }) => {
        const params = new URLSearchParams();
        params.set("title", card.titleFilter);
        params.set("specialty", card.specialties[0] || "");
        params.set("from", "landing");
        router.push(`/dashboard/jobseeker?${params.toString()}`);
    };

    const handleNewsletterSubscribe = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setSubmitting(true);
            const data = await apiFetch<{ message?: string }>("/api/newsletter/subscribe", {
                method: "POST",
                skipAuth: true,
                retryOnAuthError: false,
                body: JSON.stringify({ email: normalizedEmail, source: "landing-page-cta" }),
            });
            toast.success(data?.message || "Subscribed successfully.");
            setEmail("");
        } catch (error: any) {
            toast.error(error?.message || "Unable to subscribe right now.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <img src="/bg.svg" alt="" className="w-full h-full" />
                    <div className="absolute top-10 left-10 w-32 h-32 ">
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    {/* Main Content */}
                    <div className="text-center mb-12">
                        <img src="/img.png" alt="Healthcare Professionals" className="mx-auto mb-8 mt-5 max-w-2xl w-full" />

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Find Your Dream{" "}
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                Healthcare
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                Career
                            </span>
                        </h1>
                        <div className="mt-6 mb-5">
                            <Link href="/view-jobs">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold">
                                    Explore All Jobs
                                </button>
                            </Link>
                        </div>


                        {/* Search Bar */}
                        {/* <div className="max-w-3xl mx-auto mb-8">
                            <div className="bg-white rounded-lg shadow-lg p-3 flex flex-col md:flex-row items-center gap-3">
                                <div className="flex-1 flex items-center w-full border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-3">
                                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Job title, keyword, or company"
                                        className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <div className="flex-1 flex items-center w-full pb-3 md:pb-0">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="City, state or remote"
                                        className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <Link href="/register">
                                    <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-medium whitespace-nowrap">
                                        Search Jobs
                                    </button>
                                </Link>
                            </div>
                        </div> */}

                        {/* Popular Searches */}
                        <div className="flex items-center justify-center flex-wrap gap-3 text-sm">
                            <span className="text-gray-600">Popular searches:</span>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-gray-700">
                                General Physician
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-gray-700">
                                Staff Nurse
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-gray-700">
                                Pharmacist
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-gray-700">
                                Lab Technician
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition text-gray-700">
                                Radiologist
                            </button>
                        </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 px-4 md:px-0">
                        <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-50/50 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Top Talent</h3>
                            <p className="text-gray-500 text-xs text-center uppercase tracking-wider font-semibold">Elite Professionals</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-50/50 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                                <Building className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Premium Clinics</h3>
                            <p className="text-gray-500 text-xs text-center uppercase tracking-wider font-semibold">Verified Facilities</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-50/50 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Diverse Roles</h3>
                            <p className="text-gray-500 text-xs text-center uppercase tracking-wider font-semibold">Abundant Opportunities</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-50/50 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">High Success</h3>
                            <p className="text-gray-500 text-xs text-center uppercase tracking-wider font-semibold">Proven Placement</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to{" "}
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                succeed
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Comprehensive tools and resources to help healthcare professionals
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="border-1 border-gray-300 rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Employers</h3>
                            <p className="text-gray-600">
                                All employers are verified and trusted in the healthcare industry
                            </p>
                        </div>

                        <div className="border-1 border-gray-300  rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Applications</h3>
                            <p className="text-gray-600">
                                Apply to multiple positions with one click using your profile
                            </p>
                        </div>

                        <div className="border-1 border-gray-300  rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Matching</h3>
                            <p className="text-gray-600">
                                AI-powered matching connects you with your ideal positions
                            </p>
                        </div>

                        <div className="border-1 border-gray-300  rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                            <p className="text-gray-600">
                                Dedicated career advisors to support your job search journey
                            </p>
                        </div>

                        <div className="border-1 border-gray-300  rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Career Growth</h3>
                            <p className="text-gray-600">
                                Get career tips and training to grow your career in healthcare
                            </p>
                        </div>

                        <div className="border-1 border-gray-300 rounded-2xl p-8 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Salaries</h3>
                            <p className="text-gray-600">
                                Salary tools to help you find jobs that match your expectations
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Opportunities Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-blue-500 font-semibold mb-2">Browse by Specialties</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Explore{" "}
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                Healthcare
                            </span>{" "}
                            Opportunities
                        </h2>
                        <p className="text-xl text-gray-600">
                            Find jobs tailored to your healthcare specialization and expertise level
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {OPPORTUNITY_CARDS.map((card) => (
                            <button
                                key={card.title}
                                type="button"
                                onClick={() => openJobsByCategory(card)}
                                className="group bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 text-left flex flex-col h-full"
                            >
                                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                                    <Image src={card.image} alt={card.title} width={24} height={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-500 mb-6 flex-grow">{card.subtitle}</p>
                                
                                <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                    <span className={`text-sm font-semibold ${card.accent}`}>Explore roles</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                        <svg className={`w-4 h-4 ${card.accent} group-hover:translate-x-0.5 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="/bg.svg" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Trusted by{" "}
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                Leading Institutions
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Join the fastest-growing healthcare job platform in India and connect with top-tier talent and premier facilities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                            <div className="w-16 h-16 bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/30">
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Expert Network</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Connect with highly qualified healthcare professionals dedicated to excellence in patient care.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                            <div className="w-16 h-16 bg-cyan-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-cyan-500/30">
                                <Building className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Verified Partners</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Partner with certified hospitals, clinics, and research facilities across the nation.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                            <div className="w-16 h-16 bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-purple-500/30">
                                <Award className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Quality Matches</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Advanced algorithms ensuring the perfect fit between talent expertise and facility requirements.
                            </p>
                        </div>

                        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-xl">
                            <div className="w-16 h-16 bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
                                <TrendingUp className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Career Growth</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Empowering professionals with continuous opportunities for advancement and skill development.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-gray-400 mb-6">Ready to get started? Join CareerMed</p>
                        <div className="flex items-center justify-center space-x-4">
                            {(role === "employer" || role === "admin") && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/employee/jobs/create")}
                                    className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition font-semibold"
                                >
                                    Post a Job
                                </button>
                            )}
                            {(role === "jobseeker" || role === null) && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/view-jobs")}
                                    className="border border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition font-semibold"
                                >
                                    Find a Job
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Loved by <span className="text-blue-500">Healthcare</span> Professionals
                        </h2>
                        <p className="text-xl text-gray-600">
                            Don't just take our word for it - hear from real healthcare professionals who found their dream jobs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6">
                                "This site has helped me a lot in finding an opportunity for my dream career. The process was amazing and the interface too."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-200 rounded-full mr-3"></div>
                                <div>
                                    <div className="font-bold text-gray-900">Dr. Youraj Saste</div>
                                    <div className="text-sm text-gray-500">BHMS</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <div className="flex mb-4">
                                {[...Array(4)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6">
                                "The platform is amazing! I found my perfect job within two weeks. The employers are verified which made me feel safe."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-200 rounded-full mr-3"></div>
                                <div>
                                    <div className="font-bold text-gray-900">Ms. Swati Jadhav</div>
                                    <div className="text-sm text-gray-500">Registered Nurse</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6">
                                "I was confused about my career path but the career advisors here helped me find the right direction. Highly recommended!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-200 rounded-full mr-3"></div>
                                <div>
                                    <div className="font-bold text-gray-900">Ms. Mangal Lavare</div>
                                    <div className="text-sm text-gray-500">Lab Technician</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <img src="/bg.svg" alt="" className="w-full h-full object-cover" />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    {/* Top Tagline */}
                    <p className="text-blue-200 text-sm sm:text-base mb-3 sm:mb-4 tracking-wider">
                        JOIN OUR SUCCESS FAMILY
                    </p>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                        Ready to Transform Your{" "}
                        <span className="bg-gradient-to-r from-[#fff] to-[#A7C6FF] bg-clip-text text-transparent">
                            Healthcare Career?
                        </span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Take your first step toward a better healthcare career with us. Apply to
                        thousands of jobs in just a few clicks!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        {/* Email + Subscribe */}
                        <div className="bg-white rounded-full p-1 flex items-center w-full sm:w-auto max-w-md">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-5 py-3 text-sm sm:text-base outline-none text-gray-900 rounded-full"
                            />
                            <button
                                type="button"
                                onClick={handleNewsletterSubscribe}
                                disabled={submitting}
                                className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold whitespace-nowrap disabled:opacity-60"
                            >
                                {submitting ? "Subscribing..." : "Subscribe"}
                            </button>
                        </div>

                        {/* Secondary Button */}
                        <button
                            type="button"
                            onClick={() => router.push("/view-jobs")}
                            className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition font-semibold"
                        >
                            Find All Vacancies
                        </button>
                    </div>
                </div>
            </section>


            {/* Footer */}
            {/* <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="text-2xl font-bold text-white mb-4">
                                <img src="/logo.png" alt="CareerMed" className="h-7" />
                            </div>
                            <p className="text-sm mb-4">
                                Empowering healthcare professionals to find their dream careers
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-white">LinkedIn</a>
                                <a href="#" className="hover:text-white">Twitter</a>
                                <a href="#" className="hover:text-white">Facebook</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                                <li><a href="#" className="hover:text-white">Career Resources</a></li>
                                <li><a href="#" className="hover:text-white">Resume Builder</a></li>
                                <li><a href="#" className="hover:text-white">Salary Tools</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">For Employers</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                                <li><a href="#" className="hover:text-white">Browse Candidates</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Enterprise</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>© 2025 CareerMed. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}
            {/* <Footer /> */}
        </div>
    );
}
