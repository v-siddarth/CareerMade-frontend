import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — Reset Your Account Password",
  description:
    "Reset your CareerMed account password securely. Enter your email to receive a password reset link.",
  openGraph: {
    title: "Reset Password — CareerMed",
    description:
      "Forgot your CareerMed password? Reset it securely and get back to browsing healthcare jobs.",
    url: "https://www.careermed.in/forgot-password",
  },
  alternates: {
    canonical: "/forgot-password",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
