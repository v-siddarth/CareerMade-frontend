export const HEALTHCARE_TITLES = [
  "Doctor",
  "Nurse",
  "Technician",
  "Pharmacy",
  "Support",
  "Admin",
  "Insurance",
  "Marketing",
  "Other",
] as const;

export type HealthcareTitle = (typeof HEALTHCARE_TITLES)[number];

export const TITLE_SPECIALIZATION_OPTIONS: Record<HealthcareTitle, string[]> = {
  Doctor: ["Specialist", "Super specialist", "Medicine officer", "RMO", "Other"],
  Nurse: ["ANM", "GNM", "BSc Nursing", "Other"],
  Technician: ["Cathlab", "Dialysis", "Operation theatre", "Laboratory", "Endoscopy", "X-ray", "CT/MRI", "Other"],
  Pharmacy: ["D. Pharma", "B. Pharma", "Other"],
  Support: ["Ward assistant", "OT assistant", "House keeping", "Security", "Accounting", "Other"],
  Admin: ["Hospital administration", "Operations", "HR", "Finance", "Other"],
  Insurance: ["Claims", "TPA operations", "Underwriting", "Customer support", "Other"],
  Marketing: ["Digital marketing", "Field marketing", "Branding", "Sales", "Other"],
  Other: ["Other"],
};

export const TITLE_FIELD_OPTIONS: Record<HealthcareTitle, Record<string, string[]>> = {
  Doctor: {
    Specialist: [
      "General Medicine",
      "Pediatrics",
      "General Surgery",
      "Obstetrics & Gynecology",
      "Orthopedics",
      "ENT",
      "Ophthalmology",
      "Dermatology",
      "Psychiatry",
      "Anesthesiology",
      "Radiology",
      "Pathology",
      "Emergency Medicine",
      "Pulmonology",
      "Other",
    ],
    "Super specialist": [
      "Cardiology",
      "Neurology",
      "Nephrology",
      "Gastroenterology",
      "Endocrinology",
      "Medical Oncology",
      "Surgical Oncology",
      "Urology",
      "Neurosurgery",
      "Cardiothoracic Surgery",
      "Plastic Surgery",
      "Pediatric Surgery",
      "Rheumatology",
      "Clinical Hematology",
      "Critical Care Medicine",
      "Other",
    ],
    "Medicine officer": [
      "General Duty Medical Officer",
      "Casualty Medical Officer",
      "ICU Medical Officer",
      "Public Health Medical Officer",
      "Occupational Health Medical Officer",
      "Community Health Medical Officer",
      "Medical Officer (TB/IDSP/NHM)",
      "Insurance Medical Officer",
      "Other",
    ],
    RMO: ["Emergency RMO", "ICU RMO", "Ward RMO", "Night Duty RMO", "Trauma RMO", "OPD RMO", "OT RMO", "Other"],
    Other: ["Other"],
  },
  Nurse: {
    ANM: ["Community Health Nurse", "Maternal Care Nurse", "Vaccination Nurse", "Other"],
    GNM: ["Ward Nurse", "ICU Nurse", "Operation Theatre Nurse", "Emergency Nurse", "Other"],
    "BSc Nursing": ["Clinical Nurse", "Nurse Educator", "Critical Care Nurse", "Nurse Supervisor", "Other"],
    Other: ["Other"],
  },
  Technician: {
    Cathlab: ["Cath Lab Technician", "Other"],
    Dialysis: ["Dialysis Technician", "Other"],
    "Operation theatre": ["OT Technician", "Anesthesia Technician", "Other"],
    Laboratory: ["Lab Technician", "Phlebotomy Technician", "Other"],
    Endoscopy: ["Endoscopy Technician", "Other"],
    "X-ray": ["X-ray Technician", "Other"],
    "CT/MRI": ["CT Technician", "MRI Technician", "Other"],
    Other: ["Other"],
  },
  Pharmacy: {
    "D. Pharma": ["Staff Pharmacist", "Dispensing Pharmacist", "Other"],
    "B. Pharma": ["Clinical Pharmacist", "Hospital Pharmacist", "Inventory Pharmacist", "Other"],
    Other: ["Other"],
  },
  Support: {
    "Ward assistant": ["Patient Care Assistant", "Ward Boy / Aya", "Other"],
    "OT assistant": ["OT Assistant", "Sterilization Assistant", "Other"],
    "House keeping": ["Housekeeping Executive", "Infection Control Housekeeping", "Other"],
    Security: ["Hospital Security Guard", "Security Supervisor", "Other"],
    Accounting: ["Billing Executive", "Accounts Assistant", "Other"],
    Other: ["Other"],
  },
  Admin: {
    "Hospital administration": ["Hospital Administrator", "Front Office Manager", "Other"],
    Operations: ["Operations Executive", "Facility Manager", "Other"],
    HR: ["HR Executive", "Talent Acquisition", "Other"],
    Finance: ["Finance Executive", "Medical Billing Officer", "Other"],
    Other: ["Other"],
  },
  Insurance: {
    Claims: ["Claims Processing Officer", "Claims Auditor", "Other"],
    "TPA operations": ["TPA Coordinator", "Insurance Desk Officer", "Other"],
    Underwriting: ["Medical Underwriter", "Risk Analyst", "Other"],
    "Customer support": ["Insurance Support Executive", "Policy Support Officer", "Other"],
    Other: ["Other"],
  },
  Marketing: {
    "Digital marketing": ["Digital Marketing Executive", "Performance Marketer", "Other"],
    "Field marketing": ["Field Marketing Executive", "Hospital Outreach Executive", "Other"],
    Branding: ["Brand Manager", "Communications Executive", "Other"],
    Sales: ["Medical Sales Representative", "Business Development Executive", "Other"],
    Other: ["Other"],
  },
  Other: {
    Other: ["Other"],
  },
};

