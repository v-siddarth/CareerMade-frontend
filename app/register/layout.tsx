import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — Create Your Free Account",
  description:
    "Join CareerMed for free. Create your healthcare professional or employer account to access verified medical job opportunities across India.",
  openGraph: {
    title: "Register on CareerMed — Start Your Healthcare Career",
    description:
      "Create a free account on India's top healthcare job platform. Find doctor, nurse, and medical jobs at verified hospitals.",
    url: "https://www.careermed.in/register",
  },
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
