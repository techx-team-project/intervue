'use client';

import { candidateApi } from '@/apiRequest/candidate';
import { IMAGE_ERROR_MESSAGES, SECTION_LABELS } from '@/constants/candidate-profile';
import { isApiError } from '@/lib/api-error';
import type { CandidateProfileResponse, CandidateSection, CandidateSectionRequests } from '@/types/candidate-profile';
import { hasFieldErrors, PROFILE_KEY } from '@/hooks/useCandidateProfile';
import { getErrorMessage } from '@/utils/error';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

type SaveItemVariables<S extends CandidateSection> = { id?: number; body: CandidateSectionRequests[S] };

export type SaveItemMutation<S extends CandidateSection> = UseMutationResult<
  CandidateProfileResponse,
  Error,
  SaveItemVariables<S>
>;

function getSectionErrorMessage(error: unknown): string {
  if (!isApiError(error)) return getErrorMessage(error);
  return IMAGE_ERROR_MESSAGES[error.code] ?? getErrorMessage(error);
}

function isNotFound(error: unknown): boolean {
  return isApiError(error) && error.code === 'NOT_FOUND';
}

function useProfileSetter() {
  const queryClient = useQueryClient();
  return (profile: CandidateProfileResponse) => queryClient.setQueryData(PROFILE_KEY, profile);
}

export function useSaveCandidateItem<S extends CandidateSection>(section: S) {
  const queryClient = useQueryClient();
  const setProfile = useProfileSetter();

  return useMutation({
    mutationFn: ({ id, body }: SaveItemVariables<S>) =>
      id === undefined ? candidateApi.createItem(section, body) : candidateApi.updateItem(section, id, body),
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success(`${SECTION_LABELS[section]} saved.`);
    },
    onError: (error) => {
      if (isNotFound(error)) void queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      if (!hasFieldErrors(error)) toast.error(getSectionErrorMessage(error));
    },
  });
}

export function useDeleteCandidateItem(section: CandidateSection) {
  const queryClient = useQueryClient();
  const setProfile = useProfileSetter();

  return useMutation({
    mutationFn: (id: number) => candidateApi.deleteItem(section, id),
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success(`${SECTION_LABELS[section]} removed.`);
    },
    onError: (error) => {
      if (isNotFound(error)) void queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      toast.error(getSectionErrorMessage(error));
    },
  });
}

export function useCertificationImage() {
  const queryClient = useQueryClient();
  const setProfile = useProfileSetter();
  const settle = () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY });

  const upload = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => candidateApi.uploadCertificationImage(id, file),
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success('Certificate image updated.');
    },
    onError: (error) => toast.error(getSectionErrorMessage(error)),
    onSettled: settle,
  });

  const remove = useMutation({
    mutationFn: (id: number) => candidateApi.removeCertificationImage(id),
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success('Certificate image removed.');
    },
    onError: (error) => toast.error(getSectionErrorMessage(error)),
    onSettled: settle,
  });

  return { upload, remove };
}
