'use client';

import { recruiterJobApi } from '@/apiRequest/recruiter-job';
import { useRecruiterJobMutations } from '@/hooks/useRecruiterJobs';
import type { JobStatus } from '@/types/recruiter-job';
import { getErrorMessage } from '@/utils/error';
import { toFormValues, toSaveRequest } from '@/utils/recruiter-job';
import { useState } from 'react';
import { toast } from 'sonner';

const BULK_ID = 'bulk';
const MAX_TITLE_LENGTH = 150;
const COPY_SUFFIX = ' (bản sao)';

export function useJobPostActions() {
  const mutations = useRecruiterJobMutations();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const run = async (id: string, task: () => Promise<unknown>, successMessage: string) => {
    setPendingId(id);
    try {
      await task();
      toast.success(successMessage);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPendingId(null);
    }
  };

  const pauseJob = (id: string) => run(id, () => mutations.pause.mutateAsync(Number(id)), 'Đã tạm dừng tin.');

  const reopenJob = (id: string) => run(id, () => mutations.resume.mutateAsync(Number(id)), 'Đã mở lại tin.');

  const closeJob = (id: string) => run(id, () => mutations.close.mutateAsync(Number(id)), 'Đã đóng tin.');

  const deleteJob = (id: string) => run(id, () => mutations.remove.mutateAsync(Number(id)), 'Đã xóa bản nháp.');

  const toggleJobStatus = (id: string, currentStatus: JobStatus) => {
    if (currentStatus === 'PUBLISHED') return pauseJob(id);
    if (currentStatus === 'PAUSED') return reopenJob(id);
    return Promise.resolve();
  };

  const duplicateJob = (id: string) =>
    run(
      id,
      async () => {
        const source = await recruiterJobApi.get(Number(id));
        const copy = toSaveRequest(toFormValues(source));
        const title = `${source.title.slice(0, MAX_TITLE_LENGTH - COPY_SUFFIX.length)}${COPY_SUFFIX}`;
        await mutations.create.mutateAsync({ ...copy, title });
      },
      'Đã tạo bản sao dưới dạng nháp.',
    );

  const runBulk = async (ids: string[], task: (id: number) => Promise<unknown>, noun: string) => {
    if (ids.length === 0) return;
    setPendingId(BULK_ID);
    const results = await Promise.allSettled(ids.map((id) => task(Number(id))));
    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed === 0) {
      toast.success(`Đã ${noun} ${ids.length} tin.`);
    } else {
      toast.error(`${noun} thất bại ${failed}/${ids.length} tin. Chỉ tin đang tuyển mới tạm dừng được.`);
    }
    setPendingId(null);
  };

  const bulkPauseJobs = (ids: string[]) => runBulk(ids, (id) => mutations.pause.mutateAsync(id), 'tạm dừng');

  const bulkCloseJobs = (ids: string[]) => runBulk(ids, (id) => mutations.close.mutateAsync(id), 'đóng');

  return {
    pendingId,
    pauseJob,
    reopenJob,
    toggleJobStatus,
    closeJob,
    deleteJob,
    duplicateJob,
    bulkPauseJobs,
    bulkCloseJobs,
  };
}

export const BULK_PENDING_ID = BULK_ID;
