'use client';

import type { JobStatus, RecruiterJobPost } from '@/types/recruiter-job';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

const MOCK_DELAY_MS = 600;
const EXTEND_DAYS = 30;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useJobPostActions(setJobs: Dispatch<SetStateAction<RecruiterJobPost[]>>) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const runUpdate = async (
    id: string,
    updater: (job: RecruiterJobPost) => RecruiterJobPost,
    successMessage: string,
  ) => {
    setPendingId(id);
    await delay(MOCK_DELAY_MS);
    setJobs((prev) => prev.map((job) => (job.id === id ? updater(job) : job)));
    toast.success(successMessage);
    setPendingId(null);
  };

  const pauseJob = (id: string) => runUpdate(id, (job) => ({ ...job, status: 'PAUSED' }), 'Job post paused.');

  const reopenJob = (id: string) => runUpdate(id, (job) => ({ ...job, status: 'PUBLISHED' }), 'Job post reopened.');

  const toggleJobStatus = async (id: string, currentStatus: JobStatus) => {
    if (currentStatus === 'PUBLISHED') {
      await pauseJob(id);
    } else if (currentStatus === 'PAUSED') {
      await reopenJob(id);
    }
  };

  const closeJob = (id: string) => runUpdate(id, (job) => ({ ...job, status: 'CLOSED' }), 'Job post closed.');

  const extendJob = (id: string) =>
    runUpdate(
      id,
      (job) => ({ ...job, expiresAt: new Date(Date.now() + EXTEND_DAYS * 24 * 60 * 60 * 1000).toISOString() }),
      `Job post extended by ${EXTEND_DAYS} days.`,
    );

  const submitForReview = (id: string) =>
    runUpdate(id, (job) => ({ ...job, status: 'PENDING_REVIEW' }), 'Job post submitted for review.');

  const repostJob = (id: string) =>
    runUpdate(
      id,
      (job) => ({
        ...job,
        status: 'PENDING_REVIEW',
        expiresAt: new Date(Date.now() + EXTEND_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      }),
      'Job post reposted and waiting for review.',
    );

  const duplicateJob = async (id: string) => {
    setPendingId(id);
    await delay(MOCK_DELAY_MS);
    setJobs((prev) => {
      const source = prev.find((job) => job.id === id);
      if (!source) return prev;

      const now = new Date().toISOString();
      const copy: RecruiterJobPost = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
        title: `${source.title} (copy)`,
        status: 'DRAFT',
        rejectionReason: undefined,
        publishedAt: undefined,
        expiresAt: undefined,
        applicantsCount: 0,
        newApplicantsCount: 0,
        viewsCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      return [copy, ...prev];
    });
    toast.success('Job post duplicated as a draft.');
    setPendingId(null);
  };

  const deleteJob = async (id: string) => {
    setPendingId(id);
    await delay(MOCK_DELAY_MS);
    setJobs((prev) => prev.filter((job) => job.id !== id));
    toast.success('Job post deleted.');
    setPendingId(null);
  };

  const bulkPauseJobs = async (ids: string[]) => {
    if (ids.length === 0) return;
    setPendingId('bulk');
    await delay(MOCK_DELAY_MS);
    setJobs((prev) =>
      prev.map((job) => (ids.includes(job.id) && job.status === 'PUBLISHED' ? { ...job, status: 'PAUSED' } : job)),
    );
    toast.success(`Paused ${ids.length} selected job post${ids.length > 1 ? 's' : ''}.`);
    setPendingId(null);
  };

  const bulkExtendJobs = async (ids: string[]) => {
    if (ids.length === 0) return;
    setPendingId('bulk');
    await delay(MOCK_DELAY_MS);
    const newExpiresAt = new Date(Date.now() + EXTEND_DAYS * 24 * 60 * 60 * 1000).toISOString();
    setJobs((prev) => prev.map((job) => (ids.includes(job.id) ? { ...job, expiresAt: newExpiresAt } : job)));
    toast.success(`Extended ${ids.length} job post${ids.length > 1 ? 's' : ''} by ${EXTEND_DAYS} days.`);
    setPendingId(null);
  };

  const bulkCloseJobs = async (ids: string[]) => {
    if (ids.length === 0) return;
    setPendingId('bulk');
    await delay(MOCK_DELAY_MS);
    setJobs((prev) => prev.map((job) => (ids.includes(job.id) ? { ...job, status: 'CLOSED' } : job)));
    toast.success(`Closed ${ids.length} selected job post${ids.length > 1 ? 's' : ''}.`);
    setPendingId(null);
  };

  return {
    pendingId,
    pauseJob,
    reopenJob,
    toggleJobStatus,
    closeJob,
    extendJob,
    submitForReview,
    repostJob,
    duplicateJob,
    deleteJob,
    bulkPauseJobs,
    bulkExtendJobs,
    bulkCloseJobs,
  };
}
