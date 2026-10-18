'use client';

import FileDropInput from '@/components/ui/FileDropInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

const MOCK_DELAY_MS = 1500;

const MOCK_PARSED_DATA: Partial<JobPostFormData> = {
  title: 'Fullstack Engineer (Node.js/React)',
  level: 'MID',
  contractType: 'FULL_TIME',
  workingArrangement: 'HYBRID',
  skills: ['Node.js', 'React', 'PostgreSQL'],
  description:
    'Nội dung được trích xuất từ file JD bạn tải lên (demo). Xây dựng và bảo trì các dịch vụ backend và giao diện người dùng cho hệ thống.',
  requirements: 'Nội dung được trích xuất từ file JD bạn tải lên (demo). Tối thiểu 2 năm kinh nghiệm fullstack.',
};

interface JobAiFillFromFileCardProps {
  form: UseFormReturn<JobPostFormData>;
  onFilled: () => void;
}

export default function JobAiFillFromFileCard({ form, onFilled }: JobAiFillFromFileCardProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();

  const handleFileSelected = async (file: File) => {
    setFileName(file.name);
    setIsParsing(true);
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    const current = form.getValues();
    form.reset({ ...current, ...MOCK_PARSED_DATA });
    setIsParsing(false);
    onFilled();
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
      <p className="text-navy text-[13px] font-bold">Điền tự động từ file JD</p>
      <p className="mt-0.5 mb-3 text-[12px] text-[#64748b]">
        Tải lên file mô tả công việc có sẵn, AI sẽ điền tự động vào form bên dưới.
      </p>

      <FileDropInput
        onFileSelected={handleFileSelected}
        selectedFileName={isParsing ? `Đang xử lý ${fileName}...` : fileName}
      />
    </div>
  );
}
