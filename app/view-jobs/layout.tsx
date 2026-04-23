import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Healthcare Jobs — Doctor, Nurse & Medical Vacancies",
  description:
    "Browse and apply to verified healthcare jobs across India. Filter by specialization, location, salary, and experience. Find doctor, nurse, technician, and medical jobs.",
  openGraph: {
    title: "Healthcare Jobs in India — Browse & Apply on CareerMed",
    description:
      "Explore thousands of verified medical job openings at top hospitals, clinics, and diagnostic centres. Apply in one click with your CareerMed profile.",
    url: "https://www.careermed.in/view-jobs",
  },
  alternates: {
    canonical: "/view-jobs",
  },
};

export default function ViewJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
