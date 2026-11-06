/**
 * AI Personal Data Processing Consent Configuration Pursuant to Decree No. 13/2023/ND-CP on Personal Data Protection.
 *
 * Keep all consent text, versioning, and policy sections in this single constant.
 */
export const AI_PERSONAL_DATA_CONSENT_STORAGE_KEY = 'intervue_ai_personal_data_consent';

export const AI_PERSONAL_DATA_CONSENT_CONFIG = {
  version: '1.0.0',
  lastUpdated: '2026-11-05',
  badgeText: 'Tuân thủ Nghị định 13/2023/NĐ-CP',
  title: 'Chấp thuận xử lý dữ liệu cá nhân cho tính năng AI',
  summary:
    'Để sử dụng các tính năng Trí tuệ nhân tạo (AI) hỗ trợ bóc tách hồ sơ CV, đánh giá độ phù hợp và đề xuất việc làm, InterVue cần sự đồng ý rõ ràng của bạn về việc xử lý dữ liệu cá nhân theo quy định pháp luật.',
  sections: [
    {
      heading: '1. Phạm vi dữ liệu cá nhân thu thập',
      details:
        'Bao gồm các thông tin trên tệp CV bạn tải lên (họ tên, email, số điện thoại, lịch sử công tác, học vấn, kỹ năng, dự án) và các kỳ vọng nghề nghiệp bạn thiết lập.',
    },
    {
      heading: '2. Mục đích xử lý bằng Trí tuệ nhân tạo (AI)',
      details:
        'Trích xuất văn bản từ CV, tự động gợi ý điền thông tin vào hồ sơ ứng viên, kiểm tra độ tương thích với tin tuyển dụng và cung cấp nhận xét cải thiện CV khách quan.',
    },
    {
      heading: '3. Cam kết bảo mật & nguyên tắc đạo đức AI',
      details:
        'InterVue cam kết không chia sẻ hoặc thương mại hóa dữ liệu cá nhân cho bên thứ ba trái phép. AI tuyệt đối không sử dụng các yếu tố nhạy cảm (tuổi tác, giới tính, ảnh chân dung, quê quán) để đưa ra bất kỳ đánh giá nào.',
    },
    {
      heading: '4. Quyền của chủ thể dữ liệu & thời hạn',
      details:
        'Sự đồng ý áp dụng cho phiên bản chính sách hiện tại. Bạn có quyền xem lại, yêu cầu chỉnh sửa, xóa dữ liệu hoặc thu hồi sự chấp thuận này bất kỳ lúc nào trong Cài đặt tài khoản.',
    },
  ],
  notice:
    'Nếu không đồng ý, bạn hoàn toàn có thể tiếp tục sử dụng các tính năng tiêu chuẩn của InterVue và tự cập nhật hồ sơ bằng phương pháp thủ công.',
  confirmButtonText: 'Đồng ý và tiếp tục',
  cancelButtonText: 'Để sau (Nhập thủ công)',
} as const;

export type AiPersonalDataConsentConfig = typeof AI_PERSONAL_DATA_CONSENT_CONFIG;
