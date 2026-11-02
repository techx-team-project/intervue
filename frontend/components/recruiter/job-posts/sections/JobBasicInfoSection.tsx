'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Sparkles } from 'lucide-react';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form';

const LEVEL_OPTIONS = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead / Principal' },
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

const CITY_OPTIONS = [
  { value: '', label: 'Select city/province' },
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Da Nang', label: 'Da Nang' },
  { value: 'Can Tho', label: 'Can Tho' },
  { value: 'Hai Phong', label: 'Hai Phong' },
  { value: 'Remote', label: 'Remote (Worldwide / Vietnam)' },
];

const POPULAR_SKILLS = [
  'Java',
  'Spring Boot',
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'Docker',
  'Kubernetes',
  'AWS',
  'MySQL',
  'PostgreSQL',
  'Tailwind CSS',
  'Redis',
  'Kafka',
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

  const currentCity = useWatch({ control, name: 'location.city' });

  return (
    <section
      id="section-basic"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
          1
        </span>
        <h2 className="text-navy text-[16px] font-bold">Basic information</h2>
      </div>

      <div className="mt-5 space-y-4">
        {/* Job Title */}
        <Input
          label="Job post title"
          placeholder="e.g. Senior Backend Engineer (Java / Spring Boot)"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Level, Contract & Arrangement */}
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

        {/* Location row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="City / Province"
            options={CITY_OPTIONS}
            error={errors.location?.city?.message}
            {...register('location.city')}
          />
          <Input
            label="District / Area"
            placeholder={currentCity === 'Hanoi' ? 'e.g. Cau Giay' : 'e.g. District 1'}
            {...register('location.district')}
          />
          <Input
            label="Specific address"
            placeholder="e.g. Duy Tan or Optional"
            {...register('location.specificAddress')}
          />
        </div>

        {/* Required Skills & Quick Suggestions */}
        <div className="space-y-2">
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <div>
                <TagInput
                  label="Required skills"
                  placeholder="Type a skill and press Enter"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.skills?.message}
                />

                {/* Quick suggestions chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    Quick add:
                  </span>
                  {POPULAR_SKILLS.map((skill) => {
                    const isAdded = field.value?.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          if (!isAdded) {
                            field.onChange([...(field.value || []), skill]);
                          }
                        }}
                        className={`cursor-pointer rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all ${
                          isAdded
                            ? 'cursor-default border-emerald-200 bg-emerald-50 text-emerald-700 opacity-50'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700'
                        }`}
                      >
                        {isAdded ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
