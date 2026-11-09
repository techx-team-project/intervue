'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Textarea from '@/components/ui/Textarea';
import { ENTITLEMENT_TYPE_OPTIONS } from '@/constants/service-package';
import { ROUTES } from '@/constants/routes';
import { adminServicePackageApi } from '@/apiRequest/admin-service-package';
import type { AdminServiceCategory, AdminServicePackage, SaveServicePackageInput } from '@/types/admin-service-package';
import type { EntitlementType } from '@/types/service-package';
import { getErrorMessage } from '@/utils/error';
import { AlertCircle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminServicePackageFormProps {
  categories: AdminServiceCategory[];
  initial?: AdminServicePackage;
}

type BenefitDraft = {
  entitlementType: EntitlementType;
  quantity: string;
  tier: string;
  durationDays: string;
  label: string;
};
type SectionDraft = { heading: string; iconName: string; accentColor: string; body: string; imageUrl: string };

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

const EMPTY_BENEFIT: BenefitDraft = {
  entitlementType: 'JOB_POST_SLOT',
  quantity: '1',
  tier: '1',
  durationDays: '',
  label: '',
};
const EMPTY_SECTION: SectionDraft = { heading: '', iconName: '', accentColor: '', body: '', imageUrl: '' };

function toOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : Number(trimmed);
}

function toOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export default function AdminServicePackageForm({ categories, initial }: AdminServicePackageFormProps) {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState(String(initial?.categoryId ?? categories[0]?.id ?? ''));
  const [code, setCode] = useState(initial?.code ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [badge, setBadge] = useState(initial?.badge ?? 'NONE');
  const [vipRibbon, setVipRibbon] = useState(initial?.vipRibbon ?? false);
  const [accentColor, setAccentColor] = useState(initial?.accentColor ?? '');
  const [heroImageUrl, setHeroImageUrl] = useState(initial?.heroImageUrl ?? '');
  const [validityDays, setValidityDays] = useState(initial?.validityDays ? String(initial.validityDays) : '');
  const [bonusCredits, setBonusCredits] = useState(String(initial?.bonusCredits ?? 0));
  const [oneTimePerCompany, setOneTimePerCompany] = useState(initial?.oneTimePerCompany ?? false);
  const [status, setStatus] = useState(initial?.status ?? 'DRAFT');
  const [displayOrder, setDisplayOrder] = useState(String(initial?.displayOrder ?? 1));

  const [benefits, setBenefits] = useState<BenefitDraft[]>(
    initial?.benefits.map((benefit) => ({
      entitlementType: benefit.entitlementType,
      quantity: String(benefit.quantity),
      tier: String(benefit.tier ?? 1),
      durationDays: benefit.durationDays ? String(benefit.durationDays) : '',
      label: benefit.label,
    })) ?? [],
  );
  const [sections, setSections] = useState<SectionDraft[]>(
    initial?.sections.map((section) => ({
      heading: section.heading,
      iconName: section.iconName ?? '',
      accentColor: section.accentColor ?? '',
      body: section.body ?? '',
      imageUrl: section.imageUrl ?? '',
    })) ?? [],
  );

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload: SaveServicePackageInput = {
      categoryId: Number(categoryId),
      code: code.trim().toUpperCase(),
      slug: slug.trim().toLowerCase(),
      name: name.trim(),
      shortDescription: toOptionalText(shortDescription),
      price: Number(price),
      currency: 'VND',
      badge: badge as AdminServicePackage['badge'],
      vipRibbon,
      accentColor: toOptionalText(accentColor),
      heroImageUrl: toOptionalText(heroImageUrl),
      validityDays: toOptionalNumber(validityDays),
      bonusCredits: Number(bonusCredits),
      oneTimePerCompany,
      status: status as AdminServicePackage['status'],
      displayOrder: Number(displayOrder),
      benefits: benefits.map((benefit) => ({
        entitlementType: benefit.entitlementType,
        quantity: Number(benefit.quantity),
        tier: Number(benefit.tier),
        durationDays: toOptionalNumber(benefit.durationDays),
        label: benefit.label.trim(),
      })),
      sections: sections.map((section) => ({
        heading: section.heading.trim(),
        iconName: toOptionalText(section.iconName),
        accentColor: toOptionalText(section.accentColor),
        body: toOptionalText(section.body),
        imageUrl: toOptionalText(section.imageUrl),
      })),
    };

    try {
      if (initial) {
        await adminServicePackageApi.updatePackage(initial.id, payload);
      } else {
        await adminServicePackageApi.createPackage(payload);
      }
      router.push(ROUTES.ADMIN_SERVICE_PACKAGES);
    } catch (cause) {
      setError(getErrorMessage(cause));
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-16">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.ADMIN_SERVICE_PACKAGES}
          className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-navy text-xl font-bold">{initial ? `Edit ${initial.name}` : 'New service package'}</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      <section className="border-outline-variant grid gap-4 rounded-2xl border bg-white p-5 shadow-2xs sm:grid-cols-2">
        <Select
          label="Category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          options={categories.map((category) => ({ value: String(category.id), label: category.code }))}
          required
        />
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input
          label="Code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          helperText="Uppercase letters, digits and underscore"
          required
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          helperText="Lowercase letters, digits and dashes"
          required
        />
        <Input
          label="Price (VND, excluding VAT)"
          type="number"
          min={0}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
        <Input
          label="Display order"
          type="number"
          min={0}
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          required
        />
        <Select
          label="Badge"
          value={badge}
          onChange={(event) => setBadge(event.target.value as AdminServicePackage['badge'])}
          options={BADGE_OPTIONS}
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as AdminServicePackage['status'])}
          options={STATUS_OPTIONS}
        />
        <Input
          label="Validity (days)"
          type="number"
          min={1}
          value={validityDays}
          onChange={(event) => setValidityDays(event.target.value)}
          helperText="Leave empty for no expiry"
        />
        <Input
          label="Bonus credits"
          type="number"
          min={0}
          value={bonusCredits}
          onChange={(event) => setBonusCredits(event.target.value)}
        />
        <Input
          label="Accent colour"
          value={accentColor}
          onChange={(event) => setAccentColor(event.target.value)}
          helperText="Hex value such as #16a34a"
        />
        <Input label="Hero image URL" value={heroImageUrl} onChange={(event) => setHeroImageUrl(event.target.value)} />
        <div className="sm:col-span-2">
          <Textarea
            label="Short description"
            rows={3}
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
          />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={vipRibbon} onChange={setVipRibbon} ariaLabel="VIP ribbon" size="sm" />
          <span className="text-on-surface font-medium">Show VIP ribbon</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <Switch
            checked={oneTimePerCompany}
            onChange={setOneTimePerCompany}
            ariaLabel="One time per company"
            size="sm"
          />
          <span className="text-on-surface font-medium">One purchase per company</span>
        </label>
      </section>

      <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-on-surface text-base font-bold">Benefits</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setBenefits((previous) => [...previous, { ...EMPTY_BENEFIT }])}
          >
            Add benefit
          </Button>
        </div>

        {benefits.length === 0 ? (
          <p className="text-on-surface-variant mt-3 text-sm">No benefits yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="border-outline-variant grid gap-3 rounded-xl border p-3 sm:grid-cols-[180px_80px_80px_100px_minmax(0,1fr)_auto]"
              >
                <Select
                  value={benefit.entitlementType}
                  onChange={(event) =>
                    setBenefits((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, entitlementType: event.target.value as EntitlementType } : item,
                      ),
                    )
                  }
                  options={ENTITLEMENT_TYPE_OPTIONS}
                />
                <Input
                  type="number"
                  min={1}
                  value={benefit.quantity}
                  placeholder="Qty"
                  onChange={(event) =>
                    setBenefits((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, quantity: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={benefit.tier}
                  placeholder="Tier"
                  onChange={(event) =>
                    setBenefits((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, tier: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  type="number"
                  min={1}
                  value={benefit.durationDays}
                  placeholder="Days"
                  onChange={(event) =>
                    setBenefits((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, durationDays: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  value={benefit.label}
                  placeholder="Label shown to recruiters"
                  onChange={(event) =>
                    setBenefits((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, label: event.target.value } : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setBenefits((previous) => previous.filter((_, position) => position !== index))}
                  className="text-outline cursor-pointer self-center rounded-lg p-2 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Remove benefit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-outline-variant rounded-2xl border bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-on-surface text-base font-bold">Detail page sections</h2>
            <p className="text-on-surface-variant mt-0.5 text-xs">
              Rendered as markdown on the recruiter-facing detail page.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setSections((previous) => [...previous, { ...EMPTY_SECTION }])}
          >
            Add section
          </Button>
        </div>

        {sections.length === 0 ? (
          <p className="text-on-surface-variant mt-3 text-sm">No sections yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="border-outline-variant space-y-3 rounded-xl border p-3">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_150px_auto]">
                  <Input
                    value={section.heading}
                    placeholder="Heading"
                    onChange={(event) =>
                      setSections((previous) =>
                        previous.map((item, position) =>
                          position === index ? { ...item, heading: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    value={section.iconName}
                    placeholder="Icon name"
                    onChange={(event) =>
                      setSections((previous) =>
                        previous.map((item, position) =>
                          position === index ? { ...item, iconName: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    value={section.accentColor}
                    placeholder="#16a34a"
                    onChange={(event) =>
                      setSections((previous) =>
                        previous.map((item, position) =>
                          position === index ? { ...item, accentColor: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setSections((previous) => previous.filter((_, position) => position !== index))}
                    className="text-outline cursor-pointer self-center rounded-lg p-2 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Input
                  value={section.imageUrl}
                  placeholder="Image URL"
                  onChange={(event) =>
                    setSections((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, imageUrl: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Textarea
                  rows={5}
                  value={section.body}
                  placeholder="Markdown body"
                  onChange={(event) =>
                    setSections((previous) =>
                      previous.map((item, position) =>
                        position === index ? { ...item, body: event.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-3">
        <Link href={ROUTES.ADMIN_SERVICE_PACKAGES}>
          <Button type="button" variant="neutral">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isSaving}>
          {initial ? 'Save changes' : 'Create package'}
        </Button>
      </div>
    </form>
  );
}
