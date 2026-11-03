type CandidateChipListProps = {
  items: string[];
};

export default function CandidateChipList({ items }: CandidateChipListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {item}
        </li>
      ))}
    </ul>
  );
}
