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

            <h3 className="mt-8 text-xl font-semibold text-gray-900">7. Additional Policies & User Consent</h3>
            <div className="space-y-4">
              <p className="mb-4">
                Please click on each document below to read our full policies, terms, and agreements:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {[
                  "Candidate Agreement.pdf",
                  "Candidate Declaration.pdf",
                  "Corporate Hospital Annual Subscription Agreement.pdf",
                  "Credential Verification Consent.pdf",
                  "Doctor and Nurse Verification.pdf",
                  "Employer Agreement.pdf",
                  "Employer Registration Form.pdf",
                  "Employer Service Level Policy.pdf",
                  "Employer Subscription Agreement.pdf",
                  "Grievance Redressal Policy.pdf",
                  "Healthcare Recruitment Portal Disclaimer.pdf",
                  "Job Posting Declaration.pdf",
                  "Medical Registration Disclaimer.pdf",
                  "Privacy Policy.pdf",
                  "Recruitment Assignment Request.pdf",
                  "Recruitment Services Agreement.pdf",
                  "Resume Database Access Agreement.pdf",
                  "SUCCESS FEE AGREEMENT.pdf",
                  "Terms and Conditions.pdf"
                ].map((doc, index) => (
                  <a 
                    key={index} 
                    href={`/documents/${doc}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors no-underline"
                  >
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span className="font-medium text-gray-800 line-clamp-1" title={doc.replace(".pdf", "")}>
                      {doc.replace(".pdf", "")}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-gray-900">8. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at <strong>support@careermed.in</strong>.</p>
          </div>
        </section>
      </main>
    </>
  );
}
