'use client';

import HireConfirmModal from '@/components/recruiter/applications/HireConfirmModal';
import InterviewScheduleModal from '@/components/recruiter/applications/InterviewScheduleModal';
import RejectApplicationModal from '@/components/recruiter/applications/RejectApplicationModal';
import ReportCandidateModal from '@/components/recruiter/applications/ReportCandidateModal';
import type { ApplicationInterview, ApplicationStatus, RecruiterApplication } from '@/types/recruiter-application';
import { useState } from 'react';
import { toast } from 'sonner';
import type { ApplicationBoardController } from './useApplicationBoard';

interface CloseTarget {
  ids: string[];
  initialStatus: 'REJECTED' | 'NO_AGREEMENT';
}

interface HireTarget {
  ids: string[];
  jobTitle: string;
}

export function useApplicationActionFlow(board: ApplicationBoardController) {
  const [closeTarget, setCloseTarget] = useState<CloseTarget | null>(null);
  const [hireTarget, setHireTarget] = useState<HireTarget | null>(null);
  const [interviewTarget, setInterviewTarget] = useState<RecruiterApplication | null>(null);
  const [reportTarget, setReportTarget] = useState<RecruiterApplication | null>(null);

  const candidateNamesOf = (ids: string[]) =>
    board.applications
      .filter((application) => ids.includes(application.id))
      .map((application) => application.candidate.fullName);

  const requestStatusChange = (ids: string[], status: ApplicationStatus) => {
    if (ids.length === 0) return;

    if (status === 'REJECTED' || status === 'NO_AGREEMENT') {
      setCloseTarget({ ids, initialStatus: status });
      return;
    }

    if (status === 'HIRED') {
      const first = board.applications.find((application) => application.id === ids[0]);
      setHireTarget({ ids, jobTitle: first ? first.jobTitle : '' });
      return;
    }

    if (status === 'INTERVIEW') {
      const application = ids.length === 1 ? board.applications.find((item) => item.id === ids[0]) : undefined;

      if (!application) {
        toast.info('The Interview stage needs a specific schedule — open each application to book one.');
        return;
      }

      setInterviewTarget(application);
      return;
    }

    board.moveApplications(ids, status);
  };

  const confirmInterview = (interview: ApplicationInterview) => {
    if (!interviewTarget) return;
    board.moveApplications([interviewTarget.id], 'INTERVIEW', { interview });
    setInterviewTarget(null);
  };

  const actionModals = (
    <>
      {closeTarget && (
        <RejectApplicationModal
          candidateNames={candidateNamesOf(closeTarget.ids)}
          initialStatus={closeTarget.initialStatus}
          onClose={() => setCloseTarget(null)}
          onConfirm={(data) => {
            board.moveApplications(closeTarget.ids, data.status, { reason: data.reason, detail: data.detail });
            setCloseTarget(null);
          }}
        />
      )}

      {hireTarget && (
        <HireConfirmModal
          candidateNames={candidateNamesOf(hireTarget.ids)}
          jobTitle={hireTarget.jobTitle}
          onClose={() => setHireTarget(null)}
          onConfirm={() => {
            board.moveApplications(hireTarget.ids, 'HIRED');
            setHireTarget(null);
          }}
        />
      )}

      {interviewTarget && (
        <InterviewScheduleModal
          candidateName={interviewTarget.candidate.fullName}
          jobTitle={interviewTarget.jobTitle}
          onClose={() => setInterviewTarget(null)}
          onConfirm={(interview) => confirmInterview(interview)}
        />
      )}

      {reportTarget && (
        <ReportCandidateModal
          candidateName={reportTarget.candidate.fullName}
          onClose={() => setReportTarget(null)}
          onConfirm={() => {
            toast.success('Report sent to the InterVue moderation team.');
            setReportTarget(null);
          }}
        />
      )}
    </>
  );

  return { requestStatusChange, requestReport: setReportTarget, actionModals };
}
