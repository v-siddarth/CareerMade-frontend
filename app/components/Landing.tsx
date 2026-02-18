"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, TrendingUp, Users, Briefcase, DollarSign, Award, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

type UserRole = "jobseeker" | "employer" | "admin" | null;

const OPPORTUNITY_CARDS = [
  {
    title: "Doctors & Physicians",
    subtitle: "General, Surgery, Pediatrics",
    positions: "1,247",
    image: "/man.png",
    iconBg: "bg-orange-100",
    accent: "text-[#2B7FFF]",
    specialties: ["General Medicine", "Surgery", "Pediatrics", "Internal Medicine"],
  },
  {
    title: "Nursing Staff",
    subtitle: "RNs, LPNs, CNAs, Nurse Practitioners",
    positions: "2,183",
    image: "/woman.png",
    iconBg: "bg-red-100",
    accent: "text-[#F6339A]",
    specialties: ["Nursing"],
  },
  {
    title: "Technicians",
    subtitle: "Lab Techs, X-Ray, MRI, Ultrasound",
    positions: "1,640",
    image: "/micro.png",
    iconBg: "bg-yellow-100",
    accent: "text-[#00C950]",
    specialties: ["Medical Technology", "Radiology", "Pathology"],
  },
  {
    title: "Admin & Support",
    subtitle: "Medical Billing, Reception, Management",
    positions: "3,920",
    image: "/pad.png",
    iconBg: "bg-purple-100",
    accent: "text-[#AD46FF]",
    specialties: ["Other"],
  },
  {
    title: "Diagnostics",
    subtitle: "Pathology, Radiology, Laboratory",
    positions: "2,890",
    image: "/scope.png",
    iconBg: "bg-blue-100",
    accent: "text-[#00B8DB]",
    specialties: ["Pathology", "Radiology"],
  },
  {
    title: "Therapists",
    subtitle: "Physical, Occupational, Speech",
    positions: "4,455",
    image: "/pill.png",
    iconBg: "bg-gray-100",
    accent: "text-[#FF6900]",
    specialties: ["Physical Therapy", "Occupational Therapy", "Speech Therapy"],
  },
  {
    title: "Dental & Optometry",
    subtitle: "Dentists, Hygienists, Optometrists",
    positions: "2,175",
    image: "/teeth.png",
    iconBg: "bg-indigo-100",
    accent: "text-[#615FFF]",
    specialties: ["Ophthalmology", "Other"],
  },
  {
    title: "Research & Development",
    subtitle: "Clinical Research, Medical Writing",
    positions: "1,567",
    image: "/graph.png",
    iconBg: "bg-teal-100",
    accent: "text-[#00BBA7]",
    specialties: ["Pathology", "Other"],
  },
];

export default function CareerMadeLanding() {
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

    const openJobsByCategory = (card: { title: string; specialties: string[] }) => {
        const params = new URLSearchParams();
        params.set("category", card.title);
        params.set("specialties", card.specialties.join(","));
        router.push(`/view-jobs?${params.toString()}`);
    };

    const handleNewsletterSubscribe = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, source: "landing-page-cta" }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message || "Failed to subscribe");
            }

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

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-6 h-6 text-blue-500 mr-2" />
                                <div className="text-4xl font-bold text-gray-900">50K+</div>
                            </div>
                            <div className="text-gray-600 text-sm">Healthcare Professionals</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Building className="w-6 h-6 text-blue-500 mr-2" />
                                <div className="text-4xl font-bold text-gray-900">5.2K+</div>
                            </div>
                            <div className="text-gray-600 text-sm">Active Job Openings</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Briefcase className="w-6 h-6 text-blue-500 mr-2" />
                                <div className="text-4xl font-bold text-gray-900">2.5K+</div>
                            </div>
                            <div className="text-gray-600 text-sm">Healthcare Facilities</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
                                <div className="text-4xl font-bold text-gray-900">98%</div>
                            </div>
                            <div className="text-gray-600 text-sm">Success Rate</div>
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
                                className="bg-white rounded-xl p-6 hover:shadow-lg transition border border-gray-100 text-left"
                            >
                                <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                                    <Image src={card.image} alt={card.title} width={20} height={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{card.subtitle}</p>
                                <p className={`text-2xl font-bold ${card.accent} mb-1`}>{card.positions}</p>
                                <p className="text-sm text-gray-500 mb-4">positions available</p>
                                <span className="text-gray-700 font-semibold hover:text-gray-800">View jobs →</span>
                            </button>
                        ))}
                    </div>

                    
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Trusted by{" "}
                            <span className="bg-gradient-to-r from-[#155DFC] to-[#00B8DB] bg-clip-text text-transparent">
                                thousands
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Join the fastest-growing healthcare job platform in India
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                            <div className="text-4xl font-bold text-blue-400 mb-2">50,000+</div>
                            <div className="text-gray-400 mb-4">Healthcare Professionals</div>
                            <div className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                                +12% this month
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                            <div className="text-4xl font-bold text-blue-400 mb-2">5,200+</div>
                            <div className="text-gray-400 mb-4">Verified Healthcare Employers</div>
                            <div className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                                +8% this month
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                            <div className="text-4xl font-bold text-blue-400 mb-2">2,500+</div>
                            <div className="text-gray-400 mb-4">Success Stories from Top Partners</div>
                            <div className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                                +15% this month
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                            <div className="text-4xl font-bold text-blue-400 mb-2">45,000+</div>
                            <div className="text-gray-400 mb-4">Successful Job Placements</div>
                            <div className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                                +20% this month
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-gray-400 mb-6">Ready to get started? Join CareerMade</p>
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
                                    <div className="font-bold text-gray-900">Dr. Priya Sharma</div>
                                    <div className="text-sm text-gray-500">Senior Physician</div>
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
                                "The platform is amazing! I found my perfect job within two weeks. The employers are verified which made me feel safe."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-200 rounded-full mr-3"></div>
                                <div>
                                    <div className="font-bold text-gray-900">Rahul Kumar</div>
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
                                    <div className="font-bold text-gray-900">Sneha Patel</div>
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
                                <img src="/logo.png" alt="CareerMade" className="h-7" />
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
                        <p>© 2025 CareerMade. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}
            {/* <Footer /> */}
        </div>
    );
}
