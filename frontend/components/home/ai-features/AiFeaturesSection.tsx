import { buttonClassName } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/constants/routes';
import { FileSearch, Mic, ShieldCheck, Target } from 'lucide-react';
import Link from 'next/link';
import HomeSection from '../HomeSection';
import SectionHeader from '../SectionHeader';

const AI_FEATURES = [
  {
    id: 'cv-feedback',
    icon: FileSearch,
    title: 'Nhận xét CV',
    description: 'AI chấm điểm CV, chỉ ra điểm cần cải thiện theo vị trí bạn nhắm tới.',
  },
  {
    id: 'mock-interview',
    icon: Mic,
    title: 'Luyện phỏng vấn',
    description: 'Thực hành trả lời câu hỏi phỏng vấn và xem lại phản hồi chi tiết.',
  },
  {
    id: 'job-matching',
    icon: Target,
    title: 'Gợi ý việc làm',
    description: 'Xếp hạng việc làm theo kỹ năng và kinh nghiệm trong hồ sơ của bạn.',
  },
];

export default function AiFeaturesSection() {
  return (
    <HomeSection titleId="ai-title">
      <SectionHeader
        id="ai-title"
        title="Công cụ AI hỗ trợ bạn"
        description="AI giúp bạn chuẩn bị tốt hơn ở từng bước ứng tuyển."
      />

      <ul className="medium:grid-cols-3 grid grid-cols-1 gap-4">
        {AI_FEATURES.map(({ id, icon: Icon, title, description }) => (
          <li key={id}>
            <Card variant="filled" className="h-full space-y-3 p-6">
              <span className="bg-primary-container text-on-primary-container rounded-shape-md flex h-12 w-12 items-center justify-center">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-title-lg text-on-surface">{title}</h3>
              <p className="text-body-lg text-on-surface-variant">{description}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card variant="outlined" className="medium:flex-row medium:items-center mt-4 flex flex-col gap-4 p-6">
        <ShieldCheck className="text-primary h-8 w-8 shrink-0" aria-hidden />
        <div className="flex-1 space-y-1">
          <h3 className="text-title-md text-on-surface">AI hỗ trợ, nhà tuyển dụng quyết định</h3>
          <p className="text-body-md text-on-surface-variant">
            InterVue không tự động nhận hay từ chối hồ sơ. Bạn luôn được thông báo khi AI xử lý dữ liệu của mình.
          </p>
        </div>
        <Link href={ROUTES.CANDIDATE_CVS} className={buttonClassName()}>
          Quản lý CV của bạn
        </Link>
      </Card>
    </HomeSection>
  );
}
