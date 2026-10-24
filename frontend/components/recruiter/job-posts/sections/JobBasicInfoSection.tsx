import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Controller, UseFormReturn } from 'react-hook-form';

const LEVEL_OPTIONS = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
];

const CONTRACT_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const ARRANGEMENT_OPTIONS = [
  { value: 'ON_SITE', label: 'On-site' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'FLEXIBLE', label: 'Flexible' },
];

interface JobBasicInfoSectionProps {
  form: UseFormReturn<JobPostFormData>;
}

export default function JobBasicInfoSection({ form }: JobBasicInfoSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs sm:p-7">
      <h2 className="text-navy text-[15px] font-bold">Basic information</h2>

      <div className="mt-4 space-y-4">
        <Input
          label="Job post title"
          placeholder="VD: Backend Engineer (Java/Spring)"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Level" options={LEVEL_OPTIONS} error={errors.level?.message} {...register('level')} />
          <Select
            label="Contract type"
            options={CONTRACT_OPTIONS}
            error={errors.contractType?.message}
            {...register('contractType')}
          />
          <Select
            label="Working arrangement"
            options={ARRANGEMENT_OPTIONS}
            error={errors.workingArrangement?.message}
            {...register('workingArrangement')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="City/Province"
            placeholder="e.g. Hanoi"
            error={errors.location?.city?.message}
            {...register('location.city')}
          />
          <Input label="District" placeholder="e.g. Cau Giay" {...register('location.district')} />
          <Input label="Specific address" placeholder="Optional" {...register('location.specificAddress')} />
        </div>

        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <TagInput
              label="Required skills"
              placeholder="Type a skill and press Enter"
              value={field.value}
              onChange={field.onChange}
              error={errors.skills?.message}
            />
          )}
        />
      </div>
    </div>
  );
}
