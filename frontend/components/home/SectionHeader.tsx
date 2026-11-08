import Link from 'next/link';

type SectionHeaderProps = {
  id: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function SectionHeader({ id, title, description, actionHref, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h2 id={id} className="text-headline-lg text-primary font-bold">
          {title}
        </h2>
        {description && <p className="text-body-lg text-on-surface-variant">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="text-title-md text-on-surface underline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
