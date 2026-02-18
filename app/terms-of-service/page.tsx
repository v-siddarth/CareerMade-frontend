import Navbar from "@/app/components/Navbar";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-6 text-sm leading-7 text-gray-700">
            By using CareerMade, you agree to use the platform lawfully and provide accurate profile and job data.
            Employers are responsible for lawful job postings; candidates are responsible for truthful applications.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            We may suspend accounts that violate policies, abuse the platform, or engage in fraudulent activity.
            Service availability may change as we improve features. Continued use indicates acceptance of updates to
            these terms.
          </p>
        </section>
      </main>
    </>
  );
}
