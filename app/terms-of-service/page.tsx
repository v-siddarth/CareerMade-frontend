import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | CareerMed",
  description:
    "Review CareerMed's terms of service. Understand the rules for using our healthcare job platform as a job seeker or employer.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm sm:p-12 lg:p-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: April 21, 2026</p>

          <div className="prose prose-blue mt-8 max-w-none text-gray-700">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CareerMed website operated by Lifemate Healthcare Pvt Ltd.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">1. Acceptance of Terms</h3>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">2. Platform Usage</h3>
            <ul className="list-disc pl-5">
              <li><strong>Job Seekers:</strong> You agree to provide accurate, current, and complete information regarding your qualifications and work history. You must not apply for roles for which you are intentionally unqualified.</li>
              <li><strong>Employers:</strong> You are responsible for the accuracy of your job postings. You agree not to post fake, discriminatory, or unlawful jobs. You agree to use candidate data solely for the purpose of recruitment.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">3. Subscriptions and Payments</h3>
            <p>
              Certain features (like Employer job postings) require a paid subscription.
            </p>
            <ul className="list-disc pl-5">
              <li>Payments are processed securely via our payment gateway partner, Razorpay.</li>
              <li>By subscribing, you agree to pay the fees associated with your chosen plan.</li>
              <li>Subscriptions may automatically renew unless cancelled prior to the end of the current billing cycle.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">4. Termination</h3>
            <p>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">5. Limitation of Liability</h3>
            <p>
              CareerMed acts as a facilitator between job seekers and employers. We do not guarantee employment, nor do we guarantee the quality of candidates. Lifemate Healthcare Pvt Ltd shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the Service.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">6. Governing Law</h3>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">7. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at <strong>support@careermed.in</strong>.</p>
          </div>
        </section>
      </main>
    </>
  );
}
