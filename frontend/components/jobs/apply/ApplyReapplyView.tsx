'use client';

import { Button } from '@/components/ui/Button';
import { useApplicationMutations } from '@/hooks/useCandidateApplication';
import type { CandidateApplication, CandidateResume } from '@/types/candidate-application';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';
import { toast } from 'sonner';
import CvPicker from './CvPicker';

interface ApplyReapplyViewProps {
  application: CandidateApplication;
  resumes: CandidateResume[];
  open: boolean;
}

export default function ApplyReapplyView({ application, resumes, open }: ApplyReapplyViewProps) {
  const { reapply } = useApplicationMutations(application.jobId);
  const [resumeId, setResumeId] = useState<number | undefined>(
    resumes.find((resume) => resume.isDefault)?.id ?? resumes[0]?.id,
  );

  const handleReapply = () => {
    if (!resumeId) {
      toast.error('Please select or upload a CV.');
      return;
    }
    reapply.mutate(
      { id: application.id, resumeId },
      {
        onSuccess: () => toast.success('Application resubmitted.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
        You withdrew this application. Your earlier answers are kept; you only need to pick a CV again.
      </p>
      {open ? (
        <>
          <CvPicker resumes={resumes} value={resumeId} onChange={setResumeId} />
          <div className="border-outline-variant flex justify-end border-t pt-4">
            <Button isLoading={reapply.isPending} onClick={handleReapply}>
              Resubmit application
            </Button>
          </div>
        </>
      ) : (
        <p className="text-on-surface-variant text-center text-sm font-semibold">This job post is closed.</p>
      )}
    </div>
  );
}
