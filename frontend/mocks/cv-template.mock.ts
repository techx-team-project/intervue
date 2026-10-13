import {
  CvTemplateItem,
  CvTemplateStyle,
  CvTemplateIndustry,
  CvTemplateColor,
  CvStepGuide,
  CvBenefitItem,
  CvFaqItem,
} from '@/types/cv-template';

export const CV_COLORS: CvTemplateColor[] = [
  { id: 'emerald', name: 'Xanh ngọc InterVue', hex: '#00b14f' },
  { id: 'navy', name: 'Xanh Navy cổ điển', hex: '#1e3a8a' },
  { id: 'purple', name: 'Tím hiện đại', hex: '#7c3aed' },
  { id: 'orange', name: 'Cam nhiệt huyết', hex: '#ea580c' },
  { id: 'red', name: 'Đỏ rượu vang', hex: '#be123c' },
  { id: 'slate', name: 'Xám than thanh lịch', hex: '#334155' },
  { id: 'teal', name: 'Xanh mòng két', hex: '#0d9488' },
];

export const CV_STYLES: CvTemplateStyle[] = [
  { id: 'all', name: 'Tất cả', slug: 'all', count: 21 },
  {
    id: 'don-gian',
    name: 'Đơn giản',
    slug: 'mau-don-gian',
    count: 8,
    description: 'Thiết kế tối giản, tập trung vào nội dung và độ dễ đọc cao nhất.',
  },
  {
    id: 'chuyen-nghiep',
    name: 'Chuyên nghiệp',
    slug: 'mau-chuyen-nghiep',
    count: 5,
    description: 'Bố cục chuẩn mực, phù hợp cho chuyên viên và cấp quản lý.',
  },
  {
    id: 'hien-dai',
    name: 'Hiện đại',
    slug: 'mau-hien-dai',
    count: 4,
    description: 'Đường nét thanh thoát, kết hợp màu sắc tinh tế cho môi trường năng động.',
  },
  {
    id: 'ats',
    name: 'Chuẩn ATS',
    slug: 'mau-ats',
    count: 6,
    description: 'Tối ưu 100% cho phần mềm lọc hồ sơ tự động của các tập đoàn.',
  },
  {
    id: 'harvard',
    name: 'Harvard',
    slug: 'mau-harvard',
    count: 3,
    description: 'Quy chuẩn học thuật danh tiếng, không ảnh, không màu mè, tối đa thông tin.',
  },
  {
    id: 'an-tuong',
    name: 'Ấn tượng',
    slug: 'mau-an-tuong',
    count: 3,
    description: 'Điểm nhấn thị giác mạnh mẽ, phù hợp ngành Sáng tạo và Marketing.',
  },
];

export const CV_INDUSTRIES: CvTemplateIndustry[] = [
  { id: 'all', name: 'Tất cả ngành nghề', slug: 'all', count: 21 },
  { id: 'it', name: 'Công nghệ thông tin / IT', slug: 'it', count: 7 },
  { id: 'marketing', name: 'Marketing & Truyền thông', slug: 'marketing', count: 6 },
  { id: 'sales', name: 'Kinh doanh & Bán hàng', slug: 'sales', count: 5 },
  { id: 'finance', name: 'Tài chính - Kế toán', slug: 'finance', count: 4 },
  { id: 'hr', name: 'Hành chính - Nhân sự', slug: 'hr', count: 3 },
  { id: 'general', name: 'Fresher / Mới ra trường', slug: 'fresher', count: 6 },
];

