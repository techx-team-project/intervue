'use client';

import { candidateApi } from '@/apiRequest/candidate';
import { renewSession } from '@/apiRequest/http';
import { IMAGE_ERROR_MESSAGES } from '@/constants/candidate-profile';
import { isApiError } from '@/lib/api-error';
import type { CandidateProfileResponse, SaveCandidateProfileRequest } from '@/types/candidate-profile';
import { getErrorMessage } from '@/utils/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const PROFILE_KEY = ['candidate-profile'];

export type CandidateImageKind = 'avatar' | 'cover';

const IMAGE_ACTIONS = {
  avatar: { upload: candidateApi.uploadAvatar, remove: candidateApi.removeAvatar, label: 'Profile photo' },
  cover: { upload: candidateApi.uploadCover, remove: candidateApi.removeCover, label: 'Cover image' },
};

function getImageErrorMessage(error: unknown): string {
  return (isApiError(error) && IMAGE_ERROR_MESSAGES[error.code]) || getErrorMessage(error);
}

function hasFieldErrors(error: unknown): boolean {
  return isApiError(error) && error.details.some((detail) => Boolean(detail.field));
}

export function useCandidateProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: candidateApi.getProfile });
}

export function useUpdateCandidateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveCandidateProfileRequest) => candidateApi.updateProfile(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_KEY, profile);
      toast.success('Profile updated.');
      void renewSession().catch(() => undefined);
    },
    onError: (error) => {
      if (!hasFieldErrors(error)) toast.error(getErrorMessage(error));
    },
  });
}

export function useCandidateImage(kind: CandidateImageKind) {
  const queryClient = useQueryClient();
  const { upload, remove, label } = IMAGE_ACTIONS[kind];
  const settle = () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
  const setProfile = (profile: CandidateProfileResponse) => queryClient.setQueryData(PROFILE_KEY, profile);

  const uploadMutation = useMutation({
    mutationFn: upload,
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success(`${label} updated.`);
    },
    onError: (error) => toast.error(getImageErrorMessage(error)),
    onSettled: settle,
  });

  const removeMutation = useMutation({
    mutationFn: remove,
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success(`${label} removed.`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: settle,
  });

  return { upload: uploadMutation, remove: removeMutation };
}
