'use client';

import {
  APPLICATION_COLUMNS,
  APPLICATION_STATUS_META,
  getColumnIdForStatus,
  isWithinAiMatchBand,
  type ApplicationColumnMeta,
} from '@/constants/application-status';
import { MOCK_RECRUITER_NAME } from '@/mocks/recruiter-application.mock';
import type {
  ApplicationCardHandlers,
  ApplicationFilters,
  ApplicationInterview,
  ApplicationStatus,
  RecruiterApplication,
} from '@/types/recruiter-application';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface ApplicationMoveOptions {
  reason?: string;
  detail?: string;
  interview?: ApplicationInterview;
}

export interface ApplicationBoardColumn {
  meta: ApplicationColumnMeta;
  applications: RecruiterApplication[];
  newCount: number;
}

export interface ApplicationBoardViewProps {
  columns: ApplicationBoardColumn[];
  visibleApplications: RecruiterApplication[];
  handlers: ApplicationCardHandlers;
  totalVisible: number;
  selectedIds: string[];
  showJobTitle: boolean;
}

const DEFAULT_FILTERS: ApplicationFilters = {
  search: '',
  jobId: '',
  sort: 'NEWEST',
  aiMatchBand: 'ALL',
  source: '',
  savedOnly: false,
};

function matchesSearch(application: RecruiterApplication, search: string): boolean {
  const keyword = search.trim().toLowerCase();
  if (keyword.length === 0) return true;

  return (
    application.candidate.fullName.toLowerCase().includes(keyword) ||
    application.candidate.title.toLowerCase().includes(keyword) ||
    application.candidate.email.toLowerCase().includes(keyword) ||
    application.jobTitle.toLowerCase().includes(keyword) ||
    application.candidate.topSkills.some((skill) => skill.toLowerCase().includes(keyword))
  );
}

function compareApplications(sort: ApplicationFilters['sort']) {
  return (left: RecruiterApplication, right: RecruiterApplication): number => {
    switch (sort) {
      case 'OLDEST':
        return Date.parse(left.appliedAt) - Date.parse(right.appliedAt);
      case 'AI_MATCH':
        return right.aiMatch.score - left.aiMatch.score;
      case 'LAST_ACTIVITY':
        return Date.parse(right.lastActivityAt) - Date.parse(left.lastActivityAt);
      case 'NAME':
        return left.candidate.fullName.localeCompare(right.candidate.fullName, 'vi');
      default:
        return Date.parse(right.appliedAt) - Date.parse(left.appliedAt);
    }
  };
}

export function useApplicationBoard(initialApplications: RecruiterApplication[], initialJobId = '') {
  const [applications, setApplications] = useState(initialApplications);
  const [filters, setFilters] = useState<ApplicationFilters>({ ...DEFAULT_FILTERS, jobId: initialJobId });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateFilter = useCallback(<K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), []);

  const visibleApplications = useMemo(() => {
    return applications
      .filter((application) => {
        if (filters.jobId !== '' && application.jobId !== filters.jobId) return false;
        if (filters.savedOnly && !application.isSaved) return false;
        if (filters.source !== '' && application.source !== filters.source) return false;
        if (!isWithinAiMatchBand(application.aiMatch.score, filters.aiMatchBand)) return false;
        return matchesSearch(application, filters.search);
      })
      .sort(compareApplications(filters.sort));
  }, [applications, filters]);

  const columns = useMemo<ApplicationBoardColumn[]>(() => {
    return APPLICATION_COLUMNS.map((meta) => {
      const columnApplications = visibleApplications.filter(
        (application) => getColumnIdForStatus(application.status) === meta.id,
      );

      return {
        meta,
        applications: columnApplications,
        newCount: columnApplications.filter((application) => !application.isViewed).length,
      };
    });
  }, [visibleApplications]);

  const applyStatusChange = useCallback(
    (ids: string[], toStatus: ApplicationStatus, options: ApplicationMoveOptions, changedAt: string) => {
      setApplications((previous) =>
        previous.map((application) => {
          if (!ids.includes(application.id) || application.status === toStatus) return application;

          return {
            ...application,
            status: toStatus,
            lastActivityAt: changedAt,
            isViewed: true,
            interview: options.interview ?? application.interview,
            rejection:
              toStatus === 'REJECTED' || toStatus === 'NO_AGREEMENT'
                ? { reason: options.reason ?? '', detail: options.detail, rejectedAt: changedAt }
                : undefined,
            statusHistory: [
              ...application.statusHistory,
              {
                id: `${application.id}-history-${application.statusHistory.length + 1}`,
                from: application.status,
                to: toStatus,
                changedBy: MOCK_RECRUITER_NAME,
                changedAt,
                reason: options.reason,
              },
            ],
          };
        }),
      );
    },
    [],
  );

  const moveApplications = useCallback(
    (ids: string[], toStatus: ApplicationStatus, options: ApplicationMoveOptions = {}) => {
      const targets = applications.filter((application) => ids.includes(application.id));
      if (targets.length === 0) return;

      const snapshot = applications;
      applyStatusChange(ids, toStatus, options, new Date().toISOString());
      setSelectedIds([]);

      const label =
        targets.length === 1
          ? `Moved ${targets[0].candidate.fullName} to "${APPLICATION_STATUS_META[toStatus].label}".`
          : `Moved ${targets.length} applications to "${APPLICATION_STATUS_META[toStatus].label}".`;

      toast.success(label, {
        action: {
          label: 'Undo',
          onClick: () => setApplications(snapshot),
        },
      });
    },
    [applications, applyStatusChange],
  );

  const toggleSaved = useCallback(
    (id: string) => {
      const target = applications.find((application) => application.id === id);
      if (!target) return;

      const isSaved = !target.isSaved;
      setApplications((previous) =>
        previous.map((application) =>
          application.id === id
            ? { ...application, isSaved, savedAt: isSaved ? new Date().toISOString() : undefined }
            : application,
        ),
      );
      toast.success(isSaved ? 'Candidate saved to your list.' : 'Candidate removed from your saved list.');
    },
    [applications],
  );

  const saveMany = useCallback((ids: string[]) => {
    setApplications((previous) =>
      previous.map((application) =>
        ids.includes(application.id) && !application.isSaved
          ? { ...application, isSaved: true, savedAt: new Date().toISOString() }
          : application,
      ),
    );
    setSelectedIds([]);
    toast.success(`Saved ${ids.length} candidates.`);
  }, []);

  const addNote = useCallback((id: string, content: string) => {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? {
              ...application,
              internalNotes: [
                ...application.internalNotes,
                {
                  id: `${application.id}-note-${application.internalNotes.length + 1}`,
                  authorName: MOCK_RECRUITER_NAME,
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : application,
      ),
    );
    toast.success('Internal note added.');
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  return {
    applications,
    visibleApplications,
    columns,
    filters,
    updateFilter,
    resetFilters,
    selectedIds,
    toggleSelected,
    clearSelection,
    moveApplications,
    toggleSaved,
    saveMany,
    addNote,
  };
}

export type ApplicationBoardController = ReturnType<typeof useApplicationBoard>;