export const CV_TEMPLATES: CvTemplateItem[] = [
  {
    id: 'cv-don-gian-ats-standard',
    title: 'Mẫu CV Đơn Giản Chuẩn ATS',
    slug: 'mau-cv-don-gian-chuan-ats',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/simple-ats.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Công nghệ thông tin / IT', 'Tài chính - Kế toán', 'Hành chính - Nhân sự'],
    availableColors: CV_COLORS,
    defaultColorHex: '#00b14f',
    usesCount: '182.4K',
    rating: 4.9,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Mọi ngành nghề', 'Ứng tuyển tập đoàn', 'Ứng tuyển công ty nước ngoài'],
    description:
      'Thiết kế 1 cột chuẩn mực quốc tế, tối ưu hóa thuật toán ATS đọc văn bản, làm nổi bật thành tựu bằng các con số ấn tượng.',
    sampleData: {
      name: 'NGUYỄN VĂN AN',
      title: 'Senior Software Engineer / Fullstack Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      email: 'nguyenvanan.dev@intervue.vn',
      phone: '0912 345 678',
      address: 'Cầu Giấy, Hà Nội',
      summary:
        'Kỹ sư phần mềm hơn 4 năm kinh nghiệm phát triển hệ thống web quy mô lớn bằng Next.js, Node.js và Go. Có thế mạnh về tối ưu hiệu năng cơ sở dữ liệu và thiết kế kiến trúc Microservices chịu tải 50.000 CCU.',
      experience: [
        {
          role: 'Senior Fullstack Engineer',
          company: 'FPT Software & Cloud Solutions',
          period: '03/2023 - Hiện tại',
          highlights: [
            'Chỉ đạo thiết kế và tái cấu trúc hệ thống thanh toán điện tử, giảm thời gian xử lý giao dịch từ 1.2s xuống 350ms.',
            'Xây dựng luồng CI/CD tự động hóa, tăng tần suất triển khai mã nguồn lên 4 lần mỗi tuần với tỷ lệ uptime 99.98%.',
            'Cố vấn kỹ thuật và đào tạo trực tiếp cho 5 kỹ sư Fresher hòa nhập dự án trong vòng 2 tháng.',
          ],
        },
        {
          role: 'Fullstack Developer',
          company: 'TechCorp Digital Agency',
          period: '08/2021 - 02/2023',
          highlights: [
            'Phát triển hơn 12 dự án thương mại điện tử đa kênh sử dụng React, Next.js và Tailwind CSS.',
            'Tối ưu hóa điểm số Google Core Web Vitals từ 62 lên 96/100, đóng góp trực tiếp tăng 34% tỷ lệ chuyển đổi.',
          ],
        },
      ],
      education: [
        {
          degree: 'Kỹ sư Khoa học Máy tính (Bằng Giỏi)',
          school: 'Đại học Bách Khoa Hà Nội',
          period: '2017 - 2021',
          gpa: 'GPA: 3.65 / 4.0',
        },
      ],
      skills: [
        'JavaScript / TypeScript',
        'React & Next.js',
        'Node.js & Go',
        'PostgreSQL & MongoDB',
        'Docker & Kubernetes',
        'Tư duy giải quyết vấn đề',
      ],
      languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (IELTS 7.5)'],
      certifications: ['AWS Certified Solutions Architect (Associate)', 'Scrum Master Professional (PSM I)'],
    },
  },
  {
    id: 'cv-don-gian-minimalist',
    title: 'Mẫu CV Minimalist Clean',
    slug: 'mau-cv-minimalist-clean',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/clean-minimal.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Marketing & Truyền thông', 'Kinh doanh & Bán hàng', 'Fresher / Mới ra trường'],
    availableColors: CV_COLORS,
    defaultColorHex: '#1e3a8a',
    usesCount: '135.8K',
    rating: 4.85,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Marketing', 'Truyền thông', 'Sinh viên mới ra trường'],
    description:
      'Giao diện thanh thoát, khoảng cách lề thoáng đãng giúp người tuyển dụng nắm bắt trọn vẹn thông tin ứng viên trong vòng 6 giây đầu tiên.',
    sampleData: {
      name: 'TRẦN THU TRANG',
      title: 'Digital Marketing & Content Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      email: 'thutrang.mkt@intervue.vn',
      phone: '0988 765 432',
      address: 'Quận 1, TP. Hồ Chí Minh',
      summary:
        'Chuyên viên Marketing với 3 năm kinh nghiệm trong lĩnh vực Digital & Social Media. Đã từng trực tiếp quản lý ngân sách quảng cáo hơn 500 triệu/tháng và đạt mức tăng trưởng người theo dõi fanpage 250% trong 6 tháng.',
      experience: [
        {
          role: 'Digital Marketing Specialist',
          company: 'Shopee Vietnam',
          period: '01/2023 - Hiện tại',
          highlights: [
            'Lên kế hoạch nội dung và triển khai các chiến dịch Social Media Mega Sale 9.9, 11.11 đạt hơn 15 triệu lượt hiển thị.',
            'Tối ưu chi phí CPA quảng cáo giảm 22% nhờ thử nghiệm A/B Testing liên tục thông điệp sáng tạo.',
          ],
        },
      ],
      education: [
        {
          degree: 'Cử nhân Quản trị Marketing',
          school: 'Đại học Kinh tế TP.HCM (UEH)',
          period: '2019 - 2023',
          gpa: 'GPA: 3.5 / 4.0',
        },
      ],
      skills: [
        'Social Media Marketing',
        'Copywriting & Kịch bản',
        'Google Analytics 4',
        'Meta & TikTok Ads',
        'Canva & CapCut',
      ],
      languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (TOEIC 850)'],
    },
  },
  {
    id: 'cv-don-gian-harvard',
    title: 'Mẫu CV Harvard Classic',
    slug: 'mau-cv-harvard-classic',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/harvard-style.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Anh', 'Tiếng Việt'],
    industries: ['Tài chính - Kế toán', 'Hành chính - Nhân sự', 'Công nghệ thông tin / IT'],
    availableColors: CV_COLORS,
    defaultColorHex: '#334155',
    usesCount: '112.1K',
    rating: 4.92,
    isAtsOptimized: true,
    recommendedFor: ['Chuyên gia Tài chính', 'Ngân hàng đầu tư', 'Kiểm toán Big4', 'Học giả / Nghiên cứu'],
    description:
      'Quy chuẩn trình bày học thuật chuẩn mực từ Đại học Harvard. Không ảnh thẻ, không biểu tượng thừa, tập trung tuyệt đối vào thành tích và số liệu định lượng.',
    sampleData: {
      name: 'LÊ HOÀNG NAM',
      title: 'Senior Financial Analyst / CFA Level II Candidate',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      email: 'nam.lehoang@intervue.vn',
      phone: '0903 112 233',
      address: 'Hoàn Kiếm, Hà Nội',
      summary:
        'Chuyên viên phân tích tài chính doanh nghiệp với 5 năm kinh nghiệm thẩm định dự án M&A và mô hình hóa tài chính cho các định chế ngân hàng hàng đầu.',
      experience: [
        {
          role: 'Senior Financial Analyst',
          company: 'Techcom Securities (TCBS)',
          period: '05/2022 - Hiện tại',
          highlights: [
            'Xây dựng mô hình DCF và định giá tài sản cho 8 thương vụ phát hành trái phiếu doanh nghiệp tổng trị giá 4.200 tỷ VNĐ.',
            'Lập báo cáo dự báo dòng tiền hàng quý đạt độ chính xác trên 95% so với kết quả kiểm toán thực tế.',
          ],
        },
      ],
      education: [
        {
          degree: 'Cử nhân Tài chính - Ngân hàng (Thủ khoa)',
          school: 'Đại học Ngoại thương Hà Nội (FTU)',
          period: '2016 - 2020',
          gpa: 'GPA: 3.82 / 4.0',
        },
      ],
      skills: [
        'Financial Modeling (DCF/LBO)',
        'Thẩm định rủi ro',
        'Phân tích báo cáo tài chính',
        'Excel VBA & Python',
        'Power BI',
      ],
      certifications: ['CFA Level II Candidate', 'FMVA Financial Modeling Certification'],
    },
  },
  {
    id: 'cv-don-gian-cot-doi',
    title: 'Mẫu CV Tinh Tế Cột Đôi (Modern Two-Column)',
    slug: 'mau-cv-tinh-te-cot-doi',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/two-column.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Kinh doanh & Bán hàng', 'Marketing & Truyền thông', 'Hành chính - Nhân sự'],
    availableColors: CV_COLORS,
    defaultColorHex: '#7c3aed',
    usesCount: '98.5K',
    rating: 4.88,
    isAtsOptimized: true,
    recommendedFor: ['Nhân viên kinh doanh', 'Chuyên viên tuyển dụng', 'Quản trị văn phòng'],
    description:
      'Bố cục 2 cột phân chia khoa học giữa phần thông tin cá nhân/kỹ năng và phần kinh nghiệm làm việc, giúp CV gói gọn trọn vẹn trong 1 trang duy nhất.',
    sampleData: {
      name: 'VŨ THỊ HƯƠNG',
      title: 'Human Resources & Talent Acquisition Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      email: 'huong.vu@intervue.vn',
      phone: '0977 889 900',
      address: 'Đống Đa, Hà Nội',
      summary:
        'Chuyên viên Nhân sự & Tuyển dụng với 3 năm kinh nghiệm trong ngành Công nghệ (Tech HR). Đã thành công tuyển dụng hơn 150 nhân sự IT từ Fresher đến Tech Lead.',
      experience: [
        {
          role: 'Talent Acquisition Specialist',
          company: 'VNG Corporation',
          period: '02/2023 - Hiện tại',
          highlights: [
            'Giảm thời gian trung bình tuyển dụng một vị trí (Time-to-hire) từ 35 ngày xuống 21 ngày.',
            'Xây dựng mạng lưới Talent Pool hơn 3.000 ứng viên công nghệ chất lượng cao.',
          ],
        },
      ],
      education: [
        {
          degree: 'Cử nhân Quản trị Nhân lực',
          school: 'Đại học Kinh tế Quốc dân (NEU)',
          period: '2019 - 2023',
        },
      ],
      skills: [
        'Headhunting & Sourcing',
        'Phỏng vấn hành vi (STAR)',
        'Quy trình Onboarding',
        'Luật Lao động Việt Nam',
        'Hệ thống ATS',
      ],
    },
  },
  {
    id: 'cv-don-gian-fresher',
    title: 'Mẫu CV Khởi Đầu Cho Fresher',
    slug: 'mau-cv-khoi-dau-fresher',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/fresher-start.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Fresher / Mới ra trường', 'Kinh doanh & Bán hàng', 'Marketing & Truyền thông'],
    availableColors: CV_COLORS,
    defaultColorHex: '#ea580c',
    usesCount: '124.9K',
    rating: 4.87,
    isHot: true,
    isAtsOptimized: true,
    recommendedFor: ['Sinh viên năm cuối', 'Thực tập sinh', 'Người mới chuyển ngành'],
    description:
      'Thiết kế thông minh tập trung làm nổi bật hoạt động ngoại khóa, kỹ năng mềm, các dự án cá nhân và tinh thần học hỏi dành riêng cho ứng viên chưa có nhiều kinh nghiệm.',
    sampleData: {
      name: 'PHẠM MINH DƯƠNG',
      title: 'Business Development & B2B Sales Associate (Fresher)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      email: 'duong.pham@intervue.vn',
      phone: '0919 223 344',
      address: 'Bình Thạnh, TP. Hồ Chí Minh',
      summary:
        'Cử nhân ngành Thương mại Quốc tế năng động, đam mê lĩnh vực phát triển kinh doanh B2B. Đạt thành tích xuất sắc trong các cuộc thi giải case doanh nghiệp và có kinh nghiệm thực tập bán hàng.',
      experience: [
        {
          role: 'Business Development Intern',
          company: 'TopCV Vietnam',
          period: '06/2023 - 12/2023',
          highlights: [
            'Hỗ trợ kết nối với hơn 80 khách hàng doanh nghiệp SME, đóng góp hoàn thành 110% chỉ tiêu KPI nhóm.',
            'Khảo sát và thu thập phản hồi khách hàng để cải thiện tỷ lệ tái ký hợp đồng dịch vụ tuyển dụng.',
          ],
        },
      ],
      education: [
        {
          degree: 'Cử nhân Kinh doanh Quốc tế',
          school: 'Đại học Ngoại thương Cơ sở 2 (FTU2)',
          period: '2020 - 2024',
          gpa: 'GPA: 3.42 / 4.0',
        },
      ],
      skills: [
        'Giao tiếp & Đàm phán',
        'Kỹ năng Cold Calling',
        'Thuyết trình trước đám đông',
        'Sử dụng CRM HubSpot',
        'Tiếng Anh lưu loát',
      ],
    },
  },
  {
    id: 'cv-don-gian-line-accent',
    title: 'Mẫu CV Tối Giản Line-Accent',
    slug: 'mau-cv-toi-gian-line-accent',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/line-accent.png',
    style: 'Đơn giản',
    styleSlug: 'mau-don-gian',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Công nghệ thông tin / IT', 'Kỹ thuật / Kỹ sư'],
    availableColors: CV_COLORS,
    defaultColorHex: '#0d9488',
    usesCount: '78.2K',
    rating: 4.82,
    isAtsOptimized: true,
    recommendedFor: ['Kỹ sư', 'Data Analyst', 'Product Manager'],
    description:
      'Điểm nhấn đường kẻ mỏng phân tách khu vực tinh gọn, cho phép trình bày chi tiết các dự án kỹ thuật và danh sách công nghệ thành thạo.',
    sampleData: {
      name: 'HOÀNG VĂN KHÁNH',
      title: 'Data Analyst & Business Intelligence Specialist',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
      email: 'khanh.data@intervue.vn',
      phone: '0966 333 444',
      address: 'Nam Từ Liêm, Hà Nội',
      summary:
        'Chuyên viên phân tích dữ liệu 3 năm kinh nghiệm trong ngành Bán lẻ và Fintech. Thành thạo xây dựng dashboard Power BI tự động và trích xuất dữ liệu bằng SQL.',
      experience: [
        {
          role: 'Data Analyst',
          company: 'Masan Group Retail Division',
          period: '04/2022 - Hiện tại',
          highlights: [
            'Xây dựng hệ thống 15 Dashboard giám sát doanh thu chuỗi WinMart theo thời gian thực.',
            'Phân tích hành vi mua sắm giỏ hàng, đề xuất chiến lược cross-sell gia tăng giá trị đơn hàng 14%.',
          ],
        },
      ],
      education: [
        {
          degree: 'Cử nhân Hệ thống Thông tin Quản lý',
          school: 'Đại học Kinh tế Quốc dân (NEU)',
          period: '2018 - 2022',
        },
      ],
      skills: ['SQL (Postgres, MySQL)', 'Power BI & Tableau', 'Python (Pandas, Numpy)', 'ETL Pipeline', 'A/B Testing'],
    },
  },
  {
    id: 'cv-chuyen-nghiep-corporate',
    title: 'Mẫu CV Corporate Professional',
    slug: 'mau-cv-corporate-professional',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/corporate-pro.png',
    style: 'Chuyên nghiệp',
    styleSlug: 'mau-chuyen-nghiep',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Tài chính - Kế toán', 'Kinh doanh & Bán hàng'],
    availableColors: CV_COLORS,
    defaultColorHex: '#1e3a8a',
    usesCount: '142.0K',
    rating: 4.9,
    recommendedFor: ['Trưởng phòng', 'Giám đốc chi nhánh', 'Chuyên viên cao cấp'],
    description:
      'Phong thái uy tín, đĩnh đạc dành cho những ứng viên ứng tuyển vị trí quản lý hoặc tập đoàn đa quốc gia.',
    sampleData: {
      name: 'ĐẶNG THỊ MAI',
      title: 'Accounting Manager / Chief Accountant',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      email: 'mai.dang@intervue.vn',
      phone: '0909 555 666',
      address: 'Quận 3, TP. Hồ Chí Minh',
      summary:
        'Kế toán trưởng với hơn 7 năm kinh nghiệm quản lý hệ thống sổ sách kế toán, quyết toán thuế và lập báo cáo tài chính IFRS.',
      experience: [
        {
          role: 'Chief Accountant',
          company: 'An Phong Construction Corp',
          period: '2020 - Hiện tại',
          highlights: [
            'Quản lý bộ phận kế toán 12 nhân sự, tối ưu hóa chi phí vận hành và hoàn thuế hợp pháp hơn 2.4 tỷ VNĐ.',
          ],
        },
      ],
      education: [{ degree: 'Thạc sĩ Kế toán - Kiểm toán', school: 'Đại học Kinh tế TP.HCM', period: '2016 - 2018' }],
      skills: ['Phần mềm MISA / SAP', 'Quyết toán thuế', 'Chuẩn mực kế toán VAS & IFRS', 'Quản lý dòng tiền'],
    },
  },
  {
    id: 'cv-hien-dai-creative',
    title: 'Mẫu CV Hiện Đại Phá Cách',
    slug: 'mau-cv-hien-dai-creative',
    thumbnail: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/choose-cv/mau-cv/creative-modern.png',
    style: 'Hiện đại',
    styleSlug: 'mau-hien-dai',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    industries: ['Marketing & Truyền thông', 'Thiết kế & Đồ họa'],
    availableColors: CV_COLORS,
    defaultColorHex: '#be123c',
    usesCount: '89.6K',
    rating: 4.86,
    recommendedFor: ['UI/UX Designer', 'Content Creator', 'Art Director'],
    description:
      'Bố cục độc đáo với nghệ thuật sắp đặt khối hình hiện đại, giúp bạn nổi bật ngay giữa hàng trăm ứng viên.',
    sampleData: {
      name: 'NGUYỄN MINH TRIẾT',
      title: 'Senior UI/UX & Product Designer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      email: 'triet.design@intervue.vn',
      phone: '0944 666 777',
      address: 'Phú Nhuận, TP. Hồ Chí Minh',
      summary:
        'Chuyên gia thiết kế sản phẩm số 5 năm kinh nghiệm. Đam mê xây dựng Design System và kiến tạo trải nghiệm người dùng tối giản.',
      experience: [
        {
          role: 'Lead Product Designer',
          company: 'MoMo Fintech App',
          period: '2021 - Hiện tại',
          highlights: [
            'Tái thiết kế luồng chuyển tiền người dùng, giảm thời gian hoàn tất giao dịch 28% và tăng NPS lên 74 điểm.',
          ],
        },
      ],
      education: [{ degree: 'Cử nhân Thiết kế Đồ họa', school: 'Đại học Kiến trúc TP.HCM', period: '2016 - 2020' }],
      skills: [
        'Figma Master',
        'Design System Architecture',
        'User Research & Wireframing',
        'Prototyping',
        'Design Sprint',
      ],
    },
  },
];

