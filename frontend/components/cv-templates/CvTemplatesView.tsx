'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CvTemplateItem, CvTemplateStyle, CvTemplateIndustry } from '@/types/cv-template';
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

  // Preview Modal state
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    template: CvTemplateItem | null;
  }>({
    isOpen: false,
    template: null,
  });

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((item) => {
      // Style filter
      if (selectedStyleSlug !== 'all' && item.styleSlug !== selectedStyleSlug) {
        return false;
      }

      // Industry filter
      if (selectedIndustrySlug !== 'all') {
        const indObj = industries.find((i) => i.slug === selectedIndustrySlug);
        if (indObj && !item.industries.includes(indObj.name)) {
          return false;
        }
      }

      // Language filter
      if (selectedLanguage !== 'all' && !item.languages.includes(selectedLanguage as 'Tiếng Việt' | 'Tiếng Anh')) {
        return false;
      }

      // Search query
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
    // Navigate to profile or builder
    router.push('/candidate/profile');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* 1. Hero Banner */}
      <CvHeroBanner />

      {/* 2. Filter Bar */}
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

      {/* 3. Main Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#00b14f]">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">
              Danh sách mẫu CV {selectedStyleSlug === 'mau-don-gian' ? 'Đơn giản' : ''} ({filteredTemplates.length})
            </h2>
          </div>
          <span className="hidden text-xs text-[#7f878f] sm:inline-block">Tất cả mẫu đều miễn phí & chuẩn hóa ATS</span>
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
            <SearchX className="mx-auto mb-3 h-12 w-12 text-[#9ca3af]" />
            <h3 className="text-base font-bold text-[#171717]">Không tìm thấy mẫu CV phù hợp</h3>
            <p className="mt-1 text-xs text-[#7f878f]">
              Hãy thử chọn lại phong cách, ngành nghề khác hoặc xóa từ khóa tìm kiếm.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedStyleSlug('all');
                setSelectedIndustrySlug('all');
                setSelectedLanguage('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-xl bg-[#00b14f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#009b44]"
            >
              Xem tất cả mẫu CV
            </button>
          </div>
        )}
      </div>

      {/* 4. Steps Guide */}
      <CvStepGuideSection />

      {/* 5. Benefits */}
      <CvBenefitsSection />

      {/* 6. FAQ Accordion */}
      <CvFaqSection />

      {/* 7. Full Preview Modal */}
      <CvPreviewModal
        key={previewState.template?.id || 'modal'}
        template={previewState.template}
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
}
