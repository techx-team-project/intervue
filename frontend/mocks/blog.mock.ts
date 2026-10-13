import { BlogCategoryMeta, BlogCategorySlug, BlogArticle } from '@/types/blog';
import { CAREER_ARTICLES } from './career-orientation.mock';

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    id: 'orientation',
    name: 'Định hướng nghề nghiệp',
    slug: 'dinh-huong-nghe-nghiep',
    shortDesc: 'Khám phá tiềm năng, xác định đam mê và lộ trình phát triển sự nghiệp rõ ràng.',
    description:
      'Cẩm nang định hướng phát triển sự nghiệp toàn diện: Giúp bạn thấu hiểu bản thân theo mô hình Ikigai, chọn ngành nghề phù hợp với xu hướng tuyển dụng 2026 và xây dựng lộ trình thăng tiến bền vững.',
    iconName: 'Compass',
    badge: 'Định hướng tương lai',
    articleCount: 6,
    subFilters: [
      'Tất cả',
      'Khám phá bản thân (Ikigai)',
      'Chọn ngành chọn nghề',
      'Lộ trình thăng tiến',
      'Sinh viên mới ra trường',
      'Chuyển đổi nghề nghiệp (Pivot)',
    ],
    bannerGradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    accentColor: '#00b14f',
  },
  {
    id: 'tips',
    name: 'Bí quyết tìm việc',
    slug: 'bi-kip-tim-viec',
    shortDesc: 'Bí quyết viết CV chuẩn ATS, chinh phục phỏng vấn và đàm phán lương bứt phá.',
    description:
      'Bộ cẩm nang thực chiến chinh phục nhà tuyển dụng từ A-Z: Hướng dẫn tối ưu hóa CV vượt qua bộ lọc ATS trong 6 giây, kịch bản trả lời 50+ câu hỏi phỏng vấn hóc búa và nghệ thuật deal lương cao hơn 20-30%.',
    iconName: 'Briefcase',
    badge: 'Chinh phục nhà tuyển dụng',
    articleCount: 6,
    subFilters: [
      'Tất cả',
      'Viết CV chuẩn ATS',
      'Kỹ năng phỏng vấn',
      'Đàm phán mức lương',
      'Vượt qua thử việc',
      'Thư cảm ơn (Thank-you letter)',
    ],
    bannerGradient: 'from-blue-600 via-indigo-600 to-blue-800',
    accentColor: '#2563eb',
  },
  {
    id: 'salary',
    name: 'Chế độ hưởng lương',
    slug: 'che-do-luong-thuong',
    shortDesc: 'Quy đổi Lương Gross sang Net, bảo hiểm xã hội, thưởng KPI và quyền lợi lao động.',
    description:
      'Hiểu rõ quyền lợi tài chính và pháp lý của bạn theo Bộ luật Lao động mới nhất: Công cụ tính lương Gross sang Net chuẩn quy định bảo hiểm xã hội (BHXH, BHYT, BHTN), biểu thuế TNCN lũy tiến và cách tính thưởng tháng 13.',
    iconName: 'Calculator',
    badge: 'Minh bạch quyền lợi',
    articleCount: 6,
    subFilters: [
      'Tất cả',
      'Quy đổi Gross sang Net',
      'Bảo hiểm xã hội & Y tế',
      'Lương tháng 13 & Thưởng Tết',
      'Thuế TNCN & Giảm trừ',
      'Tiền làm thêm giờ (OT)',
      'Trợ cấp thôi việc',
    ],
    bannerGradient: 'from-amber-600 via-orange-600 to-amber-800',
    accentColor: '#ea580c',
  },
  {
    id: 'skills',
    name: 'Kiến thức chuyên ngành',
    slug: 'kien-thuc-chuyen-nganh',
    shortDesc: 'Kho tri thức nghiệp vụ thực chiến, thuật ngữ và xu hướng các ngành IT, Marketing, Sales, Logistics.',
    description:
      'Đào sâu kiến thức chuyên môn thực chiến và bắt kịp xu hướng thị trường lao động 2026: Phân tích chuyên sâu nghiệp vụ Marketing, Công nghệ thông tin / AI, Logistics, Tài chính ngân hàng và Quản trị nhân sự.',
    iconName: 'GraduationCap',
    badge: 'Nâng cao chuyên môn',
    articleCount: 6,
    subFilters: [
      'Tất cả',
      'Công nghệ thông tin / AI',
      'Marketing & Truyền thông số',
      'Kinh doanh & Bán hàng (Sales)',
      'Tài chính & Kế toán',
      'Logistics & Xuất nhập khẩu',
      'Nhân sự (C&B, Tuyển dụng)',
    ],
    bannerGradient: 'from-violet-600 via-purple-600 to-violet-800',
    accentColor: '#7c3aed',
  },
];

