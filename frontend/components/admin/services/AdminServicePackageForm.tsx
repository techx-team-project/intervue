'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import { AdminPageBarActions } from '@/components/admin/AdminPageBarContext';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PackageBenefitsEditor from '@/components/admin/services/packages/PackageBenefitsEditor';
import PackageColorField from '@/components/admin/services/packages/PackageColorField';
import PackageLivePreview from '@/components/admin/services/packages/PackageLivePreview';
import PackageSectionsEditor from '@/components/admin/services/packages/PackageSectionsEditor';
import { Button, buttonClassName } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import { adminServicePackageKeys } from '@/lib/admin-service-packages';
import {
  buildSamplePackageFormData,
  PACKAGE_FIELD_LIMITS,
  saveServicePackageSchema,
  slugifyPackageName,
  toPackageFormDefaults,
  toSaveServicePackagePayload,
  type SaveServicePackageFormData,
} from '@/schemas/service-package.schema';
import type { AdminServiceCategory, AdminServicePackage } from '@/types/admin-service-package';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Info, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminServicePackageFormProps {
  categories: AdminServiceCategory[];
  existingPackages?: AdminServicePackage[];
  initial?: AdminServicePackage;
  initialCategoryId?: number;
}

const BADGE_OPTIONS = [
  { value: 'NONE', label: 'None' },
  { value: 'NEW', label: 'New' },
  { value: 'SPECIAL_OFFER', label: 'Special offer' },
];

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

function suggestDisplayOrderForCategory(
  packages: AdminServicePackage[] | undefined,
  categoryId: number | string,
): number {
  const numericCategoryId = Number(categoryId);
  if (!packages || !numericCategoryId) return 1;
  const maxOrder = packages
    .filter((item) => item.categoryId === numericCategoryId)
    .reduce((max, item) => Math.max(max, item.displayOrder), 0);
  return maxOrder + 1;
}

