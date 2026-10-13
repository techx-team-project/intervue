import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CandidateProfileView from '@/components/candidate-profile/CandidateProfileView';
import { MOCK_CANDIDATE_PROFILE } from '@/mocks/candidate.mock';

export const metadata: Metadata = {
  title: `${MOCK_CANDIDATE_PROFILE.fullName} - ${MOCK_CANDIDATE_PROFILE.title} | InterVue`,
  description: `Hồ sơ năng lực chuyên nghiệp của ${MOCK_CANDIDATE_PROFILE.fullName} - ${MOCK_CANDIDATE_PROFILE.title}. Điểm đánh giá InterVue AI: ${MOCK_CANDIDATE_PROFILE.aiScore.overallScore}/100.`,
  openGraph: {
    title: `${MOCK_CANDIDATE_PROFILE.fullName} - Hồ sơ ứng viên InterVue`,
    description: `${MOCK_CANDIDATE_PROFILE.title} • ${MOCK_CANDIDATE_PROFILE.location}`,
    images: [
      {
        url: MOCK_CANDIDATE_PROFILE.avatar,
        width: 800,
        height: 800,
        alt: MOCK_CANDIDATE_PROFILE.fullName,
      },
    ],
  },
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Candidate Profile Main Content */}
      <main className="flex-1">
        <CandidateProfileView initialCandidate={MOCK_CANDIDATE_PROFILE} />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}
