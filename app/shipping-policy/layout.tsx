import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | CareerMed",
  description:
    "Read CareerMed's Shipping and Delivery Policy. Understand our terms for digital delivery and service activation.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
