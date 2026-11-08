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
import { SearchX, LayoutGrid } from 'lucide-react';

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

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary bg-primary-container flex h-8 w-8 items-center justify-center rounded-lg">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <h2 className="text-on-surface text-xl font-bold sm:text-2xl">
              {listTitle(styleSuffix, filteredTemplates.length)}
            </h2>
          </div>
          <span className="text-on-surface-variant hidden text-xs sm:inline-block">{freeAndAtsBadge}</span>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <SearchX className="text-outline mx-auto mb-3 h-12 w-12" />
            <h3 className="text-on-surface text-base font-bold">{notFoundTitle}</h3>
            <p className="text-on-surface-variant mt-1 text-xs">{notFoundDesc}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedStyleSlug('all');
                setSelectedIndustrySlug('all');
                setSelectedLanguage('all');
                setSearchQuery('');
              }}
              className="bg-primary hover:bg-primary mt-4 rounded-xl px-4 py-2 text-xs font-semibold text-white transition"
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
