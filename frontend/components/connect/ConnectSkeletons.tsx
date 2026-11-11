import Skeleton from '@/components/ui/Skeleton';

export function ConnectTimelineSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading messages" className="flex flex-col space-y-4 py-2">
      <div className="flex justify-center py-1">
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>

      {/* Incoming cluster */}
      <div className="flex items-end gap-2">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-10 w-52 rounded-2xl rounded-bl-md sm:w-64" />
          <Skeleton className="h-9 w-36 rounded-2xl rounded-tl-md rounded-bl-sm sm:w-44" />
        </div>
      </div>

      {/* Outgoing cluster */}
      <div className="flex flex-col items-end space-y-1.5">
        <Skeleton className="h-11 w-48 rounded-2xl rounded-br-md bg-emerald-100/75 sm:w-60" />
        <Skeleton className="h-9 w-32 rounded-2xl rounded-tr-md rounded-br-sm bg-emerald-100/75" />
      </div>

      <div className="flex justify-center py-1">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Incoming single message */}
      <div className="flex items-end gap-2">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Skeleton className="h-14 w-60 rounded-2xl rounded-bl-sm sm:w-72" />
      </div>

      {/* Outgoing single message */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-44 rounded-2xl rounded-br-sm bg-emerald-100/75 sm:w-52" />
      </div>
    </div>
  );
}

export function ConnectThreadSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading conversation" className="flex h-full min-h-0 flex-col bg-white">
      {/* Header skeleton */}
      <div className="border-outline-variant flex h-[68px] shrink-0 items-center justify-between gap-3 border-b bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36 rounded-md sm:w-44" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="hidden h-8 w-8 rounded-full lg:block" />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6">
        <ConnectTimelineSkeleton />
      </div>

      {/* Composer skeleton */}
      <div className="border-outline-variant flex shrink-0 items-center gap-2.5 border-t bg-white px-4 py-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

export function ConnectSidebarListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading conversations" className="space-y-1.5 px-1">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3.5 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-10 rounded-md" />
            </div>
            <Skeleton className="h-3 w-4/5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConnectRightPanelSkeleton({ variant }: { variant: 'jobs' | 'candidates' }) {
  if (variant === 'jobs') {
    return (
      <div aria-busy="true" aria-label="Loading applied jobs" className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-outline-variant rounded-xl border bg-slate-50/40 p-3.5">
            <Skeleton className="h-4 w-4/5 rounded-md" />
            <Skeleton className="mt-2 h-3.5 w-3/5 rounded-md" />
            <div className="mt-3 flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-label="Loading candidates" className="space-y-1.5 px-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/5 rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
            <Skeleton className="h-2.5 w-1/3 rounded-md" />
          </div>
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}
