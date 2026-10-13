import { AvailableVoucher, GiftFaqItem } from '@/types/gift';

export const AVAILABLE_VOUCHERS: AvailableVoucher[] = [
  {
    id: 'v-1',
    type: 'education',
    packageId: '300',
    packageName: 'Tài khoản Education VIP (1 năm)',
    code: 'EDU-VIP-2026',
    expiryDate: '31/12/2026',
    receivedDate: '01/10/2026',
    tagColor: 'text-amber-700',
    tagBg: 'bg-amber-50',
    titleColor: 'text-amber-600',
    badgeLabel: 'Sinh viên & Giảng viên',
    description: 'Ưu đãi kích hoạt VIP dành cho học tập, bao gồm trọn bộ đặc quyền tạo CV & khoá học.',
  },
  {
    id: 'v-2',
    type: 'pro',
    packageId: '400',
    packageName: 'Tài khoản Pro VIP (1 tháng)',
    code: 'PRO-TRIAL-30D',
    expiryDate: '15/11/2026',
    receivedDate: '05/10/2026',
    tagColor: 'text-blue-700',
    tagBg: 'bg-blue-50',
    titleColor: 'text-blue-600',
    badgeLabel: 'Dùng thử Pro',
    description: 'Trải nghiệm đầy đủ tính năng Pro: Đẩy Top hồ sơ và tải không giới hạn CV.',
  },
  {
    id: 'v-3',
    type: 'premium',
    packageId: '402',
    packageName: 'Tài khoản Premium VIP (1 năm)',
    code: 'TOPCV-PREMIUM-VIP',
    expiryDate: '30/12/2026',
    receivedDate: '06/10/2026',
    tagColor: 'text-emerald-700',
    tagBg: 'bg-emerald-50',
    titleColor: 'text-emerald-600',
    badgeLabel: 'VIP Cao Cấp Nhất',
    description: 'Đặc quyền cao nhất: Xếp hạng Top 1 tìm kiếm NTD, hỗ trợ sửa CV 1-1 chuyên sâu.',
  },
  {
    id: 'v-4',
    type: 'course',
    packageId: '300',
    packageName: 'Khoá học Gitiho: Tuyệt đỉnh Excel 2026',
    code: 'GITIHO-EXCEL-FREE',
    expiryDate: '31/12/2026',
    receivedDate: 'Quà tặng thành viên',
    tagColor: 'text-purple-700',
    tagBg: 'bg-purple-50',
    titleColor: 'text-purple-600',
    badgeLabel: 'Đối tác Gitiho',
    description: 'Trọn bộ 50+ video thực hành Excel từ cơ bản tới nâng cao cho dân văn phòng.',
  },
];

export const GIFT_FAQS: GiftFaqItem[] = [
  {
    q: 'Làm thế nào để nhận được mã quà tặng TopCV?',
    a: 'Mã quà tặng TopCV thường được phát hành thông qua các chương trình tri ân ứng viên, sự kiện ngày hội việc làm, workshop tại các trường đại học, đối tác liên kết giáo dục, hoặc gửi trực tiếp qua email của bạn.',
  },
  {
    q: 'Mã quà tặng có thể áp dụng cho những gói tài khoản nào?',
    a: 'Mỗi mã quà tặng được thiết kế riêng cho một hoặc nhiều gói tài khoản cụ thể (Education VIP, Pro VIP, Premium VIP). Bạn chỉ cần chọn đúng gói tài khoản tương ứng trên thanh chọn rồi bấm "Áp dụng".',
  },
  {
    q: 'Tôi có thể chia sẻ mã quà tặng cho bạn bè được không?',
    a: 'Có. Mỗi mã quà tặng chưa qua kích hoạt đều có thể sử dụng cho bất kỳ tài khoản ứng viên nào trên hệ thống. Sau khi đã kích hoạt thành công, mã sẽ được liên kết vĩnh viễn với tài khoản đó.',
  },
  {
    q: 'Quyền lợi khoá học từ đối tác (Gitiho) nhận như thế nào?',
    a: 'Khi kích hoạt mã và tích chọn đồng ý chia sẻ thông tin cho đối tác, hệ thống sẽ tự động gửi email hướng dẫn kích hoạt tài khoản học tập trực tuyến trên Gitiho với đúng địa chỉ email tài khoản của bạn trong vòng 24 giờ làm việc.',
  },
  {
    q: 'Mã quà tặng đã hết hạn thì có kích hoạt được không?',
    a: 'Rất tiếc, các mã quà tặng đã quá ngày hết hạn (HSD) sẽ không còn giá trị kích hoạt. Bạn vui lòng liên hệ hotline 1900 068 889 (Nhánh 2) nếu cần hỗ trợ thêm thông tin chi tiết.',
  },
];
