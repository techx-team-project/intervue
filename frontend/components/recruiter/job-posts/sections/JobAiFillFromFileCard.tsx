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
    'Content extracted from the JD file you uploaded (demo). Build and maintain the backend services and user interfaces of the system.',
  requirements: 'Content extracted from the JD file you uploaded (demo). At least 2 years of fullstack experience.',
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
      <p className="text-navy text-[13px] font-bold">Auto-fill from a JD file</p>
      <p className="mt-0.5 mb-3 text-[12px] text-[#64748b]">
        Upload an existing job description and AI will fill in the form below.
      </p>

      <FileDropInput
        onFileSelected={handleFileSelected}
        selectedFileName={isParsing ? `Processing ${fileName}...` : fileName}
      />
    </div>
  );
}
