import Navbar from "@/app/components/Navbar";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">About CareerMade</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">
            CareerMade is a healthcare-focused hiring platform built to connect talented professionals with verified employers.
            We help job seekers discover the right opportunities faster and help employers hire quality candidates with confidence.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Our Mission</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Build the most trusted healthcare hiring network where careers and organizations grow together.
              </p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">What We Solve</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We reduce hiring friction with role matching, application workflows, resume tooling, and role-based dashboards.
              </p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Our Promise</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Product quality, transparent communication, and continuous improvements for both candidates and hiring teams.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
