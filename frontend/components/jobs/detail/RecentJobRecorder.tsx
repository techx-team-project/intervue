'use client';

import { rememberViewedJob } from '@/utils/recently-viewed-jobs';
import { useEffect } from 'react';

type RecentJobRecorderProps = {
  id: number;
  title: string;
  companyName: string;
  city?: string;
};

export default function RecentJobRecorder({ id, title, companyName, city }: RecentJobRecorderProps) {
  useEffect(() => {
    rememberViewedJob({ id, title, companyName, city });
  }, [id, title, companyName, city]);

  return null;
}
