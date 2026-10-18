'use client';

import Button from '@/components/ui/Button';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const MOCK_DELAY_MS = 1200;

const MOCK_DESCRIPTION =
  'Chúng tôi đang tìm kiếm một thành viên tài năng để tham gia đội ngũ kỹ thuật, chịu trách nhiệm phát triển và vận hành các tính năng cốt lõi của sản phẩm. Bạn sẽ làm việc trong môi trường năng động, phối hợp chặt chẽ với các team Product và Design.';

const MOCK_REQUIREMENTS =
  'Có kinh nghiệm làm việc với các công nghệ liên quan đến vị trí ứng tuyển. Tư duy giải quyết vấn đề tốt, khả năng làm việc nhóm và giao tiếp rõ ràng. Ưu tiên ứng viên có kinh nghiệm trong lĩnh vực tuyển dụng/HR Tech.';

interface JobAiGenerateCardProps {
  form: UseFormReturn<JobPostFormData>;
  onGenerated: () => void;
}

export default function JobAiGenerateCard({ form, onGenerated }: JobAiGenerateCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    form.setValue('description', MOCK_DESCRIPTION, { shouldValidate: true, shouldDirty: true });
    form.setValue('requirements', MOCK_REQUIREMENTS, { shouldValidate: true, shouldDirty: true });
    setIsGenerating(false);
    onGenerated();
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
      <div className="text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
        <Sparkles className="h-4.5 w-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-navy text-[13px] font-bold">Tạo mô tả công việc bằng AI</p>
        <p className="mt-0.5 text-[12px] text-[#64748b]">
          AI sẽ gợi ý nội dung mô tả và yêu cầu dựa trên tên tin và kỹ năng bạn đã nhập.
        </p>
      </div>

      <Button type="button" size="sm" variant="outline" isLoading={isGenerating} onClick={handleGenerate}>
        Tạo ngay
      </Button>
    </div>
  );
}
