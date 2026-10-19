import { ROUTES } from './routes';

export type ApplicationsBoardVariant = 'command-center' | 'split' | 'swimlane' | 'minimal';

export interface ApplicationsBoardVariantMeta {
  id: ApplicationsBoardVariant;
  label: string;
  href: string;
  tagline: string;
  description: string;
  highlights: string[];
}

export const APPLICATIONS_BOARD_VARIANTS: ApplicationsBoardVariantMeta[] = [
  {
    id: 'command-center',
    label: 'Pipeline Command Center',
    href: ROUTES.RECRUITER_APPLICATIONS_COMMAND_CENTER,
    tagline: 'Nhiều thông tin nhất trong một màn hình',
    description: 'Dải chỉ số theo giai đoạn, thẻ ứng viên dày thông tin, chi tiết hồ sơ mở ở khay trượt bên phải.',
    highlights: [
      'Dải chỉ số: hồ sơ chưa xem, hồ sơ chờ quá lâu, lịch phỏng vấn sắp tới',
      'Mỗi cột có mô tả giai đoạn và tỉ lệ hồ sơ đang nằm ở đó',
      'Thẻ ứng viên hiển thị điểm phù hợp AI, kỹ năng, câu hỏi sàng lọc',
    ],
  },
  {
    id: 'split',
    label: 'Split view + inspector',
    href: ROUTES.RECRUITER_APPLICATIONS_SPLIT,
    tagline: 'Duyệt hồ sơ nhanh nhất',
    description: 'Board bên trái, khung chi tiết luôn hiển thị bên phải, duyệt hồ sơ bằng phím J và K.',
    highlights: [
      'Không cần mở và đóng chi tiết cho từng hồ sơ',
      'Phím J và K để nhảy giữa các hồ sơ mà không rời bàn phím',
      'Cột hẹp hơn vì khung chi tiết chiếm chỗ cố định',
    ],
  },
  {
    id: 'swimlane',
    label: 'Swimlane theo tin',
    href: ROUTES.RECRUITER_APPLICATIONS_SWIMLANE,
    tagline: 'Theo dõi nhiều tin cùng lúc',
    description: 'Mỗi tin tuyển dụng một hàng riêng, thấy nhiều tin cùng lúc mà không cần đổi bộ lọc.',
    highlights: [
      'So sánh tiến độ tuyển dụng giữa các tin ngay trên một màn hình',
      'Thu gọn từng hàng để tập trung vào tin đang cần xử lý',
      'Trang sẽ cao hơn khi có nhiều tin đang tuyển',
    ],
  },
  {
    id: 'minimal',
    label: 'Kanban tối giản',
    href: ROUTES.RECRUITER_APPLICATIONS_MINIMAL,
    tagline: 'Gọn và tập trung',
    description: 'Board gọn nhẹ, thẻ chỉ hiển thị thông tin cốt lõi, chi tiết mở ở cửa sổ giữa trang.',
    highlights: [
      'Thấy toàn bộ pipeline với ít nhiễu thị giác nhất',
      'Thẻ chỉ gồm ứng viên, điểm phù hợp và thời điểm ứng tuyển',
      'Phải mở chi tiết mới nắm được bối cảnh hồ sơ',
    ],
  },
];

export function getBoardVariantMeta(variant: ApplicationsBoardVariant): ApplicationsBoardVariantMeta {
  return APPLICATIONS_BOARD_VARIANTS.find((item) => item.id === variant) ?? APPLICATIONS_BOARD_VARIANTS[0];
}
