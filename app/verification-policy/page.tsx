import FooterPageShell from "@/app/components/FooterPageShell";
import { BadgeCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Policy | CareerMed",
  description:
    "Learn how CareerMed reviews and displays verification information for healthcare candidates and employers.",
  alternates: { canonical: "/verification-policy" },
};

const sections = [
  [
    "1. Purpose of Verification",
    "CareerMed may review selected information, documents or particulars to promote transparency in healthcare recruitment. Verification is a limited risk-mitigation process; it does not replace independent due diligence, statutory checks, professional scrutiny or an employer's recruitment procedures.",
  ],
  [
    "2. Verification Principle",
    "Where reasonably practicable, CareerMed will communicate what was checked, how the check was undertaken and when it was completed or last updated. A verification indicator relates only to the item or category stated. Verification of one part of a profile does not mean every profile detail has been checked.",
  ],
  [
    "3. Verification Categories",
    "CareerMed may offer identity, professional registration, education or qualification, experience, document and employer verification. The exact scope depends on the available evidence, source, method and process at the time of verification. A document review may establish only that a document appears facially consistent; it does not automatically confirm every statement within it.",
  ],
  [
    "4. Verification Date and Status",
    "Where appropriate, CareerMed may display the date or approximate period of a completed check. Information can change after a verification. Statuses may include Verified, Pending Verification, Verification Required, Unable to Verify, Verification Expired and Verification Withdrawn. A pending, unavailable or withdrawn status is not, by itself, a finding of fraud or misconduct.",
  ],
  [
    "5. Verification Is Not Certification",
    "A CareerMed verification badge is not a guarantee of competence, clinical skill, character, conduct, continued registration, employer quality, workplace safety or suitability. It is not a professional licence, government accreditation, statutory approval or CareerMed endorsement.",
  ],
  [
    "6. Professional Licensing and Employer Responsibility",
    "Healthcare professionals remain responsible for obtaining and maintaining every required registration, licence, permit and authorisation. Employers must independently determine a candidate's eligibility, qualifications, competence and fitness for the specific role, and must not rely exclusively on a CareerMed profile, document, badge or verification status.",
  ],
  [
    "7. Verification Sources",
    "Depending on the category and availability of information, CareerMed may rely on official registries, educational institutions, employers, user-submitted documents, authorised verification agencies and lawfully accessible public records. A check may be unavailable where source information is inaccessible, incomplete or unreliable.",
  ],
  [
    "8. Document Fraud and Change in Status",
    "Where CareerMed reasonably suspects forgery, impersonation, material misrepresentation or other fraud, it may request clarification, restrict the disputed information, suspend or withdraw an indicator, limit account functionality or take other proportionate action permitted by law. Users must promptly update material changes that affect previously submitted or verified information.",
  ],
  [
    "9. Expiry, Removal and Disputes",
    "Some verification statuses may be time-limited or require renewal. CareerMed may suspend, amend or remove an indicator when new information contradicts it, source records change, a verification expires, or an integrity or legal requirement applies. Users may submit a written request with the relevant category, profile or document details and supporting information if they believe a displayed status is incorrect.",
  ],
  [
    "10. No Guarantee",
    "Verification is based on information, access and methods reasonably available at the time of the check. CareerMed does not warrant that verification will detect every fraud, establish every fact, guarantee suitability or prevent every loss or dispute. Users must exercise independent judgement and conduct checks appropriate to their circumstances.",
  ],
];

export default function VerificationPolicyPage() {
  return (
    <FooterPageShell
      eyebrow="Trust & verification"
      title="Verification Policy"
      description="How CareerMed may review information while keeping responsibility for hiring and professional decisions with users and employers."
      icon={BadgeCheck}
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-10 lg:p-12">
        <div className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-blue-600">
          <p>
            This Verification Policy describes the broad principles under which CareerMed, operated
            by Lifemate Healthcare Private Limited, may review, check or verify information relating
            to candidates, employers and other Platform users.
          </p>
          {sections.map(([heading, copy]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <p>{copy}</p>
            </section>
          ))}
          <h3>Contact</h3>
          <p>
            For verification-related queries, correction requests or disputes, email{" "}
            <a href="mailto:support@careermed.in?subject=CareerMed%20Verification%20Request">
              support@careermed.in
            </a>{" "}
            with your registered account details and the relevant verification category or reference
            number. Do not send passwords, OTPs, UPI PINs or other confidential authentication
            credentials.
          </p>
        </div>
      </article>
    </FooterPageShell>
  );
}
