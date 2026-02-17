export type PasswordRule = {
  key: "length" | "uppercase" | "lowercase" | "number";
  label: string;
  valid: boolean;
};

export const getPasswordRules = (password: string): PasswordRule[] => [
  {
    key: "length",
    label: "At least 6 characters",
    valid: password.length >= 6,
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    valid: /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a-z)",
    valid: /[a-z]/.test(password),
  },
  {
    key: "number",
    label: "At least one number (0-9)",
    valid: /\d/.test(password),
  },
];

export const isPasswordValid = (password: string): boolean =>
  getPasswordRules(password).every((rule) => rule.valid);