export const CV_BENEFITS: CvBenefitItem[] = [
  {
    icon: 'ShieldCheck',
    title: 'Tối ưu 100% bộ lọc ATS',
    description:
      'Cấu trúc văn bản và thứ tự phân cấp đề mục được tối ưu hóa chuẩn quốc tế, giúp phần mềm tuyển dụng tự động (ATS) quét và trích xuất thông tin chính xác 100%.',
  },
  {
    icon: 'Eye',
    title: 'Ghi điểm trong 6 giây đầu tiên',
    description:
      'Thiết kế đơn giản loại bỏ hoàn toàn các chi tiết rườm rà, tập trung làm nổi bật kinh nghiệm và thành tựu số liệu giúp nhà tuyển dụng dễ dàng nắm bắt mấu chốt.',
  },
  {
    icon: 'Sliders',
    title: 'Dễ dàng tùy biến & Phù hợp mọi cấp bậc',
    description:
      'Linh hoạt chuyển đổi màu sắc, phông chữ và bố cục chỉ với một cú nhấp chuột. Phù hợp từ sinh viên mới ra trường đến quản lý cấp cao.',
  },
  {
    icon: 'FileCheck2',
    title: 'Xuất file PDF chuẩn in ấn & sắc nét',
    description:
      'Hỗ trợ tải xuống file PDF vector độ phân giải cao, đảm bảo văn bản hiển thị rõ ràng trên mọi thiết bị và không bị vỡ nét khi in ấn.',
  },
];

