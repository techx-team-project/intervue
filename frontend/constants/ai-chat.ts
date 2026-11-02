import type { SuggestedQuestion } from '@/types/ai-chat';

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'sq-company-verification',
    question: 'Làm thế nào để xác thực doanh nghiệp?',
  },
  {
    id: 'sq-ats-cv',
    question: 'Cách tạo và tối ưu CV chuẩn ATS?',
  },
  {
    id: 'sq-apply-status',
    question: 'Quy trình ứng tuyển và theo dõi trạng thái như thế nào?',
  },
  {
    id: 'sq-two-factor',
    question: 'Làm sao để bật bảo mật 2 lớp (2FA)?',
  },
  {
    id: 'sq-ai-interview',
    question: 'InterVue hỗ trợ luyện phỏng vấn AI như thế nào?',
  },
];

export const DEFAULT_GREETING =
  'Xin chào! 👋 Tôi là trợ lý ảo InterVue AI. Tôi có thể giải đáp các thắc mắc về cách sử dụng nền tảng InterVue: tạo tài khoản, tối ưu CV chuẩn ATS, luyện phỏng vấn AI, hoặc quy trình xác thực doanh nghiệp.';

export const AI_CHAT_SESSION_KEY = 'intervue.ai.chat.sessionId';

export function hasBottomBar(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname.startsWith('/recruiter') || pathname.startsWith('/admin') || pathname === '/mascot';
}
