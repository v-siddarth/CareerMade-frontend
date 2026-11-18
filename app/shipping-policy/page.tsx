import FooterPageShell from "@/app/components/FooterPageShell";
import { PackageCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | CareerMed",
  description: "Learn how CareerMed delivers digital subscriptions and services.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <FooterPageShell
      eyebrow="Digital service delivery"
      title="Shipping & Delivery Policy"
      description="How CareerMed activates subscriptions and delivers platform services after payment."
      updated="April 21, 2026"
      icon={PackageCheck}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
          <p>
            CareerMed, operated by Lifemate Healthcare Pvt Ltd, is a digital SaaS (Software as a
            Service) platform and job portal.
          </p>
          <h3>Digital Delivery</h3>
          <p>
            We do not sell physical goods. Therefore,{" "}
            <strong>no physical shipping or delivery is involved</strong> when you purchase a
            subscription or service on our platform.
          </p>
          <h3>Activation of Services</h3>
          <p>
            Upon successful payment processing via our payment gateway (Razorpay), your purchased
            digital services, subscription plans, or premium features are activated immediately and
            automatically on your account.
          </p>
          <p>
            You will receive an email confirmation containing the details of your transaction and
            your service access. You can instantly access the features by logging into your
            CareerMed Dashboard.
          </p>
          <h3>Contact Us</h3>
          <p>
            If you experience any issues with the activation of your digital services after payment,
            please contact our support team immediately:
          </p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:support@careermed.in">support@careermed.in</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+918806506455">+91 88065 06455</a>
            </li>
          </ul>
        </div>
      </article>
    </FooterPageShell>
  );
}
