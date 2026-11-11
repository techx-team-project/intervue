import { candidateCvProfileApi } from '@/apiRequest/candidate-cv-profile';
import type { ApplyCvParsedRequest } from '@/types/candidate-cv-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCandidateCvProfile() {
  const queryClient = useQueryClient();

  const parseCv = useMutation({
    mutationFn: ({ file, resumeId }: { file?: File; resumeId?: number }) =>
      candidateCvProfileApi.parseCv({ file, resumeId }),
  });

  const applyCvParsed = useMutation({
    mutationFn: (payload: ApplyCvParsedRequest) => candidateCvProfileApi.applyCvParsed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
      toast.success('Hồ sơ đã được cập nhật thành công từ CV!');
    },
  });

  return { parseCv, applyCvParsed };
}
