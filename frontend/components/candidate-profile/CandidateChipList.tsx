type CandidateChipListProps = {
  items: string[];
};

export default function CandidateChipList({ items }: CandidateChipListProps) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="bg-primary-light text-primary rounded-full px-2.5 py-1 text-xs font-semibold">
          {item}
        </li>
      ))}
    </ul>
  );
}
