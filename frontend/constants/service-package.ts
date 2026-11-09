import type { ServiceNeedKey } from '@/types/service-package';

export const SERVICE_NEED_MODAL_STORAGE_KEY = 'intervue.services.needModal.dismissed';

export const SERVICE_NEED_OPTIONS: { key: ServiceNeedKey; label: string }[] = [
  { key: 'REACH', label: 'Hỗ trợ quảng cáo và tăng lượt tiếp cận với ứng viên' },
  { key: 'CONNECT', label: 'Chủ động tìm kiếm và kết nối ứng viên' },
  { key: 'HIGHLIGHT', label: 'Làm nổi bật tin tuyển dụng để tăng hiệu quả với ứng viên' },
  {
    key: 'BRANDING',
    label: 'Xây dựng hình ảnh thương hiệu tuyển dụng uy tín, nâng cao hiệu quả hoạt động tuyển dụng',
  },
];

export const SERVICE_NEED_MODAL_COPY = {
  title: 'Gợi ý gói dịch vụ phù hợp',
  description: 'Hãy chọn một trong các nhu cầu bên dưới để chúng tôi có thể giúp bạn đưa ra gợi ý chính xác nhất nhé.',
  dismissLabel: 'Không hiển thị lại nội dung này',
  confirmLabel: 'Xác nhận',
};

export const SERVICE_IMPORTANT_NOTICE = {
  title: 'Lưu ý quan trọng',
  body: 'Nhằm tránh rủi ro mạo danh và lừa đảo, InterVue khuyến nghị Quý khách hàng không chuyển khoản vào bất cứ tài khoản cá nhân nào và chỉ thực hiện thanh toán vào các tài khoản chính thức của chúng tôi.',
};

export const SERVICE_VAT_NOTE = '* Giá dịch vụ chưa bao gồm VAT';

export const SERVICE_BADGE_LABEL: Record<'NEW' | 'SPECIAL_OFFER', string> = {
  NEW: 'MỚI',
  SPECIAL_OFFER: 'Ưu đãi đặc biệt',
};

export const SERVICE_CATEGORY_ANCHOR_PREFIX = 'service-category-';
