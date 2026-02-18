import Navbar from "@/app/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-6 text-sm leading-7 text-gray-700">
            CareerMade collects and processes account data, profile information, job applications, and platform usage
            information to operate core services. We use reasonable security safeguards and do not sell personal data.
            Data may be shared with employers when you apply for jobs and with service providers that help us deliver
            the platform.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            You can request account updates or deletion by contacting support. By using CareerMade, you consent to this
            policy and related processing required to provide hiring and recruitment services.
          </p>
        </section>
      </main>
    </>
  );
}
