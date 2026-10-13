'use client';

import { useEffect, useState } from 'react';
import { Award, Briefcase, Eye, FolderGit2, ShieldCheck, Sparkles } from 'lucide-react';
import type { CandidateProfile } from '@/types/candidate';
import CandidateHeroHeader from './CandidateHeroHeader';
import CandidateAiScoreCard from './CandidateAiScoreCard';
import CandidateAboutSection from './CandidateAboutSection';
import CandidateExperienceSection from './CandidateExperienceSection';
import CandidateSkillsSection from './CandidateSkillsSection';
import CandidateProjectsSection from './CandidateProjectsSection';
import CandidateEducationSection from './CandidateEducationSection';
import CandidateCertificationsSection from './CandidateCertificationsSection';
import CandidateJobPreferencesSidebar from './CandidateJobPreferencesSidebar';
import CandidateAttachedCvSidebar from './CandidateAttachedCvSidebar';
import CandidateActivityStatsSidebar from './CandidateActivityStatsSidebar';
import CandidateEditModal from './CandidateEditModal';
import CandidateShareModal from './CandidateShareModal';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CandidateProfileViewProps {
  initialCandidate: CandidateProfile;
  initialIsOwner?: boolean;
}

export default function CandidateProfileView({ initialCandidate, initialIsOwner = true }: CandidateProfileViewProps) {
  const [candidate, setCandidate] = useState<CandidateProfile>(initialCandidate);
  const [isOwner, setIsOwner] = useState<boolean>(initialIsOwner);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'experience' | 'skills_projects' | 'ai_assessment' | 'certifications'>(
    'experience',
  );

  // Sync mode with URL search param on load (e.g. /profile?view=guest)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'guest' || view === 'visitor') {
      const timer = setTimeout(() => setIsOwner(false), 0);
      return () => clearTimeout(timer);
    } else if (view === 'owner') {
      const timer = setTimeout(() => setIsOwner(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggleMode = () => {
    const nextMode = !isOwner;
    setIsOwner(nextMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextMode) {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', 'guest');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const tabs = [
    {
      id: 'experience' as const,
      label: 'Kinh nghiệm & Học vấn',
      icon: Briefcase,
      badge: `${candidate.experiences.length} nơi làm`,
    },
    {
      id: 'skills_projects' as const,
      label: 'Kỹ năng & Dự án',
      icon: FolderGit2,
      badge: `${candidate.projects.length} dự án`,
    },
    {
      id: 'ai_assessment' as const,
      label: 'Đánh giá InterVue AI',
      icon: Sparkles,
      highlight: `${candidate.aiScore.overallScore}/100`,
    },
    {
      id: 'certifications' as const,
      label: 'Chứng chỉ & Ngoại ngữ',
      icon: Award,
      badge: `${candidate.certifications.length + candidate.languages.length}`,
    },
  ];

  const handleSaveProfile = (updated: Partial<CandidateProfile>) => {
    setCandidate((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-topcv py-3">
          <Breadcrumb items={[{ label: 'Ứng viên' }, { label: candidate.fullName }]} showHome className="text-xs" />
        </div>
      </div>

      <div className="container-topcv pt-5">
        {/* Facebook-style View Mode Switcher Banner */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs sm:px-4.5">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
                isOwner ? 'bg-primary' : 'bg-blue-600'
              }`}
            >
              {isOwner ? <ShieldCheck className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Chế độ xem:</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    isOwner ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {isOwner ? 'Chủ sở hữu hồ sơ (Bạn)' : 'Khách / Nhà tuyển dụng xem'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isOwner
                  ? 'Bạn có toàn quyền chỉnh sửa thông tin, thêm kinh nghiệm, quản lý CV và xem số liệu phân tích riêng tư.'
                  : 'Chế độ khách: Chỉ hiển thị nội dung công khai, các nút chỉnh sửa & quyền quản lý đã được ẩn hoàn toàn.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleMode}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-2xs transition-all ${
              isOwner
                ? 'border border-slate-300 bg-slate-50 text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
                : 'border-primary hover:bg-primary border bg-emerald-50 text-emerald-700 hover:text-white'
            }`}
          >
            {isOwner ? (
              <>
                <Eye className="h-4 w-4 text-blue-600" />
                <span>Xem với tư cách Khách</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Quay lại chế độ của Bạn (Chủ sở hữu)</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Candidate Hero Header */}
        <CandidateHeroHeader
          candidate={candidate}
          isOwner={isOwner}
          onEdit={() => setIsEditOpen(true)}
          onShare={() => setIsShareOpen(true)}
          onContact={() => alert(`Đã gửi yêu cầu phỏng vấn & tin nhắn tuyển dụng đến ${candidate.fullName}!`)}
          onBookmark={() => alert(`Đã lưu hồ sơ của ${candidate.fullName} vào danh sách ứng viên tiềm năng!`)}
        />

        {/* 3. Section Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-primary bg-white shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.highlight ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive ? 'bg-primary text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tab.highlight}
                    </span>
                  ) : (
                    tab.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive ? 'text-primary bg-emerald-50' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden text-xs text-slate-500 lg:block">
            Cập nhật lần cuối: <strong className="text-slate-800">Hôm nay, 15:30</strong>
          </div>
        </div>

        {/* 4. Main Body: 12 Cols Grid (8 cols Left Tab Content, 4 cols Right Sidebar) */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: 8 Cols Active Tab View */}
          <div className="space-y-6 lg:col-span-8">
            {/* TAB 1: Kinh nghiệm & Học vấn */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <CandidateAboutSection bio={candidate.bio} isOwner={isOwner} onEdit={() => setIsEditOpen(true)} />
                <CandidateExperienceSection
                  experiences={candidate.experiences}
                  isOwner={isOwner}
                  onAddExperience={() => setIsEditOpen(true)}
                />
                <CandidateEducationSection
                  educations={candidate.educations}
                  isOwner={isOwner}
                  onAddEducation={() => setIsEditOpen(true)}
                />
              </div>
            )}

            {/* TAB 2: Kỹ năng & Dự án */}
            {activeTab === 'skills_projects' && (
              <div className="space-y-6">
                <CandidateSkillsSection
                  skills={candidate.skills}
                  isOwner={isOwner}
                  onEditSkills={() => setIsEditOpen(true)}
                />
                <CandidateProjectsSection
                  projects={candidate.projects}
                  isOwner={isOwner}
                  onAddProject={() => setIsEditOpen(true)}
                />
              </div>
            )}

            {/* TAB 3: Đánh giá InterVue AI */}
            {activeTab === 'ai_assessment' && (
              <div className="space-y-6">
                <CandidateAiScoreCard aiScore={candidate.aiScore} />
              </div>
            )}

            {/* TAB 4: Chứng chỉ & Ngoại ngữ */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <CandidateCertificationsSection
                  certifications={candidate.certifications}
                  languages={candidate.languages}
                  isOwner={isOwner}
                  onAddCertification={() => setIsEditOpen(true)}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 4 Cols Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Job Preferences & Salary */}
            <CandidateJobPreferencesSidebar
              preferences={candidate.preferences}
              isOwner={isOwner}
              onEdit={() => setIsEditOpen(true)}
            />

            {/* Attached Resumes */}
            <CandidateAttachedCvSidebar resumes={candidate.resumes} isOwner={isOwner} />

            {/* Weekly Activity Stats (Owner) or Recruiter Connect (Guest) */}
            <CandidateActivityStatsSidebar
              stats={candidate.stats}
              isOwner={isOwner}
              candidateName={candidate.fullName}
              onContact={() => alert(`Đã gửi yêu cầu kết nối & mời phỏng vấn đến ${candidate.fullName}!`)}
              onBookmark={() => alert(`Đã lưu hồ sơ của ${candidate.fullName} vào danh sách theo dõi!`)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <CandidateEditModal
        candidate={candidate}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Share Profile Modal */}
      <CandidateShareModal fullName={candidate.fullName} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}
