import FooterPageShell from "@/app/components/FooterPageShell";
import { BriefcaseBusiness, HeartHandshake, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Healthcare Recruitment Platform",
  description:
    "Learn about CareerMed, India's trusted healthcare hiring platform connecting qualified medical professionals with verified hospitals, clinics, and diagnostic centres.",
  openGraph: {
    title: "About CareerMed — India's Healthcare Job Platform",
    description:
      "CareerMed is built to connect talented healthcare professionals with verified employers. Discover our mission, what we solve, and our promise.",
    url: "https://www.careermed.in/about-us",
  },
  alternates: { canonical: "/about-us" },
};

const values = [
  {
    title: "Our Mission",
    text: "Build the most trusted healthcare hiring network where careers and organizations grow together.",
    icon: Target,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "What We Solve",
    text: "We reduce hiring friction with role matching, application workflows, resume tooling, and role-based dashboards.",
    icon: BriefcaseBusiness,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Our Promise",
    text: "Product quality, transparent communication, and continuous improvements for both candidates and hiring teams.",
    icon: HeartHandshake,
    color: "bg-violet-50 text-violet-700",
  },
];

export default function AboutUsPage() {
  return (
    <FooterPageShell
      eyebrow="About CareerMed"
      title="Healthcare careers, made more connected."
      description="CareerMed is a healthcare-focused hiring platform built to connect talented professionals with verified employers."
      icon={HeartHandshake}
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-lg leading-8 text-slate-600">
          We help job seekers discover the right opportunities faster and help employers hire
          quality candidates with confidence.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map(({ title, text, icon: Icon, color }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-8 text-center text-white shadow-lg shadow-blue-500/20 sm:px-10">
        <h2 className="text-xl font-bold">Built for healthcare hiring</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-blue-50">
          From first opportunity to a successful hire, CareerMed brings candidates and healthcare
          organizations together with clarity and confidence.
        </p>
      </div>
    </FooterPageShell>
  );
}
