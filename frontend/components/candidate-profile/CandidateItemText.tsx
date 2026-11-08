type CandidateItemTextProps = {
  label: string;
  text: string | null;
};

export default function CandidateItemText({ label, text }: CandidateItemTextProps) {
  if (!text) return null;

  return (
    <div className="mt-2">
      <p className="text-on-surface-variant text-xs font-semibold tracking-wide uppercase">{label}</p>
      <p className="text-on-surface-variant mt-0.5 text-sm leading-relaxed wrap-break-word whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