// Additional rich articles for Bí quyết tìm việc, Chế độ hưởng lương, Kiến thức chuyên ngành, and Định hướng nghề nghiệp
export const ADDITIONAL_BLOG_ARTICLES: BlogArticle[] = [
  // --- BÍ QUYẾT TÌM VIỆC (bi-kip-tim-viec) ---
  {
    id: 'art-cv-ats-2026',
    slug: 'bi-quyet-viet-cv-chuan-ats-chinh-phuc-nha-tuyen-dung-2026',
    title: 'Trọn bộ bí quyết viết CV chuyên nghiệp chuẩn ATS chinh phục nhà tuyển dụng 2026',
    category: 'Bí quyết tìm việc',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Hơn 75% CV bị loại trước khi đến tay HR bởi hệ thống theo dõi ứng viên (ATS). Học ngay cách cấu trúc CV chuẩn, chèn từ khóa ngành và trình bày thành tích theo mô hình STAR ấn tượng.',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '03/10/2026',
    readTime: '9 phút đọc',
    viewsCount: '41.8K',
    isFeatured: true,
    isTrending: true,
    tags: ['Viết CV', 'Chuẩn ATS', 'Bí quyết tìm việc', 'Mô hình STAR', 'Hồ sơ xin việc'],
    author: {
      name: 'Nguyễn Thanh Tùng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Head of Talent Acquisition @ InterVue',
      bio: 'Hơn 12 năm kinh nghiệm phỏng vấn và đánh giá hơn 20.000 hồ sơ ứng viên cấp cao tại các tập đoàn công nghệ.',
    },
    tableOfContents: [
      { id: 'he-thong-ats-la-gi', title: '1. Hệ thống ATS là gì và cơ chế hoạt động?', level: 1 },
      { id: '5-sai-lam-khien-cv-bi-loai', title: '2. 5 sai lầm phổ biến khiến CV bị loại ngay lập tức', level: 1 },
      {
        id: 'cong-thuc-star-viet-kinh-nghiem',
        title: '3. Công thức STAR viết phần kinh nghiệm gây ấn tượng',
        level: 1,
      },
      { id: 'tu-khoa-ats-theo-nganh', title: '4. Cách tìm và chèn từ khóa ATS chính xác', level: 1 },
      { id: 'checklist-ho-so-truoc-khi-nop', title: '5. Checklist 7 bước kiểm tra CV trước khi nộp', level: 1 },
    ],
    sections: [
      {
        id: 'he-thong-ats-la-gi',
        title: '1. Hệ thống ATS là gì và cơ chế hoạt động?',
        leadText:
          'ATS (Applicant Tracking System) là phần mềm tự động quét và xếp hạng hồ sơ ứng viên dựa trên từ khóa, định dạng văn bản và tiêu chí tuyển dụng trước khi chuyên viên nhân sự đọc trực tiếp.',
        paragraphs: [
          'Tại các doanh nghiệp quy mô vừa và lớn, mỗi vị trí tuyển dụng có thể nhận từ 100 đến 500 CV trong vòng một tuần. ATS đóng vai trò người gác cổng, phân tích văn bản để trích xuất thông tin về học vấn, kỹ năng cốt lõi và kinh nghiệm liên quan.',
          'Nếu định dạng tệp phức tạp (chứa bảng biểu lồng nhau, hình ảnh chứa chữ, hoặc icon lạ), hệ thống ATS có thể không đọc được dữ liệu, dẫn đến việc CV của bạn bị đánh giá điểm tương đồng thấp dù năng lực thực tế rất tốt.',
        ],
        highlights: [
          'Định dạng tối ưu nhất: PDF tiêu chuẩn hoặc Word (.docx), phông chữ rõ ràng như Arial, Inter, Calibri cỡ chữ 10 - 12pt.',
          'Đặt tên file chuyên nghiệp: [Vị trí ứng tuyển]_[Họ và tên]_[CV].pdf.',
        ],
      },
      {
        id: '5-sai-lam-khien-cv-bi-loai',
        title: '2. 5 sai lầm phổ biến khiến CV bị loại ngay lập tức',
        paragraphs: [
          'Sai lầm đầu tiên là sử dụng thanh đo kỹ năng phần trăm (ví dụ: Photoshop 80%, Giao tiếp 90%). ATS không thể diễn giải các thanh đồ họa này và nhà tuyển dụng cũng xem đó là đánh giá chủ quan thiếu cơ sở.',
          'Sai lầm thứ hai là liệt kê trách nhiệm công việc chung chung thay vì kết quả đạt được. Thay vì viết "Phụ trách quản lý fanpage", hãy viết "Tăng trưởng 45% lượng tương tác tự nhiên và thu về 120 khách hàng tiềm năng/tháng".',
        ],
      },
      {
        id: 'cong-thuc-star-viet-kinh-nghiem',
        title: '3. Công thức STAR viết phần kinh nghiệm gây ấn tượng',
        paragraphs: [
          'Mô hình STAR gồm: Situation (Bối cảnh) - Task (Nhiệm vụ) - Action (Hành động bạn đã thực hiện) - Result (Kết quả có số liệu đo lường cụ thể).',
          'Ví dụ thực tế: "Trong bối cảnh chi phí quảng cáo tăng 30% (S), tôi được giao nhiệm vụ tối ưu hóa tỷ lệ chuyển đổi website (T). Tôi đã thiết kế lại luồng thanh toán và A/B testing 12 mẫu landing page (A), giúp tỷ lệ chốt đơn tăng từ 2.1% lên 4.3%, tiết kiệm 80 triệu chi phí quảng cáo hàng tháng (R)".',
        ],
      },
      {
        id: 'tu-khoa-ats-theo-nganh',
        title: '4. Cách tìm và chèn từ khóa ATS chính xác',
        paragraphs: [
          'Đọc kỹ 3 - 5 bản tin tuyển dụng (Job Description - JD) của vị trí mục tiêu. Gạch chân các cụm danh từ chỉ kỹ năng, công cụ phần mềm và chứng chỉ thường xuyên xuất hiện (ví dụ: Google Analytics, SQL, Agile/Scrum, Figma).',
          'Chèn tự nhiên các từ khóa này vào phần Tóm tắt mục tiêu nghề nghiệp, Kỹ năng và mô tả các dự án đã thực hiện.',
        ],
      },
      {
        id: 'checklist-ho-so-truoc-khi-nop',
        title: '5. Checklist 7 bước kiểm tra CV trước khi nộp',
        paragraphs: [
          '1. Kiểm tra chính tả và ngữ pháp tuyệt đối không có lỗi.',
          '2. Số điện thoại và email cá nhân hoạt động bình thường, email mang tính chuyên nghiệp.',
          '3. Link LinkedIn hoặc Portfolio hoạt động tốt, không bị lỗi 404.',
          '4. Độ dài CV gói gọn trong 1 đến 2 trang.',
        ],
      },
    ],
  },
  {
    id: 'art-interview-questions-2026',
    slug: 'top-15-cau-hoi-phong-van-thuong-gap-nhat-va-cach-tra-loi',
    title: 'Top 15 câu hỏi phỏng vấn thường gặp nhất và kịch bản trả lời thông minh ghi điểm tuyệt đối',
    category: 'Bí quyết tìm việc',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Tổng hợp 15 câu hỏi phỏng vấn kinh điển từ "Hãy giới thiệu bản thân", "Điểm yếu lớn nhất của bạn là gì?" đến "Tại sao chúng tôi nên chọn bạn?" kèm phân tích tâm lý nhà tuyển dụng và câu trả lời mẫu.',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    publishedAt: '28/09/2026',
    readTime: '11 phút đọc',
    viewsCount: '58.2K',
    isFeatured: true,
    tags: ['Kỹ năng phỏng vấn', 'Câu hỏi phỏng vấn', 'Giao tiếp ứng xử', 'Nhà tuyển dụng', 'Bí quyết tìm việc'],
    author: {
      name: 'Trần Bích Phương',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'Career Coach & HR Consultant',
    },
    tableOfContents: [
      {
        id: 'gioi-thieu-ban-than-2-phut',
        title: '1. Kỹ thuật giới thiệu bản thân trong 2 phút (Mô hình Past-Present-Future)',
        level: 1,
      },
      {
        id: 'cach-tra-loi-diem-yeu',
        title: '2. Cách trả lời câu hỏi "Điểm yếu lớn nhất của bạn là gì?" khéo léo',
        level: 1,
      },
      {
        id: 'tai-sao-nghi-viec-cong-ty-cu',
        title: '3. Trả lời lý do nghỉ việc ở công ty cũ mà không bị phàn nàn',
        level: 1,
      },
      {
        id: '5-cau-hoi-thong-minh-hoi-lai-hr',
        title: '4. 5 câu hỏi thông minh ứng viên nên hỏi nhà tuyển dụng cuối buổi',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'gioi-thieu-ban-than-2-phut',
        title: '1. Kỹ thuật giới thiệu bản thân trong 2 phút (Mô hình Past-Present-Future)',
        leadText:
          'Đừng đọc lại toàn bộ CV của bạn! Nhà tuyển dụng muốn nghe câu chuyện ngắn gọn về vị thế hiện tại của bạn, những thành tựu nổi bật trong quá khứ và lý do bạn muốn đồng hành cùng công ty trong tương lai.',
        paragraphs: [
          'Present (Hiện tại): Tóm tắt vị trí chuyên môn hiện tại, số năm kinh nghiệm và lĩnh vực thế mạnh.',
          'Past (Quá khứ): 1 đến 2 thành tựu nổi bật nhất minh chứng cho năng lực thực tế.',
          'Future (Tương lai): Tại sao mục tiêu phát triển tiếp theo của bạn lại hoàn toàn phù hợp với định hướng của công ty đang ứng tuyển.',
        ],
      },
      {
        id: 'cach-tra-loi-diem-yeu',
        title: '2. Cách trả lời câu hỏi "Điểm yếu lớn nhất của bạn là gì?" khéo léo',
        paragraphs: [
          'Tuyệt đối tránh câu trả lời sáo rỗng như: "Điểm yếu của tôi là quá cầu toàn" hoặc "Tôi là người nghiện công việc".',
          'Cách trả lời chuẩn xác: Chọn một kỹ năng phụ không ảnh hưởng trực tiếp đến năng lực cốt lõi của vị trí, thừa nhận một cách chân thành và nêu rõ giải pháp cụ thể bạn đang thực hiện để khắc phục.',
        ],
      },
      {
        id: 'tai-sao-nghi-viec-cong-ty-cu',
        title: '3. Trả lời lý do nghỉ việc ở công ty cũ mà không bị phàn nàn',
        paragraphs: [
          'Nguyên tắc vàng: Không bao giờ nói xấu sếp cũ, đồng nghiệp cũ hoặc văn hóa công ty cũ.',
          'Hãy tập trung vào nhu cầu tìm kiếm thử thách mới, mong muốn mở rộng quy mô dự án và môi trường phù hợp với mục tiêu thăng tiến dài hạn của bạn.',
        ],
      },
      {
        id: '5-cau-hoi-thong-minh-hoi-lai-hr',
        title: '4. 5 câu hỏi thông minh ứng viên nên hỏi nhà tuyển dụng cuối buổi',
        paragraphs: [
          '1. "Một ngày làm việc điển hình của vị trí này sẽ diễn ra như thế nào?"',
          '2. "Mục tiêu quan trọng nhất mà ban lãnh đạo kỳ vọng người đảm nhận vị trí này đạt được trong 3 tháng đầu tiên là gì?"',
          '3. "Anh/chị đánh giá đâu là thách thức lớn nhất mà đội ngũ hiện tại đang đối mặt?"',
          '4. "Quy trình đánh giá hiệu quả công việc (KPI/OKR) tại công ty được triển khai ra sao?"',
        ],
      },
    ],
  },
  {
    id: 'art-salary-negotiation-offer',
    slug: 'nghe-thuat-dam-phan-luong-khi-nhan-offer-tang-20-30-phan-tram',
    title: 'Nghệ thuật đàm phán lương khi nhận Offer: Cách đạt mức thu nhập cao hơn 20-30% mà không bị mất lòng',
    category: 'Bí quyết tìm việc',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Đàm phán lương không phải là cuộc mặc cả, mà là thảo luận dựa trên giá trị bạn mang lại cho doanh nghiệp. Khám phá 6 nguyên tắc thương lượng mức đãi ngộ trọn gói (Base salary, Bonus, Phúc lợi) từ chuyên gia HR.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '22/09/2026',
    readTime: '10 phút đọc',
    viewsCount: '34.7K',
    tags: ['Đàm phán lương', 'Job Offer', 'Mức lương thị trường', 'Bí quyết tìm việc', 'Thu nhập'],
    author: {
      name: 'Vũ Minh Đức',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Executive Recruiter',
    },
    tableOfContents: [
      { id: 'thoi-diem-vang-dam-phan-luong', title: '1. Thời điểm vàng để bắt đầu đàm phán lương', level: 1 },
      { id: 'nghien-cuu-dai-luong-thi-truong', title: '2. Cách khảo sát dải lương thị trường chính xác', level: 1 },
      { id: 'nguyen-tac-dam-phan-tong-the', title: '3. Đàm phán gói đãi ngộ tổng thể (Total Compensation)', level: 1 },
      {
        id: 'kich-ban-email-phan-hoi-offer',
        title: '4. Mẫu email phản hồi thương lượng offer chuyên nghiệp',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'thoi-diem-vang-dam-phan-luong',
        title: '1. Thời điểm vàng để bắt đầu đàm phán lương',
        paragraphs: [
          'Thời điểm có lợi thế đàm phán cao nhất là khi nhà tuyển dụng đã chính thức gửi thư mời nhận việc (Job Offer). Lúc này họ đã chọn bạn là ứng viên số 1 và đã tốn chi phí, thời gian tìm kiếm.',
          'Nếu được hỏi mức lương mong muốn ở vòng đầu, hãy đưa ra một khoảng linh hoạt dựa trên dữ liệu thị trường thay vì chốt một con số cứng nhắc.',
        ],
      },
      {
        id: 'nghien-cuu-dai-luong-thi-truong',
        title: '2. Cách khảo sát dải lương thị trường chính xác',
        paragraphs: [
          'Sử dụng Báo cáo thị trường tuyển dụng của InterVue, TopCV, Navigos và các mạng lưới chuyên gia để biết dải lương trung vị (P50) và dải lương cạnh tranh cao (P75) của vị trí ứng tuyển.',
        ],
      },
      {
        id: 'nguyen-tac-dam-phan-tong-the',
        title: '3. Đàm phán gói đãi ngộ tổng thể (Total Compensation)',
        paragraphs: [
          'Nếu doanh nghiệp có giới hạn về mức lương cơ bản theo khung ngạch lương, hãy đề xuất đàm phán các quyền lợi khác: Thưởng hiệu suất (KPI/Bonus), phụ cấp máy tính cá nhân, số ngày phép năm, thời gian xét tăng lương sau 6 tháng thay vì 1 năm.',
        ],
      },
      {
        id: 'kich-ban-email-phan-hoi-offer',
        title: '4. Mẫu email phản hồi thương lượng offer chuyên nghiệp',
        paragraphs: [
          'Bày tỏ lòng biết ơn trước lời đề nghị, tái khẳng định sự hào hứng với vị trí, sau đó lịch sự trình bày đề xuất điều chỉnh dựa trên phân tích giá trị đóng góp và dải lương thị trường.',
        ],
      },
    ],
  },
  {
    id: 'art-probation-success-guide',
    slug: 'cam-nang-60-ngay-thu-viec-hoa-nhap-nhanh-chinh-thuc',
    title: 'Cẩm nang 60 ngày thử việc: Bí quyết hòa nhập nhanh và ký hợp đồng chính thức với đánh giá xuất sắc',
    category: 'Bí quyết tìm việc',
    categorySlug: 'bi-kip-tim-viec',
    excerpt:
      'Giai đoạn thử việc là thời gian kiểm chứng năng lực thực tế và sự phù hợp văn hóa. Khám phá kế hoạch 30-60 ngày giúp bạn ghi điểm tuyệt đối với quản lý và đồng nghiệp.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '15/09/2026',
    readTime: '8 phút đọc',
    viewsCount: '21.5K',
    tags: ['Thử việc', 'Ký hợp đồng', 'Văn hóa công sở', 'Phát triển sự nghiệp'],
    author: {
      name: 'Trần Bích Phương',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'Career Coach & HR Consultant',
    },
    tableOfContents: [
      { id: '30-ngay-dau-tien', title: '1. 30 ngày đầu tiên: Lắng nghe, học hỏi và thấu hiểu quy trình', level: 1 },
      { id: '30-ngay-tiep-theo', title: '2. 30 ngày tiếp theo: Chủ động đề xuất giải pháp và tạo Quick Win', level: 1 },
      {
        id: 'chuan-bi-buoi-review-thu-viec',
        title: '3. Chuẩn bị cho buổi đánh giá thử việc (Probation Review)',
        level: 1,
      },
    ],
    sections: [
      {
        id: '30-ngay-dau-tien',
        title: '1. 30 ngày đầu tiên: Lắng nghe, học hỏi và thấu hiểu quy trình',
        paragraphs: [
          'Mục tiêu lớn nhất trong tháng đầu là nắm vững luồng công việc, hiểu vai trò các bộ phận liên quan và chủ động đặt câu hỏi khi gặp vướng mắc.',
        ],
      },
      {
        id: '30-ngay-tiep-theo',
        title: '2. 30 ngày tiếp theo: Chủ động đề xuất giải pháp và tạo Quick Win',
        paragraphs: [
          'Tìm kiếm một vấn đề nhỏ có thể giải quyết nhanh chóng (Quick win) để tạo ấn tượng về tinh thần trách nhiệm và tính chủ động trong công việc.',
        ],
      },
      {
        id: 'chuan-bi-buoi-review-thu-viec',
        title: '3. Chuẩn bị cho buổi đánh giá thử việc (Probation Review)',
        paragraphs: [
          'Tự tổng hợp một bản báo cáo ngắn gọn về kết quả công việc đã đạt được so với mục tiêu ban đầu, bài học kinh nghiệm và định hướng đóng góp trong 6 tháng tới.',
        ],
      },
    ],
  },

  // --- CHẾ ĐỘ HƯỞNG LƯƠNG (che-do-luong-thuong) ---
  {
    id: 'art-gross-net-guide-2026',
    slug: 'cach-tinh-luong-gross-sang-net-chuan-quy-dinh-moi-2026',
    title: 'Cách tính và quy đổi Lương Gross sang Net chuẩn quy định bảo hiểm & biểu thuế TNCN 2026',
    category: 'Chế độ lương thưởng',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Phân biệt rõ ràng giữa Lương Gross và Lương Net. Hướng dẫn chi tiết công thức khấu trừ BHXH 8%, BHYT 1.5%, BHTN 1%, mức giảm trừ gia cảnh 11 triệu đồng và bảng tính biểu thuế lũy tiến từng phần mới nhất.',
    coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    publishedAt: '04/10/2026',
    readTime: '13 phút đọc',
    viewsCount: '65.9K',
    isFeatured: true,
    isTrending: true,
    tags: ['Lương Gross Net', 'Tính lương', 'BHXH', 'Thuế TNCN', 'Chế độ lương thưởng', 'Luật lao động'],
    author: {
      name: 'Lê Hoàng Hải',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia C&B & Tư vấn Pháp lý Lao động',
      bio: 'Hơn 15 năm phụ trách hệ thống tính lương và chính sách phúc lợi nhân sự tại các tập đoàn đa quốc gia.',
    },
    tableOfContents: [
      { id: 'luong-gross-la-gi-luong-net-la-gi', title: '1. Lương Gross là gì? Lương Net là gì?', level: 1 },
      { id: 'ty-le-dong-bao-hiem-2026', title: '2. Tỷ lệ trích nộp bảo hiểm xã hội bắt buộc 2026', level: 1 },
      { id: 'giam-tru-gia-canh-thue-tncn', title: '3. Mức giảm trừ gia cảnh và cách tính thuế TNCN', level: 1 },
      { id: 'bieu-thue-luy-tien-7-bac', title: '4. Biểu thuế thu nhập cá nhân lũy tiến 7 bậc chi tiết', level: 1 },
      { id: 'vi-du-tinh-luong-thuc-te', title: '5. Ví dụ thực tế: Tính lương Gross 25 triệu đồng sang Net', level: 1 },
      { id: 'nen-deal-gross-hay-net', title: '6. Người lao động nên deal lương Gross hay Net?', level: 1 },
    ],
    sections: [
      {
        id: 'luong-gross-la-gi-luong-net-la-gi',
        title: '1. Lương Gross là gì? Lương Net là gì?',
        leadText:
          'Lương Gross là tổng thu nhập bạn nhận được trước khi trừ các khoản bảo hiểm bắt buộc và thuế thu nhập cá nhân. Lương Net là số tiền thực tế đổ vào tài khoản ngân hàng của bạn mỗi kỳ nhận lương.',
        paragraphs: [
          'Công thức cơ bản: Lương Net = Lương Gross - (BHXH + BHYT + BHTN) - Thuế TNCN (nếu có).',
          'Nhiều ứng viên thường băn khoăn khi phỏng vấn nên thỏa thuận mức lương Gross hay Net. Nắm rõ cách chuyển đổi sẽ giúp bạn bảo vệ tối đa quyền lợi khi đóng bảo hiểm và nhận trợ cấp sau này.',
        ],
        highlights: [
          'Lương Gross minh bạch hơn vì thể hiện đúng mức lương đóng bảo hiểm và căn cứ tính trợ cấp thai sản, thất nghiệp, ốm đau.',
          'Lương Net mang lại cảm giác an tâm về dòng tiền chi tiêu hàng tháng nhưng cần kiểm tra kỹ doanh nghiệp đóng bảo hiểm trên mức nào.',
        ],
      },
      {
        id: 'ty-le-dong-bao-hiem-2026',
        title: '2. Tỷ lệ trích nộp bảo hiểm xã hội bắt buộc 2026',
        paragraphs: [
          'Người lao động trích đóng tổng cộng 10.5% từ lương Gross hàng tháng:',
          '- Bảo hiểm xã hội (BHXH): 8%',
          '- Bảo hiểm y tế (BHYT): 1.5%',
          '- Bảo hiểm thất nghiệp (BHTN): 1%',
          'Đồng thời, người sử dụng lao động (công ty) đóng thêm 21.5% - 22% chi phí trên quỹ lương của bạn (17.5% BHXH, 3% BHYT, 1% BHTN, 0.5% BHTNLĐ-BNN).',
        ],
      },
      {
        id: 'giam-tru-gia-canh-thue-tncn',
        title: '3. Mức giảm trừ gia cảnh và cách tính thuế TNCN',
        paragraphs: [
          'Theo quy định hiện hành:',
          '- Giảm trừ bản thân người nộp thuế: 11.000.000 đồng/tháng (132 triệu đồng/năm).',
          '- Giảm trừ cho mỗi người phụ thuộc: 4.400.000 đồng/người/tháng.',
          'Thu nhập tính thuế = Thu nhập trước thuế - Các khoản đóng bảo hiểm - Giảm trừ bản thân - Giảm trừ người phụ thuộc.',
        ],
      },
      {
        id: 'bieu-thue-luy-tien-7-bac',
        title: '4. Biểu thuế thu nhập cá nhân lũy tiến 7 bậc chi tiết',
        paragraphs: [
          'Bậc 1: Đến 5 triệu đồng -> Thuế suất 5%',
          'Bậc 2: Trên 5 triệu đến 10 triệu đồng -> Thuế suất 10%',
          'Bậc 3: Trên 10 triệu đến 18 triệu đồng -> Thuế suất 15%',
          'Bậc 4: Trên 18 triệu đến 32 triệu đồng -> Thuế suất 20%',
          'Bậc 5: Trên 32 triệu đến 52 triệu đồng -> Thuế suất 25%',
          'Bậc 6: Trên 52 triệu đến 80 triệu đồng -> Thuế suất 30%',
          'Bậc 7: Trên 80 triệu đồng -> Thuế suất 35%',
        ],
      },
      {
        id: 'vi-du-tinh-luong-thuc-te',
        title: '5. Ví dụ thực tế: Tính lương Gross 25 triệu đồng sang Net',
        paragraphs: [
          'Giả sử lương Gross của bạn là 25.000.000 VNĐ/tháng, có 1 người phụ thuộc:',
          '1. Tổng đóng bảo hiểm (10.5%): 25.000.000 x 10.5% = 2.625.000 VNĐ.',
          '2. Thu nhập trước thuế: 25.000.000 - 2.625.000 = 22.375.000 VNĐ.',
          '3. Tổng giảm trừ gia cảnh: 11.000.000 (bản thân) + 4.400.000 (1 phụ thuộc) = 15.400.000 VNĐ.',
          '4. Thu nhập tính thuế: 22.375.000 - 15.400.000 = 6.975.000 VNĐ.',
          '5. Thuế TNCN: Bậc 1 (5 triệu x 5% = 250.000) + Bậc 2 (1.975.000 x 10% = 197.500) = 447.500 VNĐ.',
          '6. Lương Net thực nhận: 25.000.000 - 2.625.000 - 447.500 = 21.927.500 VNĐ.',
        ],
      },
      {
        id: 'nen-deal-gross-hay-net',
        title: '6. Người lao động nên deal lương Gross hay Net?',
        paragraphs: [
          'Khuyến nghị chuyên gia: Nên đàm phán lương Gross. Khi thỏa thuận lương Gross, bạn nắm chắc mức lương đóng bảo hiểm thực tế, khi luật thuế hoặc chính sách giảm trừ thay đổi bạn sẽ hưởng trọn vẹn quyền lợi thay vì doanh nghiệp giữ lại khoản chênh lệch.',
        ],
      },
    ],
  },
  {
    id: 'art-bhxh-guide-2026',
    slug: 'quy-dinh-bao-hiem-xa-hoi-bhxh-nguoi-lao-dong-can-biet-2026',
    title: 'Cẩm nang toàn diện về Bảo hiểm Xã hội (BHXH) năm 2026 người lao động bắt buộc phải biết',
    category: 'Chế độ lương thưởng',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Quy định chi tiết về 5 chế độ BHXH bắt buộc: Ốm đau, Thai sản, Tai nạn lao động, Hưu trí và Tử tuất. Hướng dẫn cách tra cứu quá trình đóng trên ứng dụng VssID và điều kiện rút BHXH 1 lần.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    publishedAt: '27/09/2026',
    readTime: '12 phút đọc',
    viewsCount: '48.3K',
    tags: ['Bảo hiểm xã hội', 'BHXH', 'Chế độ thai sản', 'Ứng dụng VssID', 'Quyền lợi lao động'],
    author: {
      name: 'Lê Hoàng Hải',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia C&B & Tư vấn Pháp lý Lao động',
    },
    tableOfContents: [
      { id: 'cac-che-do-bhxh-chinh', title: '1. 5 chế độ BHXH cốt lõi bảo vệ người lao động', level: 1 },
      { id: 'che-do-thai-san-chi-tiet', title: '2. Quyền lợi chế độ thai sản cho lao động nữ và nam', level: 1 },
      { id: 'tra-cuu-vssid', title: '3. Cách cài đặt và tra cứu quá trình đóng BHXH trên VssID', level: 1 },
      { id: 'dieu-kien-rut-bhxh-1-lan', title: '4. Điều kiện rút BHXH một lần và lời khuyên cân nhắc', level: 1 },
    ],
    sections: [
      {
        id: 'cac-che-do-bhxh-chinh',
        title: '1. 5 chế độ BHXH cốt lõi bảo vệ người lao động',
        paragraphs: [
          'Bảo hiểm xã hội bao gồm chế độ Ốm đau (hưởng 75% mức lương đóng bảo hiểm khi nghỉ ốm có chỉ định bác sĩ), chế độ Thai sản, chế độ Tai nạn lao động - Bệnh nghề nghiệp, chế độ Hưu trí và chế độ Tử tuất.',
        ],
      },
      {
        id: 'che-do-thai-san-chi-tiet',
        title: '2. Quyền lợi chế độ thai sản cho lao động nữ và nam',
        paragraphs: [
          'Lao động nữ sinh con được nghỉ thai sản 6 tháng và nhận trợ cấp bằng 100% mức bình quân tiền lương tháng đóng BHXH của 6 tháng trước khi nghỉ, cộng với trợ cấp một lần tương đương 2 tháng lương cơ sở cho mỗi con.',
          'Lao động nam có vợ sinh con cũng được hưởng chế độ nghỉ từ 5 đến 14 ngày làm việc có hưởng nguyên lương bảo hiểm.',
        ],
      },
      {
        id: 'tra-cuu-vssid',
        title: '3. Cách cài đặt và tra cứu quá trình đóng BHXH trên VssID',
        paragraphs: [
          'Ứng dụng VssID cho phép bạn kiểm tra chính xác hàng tháng xem doanh nghiệp có nộp bảo hiểm đúng số tiền và thời gian cam kết hay không, tránh tình trạng doanh nghiệp nợ đọng bảo hiểm.',
        ],
      },
      {
        id: 'dieu-kien-rut-bhxh-1-lan',
        title: '4. Điều kiện rút BHXH một lần và lời khuyên cân nhắc',
        paragraphs: [
          'Rút BHXH một lần chỉ nên là phương án cuối cùng khi thực sự khó khăn về tài chính, bởi việc duy trì thời gian đóng sẽ bảo đảm bạn có lương hưu và thẻ BHYT miễn phí khi về già.',
        ],
      },
    ],
  },
  {
    id: 'art-13th-salary-tet-bonus',
    slug: 'luong-thang-13-va-thuong-tet-quy-dinh-phap-luat-va-thuc-te',
    title: 'Lương tháng 13 và thưởng Tết: Doanh nghiệp có bắt buộc phải chi trả theo Bộ luật Lao động?',
    category: 'Chế độ lương thưởng',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Lương tháng 13 có phải quyền lợi bắt buộc không? Phân biệt giữa lương tháng 13 và tiền thưởng Tết theo Bộ luật Lao động. Điều kiện hưởng, cách tính theo thâm niên làm việc và nghĩa vụ thuế TNCN.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '18/09/2026',
    readTime: '9 phút đọc',
    viewsCount: '37.4K',
    tags: ['Lương tháng 13', 'Thưởng Tết', 'Bộ luật Lao động', 'Chế độ đãi ngộ'],
    author: {
      name: 'Lê Hoàng Hải',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia C&B & Tư vấn Pháp lý Lao động',
    },
    tableOfContents: [
      { id: 'luong-thang-13-la-gi', title: '1. Khái niệm lương tháng 13 theo luật lao động', level: 1 },
      {
        id: 'doanh-nghiep-co-bat-buoc-tra',
        title: '2. Doanh nghiệp có bắt buộc phải chi trả lương tháng 13 không?',
        level: 1,
      },
      {
        id: 'cach-tinh-theo-tham-nien',
        title: '3. Cách tính lương tháng 13 cho nhân sự làm việc dưới 1 năm',
        level: 1,
      },
      {
        id: 'thue-tncn-tien-thuong-tet',
        title: '4. Tiền thưởng Tết và lương tháng 13 có phải đóng thuế TNCN không?',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'luong-thang-13-la-gi',
        title: '1. Khái niệm lương tháng 13 theo luật lao động',
        paragraphs: [
          'Trong Bộ luật Lao động hiện hành, thuật ngữ "Lương tháng 13" không được quy định bằng văn bản riêng biệt mà được xếp vào khoản "Tiền thưởng" theo Điều 104.',
        ],
      },
      {
        id: 'doanh-nghiep-co-bat-buoc-tra',
        title: '2. Doanh nghiệp có bắt buộc phải chi trả lương tháng 13 không?',
        paragraphs: [
          'Việc chi trả phụ thuộc vào quy chế thưởng nội bộ của công ty và điều khoản ghi trong Hợp đồng lao động hoặc Thỏa ước lao động tập thể. Nếu hợp đồng cam kết có lương tháng 13 thì doanh nghiệp có nghĩa vụ thực thi.',
        ],
      },
      {
        id: 'cach-tinh-theo-tham-nien',
        title: '3. Cách tính lương tháng 13 cho nhân sự làm việc dưới 1 năm',
        paragraphs: ['Công thức thông thường: (Số tháng làm việc thực tế / 12) x Mức lương bình quân tháng.'],
      },
      {
        id: 'thue-tncn-tien-thuong-tet',
        title: '4. Tiền thưởng Tết và lương tháng 13 có phải đóng thuế TNCN không?',
        paragraphs: [
          'Tiền thưởng Tết và lương tháng 13 là khoản thu nhập từ tiền lương, tiền công nên vẫn phải chịu thuế thu nhập cá nhân theo biểu lũy tiến vào tháng nhận tiền.',
        ],
      },
    ],
  },
  {
    id: 'art-overtime-ot-calculation',
    slug: 'cach-tinh-tien-lam-them-gio-overtime-ot-chuan-luat',
    title: 'Cách tính tiền làm thêm giờ (Overtime - OT) ngày thường, ngày nghỉ cuối tuần và ngày lễ Tết',
    category: 'Chế độ lương thưởng',
    categorySlug: 'che-do-luong-thuong',
    excerpt:
      'Quy định chi tiết về mức trả lương làm thêm giờ: 150% ngày thường, 200% ngày nghỉ tuần và 300% ngày lễ tết. Cách tính phụ cấp làm thêm vào ban đêm và giới hạn số giờ làm thêm tối đa.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '12/09/2026',
    readTime: '8 phút đọc',
    viewsCount: '19.8K',
    tags: ['Làm thêm giờ', 'Tính lương OT', 'Quyền lợi người lao động', 'Luật lao động'],
    author: {
      name: 'Lê Hoàng Hải',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia C&B & Tư vấn Pháp lý Lao động',
    },
    tableOfContents: [
      { id: 'ty-le-tra-luong-ot', title: '1. Tỷ lệ phần trăm tính lương làm thêm giờ chuẩn', level: 1 },
      { id: 'lam-them-ban-dem', title: '2. Cách tính làm thêm giờ vào ban đêm (22h - 6h)', level: 1 },
      { id: 'gioi-han-so-gio-ot', title: '3. Giới hạn số giờ làm thêm tối đa được phép theo luật', level: 1 },
    ],
    sections: [
      {
        id: 'ty-le-tra-luong-ot',
        title: '1. Tỷ lệ phần trăm tính lương làm thêm giờ chuẩn',
        paragraphs: [
          '- Ngày làm việc bình thường: Tối thiểu 150% lương giờ bình thường.',
          '- Ngày nghỉ hằng tuần (thứ 7, CN): Tối thiểu 200%.',
          '- Ngày nghỉ lễ, Tết, ngày nghỉ có hưởng lương: Tối thiểu 300% (chưa kể tiền lương của ngày lễ tết đó).',
        ],
      },
      {
        id: 'lam-them-ban-dem',
        title: '2. Cách tính làm thêm giờ vào ban đêm (22h - 6h)',
        paragraphs: [
          'Làm việc vào ban đêm được trả thêm ít nhất 30% lương. Nếu làm thêm giờ vào ban đêm, người lao động còn được trả thêm 20% tiền lương tính theo đơn giá tiền lương ban ngày.',
        ],
      },
      {
        id: 'gioi-han-so-gio-ot',
        title: '3. Giới hạn số giờ làm thêm tối đa được phép theo luật',
        paragraphs: [
          'Không quá 50% số giờ làm việc bình thường trong 1 ngày, không quá 40 giờ trong 1 tháng và không quá 200 giờ trong 1 năm (một số ngành đặc thù tối đa 300 giờ).',
        ],
      },
    ],
  },

  // --- KIẾN THỨC CHUYÊN NGÀNH (kien-thuc-chuyen-nganh) ---
  {
    id: 'art-it-landscape-2026',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi-lo-trinh-developer',
    title: 'Bức tranh toàn cảnh ngành CNTT & AI 2026: Từ Lập trình viên đến AI Engineer & Solution Architect',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Phân tích sâu các chuyên ngành HOT trong làng công nghệ: Frontend, Backend, DevOps, Data Science và Kỹ sư Trí tuệ nhân tạo (AI/ML). Bảng lương theo năm kinh nghiệm và lộ trình thăng tiến kỹ thuật.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    publishedAt: '02/10/2026',
    readTime: '14 phút đọc',
    viewsCount: '62.1K',
    isFeatured: true,
    isTrending: true,
    tags: ['Công nghệ thông tin', 'IT', 'Lập trình viên', 'AI Engineer', 'Solution Architect', 'Mức lương IT'],
    author: {
      name: 'Nguyễn Thành Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      role: 'Principal Software Architect & Tech Mentor',
    },
    tableOfContents: [
      { id: 'cac-chuyen-nganh-it-hot-nhat', title: '1. Các nhánh chuyên ngành IT được săn đón nhất 2026', level: 1 },
      {
        id: 'ky-nguyen-ai-developer-can-gi',
        title: '2. Kỷ nguyên Generative AI: Developer cần thích ứng ra sao?',
        level: 1,
      },
      { id: 'bang-luong-lap-trinh-vien', title: '3. Khung lương lập trình viên theo số năm kinh nghiệm', level: 1 },
      {
        id: 'lo-trinh-tech-lead-architect',
        title: '4. Lộ trình phát triển từ Junior lên Tech Lead và Architect',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'cac-chuyen-nganh-it-hot-nhat',
        title: '1. Các nhánh chuyên ngành IT được săn đón nhất 2026',
        leadText:
          'Ngành IT không chỉ đơn thuần là gõ code mà đã phân hóa thành các chuyên ngành có tính chuyên môn hóa rất cao.',
        paragraphs: [
          '1. AI/ML Engineering & Data Engineering: Thiết kế mô hình học máy, tinh chỉnh LLM và xử lý luồng dữ liệu lớn.',
          '2. Cloud & Platform Engineering (DevOps/SRE): Quản trị hạ tầng đám mây (AWS, GCP, Azure), Kubernetes và CI/CD pipelines.',
          '3. Full-Stack / Backend Engineering: Xây dựng hệ thống phân tán chịu tải cao, microservices, bảo mật thông tin.',
        ],
      },
      {
        id: 'ky-nguyen-ai-developer-can-gi',
        title: '2. Kỷ nguyên Generative AI: Developer cần thích ứng ra sao?',
        paragraphs: [
          'AI không thay thế developer, nhưng developer biết ứng dụng AI để tăng tốc hiệu suất sẽ thay thế những người từ chối đổi mới. Kỹ năng tư duy hệ thống, phân tích bài toán nghiệp vụ phức tạp và bảo mật dữ liệu trở nên quan trọng hơn việc viết cú pháp đơn thuần.',
        ],
      },
      {
        id: 'bang-luong-lap-trinh-vien',
        title: '3. Khung lương lập trình viên theo số năm kinh nghiệm',
        paragraphs: [
          '- Fresher / Dưới 1 năm: 10 - 16 triệu VNĐ/tháng',
          '- Junior (1 - 3 năm): 16 - 28 triệu VNĐ/tháng',
          '- Senior (3 - 5 năm): 30 - 55 triệu VNĐ/tháng',
          '- Tech Lead / Architect (5+ năm): 55 - 95 triệu VNĐ/tháng hoặc cao hơn tại các công ty nước ngoài.',
        ],
      },
      {
        id: 'lo-trinh-tech-lead-architect',
        title: '4. Lộ trình phát triển từ Junior lên Tech Lead và Architect',
        paragraphs: [
          'Hai hướng đi lớn: Technical Specialist (Solution Architect / Staff Engineer) dành cho người đam mê kỹ thuật chuyên sâu, và Engineering Management (Tech Lead, Engineering Manager) dành cho người giỏi dẫn dắt đội ngũ.',
        ],
      },
    ],
  },
  {
    id: 'art-cb-hr-specialist-guide',
    slug: 'chuyen-mon-cb-compensation-and-benefits-trong-nganh-hr',
    title: 'Chuyên môn C&B (Compensation & Benefits): Từ quản trị bảng lương đến hoạch định đãi ngộ nhân tài',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'C&B là trái tim của phòng nhân sự đảm bảo sự công bằng và tính cạnh tranh của doanh nghiệp. Tìm hiểu các kỹ năng cốt lõi: Thiết kế hệ thống lương 3P, xây dựng khung thưởng KPI và tối ưu hóa chi phí nhân sự.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    publishedAt: '20/09/2026',
    readTime: '11 phút đọc',
    viewsCount: '27.6K',
    tags: ['C&B', 'Nhân sự', 'Lương 3P', 'Đãi ngộ nhân sự', 'Kiến thức chuyên ngành'],
    author: {
      name: 'Lê Hoàng Hải',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia C&B & Tư vấn Pháp lý Lao động',
    },
    tableOfContents: [
      { id: 'vai-tro-cb-trong-doanh-nghiep', title: '1. Vai trò chiến lược của chuyên viên C&B', level: 1 },
      { id: 'mo-hinh-luong-3p', title: '2. Mô hình lương 3P: Position - Person - Performance', level: 1 },
      { id: 'cac-ky-nang-can-co-cb', title: '3. Bộ công cụ và kỹ năng định lượng của người làm C&B', level: 1 },
    ],
    sections: [
      {
        id: 'vai-tro-cb-trong-doanh-nghiep',
        title: '1. Vai trò chiến lược của chuyên viên C&B',
        paragraphs: [
          'C&B không chỉ là làm bảng chấm công và chuyển khoản tiền lương. C&B chuyên nghiệp đóng vai trò cố vấn cho ban điều hành về cấu trúc ngân sách nhân sự, chính sách giữ chân nhân tài và tuân thủ luật pháp lao động.',
        ],
      },
      {
        id: 'mo-hinh-luong-3p',
        title: '2. Mô hình lương 3P: Position - Person - Performance',
        paragraphs: [
          '- P1 (Position): Trả lương theo giá trị vị trí công việc (Job Grading).',
          '- P2 (Person): Trả lương theo năng lực cá nhân và mức độ đóng góp (Competency).',
          '- P3 (Performance): Trả thưởng theo kết quả công việc và KPI đạt được.',
        ],
      },
      {
        id: 'cac-ky-nang-can-co-cb',
        title: '3. Bộ công cụ và kỹ năng định lượng của người làm C&B',
        paragraphs: [
          'Thành thạo Excel nâng cao (VBA, Power Query), hiểu sâu luật lao động và am hiểu các báo cáo khảo sát lương Mercer, Willis Towers Watson.',
        ],
      },
    ],
  },
  {
    id: 'art-logistics-supply-chain-guide',
    slug: 'logistics-va-supply-chain-la-gi-kien-thuc-thuc-chien',
    title:
      'Kiến thức thực chiến ngành Logistics & Supply Chain: Incoterms 2020, Xuất nhập khẩu và Quản trị chuỗi cung ứng',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Cẩm nang toàn diện cho nhân sự ngành Xuất nhập khẩu: 11 điều kiện Incoterms 2020, quy trình thông quan hàng hóa, vận đơn đường biển (Bill of Lading) và ứng dụng công nghệ trong tối ưu hóa kho vận.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '16/09/2026',
    readTime: '13 phút đọc',
    viewsCount: '31.2K',
    tags: ['Logistics', 'Supply Chain', 'Incoterms 2020', 'Xuất nhập khẩu', 'Kho vận'],
    author: {
      name: 'Đặng Quốc Huy',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Supply Chain Operations Director',
    },
    tableOfContents: [
      {
        id: 'phan-biet-logistics-va-supply-chain',
        title: '1. Phân biệt Logistics và Quản trị chuỗi cung ứng (Supply Chain)',
        level: 1,
      },
      { id: 'incoterms-2020-cot-loi', title: '2. Tóm tắt 4 nhóm Incoterms 2020 cốt lõi (E, F, C, D)', level: 1 },
      { id: 'quy-trinh-xuat-nhap-khau', title: '3. Quy trình 6 bước xuất nhập khẩu một lô hàng đường biển', level: 1 },
    ],
    sections: [
      {
        id: 'phan-biet-logistics-va-supply-chain',
        title: '1. Phân biệt Logistics và Quản trị chuỗi cung ứng (Supply Chain)',
        paragraphs: [
          'Logistics tập trung vào vận chuyển, lưu kho và phân phối dòng chảy hàng hóa. Supply Chain là khái niệm bao trùm từ tìm kiếm nguồn nguyên liệu, sản xuất, kiểm soát tồn kho đến trải nghiệm khách hàng cuối cùng.',
        ],
      },
      {
        id: 'incoterms-2020-cot-loi',
        title: '2. Tóm tắt 4 nhóm Incoterms 2020 cốt lõi (E, F, C, D)',
        paragraphs: [
          'Incoterms quy định rõ địa điểm chuyển giao rủi ro, trách nhiệm chịu chi phí vận tải và bảo hiểm giữa bên bán và bên mua (FOB, CIF, EXW, DDP là các điều kiện phổ biến nhất tại Việt Nam).',
        ],
      },
      {
        id: 'quy-trinh-xuat-nhap-khau',
        title: '3. Quy trình 6 bước xuất nhập khẩu một lô hàng đường biển',
        paragraphs: [
          'Đàm phán hợp đồng thương mại, mở L/C hoặc thanh toán quốc tế, thuê tàu (Booking), làm thủ tục hải quan, kiểm tra hàng hóa và giải phóng hàng tại cảng.',
        ],
      },
    ],
  },

  // --- ĐỊNH HƯỚNG NGHỀ NGHIỆP (dinh-huong-nghe-nghiep) ---
  {
    id: 'art-sales-career-roadmap',
    slug: 'dinh-huong-nghe-nghiep-nganh-kinh-doanh-sales',
    title:
      'Định hướng nghề nghiệp ngành Kinh doanh & Bán hàng: Lộ trình từ Sales Executive đến Giám đốc Kinh doanh (CCO)',
    category: 'Định hướng nghề nghiệp',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Nghề Sales không chỉ là bán hàng mà là nghệ thuật giải quyết vấn đề và xây dựng quan hệ chiến lược. Khám phá sự khác biệt giữa B2B Sales, B2C Sales, dải thu nhập hoa hồng không giới hạn và lộ trình thăng tiến.',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    publishedAt: '01/10/2026',
    readTime: '10 phút đọc',
    viewsCount: '36.8K',
    tags: ['Kinh doanh', 'Bán hàng', 'B2B Sales', 'Lộ trình sự nghiệp', 'Định hướng nghề nghiệp'],
    author: {
      name: 'Vũ Minh Đức',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Executive Recruiter',
    },
    tableOfContents: [
      { id: 'tong-quan-nghe-sales', title: '1. Nghề Sales trong kỷ nguyên số: Không chỉ là "chào hàng"', level: 1 },
      { id: 'b2b-vs-b2c-sales', title: '2. So sánh B2B Sales và B2C Sales: Bạn phù hợp với hướng nào?', level: 1 },
      { id: 'lo-trinh-thang-tien-sales', title: '3. Lộ trình 5 nấc thang thăng tiến từ Sales Exec đến CCO', level: 1 },
      {
        id: 'thu-nhap-nganh-sales',
        title: '4. Cấu trúc thu nhập ngành Sales: Lương cứng + Hoa hồng bứt phá',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'tong-quan-nghe-sales',
        title: '1. Nghề Sales trong kỷ nguyên số: Không chỉ là "chào hàng"',
        paragraphs: [
          'Sales hiện đại chuyển dịch mạnh mẽ sang mô hình "Consultative Selling" (Bán hàng tư vấn giải pháp). Khách hàng không mua sản phẩm mà mua kết quả kinh doanh và giải pháp tháo gỡ khó khăn của họ.',
        ],
      },
      {
        id: 'b2b-vs-b2c-sales',
        title: '2. So sánh B2B Sales và B2C Sales: Bạn phù hợp với hướng nào?',
        paragraphs: [
          'B2C Sales có chu kỳ bán hàng ngắn, quyết định dựa trên cảm xúc và tiếp cận số lượng lớn người tiêu dùng.',
          'B2B Sales có chu kỳ bán hàng dài (từ vài tháng đến cả năm), giá trị hợp đồng lớn hàng trăm triệu hoặc hàng tỷ đồng, đòi hỏi kỹ năng đàm phán với nhiều bên liên quan trong doanh nghiệp đối tác.',
        ],
      },
      {
        id: 'lo-trinh-thang-tien-sales',
        title: '3. Lộ trình 5 nấc thang thăng tiến từ Sales Exec đến CCO',
        paragraphs: [
          'Sales Development Rep (SDR) -> Account Executive (AE) -> Key Account Manager (KAM) -> Sales Manager -> Chief Commercial Officer (CCO).',
        ],
      },
      {
        id: 'thu-nhap-nganh-sales',
        title: '4. Cấu trúc thu nhập ngành Sales: Lương cứng + Hoa hồng bứt phá',
        paragraphs: [
          'Mức lương cơ bản thường dao động từ 10 - 25 triệu VNĐ, nhưng hoa hồng (commission) không giới hạn có thể đẩy tổng thu nhập lên 40 - 100+ triệu VNĐ/tháng đối với các nhân sự xuất sắc.',
        ],
      },
    ],
  },
  {
    id: 'art-career-pivot-at-30',
    slug: 'chuyen-nganh-o-tuoi-30-co-muon-khong-chien-luoc-pivot-thanh-cong',
    title: 'Chuyển ngành ở tuổi 30: Có quá muộn không? Chiến lược "Pivot" nghề nghiệp an toàn và bứt phá',
    category: 'Định hướng nghề nghiệp',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Khủng hoảng sự nghiệp tuổi 30 và câu hỏi: Liệu có nên bắt đầu lại từ con số 0? Hướng dẫn cách tận dụng kỹ năng chuyển đổi (Transferable skills), chuẩn bị tài chính và tạo bước đệm chuyển ngành suôn sẻ.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    publishedAt: '24/09/2026',
    readTime: '10 phút đọc',
    viewsCount: '28.9K',
    tags: ['Chuyển ngành', 'Khủng hoảng tuổi 30', 'Định hướng nghề nghiệp', 'Kỹ năng mềm'],
    author: {
      name: 'Nguyễn Thanh Tùng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Head of Talent Acquisition @ InterVue',
    },
    tableOfContents: [
      { id: 'tuoi-30-chuyen-nganh', title: '1. Tuổi 30 chuyển ngành: Lợi thế hay rủi ro?', level: 1 },
      { id: 'ky-nang-chuyen-doi', title: '2. Khai phóng kỹ năng chuyển đổi (Transferable Skills)', level: 1 },
      {
        id: 'chien-luoc-chuyen-nganh-3-buoc',
        title: '3. Chiến lược 3 bước chuyển ngành không bị sốc tài chính',
        level: 1,
      },
    ],
    sections: [
      {
        id: 'tuoi-30-chuyen-nganh',
        title: '1. Tuổi 30 chuyển ngành: Lợi thế hay rủi ro?',
        paragraphs: [
          'Bạn không bắt đầu từ con số 0, mà bắt đầu từ kinh nghiệm sống, kỹ năng giao tiếp, khả năng giải quyết xung đột và sự chín chắn trong thái độ làm việc.',
        ],
      },
      {
        id: 'ky-nang-chuyen-doi',
        title: '2. Khai phóng kỹ năng chuyển đổi (Transferable Skills)',
        paragraphs: [
          'Quản lý dự án, kỹ năng phân tích dữ liệu, tư duy logic và kỹ năng đàm phán là những năng lực có thể áp dụng thành công ở bất kỳ ngành nghề nào.',
        ],
      },
      {
        id: 'chien-luoc-chuyen-nganh-3-buoc',
        title: '3. Chiến lược 3 bước chuyển ngành không bị sốc tài chính',
        paragraphs: [
          'Bước 1: Quỹ dự phòng tài chính tối thiểu 6 tháng sinh hoạt phí. Bước 2: Học chứng chỉ nghiệp vụ hoặc thực hiện các dự án tự do (Freelance/Side-project) trước khi nghỉ việc chính. Bước 3: Ứng tuyển vào các vị trí giao thoa giữa ngành cũ và ngành mới.',
        ],
      },
    ],
  },
];

// Combine all articles into a master list
export const ALL_BLOG_ARTICLES: BlogArticle[] = [...CAREER_ARTICLES, ...ADDITIONAL_BLOG_ARTICLES];

// Helper functions for Blog
export function getAllBlogArticles(): BlogArticle[] {
  return ALL_BLOG_ARTICLES;
}

export function getBlogArticlesByCategory(categorySlug: BlogCategorySlug): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter((art) => art.categorySlug === categorySlug);
}

export function getFeaturedBlogArticles(): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter((art) => art.isFeatured);
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return ALL_BLOG_ARTICLES.find((art) => art.slug === slug);
}

export function getBlogCategoryBySlug(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getRelatedBlogArticles(currentArticle: BlogArticle, limit: number = 3): BlogArticle[] {
  return ALL_BLOG_ARTICLES.filter(
    (art) => art.slug !== currentArticle.slug && art.categorySlug === currentArticle.categorySlug,
  ).slice(0, limit);
}
