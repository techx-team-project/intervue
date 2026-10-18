import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import type { JobPostFormData } from '@/schemas/job.schema';
import { Controller, UseFormReturn } from 'react-hook-form';

const LEVEL_OPTIONS = [
  { value: 'INTERN', label: 'Thực tập sinh' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
];

const CONTRACT_OPTIONS = [
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
];

const ARRANGEMENT_OPTIONS = [
  { value: 'ON_SITE', label: 'Tại văn phòng' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Từ xa' },
  { value: 'FLEXIBLE', label: 'Linh hoạt' },
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
      <h2 className="text-navy text-[15px] font-bold">Thông tin cơ bản</h2>

      <div className="mt-4 space-y-4">
        <Input
          label="Tên tin tuyển dụng"
          placeholder="VD: Backend Engineer (Java/Spring)"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Cấp bậc" options={LEVEL_OPTIONS} error={errors.level?.message} {...register('level')} />
          <Select
            label="Loại hợp đồng"
            options={CONTRACT_OPTIONS}
            error={errors.contractType?.message}
            {...register('contractType')}
          />
          <Select
            label="Hình thức làm việc"
            options={ARRANGEMENT_OPTIONS}
            error={errors.workingArrangement?.message}
            {...register('workingArrangement')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Tỉnh/Thành phố"
            placeholder="VD: Hà Nội"
            error={errors.location?.city?.message}
            {...register('location.city')}
          />
          <Input label="Quận/Huyện" placeholder="VD: Cầu Giấy" {...register('location.district')} />
          <Input label="Địa chỉ cụ thể" placeholder="Tùy chọn" {...register('location.specificAddress')} />
        </div>

        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <TagInput
              label="Kỹ năng yêu cầu"
              placeholder="Nhập kỹ năng rồi nhấn Enter"
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
