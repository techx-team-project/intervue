'use client';

import Input from '@/components/ui/Input';
import type { DateRangeValues } from '@/schemas/candidate-sections.schema';
import { useFormContext, useWatch } from 'react-hook-form';

type CandidateDateRangeFieldsProps = {
  currentLabel: string;
};

export default function CandidateDateRangeFields({ currentLabel }: CandidateDateRangeFieldsProps) {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<DateRangeValues>();
  const current = useWatch({ control, name: 'current' });
  const revalidateEnd = { onChange: () => void trigger('endDate') };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          type="month"
          placeholder="YYYY-MM"
          error={errors.startDate?.message}
          {...register('startDate', revalidateEnd)}
        />
        <Input
          label="End date"
          type="month"
          placeholder="YYYY-MM"
          disabled={current}
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>
      <label className="text-on-surface flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-emerald-600" {...register('current', revalidateEnd)} />
        {currentLabel}
      </label>
    </div>
  );
}
