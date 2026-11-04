'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import type { JobLevel, WorkingArrangement } from '@/types/recruiter-job';
import {
  Building2,
  Clock,
  Code2,
  Crown,
  GraduationCap,
  Home,
  Laptop2,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form';

const CONTRACT_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const CITY_OPTIONS = [
  { value: '', label: 'Select city / province' },
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Da Nang', label: 'Da Nang' },
  { value: 'Can Tho', label: 'Can Tho' },
  { value: 'Hai Phong', label: 'Hai Phong' },
  { value: 'Remote', label: 'Remote (Worldwide / Vietnam)' },
];

const LEVEL_ITEMS: Array<{ value: JobLevel; label: string; icon: React.ElementType }> = [
  { value: 'INTERN', label: 'Intern', icon: GraduationCap },
  { value: 'JUNIOR', label: 'Junior', icon: User },
  { value: 'MID', label: 'Middle', icon: Code2 },
  { value: 'SENIOR', label: 'Senior', icon: ShieldCheck },
  { value: 'LEAD', label: 'Lead / Principal', icon: Crown },
];

const ARRANGEMENT_ITEMS: Array<{ value: WorkingArrangement; label: string; icon: React.ElementType }> = [
  { value: 'ON_SITE', label: 'On-site', icon: Building2 },
  { value: 'HYBRID', label: 'Hybrid', icon: Laptop2 },
  { value: 'REMOTE', label: 'Remote', icon: Home },
  { value: 'FLEXIBLE', label: 'Flexible', icon: Clock },
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

      <div className="mt-5 space-y-5">
        {/* Job Title */}
        <Input
          label="Job post title"
          placeholder="e.g. Senior Backend Engineer (Java / Spring Boot)"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Level Segmented Radio Cards */}
        <div>
          <label className="mb-2 block text-xs font-bold tracking-wide text-slate-700 uppercase">
            Experience Level
          </label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {LEVEL_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = field.value === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => field.onChange(item.value)}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.level && <p className="mt-1 text-xs text-rose-500">{errors.level.message}</p>}
        </div>

        {/* Working Arrangement Segmented Radio Cards */}
        <div>
          <label className="mb-2 block text-xs font-bold tracking-wide text-slate-700 uppercase">
            Working Arrangement
          </label>
          <Controller
            control={control}
            name="workingArrangement"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ARRANGEMENT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = field.value === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => field.onChange(item.value)}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-center transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 font-bold text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.workingArrangement && (
            <p className="mt-1 text-xs text-rose-500">{errors.workingArrangement.message}</p>
          )}
        </div>

        {/* Contract Type & Location Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Contract type"
            options={CONTRACT_OPTIONS}
            error={errors.contractType?.message}
            {...register('contractType')}
          />
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
        </div>

        <Input
          label="Specific office address (Optional)"
          placeholder="e.g. 12 Duy Tan, Cau Giay, Hanoi"
          {...register('location.specificAddress')}
        />

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
