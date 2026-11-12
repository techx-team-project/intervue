'use client';

import JobLocationPicker from '@/components/map/JobLocationPicker';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import {
  JOB_CITY_SUGGESTIONS,
  JOB_FORM_ARRANGEMENT_OPTIONS,
  JOB_FORM_CONTRACT_OPTIONS,
  JOB_FORM_CURRENCY_OPTIONS,
  JOB_FORM_LEVEL_OPTIONS,
  JOB_FORM_ROLE_OPTIONS,
  JOB_FORM_SALARY_BASIS_OPTIONS,
} from '@/constants/recruiter-job';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Controller, useFormContext } from 'react-hook-form';
import FormSection from './FormSection';
import SkillPicker from './SkillPicker';

const CITY_LIST_ID = 'job-city-suggestions';

function numberOrUndefined(raw: string): number | undefined {
  return raw === '' ? undefined : Number(raw);
}

export default function JobBasicsStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobPostFormData>();
  const [city, address, latitude, longitude] = watch(['city', 'address', 'latitude', 'longitude']);
  const negotiable = watch('salaryNegotiable');
  const currency = watch('currency');
  const salaryError = errors.salaryMax?.message ?? errors.salaryMin?.message;
  const experienceError = errors.experienceMinYears?.message ?? errors.experienceMaxYears?.message;

  return (
    <div className="space-y-5">
      <FormSection title="Thông tin chung" description="Những gì ứng viên nhìn thấy đầu tiên trong danh sách việc làm.">
        <Input
          label="Tiêu đề tin tuyển dụng"
          placeholder="Ví dụ: Backend Engineer (Java / Spring Boot)"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Nhóm vị trí"
            placeholder="Chọn nhóm vị trí"
            options={JOB_FORM_ROLE_OPTIONS}
            error={errors.jobRole?.message}
            {...register('jobRole', { setValueAs: (value: string) => (value === '' ? undefined : value) })}
          />
          <Select
            label="Cấp bậc"
            options={JOB_FORM_LEVEL_OPTIONS}
            error={errors.level?.message}
            {...register('level')}
          />
          <Select
            label="Loại hợp đồng"
            options={JOB_FORM_CONTRACT_OPTIONS}
            error={errors.contractType?.message}
            {...register('contractType')}
          />
          <Select
            label="Hình thức làm việc"
            options={JOB_FORM_ARRANGEMENT_OPTIONS}
            error={errors.workingArrangement?.message}
            {...register('workingArrangement')}
          />
        </div>
      </FormSection>

      <FormSection title="Địa điểm làm việc">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Nơi làm việc"
              placeholder="Chọn hoặc nhập tỉnh / thành phố"
              list={CITY_LIST_ID}
              error={errors.city?.message}
              {...register('city')}
            />
            <datalist id={CITY_LIST_ID}>
              {JOB_CITY_SUGGESTIONS.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>
          <Input
            label="Địa chỉ cụ thể (không bắt buộc)"
            placeholder="Số nhà, đường, quận / chi nhánh"
            error={errors.address?.message}
            {...register('address')}
          />
        </div>

        <JobLocationPicker
          latitude={latitude}
          longitude={longitude}
          addressQuery={[address, city].filter(Boolean).join(', ')}
          onChange={(point) => {
            setValue('latitude', point?.lat, { shouldDirty: true });
            setValue('longitude', point?.lng, { shouldDirty: true });
          }}
        />
      </FormSection>

      <FormSection title="Mức lương & kinh nghiệm">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-on-surface block text-sm font-semibold">Mức lương (mỗi tháng)</span>
            <Controller
              control={control}
              name="salaryNegotiable"
              render={({ field }) => (
                <label className="text-on-surface-variant flex cursor-pointer items-center gap-2 text-xs font-medium">
                  Thỏa thuận
                  <Switch size="sm" ariaLabel="Lương thỏa thuận" checked={field.value} onChange={field.onChange} />
                </label>
              )}
            />
          </div>

          {!negotiable && (
            <>
              <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={currency === 'VND' ? 0.5 : 100}
                  placeholder="Từ"
                  aria-label="Lương tối thiểu"
                  {...register('salaryMin', { setValueAs: numberOrUndefined })}
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={currency === 'VND' ? 0.5 : 100}
                  placeholder="Đến"
                  aria-label="Lương tối đa"
                  {...register('salaryMax', { setValueAs: numberOrUndefined })}
                />
                <Select
                  aria-label="Đơn vị lương"
                  options={JOB_FORM_CURRENCY_OPTIONS}
                  className="min-w-28"
                  {...register('currency')}
                />
              </div>

              <div role="radiogroup" aria-label="Cách tính lương" className="flex flex-wrap gap-2">
                {JOB_FORM_SALARY_BASIS_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="border-outline-variant text-on-surface-variant text-body-sm has-[:checked]:border-primary has-[:checked]:bg-primary-light has-[:checked]:text-primary-deep has-[:focus-visible]:ring-primary/30 inline-flex h-9 cursor-pointer items-center rounded-lg border bg-white px-3 font-medium transition-colors has-[:focus-visible]:ring-2"
                  >
                    <input type="radio" value={option.value} className="sr-only" {...register('salaryBasis')} />
                    {option.label}
                  </label>
                ))}
              </div>
            </>
          )}
          {salaryError && !negotiable && <p className="text-xs font-medium text-rose-500">{salaryError}</p>}
        </div>

        <div className="space-y-1.5">
          <span className="text-on-surface block text-sm font-semibold">Kinh nghiệm yêu cầu (năm, không bắt buộc)</span>
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Từ"
              aria-label="Số năm kinh nghiệm tối thiểu"
              {...register('experienceMinYears', { setValueAs: numberOrUndefined })}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Đến"
              aria-label="Số năm kinh nghiệm tối đa"
              {...register('experienceMaxYears', { setValueAs: numberOrUndefined })}
            />
          </div>
          {experienceError && <p className="text-xs font-medium text-rose-500">{experienceError}</p>}
        </div>
      </FormSection>

      <FormSection title="Kỹ năng & tuyển dụng">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <SkillPicker value={field.value} onChange={field.onChange} error={errors.skills?.message} />
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input type="date" label="Hạn nộp hồ sơ" error={errors.deadline?.message} {...register('deadline')} />
          <Input
            type="number"
            min={1}
            label="Số lượng cần tuyển"
            error={errors.openings?.message}
            {...register('openings', { valueAsNumber: true })}
          />
        </div>
      </FormSection>
    </div>
  );
}
