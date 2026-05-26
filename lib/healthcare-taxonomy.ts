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

const withOther = (items: string[]) => Array.from(new Set([...items, "Other"]));

export const TITLE_SPECIALIZATION_OPTIONS: Record<HealthcareTitle, string[]> = {
  Doctor: withOther([
    "Primary care",
    "Specialist",
    "Super specialist",
    "Surgical specialist",
    "Dental specialist",
    "AYUSH practitioner",
    "Medicine officer",
    "RMO",
  ]),
  Nurse: withOther([
    "ANM",
    "GNM",
    "BSc Nursing",
    "Post Basic BSc Nursing",
    "MSc Nursing",
    "Nurse Practitioner",
    "Nurse Educator",
    "Nurse Manager",
  ]),
  Technician: withOther([
    "Cardiac",
    "Cathlab",
    "Dialysis",
    "Operation theatre",
    "Laboratory",
    "Endoscopy",
    "Radiology & Imaging",
    "X-ray",
    "CT/MRI",
    "Respiratory therapy",
    "Rehabilitation",
    "Ophthalmic & Optometry",
    "Dental",
    "Blood bank",
    "CSSD",
    "Emergency",
  ]),
  Pharmacy: withOther([
    "D. Pharma",
    "B. Pharma",
    "M. Pharma",
    "Pharm.D",
    "Clinical pharmacy",
    "Hospital pharmacy",
    "Pharmaceutical operations",
  ]),
  Support: withOther([
    "Ward assistant",
    "OT assistant",
    "Patient care",
    "House keeping",
    "Security",
    "Accounting",
    "Therapy support",
    "Nutrition",
    "Counselling",
    "Home healthcare",
  ]),
  Admin: withOther([
    "Hospital administration",
    "Operations",
    "HR",
    "Finance",
    "Front office",
    "Medical records",
    "Quality & compliance",
    "IT & digital health",
    "Procurement",
  ]),
  Insurance: withOther([
    "Claims",
    "TPA operations",
    "Underwriting",
    "Customer support",
    "Pre-authorization",
    "Medical audit",
    "Revenue cycle",
  ]),
  Marketing: withOther([
    "Digital marketing",
    "Field marketing",
    "Branding",
    "Sales",
    "Doctor relations",
    "Patient acquisition",
    "Corporate partnerships",
  ]),
  Other: ["Other"],
};