export const TITLE_DEGREE_OPTIONS: Record<HealthcareTitle, string[]> = {
  Doctor: [
    "MBBS",
    "MD",
    "MS",
    "DNB",
    "DM",
    "MCh",
    "BAMS",
    "BHMS",
    "BUMS",
    "Unani",
    "BDS",
    "MDS",
    "Fellowship",
    "FRCS",
    "MRCS",
    "Diploma",
    "Certificate",
    "Other",
  ],
  Nurse: ["ANM", "GNM", "BSc Nursing", "Post Basic BSc Nursing", "MSc Nursing", "Diploma", "Certificate", "Other"],
  Technician: [
    "DMLT",
    "BMLT",
    "BPT",
    "MPT",
    "Diploma in OT Technician",
    "Diploma in Radiology Imaging",
    "Diploma in Dialysis Technician",
    "BSc",
    "Diploma",
    "Certificate",
    "Other",
  ],
  Pharmacy: ["D.Pharm", "B.Pharm", "M.Pharm", "Pharm.D", "Diploma", "Certificate", "Other"],
  Support: ["Certificate", "Diploma", "BSc", "BPT", "Other"],
  Admin: ["BBA", "MBA", "MHA", "PG Diploma", "BCom", "Other"],
  Insurance: ["BCom", "BBA", "MBA", "PG Diploma", "IRDA Certification", "Other"],
  Marketing: ["BBA", "MBA", "PG Diploma", "Other"],
  Other: ["Certificate", "Diploma", "BSc", "MSc", "PhD", "BPT", "MPT", "Other"],
};

export const ALL_JOBSEEKER_DEGREES = [
  "MBBS",
  "MD",
  "MS",
  "DNB",
  "DM",
  "MCh",
  "BAMS",
  "BHMS",
  "BUMS",
  "Unani",
  "BDS",
  "MDS",
  "Fellowship",
  "FRCS",
  "MRCS",
  "BPT",
  "MPT",
  "ANM",
  "GNM",
  "BSc Nursing",
  "Post Basic BSc Nursing",
  "MSc Nursing",
  "DMLT",
  "BMLT",
  "Diploma in OT Technician",
  "Diploma in Radiology Imaging",
  "Diploma in Dialysis Technician",
  "D.Pharm",
  "B.Pharm",
  "M.Pharm",
  "Pharm.D",
  "BBA",
  "MBA",
  "MHA",
  "PG Diploma",
  "BCom",
  "IRDA Certification",
  "BSc",
  "MSc",
  "PhD",
  "Diploma",
  "Certificate",
  "Other",
] as const;

export const GENERIC_SCREENING_QUESTIONS = [
  "Can you join within 30 days?",
  "Are you willing to work rotational shifts?",
  "Do you have relevant healthcare experience for this role?",
  "Are you comfortable with weekend/on-call duty when required?",
  "Do you hold all required registration/licensing documents?",
] as const;

export const SCREENING_QUESTIONS_BY_TITLE: Record<HealthcareTitle, string[]> = {
  Doctor: [
    "Do you have valid medical council registration?",
    "Have you handled ICU/emergency cases independently?",
    "Are you comfortable with OPD and IPD responsibilities?",
  ],
  Nurse: [
    "Do you have valid nursing council registration?",
    "Do you have experience in ICU/OT/Ward nursing?",
    "Can you administer medications as per protocol?",
  ],
  Technician: [
    "Do you have hands-on experience with relevant equipment for this role?",
    "Are you certified for this technician role?",
    "Can you handle night shifts in diagnostics/support services?",
  ],
  Pharmacy: [
    "Do you hold a valid pharmacy registration license?",
    "Do you have experience with hospital pharmacy software?",
    "Can you manage controlled-drug inventory and documentation?",
  ],
  Support: [
    "Do you have prior hospital support staff experience?",
    "Are you comfortable with patient-facing support tasks?",
    "Can you work in hygiene-sensitive clinical areas?",
  ],
  Admin: [
    "Do you have prior hospital administration experience?",
    "Have you managed compliance, operations, or billing workflows?",
    "Can you coordinate across clinical and non-clinical teams?",
  ],
  Insurance: [
    "Do you have experience in claims/TPA processing?",
    "Are you familiar with pre-authorization and discharge approvals?",
    "Can you coordinate with insurers and hospital billing teams?",
  ],
  Marketing: [
    "Do you have healthcare/hospital marketing experience?",
    "Have you handled doctor outreach or referral programs?",
    "Can you manage digital campaigns and lead tracking?",
  ],
  Other: ["Do you have relevant experience for this role?"],
};

