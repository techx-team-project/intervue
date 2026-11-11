'use client';

import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Button, buttonClassName } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { SERVICE_NEED_ADMIN_META } from '@/constants/service-package';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import { getNeedKeySelectOptions, isKnownServiceNeedKey } from '@/lib/admin-service-categories';
import {
  CATEGORY_FIELD_LIMITS,
  saveServiceCategorySchema,
  toSaveServiceCategoryPayload,
  type SaveServiceCategoryFormData,
} from '@/schemas/service-category.schema';
import type { AdminServiceCategory } from '@/types/admin-service-package';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, EyeOff, FolderKanban, Info, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminServiceCategoryFormProps {
  categories: AdminServiceCategory[];
  editingCategory?: AdminServiceCategory;
  suggestedDisplayOrder: number;
}

const INPUT_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function AdminServiceCategoryForm({
  categories,
  editingCategory,
  suggestedDisplayOrder,
}: AdminServiceCategoryFormProps) {
  const formId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditing = Boolean(editingCategory);
  const isCodeLocked = Boolean(editingCategory && editingCategory.packageCount > 0);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SaveServiceCategoryFormData>({
    resolver: zodResolver(saveServiceCategorySchema),
    defaultValues: {
      code: editingCategory?.code ?? '',
      name: editingCategory?.name ?? '',
      headline: editingCategory?.headline ?? '',
      description: editingCategory?.description ?? '',
      needKey: editingCategory?.needKey ?? '',
      displayOrder: String(editingCategory?.displayOrder ?? suggestedDisplayOrder),
      isActive: editingCategory?.isActive ?? true,
    },
  });

  const [codeValue, nameValue, headlineValue, descriptionValue, needKeyValue, isActiveValue] = useWatch({
    control,
    name: ['code', 'name', 'headline', 'description', 'needKey', 'isActive'],
  });

  const needOptions = getNeedKeySelectOptions(editingCategory?.needKey);
  const normalizedNeedKey = (needKeyValue ?? '').trim().toUpperCase();
  const needMeta = isKnownServiceNeedKey(normalizedNeedKey) ? SERVICE_NEED_ADMIN_META[normalizedNeedKey] : null;
  const sharedActivePeers = normalizedNeedKey
    ? categories.filter(
        (item) => item.isActive && item.needKey === normalizedNeedKey && item.id !== editingCategory?.id,
      )
    : [];

  const submitForm = handleSubmit(async (values) => {
    const payload = toSaveServiceCategoryPayload(values);
    try {
      if (editingCategory) {
        await adminServicePackageApi.updateCategory(editingCategory.id, payload);
        toast.success(`Category "${payload.name}" updated.`);
      } else {
        await adminServicePackageApi.createCategory(payload);
        toast.success(`Category "${payload.name}" created.`);
      }
      await queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog });
      router.push(ROUTES.ADMIN_SERVICE_CATEGORIES);
    } catch (cause) {
      applyFormError(cause, setError, ['code', 'name', 'headline', 'description', 'needKey', 'displayOrder']);
    }
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="pb-1">
        <AdminPageHeader
          description={
            editingCategory
              ? `Update configuration for ${editingCategory.name} (${editingCategory.code}).`
              : 'Create a section for grouping and ordering packages on the recruiter buy-services page.'
          }
          actions={
            <Link
              href={ROUTES.ADMIN_SERVICE_CATEGORIES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to categories</span>
            </Link>
          }
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form
          id={formId}
          onSubmit={submitForm}
          noValidate
          className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-6 rounded-2xl border bg-white p-5 shadow-xs sm:p-6"
        >
          {errors.root?.message && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Basic details</h2>
              <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-xs">
                Code, heading, and description shown to recruiters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={`Code * (${(codeValue ?? '').length}/${CATEGORY_FIELD_LIMITS.code})`}
                value={codeValue ?? ''}
                disabled={isCodeLocked}
                onChange={(event) =>
                  setValue('code', event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: true })
                }
                placeholder="e.g. TOP_JOBS"
                rightElement={isCodeLocked ? <Lock className="text-outline h-4 w-4" /> : undefined}
                helperText={
                  isCodeLocked
                    ? `Locked while ${editingCategory?.packageCount} package(s) reference this category.`
                    : 'Unique key for #service-category-<code> URL anchors and logs (A–Z, 0–9, _).'
                }
                error={errors.code?.message}
                className={`${INPUT_DARK_CLASS} font-mono uppercase disabled:cursor-not-allowed disabled:opacity-65`}
              />

              <Input
                label={`Display name * (${(nameValue ?? '').length}/${CATEGORY_FIELD_LIMITS.name})`}
                placeholder="e.g. TOP JOBS"
                helperText="Short label displayed in green before the headline separator"
                error={errors.name?.message}
                className={INPUT_DARK_CLASS}
                {...register('name')}
              />

              <div className="sm:col-span-2">
                <Input
                  label={`Headline * (${(headlineValue ?? '').length}/${CATEGORY_FIELD_LIMITS.headline})`}
                  placeholder="e.g. ĐĂNG TIN TUYỂN DỤNG HIỆU SUẤT CAO"
                  helperText="Primary section title displayed on the buy-services page"
                  error={errors.headline?.message}
                  className={INPUT_DARK_CLASS}
                  {...register('headline')}
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label={`Description (${(descriptionValue ?? '').length}/${CATEGORY_FIELD_LIMITS.description})`}
                  rows={4}
                  placeholder="Short summary explaining which hiring goal these packages support..."
                  error={errors.description?.message}
                  className={INPUT_DARK_CLASS}
                  {...register('description')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="dark:border-forest-800 border-outline-variant border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Placement & suggestion matching</h2>
              <p className="text-on-surface-variant dark:text-forest-400 mt-0.5 text-xs">
                Control section order, visibility, and which onboarding goal scrolls recruiters to this category.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Recruiter suggestion goal"
                options={needOptions}
                helperText="Matches 1 of the 4 radio options in the recruiter welcome suggestion popup"
                error={errors.needKey?.message}
                className={INPUT_DARK_CLASS}
                {...register('needKey')}
              />

              <Input
                label="Display order *"
                type="number"
                min={0}
                helperText="Lower numbers appear higher on the catalog page"
                error={errors.displayOrder?.message}
                className={INPUT_DARK_CLASS}
                {...register('displayOrder')}
              />
            </div>

            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/50 flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3.5">
                  <div>
                    <p className="text-on-surface dark:text-forest-100 text-sm font-semibold">
                      Visible in recruiter catalog
                    </p>
                    <p className="text-on-surface-variant dark:text-forest-400 text-xs">
                      When hidden, this entire section is omitted from the recruiter buy-services page.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    ariaLabel="Visible in recruiter catalog"
                    size="sm"
                  />
                </label>
              )}
            />
          </div>

          <div className="dark:border-forest-800 border-outline-variant flex items-center justify-end gap-3 border-t pt-5">
            <Link
              href={ROUTES.ADMIN_SERVICE_CATEGORIES}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              Cancel
            </Link>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Save changes' : 'Create category'}
            </Button>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-44">
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-2xl border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-navy dark:text-forest-50 text-xs font-bold tracking-wider uppercase">
                Recruiter section preview
              </h3>
              {!isActiveValue ? (
                <span className="dark:bg-forest-850 dark:text-forest-300 bg-surface-container-low text-on-surface-variant inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                  <EyeOff className="h-3 w-3" />
                  Hidden
                </span>
              ) : (editingCategory?.activePackageCount ?? 0) === 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                  Needs active package
                </span>
              ) : null}
            </div>

            <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/40 mt-4 rounded-xl border p-4">
              <p className="flex flex-wrap items-center gap-2 text-base font-bold break-words">
                <span className="text-primary">{nameValue?.trim() || 'CATEGORY NAME'}</span>
                <span className="text-outline-variant" aria-hidden>
                  |
                </span>
                <span className="text-on-surface dark:text-forest-50">
                  {headlineValue?.trim() || 'SECTION HEADLINE'}
                </span>
              </p>
              <p className="text-on-surface-variant dark:text-forest-300 mt-1.5 text-xs leading-relaxed break-words">
                {descriptionValue?.trim() || 'Optional section description appears below the heading.'}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3">
                  <div className="dark:bg-forest-800 bg-surface-container-high h-2.5 w-16 rounded" />
                  <div className="dark:bg-forest-850 bg-surface-container-low mt-2 h-2 w-24 rounded" />
                </div>
                <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-lg border bg-white p-3">
                  <div className="dark:bg-forest-800 bg-surface-container-high h-2.5 w-14 rounded" />
                  <div className="dark:bg-forest-850 bg-surface-container-low mt-2 h-2 w-20 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-3 rounded-2xl border bg-white p-5 text-xs shadow-xs">
            <h3 className="text-navy dark:text-forest-50 font-bold tracking-wider uppercase">
              Suggestion popup mapping
            </h3>

            {needMeta ? (
              <div className="space-y-1.5">
                <p className="text-on-surface-variant dark:text-forest-300 leading-relaxed">
                  <span className="text-navy dark:text-forest-100 font-semibold">{normalizedNeedKey}:</span>{' '}
                  {needMeta.summary}.
                </p>
                <p className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/50 text-on-surface dark:text-forest-200 rounded-lg border px-3 py-2 italic">
                  &ldquo;{needMeta.recruiterChoice}&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-on-surface-variant dark:text-forest-400 leading-relaxed">
                No onboarding goal mapped. Recruiters still see this section normally on the catalog page, while the
                welcome popup skips scrolling to it.
              </p>
            )}

            {sharedActivePeers.length > 0 && (
              <div className="dark:border-forest-800 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/60 flex items-start gap-2 rounded-xl border p-3">
                <Info className="text-on-surface-variant dark:text-forest-300 mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-on-surface-variant dark:text-forest-300 leading-relaxed">
                  Also mapped to{' '}
                  <span className="text-on-surface dark:text-forest-100 font-semibold">
                    {sharedActivePeers.map((peer) => peer.code).join(', ')}
                  </span>
                  . Selecting this goal in the suggestion popup highlights all matching sections.
                </p>
              </div>
            )}

            {editingCategory && (
              <div className="dark:border-forest-800 border-outline-variant flex items-center justify-between border-t pt-3">
                <span className="text-on-surface-variant dark:text-forest-300">
                  Linked packages:{' '}
                  <strong className="text-navy dark:text-forest-100 tabular-nums">
                    {editingCategory.packageCount}
                  </strong>{' '}
                  ({editingCategory.activePackageCount} active)
                </span>
                <Link
                  href={`${ROUTES.ADMIN_SERVICE_PACKAGES}?categoryId=${editingCategory.id}`}
                  className="text-primary inline-flex items-center gap-1 font-semibold hover:underline"
                >
                  <FolderKanban className="h-3.5 w-3.5" />
                  <span>Manage packages</span>
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
