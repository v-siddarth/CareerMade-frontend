import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | CareerMed",
  description:
    "Read CareerMed's Cancellation and Refund Policy. Understand our terms for subscription cancellations and refund eligibility.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
