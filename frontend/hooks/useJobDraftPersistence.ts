'use client';

import { useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import type { JobPostFormData } from '@/schemas/job.schema';
import { toSaveRequest } from '@/utils/recruiter-job';
import { useRef, useState } from 'react';
import type { UseFormGetValues } from 'react-hook-form';

interface JobDraftPersistence {
  savedId: number | undefined;
  persist: () => Promise<number>;
}

export function useJobDraftPersistence(
  getValues: UseFormGetValues<JobPostFormData>,
  jobId: number | undefined,
): JobDraftPersistence {
  const mutations = useRecruiterJobMutations();
  const [savedId, setSavedId] = useState(jobId);
  const savedIdRef = useRef(jobId);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const save = async (): Promise<number> => {
    const data = toSaveRequest(getValues());
    if (savedIdRef.current) {
      await mutations.update.mutateAsync({ id: savedIdRef.current, data });
      return savedIdRef.current;
    }
    const created = await mutations.create.mutateAsync(data);
    savedIdRef.current = created.id;
    setSavedId(created.id);
    return created.id;
  };

  // Saves run one after another so autosave and manual save never create the job twice
  const persist = (): Promise<number> => {
    const run = queue.current.catch(() => undefined).then(save);
    queue.current = run;
    return run;
  };

  return { savedId, persist };
}
