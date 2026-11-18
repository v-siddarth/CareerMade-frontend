import FooterPageShell from "@/app/components/FooterPageShell";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CareerMed",
  description:
    "Read CareerMed's privacy policy. Learn how we collect, process, and protect your personal data on our healthcare job platform.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <FooterPageShell
      eyebrow="Privacy & data"
      title="Privacy Policy"
      description="How CareerMed collects, uses, and protects the information entrusted to us."
      updated="April 21, 2026"
      icon={ShieldCheck}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
          <p>
            Lifemate Healthcare Pvt Ltd (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;)
            operates the CareerMed platform (the &quot;Service&quot;). This page informs you of our
            policies regarding the collection, use, and disclosure of personal data when you use our
            Service and the choices you have associated with that data.
          </p>
          <h3>1. Information We Collect</h3>
          <p>
            We collect several different types of information for various purposes to provide and
            improve our Service to you:
          </p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Email address, First name and last name, Phone number,
              Address, State, Province, ZIP/Postal code, City.
            </li>
            <li>
              <strong>Professional Data:</strong> Resumes, employment history, education, medical
              council registration details, and other job-related information.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how the Service is accessed and used
              (e.g., your computer&apos;s Internet Protocol address, browser type, pages visited).
            </li>
          </ul>
          <h3>2. Payment Information</h3>
          <p>
            We use Razorpay as our payment gateway. We do not store your full credit/debit card
            details or UPI PIN on our servers. Your payment information is securely processed by
            Razorpay in compliance with the Payment Card Industry Data Security Standard (PCI-DSS).
            We only store payment confirmation receipts and subscription status to grant you access
            to premium features.
          </p>
          <h3>3. Use of Data</h3>
          <p>CareerMed uses the collected data for various purposes:</p>
          <ul>
            <li>
              To provide and maintain the Service (e.g., matching job seekers with employers).
            </li>
            <li>To notify you about changes to our Service.</li>
            <li>To provide customer care and support.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To monitor the usage of the Service and detect technical issues.</li>
          </ul>
          <h3>4. Sharing of Data</h3>
          <p>
            If you are a job seeker, your profile and resume data will be shared with employers when
            you apply for a job or if you make your profile public. We do not sell your personal
            data to third-party marketers. We may disclose your data in good faith if required by
            law or to protect the rights and safety of Lifemate Healthcare Pvt Ltd.
          </p>
          <h3>5. Security of Data</h3>
          <p>
            The security of your data is important to us. We implement industry-standard security
            measures to protect your data. However, remember that no method of transmission over the
            Internet, or method of electronic storage is 100% secure.
          </p>
          <h3>6. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:support@careermed.in">support@careermed.in</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+918806506455">+91 88065 06455</a>
            </li>
            <li>
              <strong>Entity:</strong> Lifemate Healthcare Pvt Ltd
            </li>
          </ul>
        </div>
      </article>
    </FooterPageShell>
  );
}
