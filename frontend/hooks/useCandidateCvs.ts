'use client';

import { candidateCvApi } from '@/apiRequest/candidate-cv';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const candidateCvKeys = { all: ['candidate', 'cvs'] as const };

export function useCandidateCvs(enabled = true) {
  return useQuery({ queryKey: candidateCvKeys.all, queryFn: candidateCvApi.list, enabled });
}

export function useCandidateCvMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: candidateCvKeys.all });

  const upload = useMutation({ mutationFn: (file: File) => candidateCvApi.upload(file), onSuccess: refresh });
  const rename = useMutation({
    mutationFn: ({ id, fileName }: { id: number; fileName: string }) => candidateCvApi.rename(id, fileName),
    onSuccess: refresh,
  });
  const setDefault = useMutation({ mutationFn: (id: number) => candidateCvApi.setDefault(id), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (id: number) => candidateCvApi.remove(id), onSuccess: refresh });

  return { upload, rename, setDefault, remove };
}
