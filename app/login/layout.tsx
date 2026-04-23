import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Sign In to Your Account",
  description:
    "Sign in to your CareerMed account to browse healthcare jobs, manage applications, and connect with verified medical employers across India.",
  openGraph: {
    title: "Login to CareerMed — Healthcare Job Platform",
    description:
      "Access your CareerMed dashboard. Browse doctor, nurse, and technician jobs at top hospitals in India.",
    url: "https://www.careermed.in/login",
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
