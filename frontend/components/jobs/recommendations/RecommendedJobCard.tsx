import HomeJobCard from '@/components/home/HomeJobCard';
import type { JobRecommendationItem } from '@/types/job-recommendation';

interface RecommendedJobCardProps {
  item: JobRecommendationItem;
}

export default function RecommendedJobCard({ item }: RecommendedJobCardProps) {
  const { job, matchReason, matchedSkills = [] } = item;

  return (
    <HomeJobCard job={job}>
      <div className="space-y-2">
        <p className="text-label-md text-on-surface-variant line-clamp-1">{matchReason}</p>
        {matchedSkills.length > 0 && (
          <ul aria-label="Matched skills" className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <li
                key={skill}
                className="bg-primary-light text-label-md text-primary rounded-md px-2 py-0.5 font-semibold"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </HomeJobCard>
  );
}
