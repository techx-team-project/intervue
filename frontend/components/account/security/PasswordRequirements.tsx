import { Check } from 'lucide-react';

type PasswordRequirementsProps = { password: string };

const RULES = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'At least 1 lowercase letter (a-z)', test: (value: string) => /[a-z]/.test(value) },
  { label: 'At least 1 uppercase letter (A-Z)', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'At least 1 digit (0-9)', test: (value: string) => /[0-9]/.test(value) },
  { label: 'At least 1 special character (!@#$)', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

const STRENGTH_LEVELS = [
  { text: 'Weak', color: 'text-rose-500', bar: 'bg-rose-500', width: '25%' },
  { text: 'Weak', color: 'text-rose-500', bar: 'bg-rose-500', width: '25%' },
  { text: 'Medium', color: 'text-amber-500', bar: 'bg-amber-500', width: '50%' },
  { text: 'Fairly strong', color: 'text-blue-500', bar: 'bg-blue-500', width: '75%' },
  { text: 'Very strong', color: 'text-emerald-500', bar: 'bg-primary', width: '100%' },
];

export function PasswordStrengthMeter({ password }: PasswordRequirementsProps) {
  if (!password) return null;
  const score = RULES.filter((rule) => rule.test(password)).length;
  const strength = STRENGTH_LEVELS[Math.ceil((score / RULES.length) * (STRENGTH_LEVELS.length - 1))];

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Password strength:</span>
        <span className={`font-bold ${strength.color}`}>{strength.text}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full transition duration-300 ${strength.bar}`} style={{ width: strength.width }} />
      </div>
    </div>
  );
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
      <div className="font-bold text-slate-800">Secure password requirements:</div>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.label}
              className={`flex items-center gap-2 ${passed ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${
                  passed ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-3" />
              </div>
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
