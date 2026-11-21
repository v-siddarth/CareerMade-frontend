import Navbar from "@/app/components/Navbar";
import { Clock3, Mail, MessageSquareText, Phone, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — CareerMed Support",
  description:
    "Contact the CareerMed support team for help with your account, jobs, employer onboarding, or billing.",
  openGraph: {
    title: "Contact CareerMed Support",
    description: "Get in touch with the CareerMed support team.",
    url: "https://www.careermed.in/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-slate-50">
        <section className="relative border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> CareerMed Support
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              We&apos;re here to help.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Need help with your account, a job opportunity, employer onboarding, or billing? Reach
              our support team directly.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="mailto:support@careermed.in"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Email support</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                For help with your account, jobs, or billing.
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                support@careermed.in
              </p>
            </a>
            <a
              href="tel:+918806506455"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                <Phone className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Call us</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Speak directly with the CareerMed support team.
              </p>
              <p className="mt-4 text-sm font-semibold text-cyan-700 group-hover:text-cyan-800">
                +91 88065 06455
              </p>
            </a>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Clock3 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Response time</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Monday to Friday, 10:00 AM to 6:00 PM IST.
              </p>
              <p className="mt-4 text-sm font-semibold text-violet-700">Within one business day</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <a
              href="mailto:support@careermed.in?subject=CareerMed%20Grievance"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                <MessageSquareText className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Grievance</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Report a concern or request help resolving an issue.
              </p>
              <p className="mt-4 text-sm font-semibold text-rose-700">Email the grievance team</p>
            </a>
            <a
              href="mailto:support@careermed.in?subject=CareerMed%20Privacy%20Request"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Privacy</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submit a privacy question, request, or concern.
              </p>
              <p className="mt-4 text-sm font-semibold text-violet-700">Email the privacy team</p>
            </a>
            <a
              href="mailto:support@careermed.in?subject=CareerMed%20Business%20Enquiry"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-semibold text-slate-900">Business enquiries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Connect with us about organisational or business matters.
              </p>
              <p className="mt-4 text-sm font-semibold text-amber-700">Email CareerMed</p>
            </a>
          </div>
          <p className="mt-10 text-center text-sm text-slate-500">
            For faster assistance, please include your registered email address and a short
            description of your query.
          </p>
        </section>
      </main>
    </>
  );
}
