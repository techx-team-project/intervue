'use client';

import { jobPostSchema, type JobPostFormData } from '@/schemas/job.schema';
import { useEffect, useRef, useState } from 'react';
import { useWatch, type Control } from 'react-hook-form';

const AUTOSAVE_DELAY_MS = 2500;

export type AutosaveStatus = 'idle' | 'saving' | 'saved';

interface UseJobDraftAutosaveOptions {
  control: Control<JobPostFormData>;
  enabled: boolean;
  save: () => Promise<unknown>;
}

export function useJobDraftAutosave({ control, enabled, save }: UseJobDraftAutosaveOptions): AutosaveStatus {
  const values = useWatch({ control });
  const snapshot = JSON.stringify(values);
  const title = values.title ?? '';
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const lastSaved = useRef<string | null>(null);
  const latest = useRef({ enabled, save });

  useEffect(() => {
    latest.current = { enabled, save };
  });

  useEffect(() => {
    if (lastSaved.current === null) {
      lastSaved.current = snapshot;
      return;
    }
    if (snapshot === lastSaved.current) return;

    const timer = setTimeout(() => {
      if (!latest.current.enabled || !jobPostSchema.shape.title.safeParse(title).success) return;
      const previous = lastSaved.current;
      lastSaved.current = snapshot;
      setStatus('saving');
      latest.current
        .save()
        .then(() => setStatus('saved'))
        .catch(() => {
          lastSaved.current = previous;
          setStatus('idle');
        });
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [snapshot, title]);

  return status;
}
