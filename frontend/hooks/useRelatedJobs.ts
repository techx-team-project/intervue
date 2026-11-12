'use client';

import type { PublicJobResource } from '@/types/public-job';
import { usePublicJobs } from './usePublicJobs';

const SIMILAR_FETCH_SIZE = 12;
const COMPANY_FETCH_SIZE = 4;
const SIMILAR_SHOWN = 6;

export function useRelatedJobs(job: PublicJobResource) {
  const similarQuery = usePublicJobs({
    skillIds: job.skills.slice(0, 5).map((skill) => skill.id),
    level: job.level,
    size: SIMILAR_FETCH_SIZE,
  });
  const companyQuery = usePublicJobs({ companyId: job.company.id, size: COMPANY_FETCH_SIZE });

  const similar = (similarQuery.data?.items ?? []).filter((item) => item.id !== job.id);
  const sameCompany = (companyQuery.data?.items ?? []).filter((item) => item.id !== job.id);

  return {
    similar,
    similarShown: similar.slice(0, SIMILAR_SHOWN),
    sameCompany,
    isLoading: similarQuery.isLoading || companyQuery.isLoading,
  };
}
