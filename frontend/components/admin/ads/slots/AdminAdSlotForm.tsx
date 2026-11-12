'use client';

import { adminAdApi } from '@/apiRequest/ads';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdArtworkLightboxModal, { type LightboxArtworkItem } from '@/components/admin/ads/AdArtworkLightboxModal';
import AdBannerPreviewFrame from '@/components/admin/ads/AdBannerPreviewFrame';
import PackageImageField from '@/components/admin/services/packages/PackageImageField';
import { Button, buttonClassName } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { adKeys } from '@/hooks/useAds';
import { serviceCatalogKeys } from '@/hooks/useServiceCatalog';
import { AD_PLACEMENT_FORM_OPTIONS, adminAdKeys, formatAdDimensions, getAdPlacementMeta } from '@/lib/admin-ads';
import { adminServicePackageKeys } from '@/lib/admin-service-packages';
import { formatVnd } from '@/lib/admin-vouchers';
import { cn } from '@/lib/utils';
import {
  AD_SLOT_FIELD_LIMITS,
  adSlotFormSchema,
  toAdSlotFormDefaults,
  toCreateAdSlotPayload,
  toSaveAdSlotPayload,
  type AdSlotFormData,
} from '@/schemas/ad-slot.schema';
import type { AdminServicePackage } from '@/types/admin-service-package';
import type { AdSlot } from '@/types/ads';
import { applyFormError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, ExternalLink, Lock, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface AdminAdSlotFormProps {
  servicePackages: AdminServicePackage[];
  editingSlot?: AdSlot;
}

const INPUT_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

const AD_SLOT_FORM_FIELDS = [
  'code',
  'name',
  'placement',
  'description',
  'width',
  'height',
  'pricePerWeek',
  'servicePackageId',
  'houseImageUrl',
  'houseTargetUrl',
  'displayOrder',
] as const;

export default function AdminAdSlotForm({ servicePackages, editingSlot }: AdminAdSlotFormProps) {
  const formId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(editingSlot);
  const [lightboxItem, setLightboxItem] = useState<LightboxArtworkItem | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdSlotFormData>({
    resolver: zodResolver(adSlotFormSchema),
    defaultValues: toAdSlotFormDefaults(editingSlot),
  });

  const [
    codeValue,
    nameValue,
    placementValue,
    widthValue,
    heightValue,
    priceValue,
    houseImageUrl,
    houseTargetUrl,
    activeValue,
  ] = useWatch({
    control,
    name: ['code', 'name', 'placement', 'width', 'height', 'pricePerWeek', 'houseImageUrl', 'houseTargetUrl', 'active'],
  });

  const parsedWidth = Math.max(1, Number(widthValue) || 1200);
  const parsedHeight = Math.max(1, Number(heightValue) || 200);
  const parsedPrice = Number(priceValue) || 0;
  const placementMeta = getAdPlacementMeta(placementValue);

  const packageOptions = useMemo(() => {
    const sorted = [...servicePackages].sort((a, b) => {
      const aIsBanner = a.code.startsWith('BANNER_') ? 0 : 1;
      const bIsBanner = b.code.startsWith('BANNER_') ? 0 : 1;
      return aIsBanner - bIsBanner || a.displayOrder - b.displayOrder;
    });
    return [
      { value: '', label: 'Auto-create BANNER_<CODE> package (Recommended)' },
      ...sorted.map((pkg) => ({
        value: String(pkg.id),
        label: `${pkg.code} — ${pkg.name} (${formatVnd(pkg.price)})`,
      })),
    ];
  }, [servicePackages]);

  const onSubmit = async (values: AdSlotFormData) => {
    try {
      const saved = editingSlot
        ? await adminAdApi.updateSlot(editingSlot.id, toSaveAdSlotPayload(values))
        : await adminAdApi.createSlot(toCreateAdSlotPayload(values));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminAdKeys.all }),
        queryClient.invalidateQueries({ queryKey: adKeys.slots }),
        queryClient.invalidateQueries({ queryKey: adminServicePackageKeys.all }),
        queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.catalog }),
      ]);

      toast.success(editingSlot ? `Ad slot "${saved.code}" updated.` : `Ad slot "${saved.code}" created.`);
      router.push(ROUTES.ADMIN_ADS_SLOTS);
    } catch (cause) {
      applyFormError<AdSlotFormData>(cause, setError, AD_SLOT_FORM_FIELDS);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <AdminPageHeader
        className="mb-0"
        description={
          editingSlot
            ? `Editing banner placement ${editingSlot.code}. Weekly price changes sync automatically with the linked service package.`
            : 'Define a new storefront banner slot, its exact pixel dimensions, weekly rate, and optional house-ad fallback.'
        }
        actions={
          <>
            <Link
              href={ROUTES.ADMIN_ADS_SLOTS}
              className={buttonClassName({
                variant: 'outline',
                size: 'md',
                className: 'dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850',
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to ad slots</span>
            </Link>
            <Button
              type="submit"
              form={formId}
              size="md"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {isEditing ? 'Save changes' : 'Create ad slot'}
            </Button>
          </>
        }
      />

      {errors.root?.message && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {errors.root.message}
        </div>
      )}

      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div>
                <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Placement &amp; dimensions</h2>
                <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                  Recruiters book one ISO week at a time and must upload artwork matching these exact dimensions.
                </p>
              </div>
              {isEditing && (
                <span className="dark:bg-forest-850 dark:text-forest-200 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                  <Lock className="h-3 w-3" />
                  <span>Code &amp; dimensions locked</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Input
                  label="Slot code"
                  placeholder="e.g. HOME_TOP"
                  disabled={isEditing}
                  maxLength={AD_SLOT_FIELD_LIMITS.codeMax}
                  className={cn('font-mono uppercase', INPUT_DARK_CLASS)}
                  error={errors.code?.message}
                  helperText={
                    isEditing
                      ? 'Slot code is permanent after creation.'
                      : 'Uppercase letters, digits, and underscores only.'
                  }
                  {...register('code', {
                    onBlur: (event) => setValue('code', event.target.value.trim().toUpperCase()),
                  })}
                />
              </div>

              <div>
                <Select
                  label="Storefront placement"
                  disabled={isEditing}
                  options={[...AD_PLACEMENT_FORM_OPTIONS]}
                  className={INPUT_DARK_CLASS}
                  error={errors.placement?.message}
                  {...register('placement')}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Display name"
                  placeholder="e.g. Homepage — Top leaderboard"
                  maxLength={AD_SLOT_FIELD_LIMITS.nameMax}
                  className={INPUT_DARK_CLASS}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Placement description"
                  rows={2}
                  maxLength={AD_SLOT_FIELD_LIMITS.descriptionMax}
                  placeholder="Explain where this banner sits on the page so recruiters know what visibility they are buying."
                  className={INPUT_DARK_CLASS}
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>

              <div>
                <Input
                  label="Width (px)"
                  type="number"
                  min={1}
                  disabled={isEditing}
                  className={cn('font-mono', INPUT_DARK_CLASS)}
                  error={errors.width?.message}
                  {...register('width')}
                />
              </div>

              <div>
                <Input
                  label="Height (px)"
                  type="number"
                  min={1}
                  disabled={isEditing}
                  className={cn('font-mono', INPUT_DARK_CLASS)}
                  error={errors.height?.message}
                  {...register('height')}
                />
              </div>
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">
                Weekly pricing &amp; storefront status
              </h2>
              <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                Ad bookings use the linked BANNER service package for checkout, VAT, and vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Input
                  label="Price per week (VND)"
                  type="number"
                  min={1}
                  step={1000}
                  className={cn('font-mono', INPUT_DARK_CLASS)}
                  error={errors.pricePerWeek?.message}
                  helperText={parsedPrice > 0 ? `Displays as ${formatVnd(parsedPrice)} / week` : undefined}
                  {...register('pricePerWeek')}
                />
              </div>

              <div>
                <Input
                  label="Display order"
                  type="number"
                  min={0}
                  className={cn('font-mono', INPUT_DARK_CLASS)}
                  error={errors.displayOrder?.message}
                  helperText="Lower numbers appear first on the recruiter booking page."
                  {...register('displayOrder')}
                />
              </div>

              {!isEditing ? (
                <div className="sm:col-span-2">
                  <Select
                    label="Linked service package"
                    options={packageOptions}
                    className={INPUT_DARK_CLASS}
                    error={errors.servicePackageId?.message}
                    helperText="Leave on auto-create unless attaching an existing BANNER package."
                    {...register('servicePackageId')}
                  />
                </div>
              ) : (
                editingSlot?.packageSlug && (
                  <div className="dark:border-forest-700 dark:bg-forest-950/60 border-outline-variant bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 sm:col-span-2">
                    <div className="text-xs">
                      <span className="text-on-surface-variant dark:text-forest-300 font-medium">
                        Linked service package:{' '}
                      </span>
                      <span className="text-navy dark:text-forest-50 font-mono font-bold">
                        {editingSlot.packageSlug}
                      </span>
                    </div>
                    <Link
                      href={`${ROUTES.ADMIN_SERVICE_PACKAGES}?q=${encodeURIComponent(editingSlot.packageSlug)}`}
                      className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline dark:text-emerald-400"
                    >
                      <span>View package</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )
              )}

              <div className="dark:border-forest-800 border-outline-variant flex items-center justify-between rounded-lg border px-3.5 py-3 sm:col-span-2">
                <div>
                  <p className="text-navy dark:text-forest-50 text-xs font-bold">Available for booking (On sale)</p>
                  <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-[11px]">
                    Turn off to pause new bookings for this slot without removing existing paid weeks.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => <Switch checked={field.value} onChange={field.onChange} ariaLabel="On sale" />}
                />
              </div>
            </div>
          </section>

          <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant rounded-xl border bg-white p-5 shadow-xs">
            <div className="dark:border-forest-800 border-outline-variant mb-4 border-b pb-3">
              <h2 className="text-navy dark:text-forest-50 text-sm font-bold">House ad fallback</h2>
              <p className="text-on-surface-variant dark:text-forest-300 mt-0.5 text-xs">
                Shown whenever the current ISO week has no approved recruiter booking, so the placement is never blank.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Controller
                control={control}
                name="houseImageUrl"
                render={({ field }) => (
                  <PackageImageField
                    label="House ad image (optional)"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.houseImageUrl?.message}
                    placeholder="https://... or /images/banners/..."
                    helperText={`Upload PNG/JPG matching ${formatAdDimensions(parsedWidth, parsedHeight)} (min 160×90px, max 5 MB) or paste a URL.`}
                    maxDimensions={{
                      width: Math.max(parsedWidth * 2, 1600),
                      height: Math.max(parsedHeight * 2, 1200),
                    }}
                  />
                )}
              />
              <Input
                label="House ad destination URL (optional)"
                placeholder="https://... or /recruiter/services"
                maxLength={AD_SLOT_FIELD_LIMITS.urlMax}
                className={INPUT_DARK_CLASS}
                error={errors.houseTargetUrl?.message}
                {...register('houseTargetUrl')}
              />
            </div>
          </section>
        </div>

        <aside className="xl:col-span-4">
          <div className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant sticky top-36 space-y-4 rounded-xl border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Megaphone className="text-primary h-4 w-4" />
                <h2 className="text-navy dark:text-forest-50 text-sm font-bold">Live slot preview</h2>
              </div>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                  activeValue
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'dark:bg-forest-850 dark:text-forest-300 bg-neutral-100 text-neutral-600',
                )}
              >
                {activeValue ? 'On sale' : 'Paused'}
              </span>
            </div>

            <AdBannerPreviewFrame
              imageUrl={houseImageUrl}
              alt={codeValue ? `${codeValue} house ad preview` : 'House ad preview'}
              width={parsedWidth}
              height={parsedHeight}
              emptyLabel="No house-ad fallback image set"
              onInspect={
                houseImageUrl?.trim()
                  ? () =>
                      setLightboxItem({
                        title: codeValue || 'New Ad Slot',
                        subtitle: nameValue || placementMeta.label,
                        imageUrl: houseImageUrl.trim(),
                        targetUrl: houseTargetUrl?.trim() || null,
                        width: parsedWidth,
                        height: parsedHeight,
                      })
                  : undefined
              }
            />

            <dl className="dark:divide-forest-800 divide-outline-variant divide-y text-xs">
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-on-surface-variant dark:text-forest-300">Code</dt>
                <dd className="text-navy dark:text-forest-50 font-mono font-bold">{codeValue || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-on-surface-variant dark:text-forest-300">Placement</dt>
                <dd>
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', placementMeta.pillClass)}>
                    {placementMeta.label}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-on-surface-variant dark:text-forest-300">Dimensions</dt>
                <dd className="text-navy dark:text-forest-50 font-mono font-semibold">
                  {formatAdDimensions(parsedWidth, parsedHeight)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-on-surface-variant dark:text-forest-300">Weekly rate</dt>
                <dd className="text-primary font-bold tabular-nums dark:text-emerald-400">
                  {parsedPrice > 0 ? `${formatVnd(parsedPrice)} / week` : '—'}
                </dd>
              </div>
              {houseTargetUrl?.trim() && (
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="text-on-surface-variant dark:text-forest-300 shrink-0">House link</dt>
                  <dd className="text-primary truncate font-medium dark:text-emerald-400">{houseTargetUrl.trim()}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </form>

      <AdArtworkLightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
