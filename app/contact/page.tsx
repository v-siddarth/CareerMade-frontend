import Navbar from "@/app/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-gray-700">
            Need help with your account, jobs, employer onboarding, or billing? Reach out to us.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Support</h2>
              <p className="mt-2 text-sm text-gray-600">Email: support@careermade.com</p>
              <p className="mt-1 text-sm text-gray-600">Response time: within 1 business day</p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Business</h2>
              <p className="mt-2 text-sm text-gray-600">Email: partnerships@careermade.com</p>
              <p className="mt-1 text-sm text-gray-600">Mon-Fri, 10:00 AM to 6:00 PM IST</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
