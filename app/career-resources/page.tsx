import Navbar from "@/app/components/Navbar";
import Link from "next/link";

const resources = [
  {
    title: "Resume Writing for Healthcare Roles",
    description: "Build recruiter-ready resumes tailored for hospitals, clinics, and diagnostics roles.",
  },
  {
    title: "Interview Preparation Checklist",
    description: "A practical interview checklist for nursing, physician, technician, and admin roles.",
  },
  {
    title: "Job Search Strategy",
    description: "How to target roles, optimize applications, and improve response rates.",
  },
];

export default function CareerResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Career Resources</h1>
          <p className="mt-4 text-gray-700">
            Practical resources for healthcare professionals to improve job search outcomes.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {resources.map((resource) => (
              <article key={resource.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">{resource.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{resource.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/view-jobs" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Browse Jobs
            </Link>
            <Link href="/dashboard/jobseeker/resume/build" className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50">
              Open Resume Builder
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