export default function AdminServicePackageForm({
  categories,
  existingPackages,
  initial,
  initialCategoryId,
}: AdminServicePackageFormProps) {
  const formId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditing = Boolean(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [orderTouched, setOrderTouched] = useState(Boolean(initial));

  const defaultCategoryId =
    initial?.categoryId ??
    (initialCategoryId && categories.some((item) => item.id === initialCategoryId) ? initialCategoryId : undefined) ??
    categories.find((category) => category.isActive)?.id ??
    categories[0]?.id ??
    '';

  const suggestedOrder = suggestDisplayOrderForCategory(existingPackages, defaultCategoryId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SaveServicePackageFormData>({
    resolver: zodResolver(saveServicePackageSchema),
    defaultValues: toPackageFormDefaults(initial, defaultCategoryId, suggestedOrder),
  });

  const benefitArray = useFieldArray({ control, name: 'benefits' });
  const sectionArray = useFieldArray({ control, name: 'sections' });

  const watchedValues = useWatch({ control }) as SaveServicePackageFormData;
  const selectedCategory = categories.find((item) => String(item.id) === String(watchedValues.categoryId));

  const creditBenefitSum = (watchedValues.benefits ?? []).reduce((total, benefit) => {
    if (benefit?.entitlementType !== 'CREDIT') return total;
    const qty = Number(benefit.quantity);
    return Number.isInteger(qty) && qty > 0 ? total + qty : total;
  }, 0);

  useEffect(() => {
    if (creditBenefitSum > 0 && watchedValues.bonusCredits !== String(creditBenefitSum)) {
      setValue('bonusCredits', String(creditBenefitSum), { shouldValidate: true });
    }
  }, [creditBenefitSum, setValue, watchedValues.bonusCredits]);

  const nameField = register('name');
  const slugField = register('slug');
  const displayOrderField = register('displayOrder');

  const submitForm = handleSubmit(async (values) => {
    const payload = toSaveServicePackagePayload(values);
    try {
      if (initial) {
        await adminServicePackageApi.updatePackage(initial.id, payload);
        toast.success(`Package "${payload.name}" updated.`);
      } else {
        await adminServicePackageApi.createPackage(payload);
        toast.success(`Package "${payload.name}" created.`);
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.all }),
        queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.categories }),
        queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog }),
      ]);
      router.push(ROUTES.ADMIN_SERVICE_PACKAGES);
    } catch (cause) {
      applyFormError(cause, setError, [
        'categoryId',
        'slug',
        'name',
        'shortDescription',
        'price',
        'currency',
        'badge',
        'vipRibbon',
        'accentColor',
        'validityDays',
        'bonusCredits',
        'oneTimePerCompany',
        'status',
        'displayOrder',
      ]);
    }
  });

  const handleFillSampleData = () => {
    const activeFallbackCategory = categories.find((category) => category.isActive)?.id ?? categories[0]?.id ?? '';
    const targetCategoryId =
      watchedValues.categoryId &&
      categories.some((category) => String(category.id) === String(watchedValues.categoryId))
        ? String(watchedValues.categoryId)
        : String(activeFallbackCategory);

    const sample = buildSamplePackageFormData({
      categoryId: targetCategoryId,
      displayOrder: suggestDisplayOrderForCategory(existingPackages, targetCategoryId),
      existingPackages,
      existingSectionImageUrls: (watchedValues.sections ?? []).map((section) => section.imageUrl ?? ''),
    });

    reset(sample);
    setSlugTouched(true);
    setOrderTouched(true);
    toast.success('Sample package fields filled. Upload section images manually if needed.');
  };

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: `${category.name} (${category.code})${category.isActive ? '' : ' — Hidden'}`,
  }));

  const shortDescriptionLength = (watchedValues.shortDescription ?? '').length;

  if (categories.length === 0) {
    return (
      <div className="space-y-5 pb-12">
        <AdminPageHeader
          description={
            isEditing
              ? 'Update pricing, catalog visuals, entitlement benefits, and marketing sections.'
              : 'Configure a new recruitment service package, entitlements, and recruiter detail sections.'
          }
          actions={
            <Link
              href={ROUTES.ADMIN_SERVICE_PACKAGES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to packages</span>
            </Link>
          }
        />
        <div className="border-outline-variant dark:border-forest-800 dark:bg-forest-900 rounded-lg border bg-white p-8 text-center shadow-xs">
          <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
          <h2 className="text-on-surface dark:text-forest-50 mt-3 text-base font-semibold">
            No service categories available
          </h2>
          <p className="text-on-surface-variant dark:text-forest-300 mx-auto mt-1 max-w-md text-sm">
            Every service package must belong to a category. Create at least one service category before adding a
            package.
          </p>
          <div className="mt-5 flex justify-center">
            <Link href={ROUTES.ADMIN_SERVICE_CATEGORIES_CREATE} className={buttonClassName({ size: 'md' })}>
              Create service category
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {!isEditing && (
        <AdminPageBarActions>
          <Button
            type="button"
            variant="outline"
            size="sm"
            radius="lg"
            leftIcon={<Wand2 className="h-3.5 w-3.5" />}
            onClick={handleFillSampleData}
            className="dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850"
          >
            Fill sample data
          </Button>
        </AdminPageBarActions>
      )}

      <AdminPageHeader
        description={
          isEditing
            ? 'Update pricing, catalog visuals, entitlement benefits, and marketing sections.'
            : 'Configure a new recruitment service package, entitlements, and recruiter detail sections.'
        }
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_SERVICE_PACKAGES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to packages</span>
            </Link>
            <Button type="submit" form={formId} isLoading={isSubmitting}>
              {isEditing ? 'Save changes' : 'Create package'}
            </Button>
          </>
        }
      />

      {selectedCategory && !selectedCategory.isActive && (
        <div className="rounded-lg border border-l-4 border-amber-200/75 border-l-amber-500 bg-amber-50 px-4 py-3 dark:border-amber-800/60 dark:border-l-amber-400 dark:bg-amber-950/35">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-on-surface-variant text-sm leading-relaxed dark:text-amber-100/80">
              <strong className="text-amber-900 dark:text-amber-200">
                Selected category ({selectedCategory.name}) is hidden.
              </strong>{' '}
              Even when saved as Active, recruiters cannot see or purchase this package until{' '}
              <Link
                href={`${ROUTES.ADMIN_SERVICE_CATEGORIES}/${selectedCategory.id}/edit`}
                className="font-semibold text-amber-900 underline underline-offset-2 dark:text-amber-200"
              >
                this category is activated
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form id={formId} onSubmit={submitForm} noValidate className="space-y-5">
          {errors.root?.message && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-lg border bg-white p-5 shadow-2xs">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-base font-bold">Core details &amp; pricing</h2>
              <p className="dark:text-forest-400 text-on-surface-variant mt-0.5 text-xs">
                Identifiers, catalog placement, VND pricing (excluding VAT), and purchase limits.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    label="Category *"
                    options={categoryOptions}
                    value={field.value}
                    onChange={(event) => {
                      const nextCatId = event.target.value;
                      field.onChange(nextCatId);
                      if (!isEditing && !orderTouched) {
                        setValue('displayOrder', String(suggestDisplayOrderForCategory(existingPackages, nextCatId)), {
                          shouldValidate: true,
                        });
                      }
                    }}
                    error={errors.categoryId?.message}
                    className={CONTROL_DARK_CLASS}
                  />
                )}
              />

              <Input
                label={`Package name * (${(watchedValues.name ?? '').length}/${PACKAGE_FIELD_LIMITS.name})`}
                placeholder="e.g. PRO MAX PLUS"
                error={errors.name?.message}
                className={CONTROL_DARK_CLASS}
                {...nameField}
                onChange={(event) => {
                  nameField.onChange(event);
                  if (!isEditing) {
                    const nextName = event.target.value;
                    if (!slugTouched) {
                      setValue('slug', slugifyPackageName(nextName), { shouldValidate: Boolean(nextName) });
                    }
                  }
                }}
              />

              <Input
                label="URL slug *"
                placeholder="pro-max-plus"
                helperText="Used at /recruiter/services/{slug}"
                error={errors.slug?.message}
                className={`font-mono lowercase ${CONTROL_DARK_CLASS}`}
                {...slugField}
                onChange={(event) => {
                  slugField.onChange(event);
                  setSlugTouched(event.target.value.trim().length > 0);
                }}
              />

              <Input
                label="Price (VND, excluding VAT) *"
                type="number"
                min={0}
                placeholder="7500000"
                error={errors.price?.message}
                className={CONTROL_DARK_CLASS}
                {...register('price')}
              />

              <Input
                label="Display order *"
                type="number"
                min={0}
                helperText="Lower numbers appear first inside this category"
                error={errors.displayOrder?.message}
                className={CONTROL_DARK_CLASS}
                {...displayOrderField}
                onChange={(event) => {
                  displayOrderField.onChange(event);
                  setOrderTouched(true);
                }}
              />

              <Select
                label="Badge"
                options={BADGE_OPTIONS}
                error={errors.badge?.message}
                className={CONTROL_DARK_CLASS}
                {...register('badge')}
              />

              <Select
                label="Status *"
                options={STATUS_OPTIONS}
                error={errors.status?.message}
                className={CONTROL_DARK_CLASS}
                {...register('status')}
              />

              <Input
                label="Validity (days)"
                type="number"
                min={1}
                placeholder="Empty = no expiry"
                helperText="Shown on catalog card and detail summary"
                error={errors.validityDays?.message}
                className={CONTROL_DARK_CLASS}
                {...register('validityDays')}
              />

              <Input
                label={creditBenefitSum > 0 ? 'Bonus credits (synced from CREDIT benefits)' : 'Bonus credits'}
                type="number"
                min={0}
                readOnly={creditBenefitSum > 0}
                helperText={
                  creditBenefitSum > 0
                    ? `Automatically synced to ${creditBenefitSum} from CREDIT benefit row(s) below`
                    : 'Or add a CREDIT benefit row below to fund credits automatically'
                }
                error={errors.bonusCredits?.message}
                className={
                  creditBenefitSum > 0
                    ? 'dark:border-forest-800 dark:bg-forest-900/60 dark:text-forest-400 bg-surface-container-low text-on-surface-variant cursor-not-allowed'
                    : CONTROL_DARK_CLASS
                }
                {...register('bonusCredits')}
              />

              <div className="sm:col-span-2">
                <Textarea
                  label={`Short description (${shortDescriptionLength}/${PACKAGE_FIELD_LIMITS.shortDescription})`}
                  rows={3}
                  placeholder="Concise summary displayed on catalog cards and hero header..."
                  error={errors.shortDescription?.message}
                  className={CONTROL_DARK_CLASS}
                  {...register('shortDescription')}
                />
              </div>
            </div>

            <div className="dark:border-forest-800 border-outline-variant grid gap-4 border-t pt-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="vipRibbon"
                render={({ field }) => (
                  <label className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/50 flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3">
                    <div>
                      <p className="text-on-surface dark:text-forest-100 text-sm font-semibold">Show VIP ribbon</p>
                      <p className="dark:text-forest-400 text-on-surface-variant text-xs">
                        Highlights card corner with gold VIP tag
                      </p>
                    </div>
                    <Switch checked={field.value} onChange={field.onChange} ariaLabel="VIP ribbon" size="sm" />
                  </label>
                )}
              />

              <Controller
                control={control}
                name="oneTimePerCompany"
                render={({ field }) => (
                  <label className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/50 flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3">
                    <div>
                      <p className="text-on-surface dark:text-forest-100 text-sm font-semibold">
                        One purchase per company
                      </p>
                      <p className="dark:text-forest-400 text-on-surface-variant text-xs">
                        Caps quantity at 1 and blocks repeat trial orders
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      ariaLabel="One purchase per company"
                      size="sm"
                    />
                  </label>
                )}
              />
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-lg border bg-white p-5 shadow-2xs">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-base font-bold">Visual branding</h2>
              <p className="dark:text-forest-400 text-on-surface-variant mt-0.5 text-xs">
                Customize the package accent color. The detail page hero uses the standard InterVue platform banner.
              </p>
            </div>

            <div className="max-w-md">
              <Controller
                control={control}
                name="accentColor"
                render={({ field }) => (
                  <PackageColorField
                    label="Accent color"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.accentColor?.message}
                    helperText="Used for card top border, price highlight, and section accents"
                  />
                )}
              />
            </div>
          </section>

          <PackageBenefitsEditor
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            fields={benefitArray.fields}
            append={benefitArray.append}
            remove={benefitArray.remove}
            move={benefitArray.move}
          />

          <PackageSectionsEditor
            control={control}
            register={register}
            errors={errors}
            fields={sectionArray.fields}
            append={sectionArray.append}
            remove={sectionArray.remove}
            move={sectionArray.move}
          />
        </form>

        <PackageLivePreview values={watchedValues} selectedCategory={selectedCategory} editingPackage={initial} />
      </div>
    </div>
  );
}
