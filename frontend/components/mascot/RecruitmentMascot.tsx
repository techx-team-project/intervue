'use client';

import React from 'react';
import { DynamicRobotHead, type RobotHeadShape, type RobotHeadState } from './MascotCore';

export type RecruitmentStage =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'searching'
  | 'interview_listen'
  | 'interview_speak'
  | 'success'
  | 'happy'
  | 'error'
  | 'sleeping';

export interface RecruitmentMascotProps {
  /** Giai đoạn trong quy trình tuyển dụng / phỏng vấn */
  stage?: RecruitmentStage;
  /** Lời thoại tùy biến. Nếu không truyền sẽ lấy câu thoại mặc định của stage */
  message?: string;
  /** Kích thước robot (pixel). Mặc định 120px */
  size?: number;
  /** Hình dáng đầu robot: 'circle' | 'rectangle' | 'square' | 'hexagon' */
  shape?: RobotHeadShape;
  /** Bố cục: ngang (robot bên cạnh thoại) hoặc dọc (robot bên trên thoại) */
  orientation?: 'horizontal' | 'vertical';
  /** Màu vỏ robot (mặc định InterVue Navy: #263a4d) */
  color?: string;
  /** Màu viền tai và ăng-ten (mặc định Emerald: #34d399) */
  trimColor?: string;
  /** Màu màn hình LED (mặc định Soft Mint: #ecfdf5) */
  screenColor?: string;
  /** Có tương tác dõi theo chuột và click nhảy xoay hay không */
  interactive?: boolean;
  /** Hiện bóng sàn dưới chân robot */
  floorShadow?: boolean;
  /** Hiện ăng-ten trên đỉnh đầu robot */
  antenna?: boolean;
  /** ClassName bổ sung cho container */
  className?: string;
}

const STAGE_CONFIG: Record<RecruitmentStage, { state: RobotHeadState; defaultMsg: string }> = {
  idle: {
    state: 'idle',
    defaultMsg: 'Chào bạn! Mình là trợ lý tuyển dụng InterVue AI, sẵn sàng đồng hành cùng bạn.',
  },
  uploading: {
    state: 'working',
    defaultMsg: 'Đang bóc tách thông tin học vấn và kỹ năng từ file CV của bạn...',
  },
  analyzing: {
    state: 'thinking',
    defaultMsg: 'Đang đối soát kỹ năng và phân tích độ tương thích tiêu chuẩn ATS...',
  },
  searching: {
    state: 'searching',
    defaultMsg: 'Đang tìm kiếm các cơ hội việc làm và mức đãi ngộ phù hợp nhất...',
  },
  interview_listen: {
    state: 'listening',
    defaultMsg: 'Mình đang lắng nghe câu trả lời của bạn, hãy tự tin trình bày nhé...',
  },
  interview_speak: {
    state: 'speaking',
    defaultMsg: 'Hãy giới thiệu ngắn gọn về một dự án thực tế tiêu biểu mà bạn tâm đắc nhất.',
  },
  success: {
    state: 'happy',
    defaultMsg: 'Tuyệt vời! Thao tác đã hoàn tất thành công. Chúc bạn nhiều may mắn!',
  },
  happy: {
    state: 'happy',
    defaultMsg: 'Tuyệt vời! Thao tác đã hoàn tất thành công. Chúc bạn nhiều may mắn!',
  },
  error: {
    state: 'error',
    defaultMsg: 'Đã xảy ra lỗi hoặc định dạng tệp chưa phù hợp. Bạn vui lòng kiểm tra lại!',
  },
  sleeping: {
    state: 'sleeping',
    defaultMsg: 'Trợ lý AI đang tạm nghỉ ngơi. Hẹn gặp lại bạn trong buổi làm việc tới!',
  },
};

export function RecruitmentMascot({
  stage = 'idle',
  message,
  size = 120,
  shape = 'rectangle',
  orientation = 'horizontal',
  color = '#064e3b',
  trimColor = '#10b981',
  screenColor = '#a7f3d0',
  interactive = true,
  floorShadow = true,
  antenna = true,
  className = '',
}: RecruitmentMascotProps) {
  const current = STAGE_CONFIG[stage] || STAGE_CONFIG.idle;

  return (
    <div
      className={`flex ${
        orientation === 'vertical' ? 'flex-col items-center text-center' : 'items-center'
      } gap-4 overflow-visible ${className}`}
    >
      {/* Robot Canvas wrapper (overflow-visible để tránh cắt ăng-ten khi nhảy) */}
      <div className="shrink-0 overflow-visible">
        <DynamicRobotHead
          shape={shape}
          state={current.state}
          size={size}
          color={color}
          trimColor={trimColor}
          screenColor={screenColor}
          interactive={interactive}
          floorShadow={floorShadow}
          antenna={antenna}
        />
      </div>

      {/* Bong bóng lời thoại (Speech bubble) */}
      <div className="relative max-w-sm rounded-2xl border border-emerald-100 bg-white/95 p-4 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-xs transition-all">
        <p className="leading-relaxed">{message || current.defaultMsg}</p>

        {/* Mũi tên chỉ về phía robot */}
        {orientation === 'horizontal' ? (
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-y-8 border-r-8 border-y-transparent border-r-white drop-shadow-xs" />
        ) : (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-white drop-shadow-xs" />
        )}
      </div>
    </div>
  );
}
