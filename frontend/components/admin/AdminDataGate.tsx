'use client';

import Spinner from '@/components/common/Spinner';
import { ERROR_MESSAGES, FALLBACK_ERROR_MESSAGE } from '@/constants/error-messages';
import type { AdminResourceStatus } from '@/hooks/useAdminResource';
import type { ApiError } from '@/lib/api-error';
import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

interface AdminDataGateProps {
  status: AdminResourceStatus;
  error: ApiError | null;
  onRetry: () => void;
  children: ReactNode;
}

export default function AdminDataGate({ status, error, onRetry, children }: AdminDataGateProps) {
  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border bg-white px-6 text-center">
        <TriangleAlert className="h-10 w-10 text-rose-500" />
        <p className="text-navy dark:text-forest-50 text-body-md font-bold">Could not load this page</p>
        <p className="dark:text-forest-300 text-body-sm text-on-surface-variant max-w-sm">
          {(error && ERROR_MESSAGES[error.code]) ?? FALLBACK_ERROR_MESSAGE}
        </p>
        {error?.traceId && (
          <p className="dark:text-forest-400 text-label-sm text-outline font-mono">Trace {error.traceId}</p>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="text-primary text-body-sm mt-1 cursor-pointer font-bold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