export const normalizeText = (value?: string) => (value || "").toLowerCase().trim();

export const inferHealthcareTitle = (job: { title?: string; specialization?: string }) => {
  const title = normalizeText(job.title);
  const specialization = normalizeText(job.specialization);
  const text = `${title} ${specialization}`;

  if (/(doctor|dr\.|consultant|surgeon|physician|medical officer|resident|registrar|rmo)/.test(text)) return "Doctor";
  if (/(nurse|nursing|anm|gnm)/.test(text)) return "Nurse";
  if (/(technician|technologist|lab tech|x-ray|radiology tech|ct|mri|dialysis|cath lab|ot tech)/.test(text)) return "Technician";
  if (/(pharmacist|pharmacy)/.test(text)) return "Pharmacy";
  if (/(assistant|housekeeping|security|ward|attendant)/.test(text)) return "Support";
  if (/(admin|administrator|hr|human resources|operations|finance|billing)/.test(text)) return "Admin";
  if (/(insurance|claims|tpa|underwriting)/.test(text)) return "Insurance";
  if (/(marketing|sales|business development|brand)/.test(text)) return "Marketing";

  for (const titleKey of HEALTHCARE_TITLES) {
    const specializations = TITLE_SPECIALIZATION_OPTIONS[titleKey];
    if (specializations.some((s) => normalizeText(s) === specialization)) {
      return titleKey;
    }
  }

  return "Other";
};

export const inferHealthcareSpecialization = (
  job: { title?: string; specialization?: string },
  title: HealthcareTitle
) => {
  const specialization = normalizeText(job.specialization);
  const allowed = TITLE_SPECIALIZATION_OPTIONS[title] || ["Other"];

  const exact = allowed.find((item) => normalizeText(item) === specialization);
  if (exact) return exact;

  const byField = Object.entries(TITLE_FIELD_OPTIONS[title] || {}).find(
    ([, fields]) => fields.some((field) => normalizeText(field) === specialization)
  );
  if (byField?.[0]) return byField[0];

  return "Other";
};

export const inferHealthcareField = (
  job: { title?: string; specialization?: string },
  title: HealthcareTitle,
  specialization: string
) => {
  const current = normalizeText(job.specialization);
  const options = TITLE_FIELD_OPTIONS[title]?.[specialization] || ["Other"];
  const exact = options.find((field) => normalizeText(field) === current);
  return exact || "Other";
};

export const getSpecializationOptions = (title: HealthcareTitle | "") => {
  if (!title) return [];
  return TITLE_SPECIALIZATION_OPTIONS[title] || [];
};

export const getFieldOptions = (title: HealthcareTitle | "", specialization: string) => {
  if (!title || !specialization) return [];
  return TITLE_FIELD_OPTIONS[title]?.[specialization] || ["Other"];
};

export const getDegreeOptions = (title: HealthcareTitle | "", specialization: string) => {
  if (!title) return [];

  const options = new Set(TITLE_DEGREE_OPTIONS[title] || []);

  if (title === "Doctor") {
    if (specialization === "Super specialist") {
      options.add("DM");
      options.add("MCh");
      options.add("DNB");
      options.add("Fellowship");
    }
    if (specialization === "Specialist") {
      options.add("MD");
      options.add("MS");
      options.add("DNB");
      options.add("Diploma");
    }
  }

  return Array.from(options);
};

export const getScreeningQuestionPresets = (title: HealthcareTitle | "") => {
  if (!title) return [...GENERIC_SCREENING_QUESTIONS];
  return [...GENERIC_SCREENING_QUESTIONS, ...(SCREENING_QUESTIONS_BY_TITLE[title] || [])];
};

export const JOB_SPECIALIZATION_ENUM = Array.from(
  new Set(
    HEALTHCARE_TITLES.flatMap((title) => [
      ...TITLE_SPECIALIZATION_OPTIONS[title],
      ...Object.values(TITLE_FIELD_OPTIONS[title]).flat(),
    ])
  )
).sort();