export const TITLE_FIELD_OPTIONS: Record<HealthcareTitle, Record<string, string[]>> = {
  Doctor: {
    "Primary care": withOther([
      "General Physician",
      "Family Physician",
      "Primary Care Physician",
      "Preventive Medicine Physician",
      "Public Health Physician",
      "Occupational Health Physician",
      "Community Health Physician",
      "Telemedicine Physician",
      "General Duty Medical Officer",
    ]),
    Specialist: withOther([
      "Allergy & Immunology",
      "Anatomy",
      "Anesthesiology",
      "Biochemistry",
      "Community Medicine",
      "Dermatology",
      "Dermatology, Venereology & Leprosy",
      "Emergency Medicine",
      "Family Medicine",
      "Forensic Medicine",
      "Geriatric Medicine",
      "General Medicine",
      "Internal Medicine",
      "Pediatrics",
      "General Surgery",
      "Obstetrics & Gynecology",
      "Gynecology",
      "Orthopedics",
      "ENT",
      "Otorhinolaryngology",
      "Ophthalmology",
      "Psychiatry",
      "Radiology",
      "Radiodiagnosis",
      "Pathology",
      "Laboratory Medicine",
      "Microbiology",
      "Nuclear Medicine",
      "Pharmacology",
      "Physical Medicine & Rehabilitation",
      "Physiology",
      "Pulmonology",
      "Respiratory Medicine",
      "Radiation Oncology",
      "Sports Medicine",
      "Transfusion Medicine",
      "Tropical Medicine",
      "Palliative Medicine",
      "Pain Medicine",
      "Sleep Medicine",
    ]),
    "Super specialist": withOther([
      "Adult Congenital Heart Disease",
      "Advanced Heart Failure and Transplant Cardiology",
      "Cardiology",
      "Cardiovascular Disease",
      "Clinical Cardiac Electrophysiology",
      "Interventional Cardiology",
      "Critical Care Medicine",
      "Endocrinology",
      "Endocrinology, Diabetes and Metabolism",
      "Gastroenterology",
      "Hepatology",
      "Hematology",
      "Clinical Hematology",
      "Medical Oncology",
      "Nephrology",
      "Neurology",
      "Neurocritical Care",
      "Pulmonary Critical Care",
      "Rheumatology",
      "Infectious Disease",
      "Infectious Diseases",
      "Medical Genetics",
      "Clinical Genetics and Genomics",
      "Neonatology",
      "Neonatal-Perinatal Medicine",
      "Pediatric Cardiology",
      "Pediatric Critical Care Medicine",
      "Pediatric Endocrinology",
      "Pediatric Gastroenterology",
      "Pediatric Hematology-Oncology",
      "Pediatric Hospital Medicine",
      "Pediatric Infectious Diseases",
      "Pediatric Nephrology",
      "Pediatric Neurology",
      "Pediatric Pulmonology",
      "Pediatric Rheumatology",
      "Maternal-Fetal Medicine",
      "Reproductive Endocrinology and Infertility",
      "Gynecologic Oncology",
      "Urogynecology",
      "Dermatopathology",
      "Pediatric Dermatology",
      "Hematopathology",
      "Molecular Genetic Pathology",
      "Transplant Hepatology",
      "Addiction Medicine",
      "Addiction Psychiatry",
      "Child and Adolescent Psychiatry",
      "Clinical Neurophysiology",
      "Epilepsy",
      "Forensic Psychiatry",
      "Geriatric Psychiatry",
      "Vascular Neurology",
    ]),
    "Surgical specialist": withOther([
      "General Surgery",
      "Surgery",
      "Cardiothoracic Surgery",
      "Thoracic Surgery",
      "Thoracic and Cardiac Surgery",
      "Cardiothoracic & Vascular Surgery",
      "Vascular Surgery",
      "Neurosurgery",
      "Neurological Surgery",
      "Urology",
      "Pediatric Surgery",
      "Plastic Surgery",
      "Plastic & Reconstructive Surgery",
      "Surgical Oncology",
      "Complex General Surgical Oncology",
      "Surgical Gastroenterology",
      "Colorectal Surgery",
      "Colon and Rectal Surgery",
      "Endocrine Surgery",
      "Hand Surgery",
      "Head & Neck Surgery",
      "Orthopedic Surgery",
      "Orthopaedic Surgery",
      "Spine Surgery",
      "Trauma Surgery",
      "Transplant Surgery",
      "Bariatric Surgery",
      "Breast Surgery",
      "Congenital Cardiac Surgery",
      "Pediatric Urology",
    ]),
    "Dental specialist": withOther([
      "General Dentistry",
      "Dental Surgery",
      "Oral & Maxillofacial Surgery",
      "Orthodontics",
      "Prosthodontics",
      "Periodontics",
      "Endodontics",
      "Pediatric Dentistry",
      "Pedodontics",
      "Oral Medicine & Radiology",
      "Oral Pathology",
      "Oral & Maxillofacial Pathology",
      "Public Health Dentistry",
      "Conservative Dentistry",
      "Implantology",
    ]),
    "AYUSH practitioner": withOther([
      "Ayurvedic Medicine",
      "Homeopathic Medicine",
      "Unani Medicine",
      "Siddha Medicine",
      "Naturopathy & Yoga",
      "Yoga Therapy",
      "Panchakarma",
      "Ayurvedic Surgery",
      "Ayurvedic Obstetrics & Gynecology",
      "Ayurvedic Pediatrics",
    ]),
    "Medicine officer": withOther([
      "General Duty Medical Officer",
      "Casualty Medical Officer",
      "ICU Medical Officer",
      "Public Health Medical Officer",
      "Occupational Health Medical Officer",
      "Community Health Medical Officer",
      "Medical Officer (TB/IDSP/NHM)",
      "Emergency Medical Officer",
      "Insurance Medical Officer",
      "Clinical Research Medical Officer",
      "Telemedicine Medical Officer",
    ]),
    RMO: withOther([
      "Emergency RMO",
      "ICU RMO",
      "Ward RMO",
      "Night Duty RMO",
      "Trauma RMO",
      "OPD RMO",
      "OT RMO",
      "NICU RMO",
      "PICU RMO",
    ]),
    Other: ["Other"],
  },
  Nurse: {
    ANM: withOther([
      "Community Health Nurse",
      "Maternal Care Nurse",
      "Vaccination Nurse",
      "Public Health Nurse",
      "School Health Nurse",
    ]),
    GNM: withOther([
      "Ward Nurse",
      "ICU Nurse",
      "Operation Theatre Nurse",
      "Emergency Nurse",
      "Pediatric Nurse",
      "Neonatal Nurse",
      "Dialysis Nurse",
      "Oncology Nurse",
      "Cardiac Nurse",
      "Neuro Nurse",
      "Psychiatric Nurse",
      "Infection Control Nurse",
      "Home Care Nurse",
      "Palliative Care Nurse",
    ]),
    "BSc Nursing": withOther([
      "Clinical Nurse",
      "Nurse Educator",
      "Critical Care Nurse",
      "Nurse Supervisor",
      "Nursing",
      "Nursing Officer",
      "Staff Nurse",
      "Charge Nurse",
      "Quality Nurse",
      "Occupational Health Nurse",
    ]),
    "Post Basic BSc Nursing": withOther([
      "Senior Staff Nurse",
      "Clinical Instructor",
      "Nurse Coordinator",
      "Nursing Quality Coordinator",
    ]),
    "MSc Nursing": withOther([
      "Medical Surgical Nursing",
      "Community Health Nursing",
      "Obstetric & Gynecological Nursing",
      "Child Health Nursing",
      "Mental Health Nursing",
      "Nurse Practitioner in Critical Care",
      "Nurse Researcher",
    ]),
    "Nurse Practitioner": withOther([
      "Nurse Practitioner in Critical Care",
      "Family Nurse Practitioner",
      "Emergency Nurse Practitioner",
      "Pediatric Nurse Practitioner",
      "Oncology Nurse Practitioner",
    ]),
    "Nurse Educator": withOther(["Nurse Educator", "Clinical Instructor", "Simulation Lab Instructor"]),
    "Nurse Manager": withOther(["Nurse Manager", "Nursing Superintendent", "Matron", "Unit Manager"]),
    Other: ["Other"],
  },
  Technician: {
    Cardiac: withOther(["ECG Technician", "Echo Technician", "TMT Technician", "Holter Technician", "Cardiac Technician"]),
    Cathlab: withOther(["Cath Lab Technician", "Cath Lab Technologist", "Cardiac Catheterization Technician"]),
    Dialysis: withOther(["Dialysis Technician", "Renal Dialysis Technician", "Dialysis Technologist"]),
    "Operation theatre": withOther(["OT Technician", "Operation Theatre Technician", "Anesthesia Technician", "Surgical Technologist"]),
    Laboratory: withOther([
      "Lab Technician",
      "Medical Laboratory Technician",
      "Medical Laboratory Technologist",
      "Phlebotomy Technician",
      "Histopathology Technician",
      "Microbiology Technician",
      "Biochemistry Technician",
      "Cytology Technician",
      "Molecular Diagnostics Technician",
      "Medical Technology",
    ]),
    Endoscopy: withOther(["Endoscopy Technician", "Bronchoscopy Technician", "GI Endoscopy Technician"]),
    "Radiology & Imaging": withOther([
      "Radiology Technician",
      "Radiology Technologist",
      "Imaging Technologist",
      "Ultrasound Technician",
      "Sonographer",
      "Mammography Technician",
      "Interventional Radiology Technician",
      "Radiotherapy Technician",
      "Nuclear Medicine Technician",
    ]),
    "X-ray": withOther(["X-ray Technician", "Radiographer"]),
    "CT/MRI": withOther(["CT Technician", "MRI Technician", "CT/MRI Technician"]),
    "Respiratory therapy": withOther(["Respiratory Therapist", "Pulmonary Function Technician", "Sleep Lab Technician"]),
    Rehabilitation: withOther([
      "Physiotherapist",
      "Physical Therapy",
      "Occupational Therapist",
      "Occupational Therapy",
      "Speech Therapist",
      "Speech Therapy",
      "Audiologist",
      "Prosthetics & Orthotics Technician",
    ]),
    "Ophthalmic & Optometry": withOther(["Optometrist", "Ophthalmic Assistant", "Ophthalmic Technician", "Refractionist"]),
    Dental: withOther(["Dental Hygienist", "Dental Assistant", "Dental Technician", "Dental Lab Technician"]),
    "Blood bank": withOther(["Blood Bank Technician", "Transfusion Medicine Technician"]),
    CSSD: withOther(["CSSD Technician", "Sterilization Technician"]),
    Emergency: withOther(["Emergency Medical Technician", "Paramedic", "Ambulance Technician"]),
    Other: ["Other"],
  },
  Pharmacy: {
    "D. Pharma": withOther(["Staff Pharmacist", "Dispensing Pharmacist", "Retail Pharmacist"]),
    "B. Pharma": withOther(["Clinical Pharmacist", "Hospital Pharmacist", "Inventory Pharmacist", "Pharmacy"]),
    "M. Pharma": withOther(["Pharmaceutical Quality Assurance", "Pharmaceutical Quality Control", "Regulatory Affairs", "Pharmacology", "Pharmaceutics"]),
    "Pharm.D": withOther(["Clinical Pharmacy Specialist", "Ward Pharmacist", "Medication Therapy Management Pharmacist"]),
    "Clinical pharmacy": withOther(["Clinical Pharmacist", "Oncology Pharmacist", "Critical Care Pharmacist", "Antimicrobial Stewardship Pharmacist"]),
    "Hospital pharmacy": withOther(["Hospital Pharmacist", "Drug Store Manager", "Inventory Pharmacist", "Sterile Compounding Pharmacist"]),
    "Pharmaceutical operations": withOther(["Pharmacovigilance", "Medical Affairs", "Regulatory Affairs", "Production Pharmacist"]),
    Other: ["Other"],
  },
  Support: {
    "Ward assistant": withOther(["Patient Care Assistant", "Ward Boy / Aya", "Patient Attendant", "Nursing Assistant"]),
    "OT assistant": withOther(["OT Assistant", "Sterilization Assistant", "Surgical Assistant"]),
    "Patient care": withOther(["Patient Care Coordinator", "Patient Relations Executive", "Care Coordinator", "Patient Navigator"]),
    "House keeping": withOther(["Housekeeping Executive", "Infection Control Housekeeping", "Sanitation Supervisor"]),
    Security: withOther(["Hospital Security Guard", "Security Supervisor", "Emergency Response Guard"]),
    Accounting: withOther(["Billing Executive", "Accounts Assistant", "Cashier", "TPA Billing Assistant"]),
    "Therapy support": withOther(["Physiotherapy Assistant", "Rehabilitation Assistant", "Speech Therapy Assistant"]),
    Nutrition: withOther(["Dietitian", "Clinical Nutritionist", "Nutrition Assistant"]),
    Counselling: withOther(["Psychologist", "Counsellor", "Medical Social Worker"]),
    "Home healthcare": withOther(["Home Health Aide", "Home Care Coordinator", "Elder Care Assistant"]),
    Other: ["Other"],
  },
  Admin: {
    "Hospital administration": withOther(["Hospital Administrator", "Front Office Manager", "Medical Superintendent Office", "Hospital Manager"]),
    Operations: withOther(["Operations Executive", "Facility Manager", "Clinic Manager", "Service Line Manager"]),
    HR: withOther(["HR Executive", "Talent Acquisition", "Recruitment Specialist", "HR Business Partner"]),
    Finance: withOther(["Finance Executive", "Medical Billing Officer", "Accounts Manager", "Revenue Analyst"]),
    "Front office": withOther(["Front Desk Executive", "Receptionist", "Appointment Coordinator", "Call Center Executive"]),
    "Medical records": withOther(["Medical Records Officer", "Health Information Management", "Data Entry Operator", "MRD Executive"]),
    "Quality & compliance": withOther(["Quality Manager", "NABH Coordinator", "Compliance Officer", "Patient Safety Officer"]),
    "IT & digital health": withOther(["Healthcare IT Support", "EMR Coordinator", "Digital Health Coordinator", "Telemedicine Coordinator"]),
    Procurement: withOther(["Purchase Executive", "Supply Chain Executive", "Store Manager", "Biomedical Purchase Coordinator"]),
    Other: ["Other"],
  },
  Insurance: {
    Claims: withOther(["Claims Processing Officer", "Claims Auditor", "Claims Adjudicator", "Medical Claims Analyst"]),
    "TPA operations": withOther(["TPA Coordinator", "Insurance Desk Officer", "Pre-auth Coordinator", "Discharge Approval Coordinator"]),
    Underwriting: withOther(["Medical Underwriter", "Risk Analyst", "Health Underwriting Analyst"]),
    "Customer support": withOther(["Insurance Support Executive", "Policy Support Officer", "Member Support Executive"]),
    "Pre-authorization": withOther(["Pre-authorization Executive", "Cashless Approval Coordinator", "Insurance Coordinator"]),
    "Medical audit": withOther(["Medical Auditor", "Clinical Auditor", "Utilization Review Nurse"]),
    "Revenue cycle": withOther(["Revenue Cycle Executive", "Denial Management Executive", "AR Caller", "Medical Coder"]),
    Other: ["Other"],
  },
  Marketing: {
    "Digital marketing": withOther(["Digital Marketing Executive", "Performance Marketer", "SEO Specialist", "Social Media Executive"]),
    "Field marketing": withOther(["Field Marketing Executive", "Hospital Outreach Executive", "Community Outreach Executive"]),
    Branding: withOther(["Brand Manager", "Communications Executive", "Content Marketing Executive", "PR Executive"]),
    Sales: withOther(["Medical Sales Representative", "Business Development Executive", "Healthcare Sales Executive"]),
    "Doctor relations": withOther(["Doctor Relationship Manager", "Referral Coordinator", "Consultant Relations Executive"]),
    "Patient acquisition": withOther(["Patient Acquisition Executive", "CRM Executive", "Lead Conversion Executive"]),
    "Corporate partnerships": withOther(["Corporate Relations Manager", "B2B Healthcare Sales", "Partnerships Executive"]),
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
    "MHA",
    "MPH",
    "Fellowship",
    "FRCS",
    "MRCS",
    "MRCP",
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
  "MRCP",
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
  "MPH",
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

export const SPECIALIZATION_MAX_LENGTH = 100;

export const normalizeText = (value?: string) => (value || "").toLowerCase().trim();

export const normalizeSpecializationLabel = (value?: string) =>
  (value || "").trim().replace(/\s+/g, " ").slice(0, SPECIALIZATION_MAX_LENGTH);

export const inferHealthcareTitle = (job: { title?: string; specialization?: string }) => {
  const title = normalizeText(job.title);
  const specialization = normalizeText(job.specialization);
  const text = `${title} ${specialization}`;

  if (/(doctor|dr\.|consultant|surgeon|physician|medical officer|resident|registrar|rmo|dentist|dental|ayurveda|homeopathy|unani|siddha)/.test(text)) return "Doctor";
  if (/(nurse|nursing|anm|gnm)/.test(text)) return "Nurse";
  if (/(technician|technologist|lab tech|x-ray|radiology tech|ct|mri|dialysis|cath lab|ot tech|therapist|physiotherapist|optometrist|audiologist|paramedic)/.test(text)) return "Technician";
  if (/(pharmacist|pharmacy)/.test(text)) return "Pharmacy";

  for (const titleKey of HEALTHCARE_TITLES) {
    const specializations = [
      ...TITLE_SPECIALIZATION_OPTIONS[titleKey],
      ...Object.values(TITLE_FIELD_OPTIONS[titleKey] || {}).flat(),
    ];
    if (specializations.some((s) => normalizeText(s) === specialization)) {
      return titleKey;
    }
  }

  if (/(assistant|housekeeping|security|ward|attendant|dietitian|nutritionist|counsellor|psychologist|social worker|home care)/.test(text)) return "Support";
  if (/(admin|administrator|hr|human resources|operations|finance|billing|front office|records|quality|compliance|procurement|it support|emr)/.test(text)) return "Admin";
  if (/(insurance|claims|tpa|underwriting|pre-auth|preauthorization|medical coding|revenue cycle)/.test(text)) return "Insurance";
  if (/(marketing|sales|business development|brand|outreach|doctor relations|patient acquisition)/.test(text)) return "Marketing";

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
    [
      ...HEALTHCARE_TITLES.flatMap((title) => [
        ...TITLE_SPECIALIZATION_OPTIONS[title],
        ...Object.values(TITLE_FIELD_OPTIONS[title]).flat(),
      ]),
      "Gynecology",
      "Hematology",
      "Infectious Disease",
      "Medical Technology",
      "Nursing",
      "Oncology",
      "Physical Therapy",
      "Surgery",
    ].map(normalizeSpecializationLabel).filter(Boolean)
  )
).sort();

export const ALL_HEALTHCARE_SPECIALIZATIONS = JOB_SPECIALIZATION_ENUM;

export const getAllHealthcareSpecializations = (includeOther = true) =>
  JOB_SPECIALIZATION_ENUM.filter((item) => includeOther || item !== "Other");

export const getSpecialtyFilterOptions = (existingValues: string[] = [], includeOther = false) =>
  Array.from(
    new Set([
      ...getAllHealthcareSpecializations(includeOther),
      ...existingValues.map(normalizeSpecializationLabel).filter(Boolean),
    ])
  ).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });
