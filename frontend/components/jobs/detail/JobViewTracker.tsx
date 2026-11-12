'use client';

import { publicJobApi } from '@/apiRequest/public-job';
import { ROLES } from '@/constants/auth';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

type JobViewTrackerProps = {
  jobId: number;
};

export default function JobViewTracker({ jobId }: JobViewTrackerProps) {
  const { isLoading, hasRole } = useAuth();
  const isRecruiter = hasRole(ROLES.RECRUITER);

  useEffect(() => {
    if (isLoading || isRecruiter) return;
    publicJobApi.recordView(jobId).catch(() => undefined);
  }, [jobId, isLoading, isRecruiter]);

  return null;
}
