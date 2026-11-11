'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BOOST_TIER_OPTIONS, ENTITLEMENT_TYPE_OPTIONS } from '@/constants/service-package';
import {
  DURATION_REQUIRED_ENTITLEMENT_TYPES,
  type PackageBenefitFormData,
  type SaveServicePackageFormData,
} from '@/schemas/service-package.schema';
import type { EntitlementType } from '@/types/service-package';
import { ArrowDown, ArrowUp, Info, Plus, Trash2 } from 'lucide-react';
import {
  Controller,
  useWatch,
  type Control,
  type FieldArrayWithId,
  type FieldErrors,
  type UseFieldArrayAppend,
  type UseFieldArrayMove,
  type UseFieldArrayRemove,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';

interface PackageBenefitsEditorProps {
  control: Control<SaveServicePackageFormData>;
  register: UseFormRegister<SaveServicePackageFormData>;
  setValue: UseFormSetValue<SaveServicePackageFormData>;
  errors: FieldErrors<SaveServicePackageFormData>;
  fields: FieldArrayWithId<SaveServicePackageFormData, 'benefits', 'id'>[];
  append: UseFieldArrayAppend<SaveServicePackageFormData, 'benefits'>;
  remove: UseFieldArrayRemove;
  move: UseFieldArrayMove;
}

const DEFAULT_BENEFIT: PackageBenefitFormData = {
  entitlementType: 'JOB_POST_SLOT',
  quantity: '1',
  tier: '1',
  durationDays: '30',
  label: '',
};

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function PackageBenefitsEditor({
  control,
  register,
  setValue,
  errors,
  fields,
  append,
  remove,
  move,
}: PackageBenefitsEditorProps) {
  const watchedBenefits = useWatch({ control, name: 'benefits' });

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-lg border bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-navy dark:text-forest-50 text-base font-bold">Entitlements &amp; benefits</h2>
          <p className="dark:text-forest-300 text-on-surface-variant mt-0.5 text-xs">
            Machine-readable rights granted to the company when an order is paid and fulfilled.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          radius="lg"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => append({ ...DEFAULT_BENEFIT })}
          className="dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850"
        >
          Add benefit
        </Button>
      </div>

      <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/60 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs">
        <Info className="text-on-surface-variant dark:text-forest-300 mt-0.5 h-4 w-4 shrink-0" />
        <p className="dark:text-forest-300 text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface dark:text-forest-100">Tip:</strong> Only{' '}
          <code className="font-mono">JOB_BOOST</code> uses ranking tier (1–3). For spendable credit grants (like Trial
          bonus credits), add a <code className="font-mono">CREDIT</code> row here — the{' '}
          <span className="italic">Bonus credits</span> field above is catalog/order display metadata.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="dark:border-forest-700 border-outline-variant rounded-lg border border-dashed px-4 py-8 text-center">
          <p className="dark:text-forest-300 text-on-surface-variant text-sm">
            No benefits configured yet. Click &ldquo;Add benefit&rdquo; to define what this package grants.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const currentType = watchedBenefits?.[index]?.entitlementType ?? field.entitlementType;
            const currentDuration = watchedBenefits?.[index]?.durationDays ?? field.durationDays;
            const isBoost = currentType === 'JOB_BOOST';
            const requiresDuration = DURATION_REQUIRED_ENTITLEMENT_TYPES.has(currentType);
            const rowErrors = errors.benefits?.[index];

            return (
              <div
                key={field.id}
                className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/30 space-y-3 rounded-lg border p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-forest-200 text-navy text-xs font-bold">Benefit #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                      aria-label={`Move benefit ${index + 1} up`}
                      className="text-on-surface-variant hover:bg-surface-container-high dark:text-forest-300 dark:hover:bg-forest-800 cursor-pointer rounded p-1 transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                      aria-label={`Move benefit ${index + 1} down`}
                      className="text-on-surface-variant hover:bg-surface-container-high dark:text-forest-300 dark:hover:bg-forest-800 cursor-pointer rounded p-1 transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove benefit ${index + 1}`}
                      className="text-outline cursor-pointer rounded p-1 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Controller
                      control={control}
                      name={`benefits.${index}.entitlementType`}
                      render={({ field: typeField }) => (
                        <Select
                          label="Entitlement type"
                          value={typeField.value}
                          onChange={(event) => {
                            const nextType = event.target.value as EntitlementType;
                            typeField.onChange(nextType);
                            if (nextType !== 'JOB_BOOST') {
                              setValue(`benefits.${index}.tier`, '1', { shouldValidate: true });
                            }
                            if (DURATION_REQUIRED_ENTITLEMENT_TYPES.has(nextType) && !currentDuration?.trim()) {
                              setValue(`benefits.${index}.durationDays`, '30', { shouldValidate: true });
                            }
                          }}
                          options={ENTITLEMENT_TYPE_OPTIONS}
                          error={rowErrors?.entitlementType?.message}
                          className={CONTROL_DARK_CLASS}
                        />
                      )}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <Input
                      label="Quantity"
                      type="number"
                      min={1}
                      {...register(`benefits.${index}.quantity`)}
                      error={rowErrors?.quantity?.message}
                      className={CONTROL_DARK_CLASS}
                    />
                  </div>

                  <div className="lg:col-span-3">
                    {isBoost ? (
                      <Select
                        label="Boost tier"
                        {...register(`benefits.${index}.tier`)}
                        options={BOOST_TIER_OPTIONS}
                        error={rowErrors?.tier?.message}
                        className={CONTROL_DARK_CLASS}
                      />
                    ) : (
                      <Input
                        label="Tier"
                        value="1 (default)"
                        readOnly
                        disabled
                        className="dark:border-forest-800 dark:bg-forest-900/60 dark:text-forest-400 bg-surface-container-low text-on-surface-variant cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div className="lg:col-span-3">
                    <Input
                      label={requiresDuration ? 'Duration (days) *' : 'Duration (days)'}
                      type="number"
                      min={1}
                      placeholder={requiresDuration ? 'Required (min 1 day)' : 'Empty = no expiry'}
                      {...register(`benefits.${index}.durationDays`)}
                      error={rowErrors?.durationDays?.message}
                      className={CONTROL_DARK_CLASS}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-12">
                    <Input
                      label="Recruiter-facing label (Vietnamese)"
                      placeholder="e.g. 05 tin tuyển dụng trong 30 ngày"
                      {...register(`benefits.${index}.label`)}
                      error={rowErrors?.label?.message}
                      className={CONTROL_DARK_CLASS}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
