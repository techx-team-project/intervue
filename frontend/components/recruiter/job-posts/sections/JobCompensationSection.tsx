import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { JobPostFormData } from '@/schemas/job.schema';
import { UseFormReturn, useWatch } from 'react-hook-form';

const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
];

interface JobCompensationSectionProps {
  form: UseFormReturn<JobPostFormData>;
}

export default function JobCompensationSection({ form }: JobCompensationSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const negotiable = useWatch({ control, name: 'salary.negotiable' });

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-navy text-[15px] font-bold">Salary</h2>

        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            {...register('salary.negotiable')}
          />
          <span>Negotiable</span>
        </label>
      </div>

      {!negotiable && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Minimum salary"
            type="number"
            placeholder="VD: 15000000"
            error={errors.salary?.min?.message}
            {...register('salary.min', { valueAsNumber: true })}
          />
          <Input
            label="Maximum salary"
            type="number"
            placeholder="VD: 25000000"
            error={errors.salary?.max?.message}
            {...register('salary.max', { valueAsNumber: true })}
          />
          <Select label="Currency" options={CURRENCY_OPTIONS} {...register('salary.currency')} />
        </div>
      )}
    </div>
  );
}
