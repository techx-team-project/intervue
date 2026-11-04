type CandidateItemTextProps = {
  label: string;
  text: string | null;
};

export default function CandidateItemText({ label, text }: CandidateItemTextProps) {
  if (!text) return null;

  return (
    <div className="mt-2">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-0.5 text-sm leading-relaxed wrap-break-word whitespace-pre-line text-[#334155]">{text}</p>
    </div>
  );
}
