'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CvTemplateItem, CvTemplateStyle, CvTemplateIndustry } from '@/types/cv-template';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import CvHeroBanner from './CvHeroBanner';
import CvFilterBar from './CvFilterBar';
import CvTemplateCard from './CvTemplateCard';
import CvPreviewModal from './CvPreviewModal';
import CvStepGuideSection from './CvStepGuideSection';
import CvBenefitsSection from './CvBenefitsSection';
import CvFaqSection from './CvFaqSection';
import { buttonClassName } from '@/components/ui/Button';
import { SearchX } from 'lucide-react';

interface CvTemplatesViewProps {
  initialTemplates: CvTemplateItem[];
  styles: CvTemplateStyle[];
  industries: CvTemplateIndustry[];
  defaultStyleSlug?: string;
}

export default function CvTemplatesView({
  initialTemplates,
  styles,
  industries,
  defaultStyleSlug = 'mau-don-gian',
}: CvTemplatesViewProps) {
  const router = useRouter();
  const [selectedStyleSlug, setSelectedStyleSlug] = useState<string>(defaultStyleSlug);
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { listTitle, defaultStyleName, freeAndAtsBadge, notFoundTitle, notFoundDesc, viewAllBtn } =
    CV_TEMPLATE_MESSAGES.view;

  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    template: CvTemplateItem | null;
  }>({
    isOpen: false,
    template: null,
  });

  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((item) => {
      if (selectedStyleSlug !== 'all' && item.styleSlug !== selectedStyleSlug) {
        return false;
      }

      if (selectedIndustrySlug !== 'all') {
        const indObj = industries.find((i) => i.slug === selectedIndustrySlug);
        if (indObj && !item.industries.includes(indObj.name)) {
          return false;
        }
      }

      if (selectedLanguage !== 'all' && !item.languages.includes(selectedLanguage)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchIndustry = item.industries.some((ind) => ind.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchIndustry) return false;
      }

      return true;
    });
  }, [initialTemplates, selectedStyleSlug, selectedIndustrySlug, selectedLanguage, searchQuery, industries]);

  const handleOpenPreview = (template: CvTemplateItem) => {
    setPreviewState({
      isOpen: true,
      template,
    });
  };

  const handleClosePreview = () => {
    setPreviewState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleUseTemplate = () => {
    router.push('/candidate/profile');
  };

  const styleSuffix = selectedStyleSlug === 'mau-don-gian' ? defaultStyleName : '';

  return (
    <div className="bg-surface-container-low min-h-screen">
      <CvHeroBanner />

      <CvFilterBar
        styles={styles}
        industries={industries}
        selectedStyleSlug={selectedStyleSlug}
        onSelectStyle={setSelectedStyleSlug}
        selectedIndustrySlug={selectedIndustrySlug}
        onSelectIndustry={setSelectedIndustrySlug}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-title-lg text-on-surface font-bold">
            {listTitle(styleSuffix, filteredTemplates.length)}
          </h2>
          <span className="text-body-md text-on-surface-variant">{freeAndAtsBadge}</span>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTemplates.map((tpl) => (
              <CvTemplateCard
                key={tpl.id}
                template={tpl}
                onPreview={handleOpenPreview}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface border-outline-variant flex flex-col items-center gap-3 rounded-2xl border px-6 py-16 text-center">
            <SearchX className="text-outline h-9 w-9" aria-hidden />
            <h3 className="text-title-md text-on-surface font-semibold">{notFoundTitle}</h3>
            <p className="text-body-md text-on-surface-variant max-w-sm">{notFoundDesc}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedStyleSlug('all');
                setSelectedIndustrySlug('all');
                setSelectedLanguage('all');
                setSearchQuery('');
              }}
              className={buttonClassName({ variant: 'outline', size: 'md', className: 'mt-1 px-5' })}
            >
              {viewAllBtn}
            </button>
          </div>
        )}
      </div>

      <CvStepGuideSection />

      <CvBenefitsSection />

      <CvFaqSection />

      <CvPreviewModal
        key={previewState.template?.id || 'modal'}
        template={previewState.template}
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
}
