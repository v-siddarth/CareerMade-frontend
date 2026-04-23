import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CareerMed",
  description:
    "Read CareerMed's privacy policy. Learn how we collect, process, and protect your personal data on our healthcare job platform.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-16">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm sm:p-12 lg:p-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last Updated: April 21, 2026</p>

          <div className="prose prose-blue mt-8 max-w-none text-gray-700">
            <p>
              Lifemate Healthcare Pvt Ltd ("us", "we", or "our") operates the CareerMed platform (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">1. Information We Collect</h3>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you:</p>
            <ul className="list-disc pl-5">
              <li><strong>Personal Data:</strong> Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
              <li><strong>Professional Data:</strong> Resumes, employment history, education, medical council registration details, and other job-related information.</li>
              <li><strong>Usage Data:</strong> Information on how the Service is accessed and used (e.g., your computer's Internet Protocol address, browser type, pages visited).</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">2. Payment Information</h3>
            <p>
              We use Razorpay as our payment gateway. We do not store your full credit/debit card details or UPI PIN on our servers. Your payment information is securely processed by Razorpay in compliance with the Payment Card Industry Data Security Standard (PCI-DSS). We only store payment confirmation receipts and subscription status to grant you access to premium features.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">3. Use of Data</h3>
            <p>CareerMed uses the collected data for various purposes:</p>
            <ul className="list-disc pl-5">
              <li>To provide and maintain the Service (e.g., matching job seekers with employers).</li>
              <li>To notify you about changes to our Service.</li>
              <li>To provide customer care and support.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To monitor the usage of the Service and detect technical issues.</li>
            </ul>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">4. Sharing of Data</h3>
            <p>
              If you are a job seeker, your profile and resume data will be shared with employers when you apply for a job or if you make your profile public. We do not sell your personal data to third-party marketers. We may disclose your data in good faith if required by law or to protect the rights and safety of Lifemate Healthcare Pvt Ltd.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">5. Security of Data</h3>
            <p>
              The security of your data is important to us. We implement industry-standard security measures to protect your data. However, remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">6. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-none pl-0">
              <li><strong>Email:</strong> support@careermed.in</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>Entity:</strong> Lifemate Healthcare Pvt Ltd</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
