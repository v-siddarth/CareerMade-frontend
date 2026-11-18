import FooterPageShell from "@/app/components/FooterPageShell";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | CareerMed",
  description:
    "Review CareerMed's terms of service. Understand the rules for using our healthcare job platform as a job seeker or employer.",
  alternates: { canonical: "/terms-of-service" },
};

const documents = [
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
  "Terms and Conditions.pdf",
];

export default function TermsOfServicePage() {
  return (
    <FooterPageShell
      eyebrow="Legal information"
      title="Terms of Service"
      description="The rules and responsibilities that help keep CareerMed a trusted healthcare hiring platform."
      updated="April 21, 2026"
      icon={FileText}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
          <p>
            Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;)
            carefully before using the CareerMed website operated by Lifemate Healthcare Pvt Ltd.
          </p>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree
            with any part of the terms, then you may not access the Service.
          </p>
          <h3>2. Platform Usage</h3>
          <ul>
            <li>
              <strong>Job Seekers:</strong> You agree to provide accurate, current, and complete
              information regarding your qualifications and work history. You must not apply for
              roles for which you are intentionally unqualified.
            </li>
            <li>
              <strong>Employers:</strong> You are responsible for the accuracy of your job postings.
              You agree not to post fake, discriminatory, or unlawful jobs. You agree to use
              candidate data solely for the purpose of recruitment.
            </li>
          </ul>
          <h3>3. Subscriptions and Payments</h3>
          <p>Certain features (like Employer job postings) require a paid subscription.</p>
          <ul>
            <li>Payments are processed securely via our payment gateway partner, Razorpay.</li>
            <li>By subscribing, you agree to pay the fees associated with your chosen plan.</li>
            <li>
              Subscriptions may automatically renew unless cancelled prior to the end of the current
              billing cycle.
            </li>
          </ul>
          <h3>4. Termination</h3>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the
            Terms. All provisions of the Terms which by their nature should survive termination
            shall survive.
          </p>
          <h3>5. Limitation of Liability</h3>
          <p>
            CareerMed acts as a facilitator between job seekers and employers. We do not guarantee
            employment, nor do we guarantee the quality of candidates. Lifemate Healthcare Pvt Ltd
            shall not be liable for any indirect, incidental, special, consequential or punitive
            damages resulting from your access to or use of the Service.
          </p>
          <h3>6. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India,
            without regard to its conflict of law provisions. Our failure to enforce any right or
            provision of these Terms will not be considered a waiver of those rights.
          </p>
          <h3>7. Additional Policies &amp; User Consent</h3>
          <p>
            Please click on each document below to read our full policies, terms, and agreements:
          </p>
          <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {documents.map((doc) => (
              <a
                key={doc}
                href={`/documents/${doc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 no-underline transition hover:border-blue-200 hover:bg-blue-50"
              >
                <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <span
                  className="font-medium text-slate-800 group-hover:text-blue-700"
                  title={doc.replace(".pdf", "")}
                >
                  {doc.replace(".pdf", "")}
                </span>
              </a>
            ))}
          </div>
          <h3>8. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:support@careermed.in">support@careermed.in</a>.
          </p>
        </div>
      </article>
    </FooterPageShell>
  );
}
