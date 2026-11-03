import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { RECRUITER_CITY_OPTIONS } from '@/constants/recruiter-onboarding';
import type { RecruiterProfileFormData } from '@/schemas/recruiter.schema';
import { Building2, Phone, User } from 'lucide-react';
import type { FieldErrors, Path, UseFormRegister } from 'react-hook-form';

type RecruiterProfileFieldsProps<T extends RecruiterProfileFormData> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<RecruiterProfileFormData>;
};

export default function RecruiterProfileFields<T extends RecruiterProfileFormData>({
  register,
  errors,
}: RecruiterProfileFieldsProps<T>) {
  const field = (name: keyof RecruiterProfileFormData) => register(name as Path<T>);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-8">
          <Input
            id="name"
            label="Full name *"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            className="py-3 text-sm sm:text-base"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...field('name')}
          />
        </div>

        <div className="md:col-span-4">
          <span id="gender-label" className="mb-1.5 block text-sm font-semibold text-slate-800">
            Gender *
          </span>
          <div role="radiogroup" aria-labelledby="gender-label" className="flex h-11 items-center gap-6">
            <label
              htmlFor="gender-male"
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 sm:text-base"
            >
              <input
                id="gender-male"
                type="radio"
                value="MALE"
                {...field('gender')}
                className="h-4.5 w-4.5 cursor-pointer text-[#00b14f] focus:ring-[#00b14f]"
              />
              <span>Male</span>
            </label>
            <label
              htmlFor="gender-female"
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 sm:text-base"
            >
              <input
                id="gender-female"
                type="radio"
                value="FEMALE"
                {...field('gender')}
                className="h-4.5 w-4.5 cursor-pointer text-[#00b14f] focus:ring-[#00b14f]"
              />
              <span>Female</span>
            </label>
          </div>
          {errors.gender && <p className="mt-1 text-xs font-medium text-rose-500">{errors.gender.message}</p>}
        </div>
      </div>

      <Input
        id="phone"
        label="Phone number *"
        type="tel"
        placeholder="Phone number"
        autoComplete="tel"
        className="py-3 text-sm sm:text-base"
        leftIcon={<Phone className="h-5 w-5" />}
        error={errors.phone?.message}
        {...field('phone')}
      />

      <Input
        id="companyName"
        label="Company *"
        type="text"
        placeholder="Company name"
        className="py-3 text-sm sm:text-base"
        leftIcon={<Building2 className="h-5 w-5" />}
        error={errors.companyName?.message}
        {...field('companyName')}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          id="city"
          label="Work location *"
          placeholder="Select a city"
          options={RECRUITER_CITY_OPTIONS}
          className="py-3 text-sm sm:text-base"
          error={errors.city?.message}
          {...field('city')}
        />

        <Input
          id="districtWard"
          label="District / ward"
          type="text"
          placeholder="District, ward"
          className="py-3 text-sm sm:text-base"
          error={errors.districtWard?.message}
          {...field('districtWard')}
        />
      </div>
    </div>
  );
}
