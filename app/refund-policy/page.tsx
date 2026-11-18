import FooterPageShell from "@/app/components/FooterPageShell";
import { CircleDollarSign } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | CareerMed",
  description:
    "Review CareerMed's cancellation and refund policy for subscriptions and paid services.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <FooterPageShell
      eyebrow="Payments & subscriptions"
      title="Cancellation & Refund Policy"
      description="Clear information about cancellations, refund eligibility, and how we review requests."
      updated="April 21, 2026"
      icon={CircleDollarSign}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
          <p>
            Thank you for choosing CareerMed, operated by Lifemate Healthcare Pvt Ltd. We strive to
            provide the best healthcare recruitment platform. Please read our cancellation and
            refund policy carefully.
          </p>
          <h3>1. Subscription Cancellations</h3>
          <p>
            You can cancel your subscription at any time. When you cancel a subscription, you will
            continue to have access to your premium features until the end of your current billing
            cycle. To cancel your subscription:
          </p>
          <ul>
            <li>Log in to your Employer Dashboard.</li>
            <li>Navigate to the &quot;Pricing &amp; Billing&quot; section.</li>
            <li>Click on &quot;Cancel Subscription&quot; and follow the prompts.</li>
          </ul>
          <p>Your cancellation will take effect at the end of the current paid term.</p>
          <h3>2. Refund Eligibility</h3>
          <p>
            Because CareerMed provides immediate access to digital services, applicant databases,
            and premium job posting features upon payment,{" "}
            <strong>
              we generally do not offer refunds for partial-month usage or unused portions of a
              subscription.
            </strong>
          </p>
          <p>However, refunds may be granted in the following exceptional circumstances:</p>
          <ul>
            <li>
              <strong>Duplicate Billing:</strong> If you are accidentally charged twice for the same
              billing cycle due to a technical error.
            </li>
            <li>
              <strong>Service Unavailability:</strong> If the CareerMed platform is entirely
              inaccessible for an extended period (exceeding 48 hours) preventing you from utilizing
              the paid services.
            </li>
          </ul>
          <h3>3. How to Request a Refund</h3>
          <p>
            If you believe you are eligible for a refund based on the criteria above, please contact
            our support team within 7 days of the billing event.
          </p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:support@careermed.in">support@careermed.in</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+918806506455">+91 88065 06455</a>
            </li>
          </ul>
          <p>
            Please include your account email address, transaction ID, and the reason for your
            refund request. Our team will review your request and respond within 3-5 business days.
            If approved, the refund will be processed back to the original payment method (via
            Razorpay) within 5-7 business days.
          </p>
          <h3>4. Changes to this Policy</h3>
          <p>
            We reserve the right to modify this Cancellation and Refund Policy at any time. Any
            changes will be posted on this page with an updated revision date.
          </p>
        </div>
      </article>
    </FooterPageShell>
  );
}
