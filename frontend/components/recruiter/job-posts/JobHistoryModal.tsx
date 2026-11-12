'use client';

import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { JOB_FIELD_LABELS, JOB_HISTORY_ACTION_LABELS } from '@/constants/recruiter-job';
import { useJobHistory } from '@/hooks/useRecruiterJobs';
import type { JobHistoryEntry, RecruiterJobPost } from '@/types/recruiter-job';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { useState } from 'react';

const PAGE_SIZE = 10;

const ACTOR_LABELS: Record<JobHistoryEntry['actorType'], string> = {
  RECRUITER: 'Bạn',
  ADMIN: 'Quản trị viên',
  SYSTEM: 'Hệ thống',
  USER: 'Người dùng',
};

function describe(entry: JobHistoryEntry): string | undefined {
  if (entry.action === 'JOB_UPDATED' && entry.detail) {
    return entry.detail
      .split(', ')
      .map((field) => JOB_FIELD_LABELS[field] ?? field)
      .join(', ');
  }
  return entry.reason ?? entry.detail;
}

interface JobHistoryModalProps {
  job: RecruiterJobPost | null;
  onClose: () => void;
}

export default function JobHistoryModal({ job, onClose }: JobHistoryModalProps) {
  const [page, setPage] = useState(0);
  const jobId = job ? Number(job.id) : null;
  const { data, isLoading, error } = useJobHistory(jobId, page, PAGE_SIZE);
  const entries = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const close = () => {
    setPage(0);
    onClose();
  };

  return (
    <Modal
      isOpen={job !== null}
      onClose={close}
      title="Lịch sử hoạt động"
      description={job?.title}
      maxWidth="md"
      footer={
        totalPages > 1 ? (
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Trang trước
            </Button>
            <span className="text-on-surface-variant text-xs">
              {page + 1}/{totalPages}
            </span>
            <Button variant="ghost" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
              Trang sau
            </Button>
          </div>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : error ? (
        <p className="py-6 text-center text-sm font-semibold text-rose-600">{getErrorMessage(error)}</p>
      ) : entries.length === 0 ? (
        <p className="text-on-surface-variant py-6 text-center text-sm">Chưa có hoạt động nào được ghi lại.</p>
      ) : (
        <ol className="border-outline-variant ml-2 space-y-5 border-l pl-5">
          {entries.map((entry, index) => {
            const description = describe(entry);
            return (
              <li key={`${entry.createdAt}-${index}`} className="relative">
                <span className="bg-primary ring-surface absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full ring-4" />
                <p className="text-on-surface text-sm font-semibold">{JOB_HISTORY_ACTION_LABELS[entry.action]}</p>
                {description && <p className="text-on-surface-variant mt-0.5 text-xs">{description}</p>}
                <p className="text-outline mt-0.5 text-xs">
                  {ACTOR_LABELS[entry.actorType]} · {formatDateTime(entry.createdAt)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </Modal>
  );
}