export const CV_STEPS: CvStepGuide[] = [
  {
    step: 1,
    title: 'Chọn mẫu CV phù hợp',
    description:
      'Khám phá thư viện mẫu CV theo phong cách Đơn giản, Chuẩn ATS hoặc Chuyên nghiệp phù hợp với ngành nghề của bạn.',
  },
  {
    step: 2,
    title: 'Điền thông tin với gợi ý từ AI',
    description:
      'Nhập kinh nghiệm và kỹ năng với sự hỗ trợ của trợ lý InterVue AI gợi ý từ khóa chuyên ngành sát với yêu cầu tuyển dụng.',
  },
  {
    step: 3,
    title: 'Tải CV PDF & Ứng tuyển ngay',
    description:
      'Xem trước toàn màn hình, tải file PDF chất lượng cao về máy hoặc sử dụng trực tiếp để nộp hồ sơ tới các tập đoàn lớn.',
  },
];

export const CV_FAQS: CvFaqItem[] = [
  {
    question: 'Tại sao nên ưu tiên chọn mẫu CV đơn giản thay vì mẫu trang trí cầu kỳ?',
    answer:
      'Các nghiên cứu tuyển dụng thực tế cho thấy nhà tuyển dụng chỉ dành từ 6 đến 10 giây để đọc lướt một CV. Mẫu CV đơn giản với cấu trúc phân cấp mạch lạc giúp mắt người đọc quét nhanh các từ khóa kỹ năng và số liệu thành tựu mà không bị phân tâm bởi các họa tiết hoa mỹ. Đồng thời, mẫu đơn giản luôn tương thích tốt nhất với hệ thống lọc ứng viên tự động (ATS).',
  },
  {
    question: 'Mẫu CV đơn giản có phù hợp cho người có nhiều năm kinh nghiệm không?',
    answer:
      'Hoàn toàn phù hợp! Thậm chí các vị trí cấp cao như Quản lý, Giám đốc, Kỹ sư trưởng hay Chuyên gia tài chính tại các tập đoàn lớn (như mẫu Harvard) đều ưu tiên sử dụng thiết kế tối giản để dành trọn vẹn không gian trang giấy cho các dự án lớn, giá trị ngân sách và chỉ số tăng trưởng.',
  },
  {
    question: 'Tôi có thể chuyển đổi ngôn ngữ của mẫu CV được không?',
    answer:
      'Có. Bạn có thể tự do chuyển đổi ngôn ngữ hiển thị (Tiếng Việt, Tiếng Anh) ngay trên trang chọn mẫu hoặc trong trình soạn thảo để phù hợp với yêu cầu của từng doanh nghiệp ứng tuyển.',
  },
  {
    question: 'Tải CV trên InterVue có mất phí không?',
    answer:
      'Toàn bộ các mẫu CV trên hệ sinh thái InterVue đều được cung cấp miễn phí 100%. Bạn có thể tạo, chỉnh sửa và tải về file PDF không giới hạn số lần.',
  },
];

// Helper functions
export function getAllCvTemplates(): CvTemplateItem[] {
  return CV_TEMPLATES;
}

export function getCvTemplatesByStyle(styleSlug: string): CvTemplateItem[] {
  if (styleSlug === 'all') return CV_TEMPLATES;
  return CV_TEMPLATES.filter((tpl) => tpl.styleSlug === styleSlug);
}

export function getCvTemplateBySlug(slug: string): CvTemplateItem | undefined {
  return CV_TEMPLATES.find((tpl) => tpl.slug === slug);
}

export function getCvStyles(): CvTemplateStyle[] {
  return CV_STYLES;
}

export function getCvIndustries(): CvTemplateIndustry[] {
  return CV_INDUSTRIES;
}
