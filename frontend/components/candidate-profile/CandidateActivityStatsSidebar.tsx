'use client';

import {
  Activity,
  Bookmark,
  Clock,
  Eye,
  MailCheck,
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { CandidateProfile } from '@/types/candidate';

interface CandidateActivityStatsSidebarProps {
  stats: CandidateProfile['stats'];
  isOwner?: boolean;
  candidateName?: string;
  onContact?: () => void;
  onBookmark?: () => void;
}

export default function CandidateActivityStatsSidebar({
  stats,
  isOwner = true,
  candidateName = 'ứng viên',
  onContact,
  onBookmark,
}: CandidateActivityStatsSidebarProps) {
  if (!isOwner) {
    return (
      <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-primary flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h2 className="text-navy text-[15.5px] font-bold">Kết nối & Tuyển dụng</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#00873c]">
            <Sparkles className="h-3 w-3" /> Đang sẵn sàng
          </span>
        </div>

        <p className="text-[13px] leading-relaxed text-[#475569]">
          Bạn muốn mời <strong>{candidateName}</strong> tham gia phỏng vấn hoặc trao đổi về cơ hội việc làm mới?
        </p>

        <div className="mt-4 space-y-2.5">
          <button
            type="button"
            onClick={onContact || (() => alert(`Đã mở hộp thoại gửi tin nhắn tuyển dụng tới ${candidateName}!`))}
            className="bg-primary hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold text-white shadow-xs transition-all"
          >
            <Send className="h-4 w-4" />
            <span>Gửi lời mời phỏng vấn ngay</span>
          </button>

          <button
            type="button"
            onClick={onBookmark || (() => alert(`Đã lưu hồ sơ của ${candidateName} vào danh sách theo dõi!`))}
            className="text-navy hover:border-primary hover:text-primary flex w-full items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2 text-[13px] font-semibold transition-all hover:bg-white"
          >
            <Bookmark className="h-4 w-4" />
            <span>Lưu hồ sơ theo dõi</span>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-[#f1f5f9] pt-3 text-[11.5px] text-[#64748b]">
          <Clock className="text-primary h-3.5 w-3.5" />
          <span>
            Ứng viên phản hồi trong vòng <strong>2 giờ</strong> làm việc
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-primary flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
            <Activity className="h-4 w-4" />
          </div>
          <h2 className="text-navy text-[15.5px] font-bold">Hoạt động tuần này</h2>
        </div>
        <span className="text-primary inline-flex items-center gap-1 text-[11px] font-bold">
          <TrendingUp className="h-3 w-3" /> +28%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-3.5">
          <div className="text-primary flex items-center justify-center">
            <Eye className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-black text-[#1e293b]">{stats.profileViewsThisWeek}</div>
          <div className="text-[11px] font-medium text-[#64748b]">Lượt xem hồ sơ</div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-3.5">
          <div className="flex items-center justify-center text-blue-600">
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-black text-[#1e293b]">{stats.recruiterSearches}</div>
          <div className="text-[11px] font-medium text-[#64748b]">Lượt tìm thấy</div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-3.5">
          <div className="flex items-center justify-center text-amber-500">
            <MailCheck className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-black text-[#1e293b]">{stats.interviewInvites}</div>
          <div className="text-[11px] font-medium text-[#64748b]">Lời mời phỏng vấn</div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-3.5">
          <div className="flex items-center justify-center text-purple-600">
            <Bookmark className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-black text-[#1e293b]">{stats.savedByRecruiters}</div>
          <div className="text-[11px] font-medium text-[#64748b]">NTD đã lưu hồ sơ</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50/70 p-3 text-[12px] text-[#00873c]">
        Hồ sơ của bạn đang có độ tương tác cao hơn <strong>88%</strong> ứng viên cùng chuyên ngành.
      </div>
    </div>
  );
}
