import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CvReviewClientView from '@/components/cv-review/CvReviewClientView';

export const metadata: Metadata = {
  title: 'AI Chấm điểm & Đánh giá CV chuẩn ATS | InterVue',
  description:
    'Công cụ AI phân tích CV ứng viên, đánh giá độ tương thích với vị trí mục tiêu và đưa ra đề xuất cải thiện chuẩn ATS theo phương pháp STAR.',
};

export default function CvReviewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f5]">
      <Header />
      <main className="container-topcv flex-1">
        <Suspense fallback={<div className="py-12 text-center text-sm text-slate-500">Đang tải...</div>}>
          <CvReviewClientView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
