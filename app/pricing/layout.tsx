import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans — Employer & Job Seeker Subscriptions",
  description:
    "Explore CareerMed's flexible pricing plans for healthcare employers and job seekers. Post unlimited jobs, access premium features, and hire the best medical talent.",
  openGraph: {
    title: "CareerMed Pricing — Affordable Healthcare Recruitment Plans",
    description:
      "Choose from Free, Basic, Premium, and Enterprise plans. Post jobs, hire verified healthcare professionals, and grow your medical team.",
    url: "https://www.careermed.in/pricing",
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
