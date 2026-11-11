'use client';

import ServiceSectionIcon from '@/components/common/ServiceSectionIcon';
import { MarkdownRenderer } from '@/components/support-chat/MarkdownRenderer';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { SERVICE_SECTION_ICON_OPTIONS } from '@/lib/service-package-icons';
import { cn } from '@/lib/utils';
import type { PackageSectionFormData, SaveServicePackageFormData } from '@/schemas/service-package.schema';
import { ArrowDown, ArrowUp, Eye, PenLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
} from 'react-hook-form';
import PackageColorField from './PackageColorField';
import PackageImageField from './PackageImageField';

interface PackageSectionsEditorProps {
  control: Control<SaveServicePackageFormData>;
  register: UseFormRegister<SaveServicePackageFormData>;
  errors: FieldErrors<SaveServicePackageFormData>;
  fields: FieldArrayWithId<SaveServicePackageFormData, 'sections', 'id'>[];
  append: UseFieldArrayAppend<SaveServicePackageFormData, 'sections'>;
  remove: UseFieldArrayRemove;
  move: UseFieldArrayMove;
}

const DEFAULT_SECTION: PackageSectionFormData = {
  heading: '',
  iconName: '',
  accentColor: '',
  body: '',
  imageUrl: '',
};

const CONTROL_DARK_CLASS =
  'dark:border-forest-700 dark:bg-forest-950 dark:text-forest-50 dark:placeholder:text-forest-400';

export default function PackageSectionsEditor({
  control,
  register,
  errors,
  fields,
  append,
  remove,
  move,
}: PackageSectionsEditorProps) {
  const watchedSections = useWatch({ control, name: 'sections' });
  const [previewTabs, setPreviewTabs] = useState<Record<string, boolean>>({});

  const togglePreview = (id: string, isPreview: boolean) => {
    setPreviewTabs((current) => ({ ...current, [id]: isPreview }));
  };

  return (
    <section className="dark:border-forest-800 dark:bg-forest-900 border-outline-variant space-y-4 rounded-lg border bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-navy dark:text-forest-50 text-base font-bold">Detail page sections</h2>
          <p className="dark:text-forest-300 text-on-surface-variant mt-0.5 text-xs">
            Rich feature blocks shown on the recruiter detail page. Supports Markdown and optional illustration artwork.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          radius="lg"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => append({ ...DEFAULT_SECTION })}
          className="dark:border-forest-700 dark:text-forest-100 dark:hover:bg-forest-850"
        >
          Add section
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="dark:border-forest-700 border-outline-variant rounded-lg border border-dashed px-4 py-8 text-center">
          <p className="dark:text-forest-300 text-on-surface-variant text-sm">
            No sections yet. Add sections to showcase use cases, metrics, or placement previews.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const currentSection = watchedSections?.[index];
            const iconValue = currentSection?.iconName ?? field.iconName;
            const bodyValue = currentSection?.body ?? field.body;
            const isPreview = Boolean(previewTabs[field.id]);
            const rowErrors = errors.sections?.[index];

            const hasKnownIcon =
              !iconValue || SERVICE_SECTION_ICON_OPTIONS.some((option) => option.value === iconValue);
            const iconOptions = [
              { value: '', label: 'None' },
              ...SERVICE_SECTION_ICON_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
              ...(!hasKnownIcon && iconValue ? [{ value: iconValue, label: `${iconValue} (custom)` }] : []),
            ];

            return (
              <div
                key={field.id}
                className="dark:border-forest-800 dark:bg-forest-950/50 border-outline-variant bg-surface-container-low/30 space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dark:text-forest-200 text-navy text-xs font-bold">Section #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                      aria-label={`Move section ${index + 1} up`}
                      className="text-on-surface-variant hover:bg-surface-container-high dark:text-forest-300 dark:hover:bg-forest-800 cursor-pointer rounded p-1 transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                      aria-label={`Move section ${index + 1} down`}
                      className="text-on-surface-variant hover:bg-surface-container-high dark:text-forest-300 dark:hover:bg-forest-800 cursor-pointer rounded p-1 transition disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove section ${index + 1}`}
                      className="text-outline cursor-pointer rounded p-1 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Section heading"
                      placeholder="e.g. Tối đa lượt tiếp cận ứng viên phù hợp"
                      {...register(`sections.${index}.heading`)}
                      error={rowErrors?.heading?.message}
                      className={CONTROL_DARK_CLASS}
                    />
                  </div>

                  <div>
                    <div className="flex items-end gap-2">
                      <div className="min-w-0 flex-1">
                        <Select
                          label="Section icon"
                          {...register(`sections.${index}.iconName`)}
                          options={iconOptions}
                          error={rowErrors?.iconName?.message}
                          className={CONTROL_DARK_CLASS}
                        />
                      </div>
                      <span
                        aria-hidden
                        className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant mb-0.5 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border bg-white text-emerald-600 dark:text-emerald-400"
                      >
                        <ServiceSectionIcon
                          name={iconValue}
                          className="h-4.5 w-4.5"
                          fallback="sparkles"
                          fallbackClassName="text-outline h-4 w-4 opacity-40"
                        />
                      </span>
                    </div>
                  </div>

                  <Controller
                    control={control}
                    name={`sections.${index}.accentColor`}
                    render={({ field: colorField }) => (
                      <PackageColorField
                        label="Section accent color (optional)"
                        value={colorField.value}
                        onChange={colorField.onChange}
                        error={rowErrors?.accentColor?.message}
                        helperText="Defaults to the package accent color if left empty."
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name={`sections.${index}.imageUrl`}
                  render={({ field: imageField }) => (
                    <PackageImageField
                      label="Section illustration image (optional)"
                      value={imageField.value}
                      onChange={imageField.onChange}
                      error={rowErrors?.imageUrl?.message}
                      helperText="PNG/JPG up to 5 MB. Images larger than 1200×720px are scaled proportionally to fit cleanly."
                    />
                  )}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-on-surface dark:text-forest-100 text-sm font-semibold">Markdown content</span>
                    <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant inline-flex rounded-lg border bg-white p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => togglePreview(field.id, false)}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition',
                          !isPreview
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'text-on-surface-variant dark:text-forest-300',
                        )}
                      >
                        <PenLine className="h-3 w-3" />
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePreview(field.id, true)}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition',
                          isPreview
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'text-on-surface-variant dark:text-forest-300',
                        )}
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {isPreview ? (
                    <div className="dark:border-forest-700 dark:bg-forest-900 border-outline-variant min-h-[104px] rounded-xl border bg-white p-3.5 text-sm">
                      {bodyValue?.trim() ? (
                        <MarkdownRenderer
                          content={bodyValue}
                          className="text-on-surface-variant dark:text-forest-200"
                        />
                      ) : (
                        <p className="dark:text-forest-400 text-on-surface-variant italic">Nothing to preview yet.</p>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      rows={4}
                      placeholder="Supports **bold**, *italic*, [links](https://...), and inline `code`"
                      {...register(`sections.${index}.body`)}
                      error={rowErrors?.body?.message}
                      className={CONTROL_DARK_CLASS}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
