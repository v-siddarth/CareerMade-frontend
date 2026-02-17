import { CheckCircle2, Circle } from "lucide-react";
import { getPasswordRules } from "@/lib/password-rules";

type PasswordChecklistProps = {
  password: string;
  confirmPassword?: string;
  showConfirmRule?: boolean;
};

const PasswordChecklist = ({
  password,
  confirmPassword = "",
  showConfirmRule = false,
}: PasswordChecklistProps) => {
  const rules = getPasswordRules(password);
  const confirmValid = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold text-gray-700 mb-2">Password must include:</p>
      <div className="space-y-1.5">
        {rules.map((rule) => (
          <div
            key={rule.key}
            className={`flex items-center gap-2 text-xs ${rule.valid ? "text-green-600" : "text-gray-500"}`}
          >
            {rule.valid ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            <span>{rule.label}</span>
          </div>
        ))}

        {showConfirmRule && (
          <div className={`flex items-center gap-2 text-xs ${confirmValid ? "text-green-600" : "text-gray-500"}`}>
            {confirmValid ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            <span>Passwords match</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordChecklist;
