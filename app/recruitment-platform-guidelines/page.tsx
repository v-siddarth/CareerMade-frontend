import FooterPageShell from "@/app/components/FooterPageShell";
import { Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruitment & Platform Guidelines | CareerMed",
  description:
    "Standards for candidates, employers and all CareerMed users participating in healthcare recruitment.",
  alternates: { canonical: "/recruitment-platform-guidelines" },
};

const sections = [
  [
    "For Job Seekers",
    [
      "Keep identity, qualifications, registration, experience and profile information accurate, complete and current.",
      "Do not use another person's identity or documents, submit forged or misleading records, conceal material restrictions where disclosure is required, or create duplicate or deceptive accounts.",
      "Apply responsibly, communicate respectfully and protect your account credentials and personal documents.",
      "CareerMed does not authorise anyone to demand money in exchange for an interview, selection, appointment letter or guaranteed job. Independently verify employers, offers, work location, compensation and terms before accepting an opportunity.",
    ],
  ],
  [
    "For Employers and Recruiters",
    [
      "Register and post vacancies only when authorised to represent the relevant organisation. Keep vacancy details genuine, current and sufficiently clear for candidates to assess the opportunity.",
      "Use candidate information solely for legitimate recruitment purposes. Restrict access to authorised personnel, protect it appropriately, do not sell or misuse it, and delete or anonymise it when no longer required, subject to lawful retention.",
      "Treat candidates fairly and professionally. Do not use harassment, coercion, fraudulent promises, unlawful discrimination or undisclosed demands for money.",
      "Employers are solely responsible for selection, offers, remuneration, workplace conditions, professional credentialing, clinical duties, patient safety and all other employment or engagement decisions.",
    ],
  ],
  [
    "Healthcare-Specific Requirements",
    [
      "Healthcare employers must independently verify identity, qualifications, registrations, licences, experience and eligibility for regulated roles. CareerMed verification does not replace credentialing, privileging, reference checks or statutory obligations.",
      "CareerMed does not assign clinical duties, grant hospital privileges, supervise clinical practice or control patient care. The employing organisation remains responsible for clinical governance, scope of practice, supervision, safety and legal compliance.",
    ],
  ],
  [
    "Platform Integrity",
    [
      "Users must not create fake or impersonation accounts, upload unlawful or misleading content, harass other users, introduce malicious code, scrape data, bypass access controls, use unauthorised automation or misuse the Platform for unlawful activity.",
      "CareerMed may investigate suspected violations and take proportionate action, including requesting clarification, restricting content or features, suspending verification, terminating access, preserving records or cooperating with lawful authorities.",
    ],
  ],
  [
    "Independent Verification and Liability",
    [
      "CareerMed facilitates connections and recruitment-related interactions. It does not guarantee employment, candidate suitability, employer suitability, salary, job availability, successful hiring or any particular outcome. Candidates and employers must independently verify all material information before entering an employment or professional engagement.",
    ],
  ],
];

export default function RecruitmentPlatformGuidelinesPage() {
  return (
    <FooterPageShell
      eyebrow="Platform standards"
      title="Recruitment & Platform Guidelines"
      description="Standards for candidates, employers and everyone using CareerMed for professional healthcare opportunities."
      icon={Scale}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600">
          <p>
            These Guidelines form part of the CareerMed Terms of Service and Privacy Policy. They
            set out conduct, recruitment, privacy, verification and platform-integrity standards for
            all users. They do not create an employment, agency, partnership, fiduciary,
            clinical-supervision or placement relationship between CareerMed and a candidate or
            employer.
          </p>
          {sections.map(([heading, points]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <ul>
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
          <h3>Reporting Misconduct</h3>
          <p>
            Report fake vacancies, fraudulent profiles, forged qualifications, harassment,
            suspicious payment requests, data misuse, impersonation or security concerns to{" "}
            <a href="mailto:support@careermed.in?subject=CareerMed%20Report%20Abuse">
              support@careermed.in
            </a>
            . Include the relevant profile, vacancy or account details, but never send passwords,
            OTPs or unnecessary sensitive documents.
          </p>
          <h3>Governing Law</h3>
          <p>
            These Guidelines are governed by the laws of India. Subject to mandatory statutory
            remedies, courts at Pune, Maharashtra have exclusive jurisdiction over disputes arising
            from or relating to these Guidelines.
          </p>
        </div>
      </article>
    </FooterPageShell>
  );
}
