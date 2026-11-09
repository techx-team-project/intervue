import type { EntitlementType, ServiceNeedKey } from '@/types/service-package';

export const SERVICE_NEED_MODAL_STORAGE_KEY = 'intervue.services.needModal.dismissed';

export const SERVICE_NEED_OPTIONS: { key: ServiceNeedKey; label: string }[] = [
  { key: 'REACH', label: 'Hỗ trợ quảng cáo và tăng lượt tiếp cận với ứng viên' },
  { key: 'CONNECT', label: 'Linh hoạt chọn tiện ích theo từng giai đoạn tuyển dụng' },
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

export const ENTITLEMENT_TYPE_OPTIONS: { value: EntitlementType; label: string }[] = [
  { value: 'JOB_POST_SLOT', label: 'Job post slot' },
  { value: 'JOB_BOOST', label: 'Job ranking boost' },
  { value: 'JOB_LABEL_URGENT', label: 'Label: urgent' },
  { value: 'JOB_LABEL_HOT', label: 'Label: hot' },
  { value: 'JOB_HIGHLIGHT', label: 'Highlighted job row' },
  { value: 'JOB_RETOP', label: 'Re-top push' },
  { value: 'JOB_ALERT_PUSH', label: 'Job alert push' },
  { value: 'AI_RESUME_MATCH', label: 'AI resume match' },
  { value: 'AI_JD_GENERATE', label: 'AI job description' },
  { value: 'BRAND_PAGE', label: 'Brand page' },
  { value: 'FEATURED_COMPANY', label: 'Featured company' },
  { value: 'AD_SLOT_WEEK', label: 'Ad slot week' },
  { value: 'CREDIT', label: 'Credits' },
];
