import { CareerArticle, CareerCategory, CareerTrendingIndustry } from '@/types/career';

export const CAREER_CATEGORIES: CareerCategory[] = [
  {
    id: 'all',
    name: 'Tất cả',
    slug: 'tat-ca',
    count: 24,
  },
  {
    id: 'orientation',
    name: 'Định hướng nghề nghiệp',
    slug: 'dinh-huong-nghe-nghiep',
    count: 12,
  },
  {
    id: 'skills',
    name: 'Kiến thức chuyên ngành',
    slug: 'kien-thuc-chuyen-nganh',
    count: 8,
  },
  {
    id: 'salary',
    name: 'Chế độ lương thưởng',
    slug: 'che-do-luong-thuong',
    count: 6,
  },
  {
    id: 'tips',
    name: 'Bí kíp tìm việc',
    slug: 'bi-kip-tim-viec',
    count: 9,
  },
  {
    id: 'trends',
    name: 'Xu hướng tuyển dụng 2026',
    slug: 'xu-huong-tuyen-dung',
    count: 5,
  },
];

export const TRENDING_INDUSTRIES: CareerTrendingIndustry[] = [
  {
    id: 'mkt',
    name: 'Marketing & Truyền thông',
    demandRate: '+34%',
    avgSalary: '12 - 35 triệu',
    jobCount: 1420,
    badge: 'Nóng',
    slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
  },
  {
    id: 'it',
    name: 'Công nghệ thông tin / AI',
    demandRate: '+48%',
    avgSalary: '18 - 55 triệu',
    jobCount: 2850,
    badge: 'Top 1',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
  },
  {
    id: 'sales',
    name: 'Sales & Phát triển kinh doanh',
    demandRate: '+29%',
    avgSalary: '15 - 45 triệu',
    jobCount: 3100,
    badge: 'Thu nhập cao',
    slug: 'nhan-vien-sales-la-gi',
  },
  {
    id: 'logistics',
    name: 'Logistics & Chuỗi cung ứng',
    demandRate: '+25%',
    avgSalary: '12 - 30 triệu',
    jobCount: 980,
    badge: 'Tăng trưởng',
    slug: 'logistics-la-gi',
  },
  {
    id: 'finance',
    name: 'Tài chính - Ngân hàng',
    demandRate: '+20%',
    avgSalary: '14 - 38 triệu',
    jobCount: 1150,
    badge: 'Ổn định',
    slug: 'nganh-tai-chinh-ngan-hang-la-gi',
  },
];

export const CAREER_ARTICLES: CareerArticle[] = [
  {
    id: 'art-marketing',
    slug: 'nganh-marketing-la-gi-cac-vi-tri-trong-nganh-marketing',
    title: 'Ngành Marketing là gì? Các vị trí trong ngành Marketing & Lộ trình thăng tiến 2026',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Tổng quan toàn diện về ngành Marketing: Định nghĩa, các chuyên ngành HOT (Digital, Brand, MarCom), thông tin tuyển sinh, mức lương theo cấp bậc và lộ trình thăng tiến từ Intern đến Giám đốc Tiếp thị (CMO).',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-marketing-la-gi-topcv.jpg69ce32b0a12d4.jpg',
    publishedAt: '21/08/2026',
    updatedAt: '04/10/2026',
    readTime: '12 phút đọc',
    viewsCount: '52.4K',
    isFeatured: true,
    isTrending: true,
    tags: ['Marketing', 'Digital Marketing', 'Lộ trình sự nghiệp', 'Mức lương', 'Brand Management', 'SEO & Ads'],
    author: {
      name: 'Ban Biên Tập InterVue & Chuyên Gia Tuyển Dụng TopCV',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia Định hướng Nghề nghiệp & Tư vấn Tuyển dụng',
      bio: 'Hơn 10 năm kinh nghiệm nghiên cứu thị trường lao động, cố vấn hướng nghiệp cho hơn 100.000 ứng viên trẻ tại Việt Nam.',
    },
    tableOfContents: [
      { id: 'nganh-marketing-la-gi', title: '1. Ngành Marketing là gì?', level: 1 },
      { id: 'nganh-marketing-co-de-xin-viec-khong', title: '2. Ngành Marketing có dễ xin việc không?', level: 1 },
      {
        id: 'nganh-marketing-gom-nhung-chuyen-nganh-nao',
        title: '3. Ngành marketing gồm những chuyên ngành nào?',
        level: 1,
      },
      { id: 'thong-tin-tuyen-sinh-nganh-marketing', title: '4. Thông tin tuyển sinh về ngành Marketing', level: 1 },
      {
        id: 'nganh-marketing-ra-truong-lam-gi',
        title: '5. Ngành Marketing ra trường làm gì? (9 vị trí HOT)',
        level: 1,
      },
      { id: 'muc-luong-nganh-marketing', title: '6. Mức lương ngành Marketing bao nhiêu?', level: 1 },
      { id: 'lo-trinh-thang-tien-nganh-marketing', title: '7. Lộ trình thăng tiến trong ngành Marketing', level: 1 },
      { id: 'nhung-to-chat-ky-nang-can-co', title: '8. Tố chất và kỹ năng cần có', level: 1 },
      { id: 'xu-huong-nganh-marketing-2026', title: '9. Xu hướng ngành Marketing năm 2026', level: 1 },
      { id: 'tim-viec-lam-nganh-marketing-o-dau', title: '10. Tìm việc làm ngành Marketing ở đâu?', level: 1 },
    ],
    salaryTiers: [
      {
        level: 'Thực tập sinh (Intern / Trainee)',
        range: '3.000.000 - 6.000.000 đ/tháng',
        experience: '0 - 6 tháng',
        description:
          'Hỗ trợ lên kế hoạch nội dung, seeding, nghiên cứu đối thủ, làm quen với các công cụ quảng cáo và phân tích cơ bản.',
        popularRoles: ['Marketing Intern', 'Content Intern', 'Social Media Trainee'],
        color: '#00b14f',
      },
      {
        level: 'Mới ra trường / Fresher',
        range: '8.000.000 - 12.000.000 đ/tháng',
        experience: 'Dưới 1 năm',
        description:
          'Đảm nhiệm trực tiếp việc sáng tạo nội dung, quản lý kênh mạng xã hội hoặc thiết lập chiến dịch quảng cáo nhỏ.',
        popularRoles: ['Marketing Executive', 'Content Writer', 'SEO Executive', 'Junior Media Planner'],
        color: '#0284c7',
      },
      {
        level: 'Chuyên viên (Junior - Middle)',
        range: '12.000.000 - 20.000.000 đ/tháng',
        experience: '1 - 3 năm',
        description:
          'Độc lập thực thi các chiến dịch truyền thông đa kênh, tối ưu hoá chuyển đổi và đo lường ROI chiến dịch.',
        popularRoles: ['Digital Marketing Specialist', 'Performance Marketer', 'Brand Executive', 'PR Specialist'],
        color: '#7c3aed',
      },
      {
        level: 'Chuyên viên cao cấp (Senior Specialist)',
        range: '20.000.000 - 35.000.000 đ/tháng',
        experience: '3 - 5 năm',
        description: 'Xây dựng chiến lược phân phối nội dung và ngân sách tiếp thị lớn, cố vấn cho các thành viên mới.',
        popularRoles: ['Senior Brand Specialist', 'Growth Marketing Lead', 'Senior Digital Strategist'],
        color: '#ea580c',
      },
      {
        level: 'Trưởng nhóm / Trưởng phòng (Leader / Manager)',
        range: '25.000.000 - 50.000.000 đ/tháng',
        experience: '5 - 8 năm',
        description:
          'Quản lý đội ngũ, điều phối ngân sách hàng tỷ đồng, chịu trách nhiệm KPI doanh số và nhận diện thương hiệu.',
        popularRoles: ['Marketing Manager', 'Brand Manager', 'Head of Digital', 'MarCom Manager'],
        color: '#e11d48',
      },
      {
        level: 'Giám đốc Tiếp thị (CMO / Marketing Director)',
        range: '50.000.000 - 100.000.000+ đ/tháng',
        experience: 'Trên 8 năm',
        description:
          'Định hình chiến lược phát triển thương hiệu toàn công ty, tham gia hoạch định mô hình tăng trưởng kinh doanh cốt lõi.',
        popularRoles: ['Chief Marketing Officer (CMO)', 'VP of Marketing', 'Marketing Director'],
        color: '#059669',
      },
    ],
    careerRoadmap: [
      {
        step: 1,
        title: 'Giai đoạn 1: Khởi động (Intern / Trainee)',
        duration: '0 - 6 tháng',
        salaryEstimate: '3 - 6 triệu/tháng',
        skills: ['Kỹ năng viết Content cơ bản', 'Sử dụng Canva/CapCut', 'Nghiên cứu thị trường', 'Excel & Báo cáo'],
        keyResponsibilities: [
          'Hỗ trợ viết bài fanpage, blog chuẩn SEO',
          'Theo dõi tương tác và phản hồi khách hàng cơ bản',
          'Lập báo cáo số liệu hàng tuần theo mẫu sẵn có',
        ],
      },
      {
        step: 2,
        title: 'Giai đoạn 2: Tiếp thu & Độc lập (Junior Specialist)',
        duration: '6 tháng - 2 năm',
        salaryEstimate: '8 - 14 triệu/tháng',
        skills: [
          'Chạy quảng cáo Meta/Google/TikTok Ads',
          'Phân tích dữ liệu Google Analytics 4',
          'Tư duy A/B Testing',
          'Copywriting thuyết phục',
        ],
        keyResponsibilities: [
          'Tự chủ sản xuất chiến dịch nội dung đa nền tảng',
          'Vận hành và tối ưu hóa ngân sách quảng cáo hàng ngày',
          'Phối hợp cùng bộ phận Thiết kế & Sales để gia tăng chuyển đổi',
        ],
      },
      {
        step: 3,
        title: 'Giai đoạn 3: Chuyên sâu & Tạo đột phá (Senior Specialist)',
        duration: '2 - 5 năm',
        salaryEstimate: '18 - 30 triệu/tháng',
        skills: ['Growth Marketing', 'Chiến lược Thương hiệu', 'Marketing Automation', 'Quản trị dự án Agile/Scrum'],
        keyResponsibilities: [
          'Lập kế hoạch tiếp thị tổng thể cho sản phẩm mới',
          'Tối ưu hóa hành trình khách hàng (Customer Journey Map)',
          'Đo lường CAC (Chi phí có được khách hàng) & LTV (Giá trị vòng đời)',
        ],
      },
      {
        step: 4,
        title: 'Giai đoạn 4: Quản lý & Lãnh đạo (Marketing Manager)',
        duration: '5 - 8 năm',
        salaryEstimate: '30 - 55 triệu/tháng',
        skills: [
          'Quản trị con người & Lãnh đạo',
          'Hoạch định ngân sách tài chính',
          'Đàm phán Agency/KOLs',
          'Tư duy kinh doanh (Business Acumen)',
        ],
        keyResponsibilities: [
          'Xây dựng và phát triển đội ngũ tiếp thị 5 - 20 nhân sự',
          'Phân bổ ngân sách tiếp thị quý/năm hiệu quả',
          'Chịu trách nhiệm trực tiếp về KPI doanh thu đóng góp từ Marketing',
        ],
      },
      {
        step: 5,
        title: 'Giai đoạn 5: Cấp cao (CMO / VP of Marketing)',
        duration: '8+ năm',
        salaryEstimate: '60 - 120+ triệu/tháng',
        skills: [
          'Chiến lược doanh nghiệp dài hạn',
          'Định vị thương hiệu tầm vĩ mô',
          'M&A & Mở rộng thị trường quốc tế',
          'Quản trị khủng hoảng truyền thông',
        ],
        keyResponsibilities: [
          'Xác lập tầm nhìn thương hiệu và vị thế cạnh tranh trên thị trường',
          'Tham gia vào Hội đồng quản trị định hướng tăng trưởng công ty',
          'Chỉ đạo các chiến dịch chuyển đổi số tiếp thị quy mô lớn',
        ],
      },
    ],
    specializations: [
      {
        title: 'Digital Marketing (Marketing Số)',
        description:
          'Tập trung vào tất cả các kênh tiếp thị trực tuyến gồm SEO, SEM, Paid Social, Email Automation và phân tích số liệu chuyển đổi số.',
        avgSalary: '12 - 28 triệu',
        keySkills: ['Meta Ads', 'Google Ads', 'SEO On-page & Off-page', 'GA4 & Looker Studio'],
        tools: ['Google Ads', 'Meta Business Suite', 'Ahrefs', 'Mailchimp', 'Klaviyo'],
        growthRate: '+38% nhu cầu năm 2026',
      },
      {
        title: 'Brand Management (Quản trị Thương hiệu)',
        description:
          'Định hình hình ảnh, giá trị cảm xúc và vị thế sản phẩm trong tâm trí người tiêu dùng thông qua các chiến dịch truyền thông dài hạn.',
        avgSalary: '15 - 35 triệu',
        keySkills: ['Consumer Insight', 'Brand Architecture', 'Storytelling', 'Campaign Planning'],
        tools: ['Mintel', 'Euromonitor', 'NielsenIQ', 'Canva Pro'],
        growthRate: '+24% nhu cầu năm 2026',
      },
      {
        title: 'Content Marketing & Creative',
        description:
          'Sáng tạo và nuôi dưỡng tệp khách hàng trung thành thông qua nội dung giá trị (Blog, Video ngắn, Podcast, Ebook, Kịch bản viral).',
        avgSalary: '10 - 22 triệu',
        keySkills: ['Copywriting', 'Content Strategy', 'Video Scriptwriting', 'Tư duy thị giác'],
        tools: ['Notion', 'ChatGPT/Claude', 'CapCut', 'Figma'],
        growthRate: '+30% nhu cầu năm 2026',
      },
      {
        title: 'Performance & Growth Marketing',
        description:
          'Chuyên gia số hóa tập trung vào việc tối ưu hóa tỷ lệ chuyển đổi, CPA, ROI và các thử nghiệm tăng trưởng nhanh (Growth Hacking).',
        avgSalary: '18 - 40 triệu',
        keySkills: ['Funnel Optimization', 'Data Analysis', 'A/B Testing', 'Retention Marketing'],
        tools: ['Mixpanel', 'Amplitude', 'AppsFlyer', 'Tableau'],
        growthRate: '+45% nhu cầu năm 2026',
      },
      {
        title: 'PR & Corporate Communications (Quan hệ Công chúng)',
        description:
          'Duy trì mối quan hệ báo chí, xử lý khủng hoảng truyền thông và quảng bá trách nhiệm xã hội doanh nghiệp (CSR).',
        avgSalary: '14 - 30 triệu',
        keySkills: ['Media Relations', 'Crisis Management', 'Event Planning', 'Press Release'],
        tools: ['Cision', 'Social Listening Tools', 'Buzzmetrics'],
        growthRate: '+18% nhu cầu năm 2026',
      },
      {
        title: 'Trade Marketing (Marketing Thương mại)',
        description:
          'Chiến lược bán buôn, tối ưu hóa điểm bán (POSM), chương trình khuyến mãi cho đại lý và nhà bán lẻ để giành thị phần tại kệ hàng.',
        avgSalary: '14 - 32 triệu',
        keySkills: ['Shopper Insight', 'Channel Strategy', 'POSM Management', 'Sales Alignment'],
        tools: ['DMS', 'SAP ERP', 'Retail Audit Data'],
        growthRate: '+22% nhu cầu năm 2026',
      },
    ],
    sections: [
      {
        id: 'nganh-marketing-la-gi',
        title: '1. Ngành Marketing là gì?',
        leadText:
          'Marketing không đơn thuần là quảng cáo hay bán hàng. Đây là cả một hệ sinh thái nghiên cứu, sáng tạo và trao gửi giá trị tới khách hàng mục tiêu.',
        paragraphs: [
          'Theo Hiệp hội Tiếp thị Hoa Kỳ (AMA), Marketing là hoạt động, tập hợp các thể chế và quy trình nhằm tạo ra, giao tiếp, phân phối và trao đổi các sản phẩm/dịch vụ có giá trị cho khách hàng, đối tác và toàn xã hội.',
          'Nói một cách gần gũi, Marketing là cầu nối giữa doanh nghiệp và thị trường. Nhiệm vụ cốt lõi của người làm Marketing là tìm hiểu nhu cầu thầm kín (customer insight) của người tiêu dùng, từ đó phát triển sản phẩm phù hợp, định giá chuẩn xác, lựa chọn kênh phân phối tối ưu và quảng bá sản phẩm chạm đúng cảm xúc khách hàng.',
          'Mô hình kinh điển trong Marketing bao gồm 4P (Product - Giá trị sản phẩm, Price - Giá cả, Place - Kênh phân phối, Promotion - Chiêu thị xúc tiến) và mở rộng thành 7P cho mảng dịch vụ (People - Con người, Process - Quy trình, Physical Evidence - Cơ sở vật chất).',
        ],
        highlights: [
          'Marketing = Tạo ra sản phẩm đúng nhu cầu + Định giá đúng + Tiếp cận đúng kênh + Thông điệp đúng thời điểm.',
          'Sự khác biệt giữa Marketing và Sales: Marketing tạo ra nhu cầu và lôi kéo khách hàng đến, trong khi Sales là người trực tiếp chốt đơn và chuyển hóa nhu cầu thành doanh thu.',
        ],
      },
      {
        id: 'nganh-marketing-co-de-xin-viec-khong',
        title: '2. Ngành Marketing có dễ xin việc không?',
        leadText:
          'Trong kỷ nguyên số và thương mại điện tử bùng nổ, mọi doanh nghiệp từ startup nhỏ đến tập đoàn đa quốc gia đều xem Marketing là huyết mạch tăng trưởng.',
        paragraphs: [
          'Theo báo cáo thị trường tuyển dụng của InterVue & TopCV, nhu cầu nhân sự khối ngành Marketing & Truyền thông luôn nằm trong TOP 3 ngành nghề có số lượng tin tuyển dụng lớn nhất Việt Nam.',
          'Mặc dù lượng sinh viên tốt nghiệp ngành Marketing hàng năm rất đông, thị trường vẫn luôn "khát" nhân sự chất lượng cao — những người vừa có tư duy chiến lược, vừa thành thạo các công cụ số (Digital Marketing) và có khả năng đọc hiểu dữ liệu (Data-driven Marketer).',
          'Đặc biệt, sự bùng nổ của mạng xã hội TikTok, thương mại điện tử Shopee/Lazada và làn sóng trí tuệ nhân tạo (GenAI) mở ra hàng nghìn vị trí mới như KOC/KOL Specialist, Live Commerce Specialist, AI Content Marketer và Performance Data Analyst.',
        ],
        highlights: [
          'Tỉ lệ sinh viên có việc làm sau tốt nghiệp ngành Marketing đạt trên 92% trong vòng 6 tháng đầu.',
          'Doanh nghiệp sẵn sàng trả mức thu nhập vượt bậc cho ứng viên có năng lực đo lường hiệu quả chuyển đổi thực tế (ROAS, CPL, LTV).',
        ],
      },
      {
        id: 'nganh-marketing-gom-nhung-chuyen-nganh-nao',
        title: '3. Ngành Marketing gồm những chuyên ngành nào?',
        leadText:
          'Tại các trường đại học và thực tế doanh nghiệp, Marketing được chia thành các nhánh chuyên sâu phù hợp với từng sở trường tính cách.',
        paragraphs: [
          'Tùy thuộc vào năng khiếu (thiên về sáng tạo nghệ thuật hay thiên về tư duy logic số liệu), bạn có thể lựa chọn một trong các chuyên ngành chính sau:',
        ],
        subsections: [
          {
            title: 'Digital Marketing (Marketing số)',
            content: [
              'Chuyên ngành được ưa chuộng nhất hiện nay, nghiên cứu việc ứng dụng công nghệ số, Internet, mạng xã hội, email và công cụ tìm kiếm để tiếp cận khách hàng.',
              'Các môn học tiêu biểu: Tối ưu hóa công cụ tìm kiếm (SEO), Quảng cáo kỹ thuật số (SEM & Social Ads), Tiếp thị qua nội dung (Content Marketing), Phân tích web (Web Analytics).',
            ],
          },
          {
            title: 'Marketing Communications (MarCom - Truyền thông Tiếp thị)',
            content: [
              'Tập trung vào cách thức truyền tải thông điệp thương hiệu thông qua các kênh tích hợp (IMC - Integrated Marketing Communications).',
              'Các môn học tiêu biểu: Quảng cáo sáng tạo, Tổ chức sự kiện tiếp thị, Quan hệ công chúng, Quản trị khủng hoảng truyền thông.',
            ],
          },
          {
            title: 'Brand Management (Quản trị Thương hiệu)',
            content: [
              'Nghiên cứu cách xây dựng và định vị tài sản thương hiệu (Brand Equity) vững chắc trên thị trường.',
              'Phù hợp với những bạn có tầm nhìn chiến lược, thấu hiểu tâm lý học hành vi người tiêu dùng và quản lý chuỗi sản phẩm.',
            ],
          },
          {
            title: 'Trade Marketing & Bán lẻ',
            content: [
              'Cầu nối giữa Brand Marketing và đội ngũ Sales thực địa, tối ưu hóa sự hiện diện của sản phẩm tại các điểm bán (siêu thị, cửa hàng tiện lợi, đại lý phân phối).',
            ],
          },
        ],
      },
      {
        id: 'thong-tin-tuyen-sinh-nganh-marketing',
        title: '4. Thông tin tuyển sinh về ngành Marketing',
        leadText:
          'Để theo đuổi ngành Marketing bài bản, việc lựa chọn trường đào tạo uy tín và nắm rõ tổ hợp xét tuyển là bước khởi đầu vững chắc.',
        paragraphs: [
          'Các tổ hợp môn xét tuyển phổ biến nhất của ngành Marketing hiện nay bao gồm: A00 (Toán, Lý, Hóa), A01 (Toán, Lý, Tiếng Anh), D01 (Toán, Văn, Tiếng Anh) và D07 (Toán, Hóa, Tiếng Anh).',
          'Tại Hà Nội, các trường đại học hàng đầu đào tạo Marketing gồm: Đại học Kinh tế Quốc dân (NEU), Đại học Ngoại thương (FTU), Học viện Bưu chính Viễn thông (PTIT), Học viện Ngân hàng (BA), Đại học Thương mại (TMU).',
          'Tại TP. Hồ Chí Minh, các cơ sở uy tín gồm: Đại học Kinh tế TP.HCM (UEH), Đại học Ngoại thương Cơ sở 2 (FTU2), Đại học Kinh tế - Luật (UEL), Đại học Tài chính - Marketing (UFM), Đại học RMIT Việt Nam.',
          'Điểm chuẩn ngành Marketing luôn nằm trong nhóm ngành có điểm số đầu vào cao nhất các trường kinh tế (thường dao động từ 26.0 - 28.5 điểm cho khối thi tốt nghiệp THPT).',
        ],
      },
      {
        id: 'nganh-marketing-ra-truong-lam-gi',
        title: '5. Ngành Marketing ra trường làm gì? (9 vị trí HOT)',
        leadText:
          'Cử nhân tốt nghiệp ngành Marketing có phổ lựa chọn nghề nghiệp rất rộng, từ môi trường Agency sáng tạo năng động đến Client tập đoàn đa quốc gia.',
        paragraphs: ['Dưới đây là 9 vị trí công việc có nhu cầu tuyển dụng sôi động nhất hiện nay:'],
        subsections: [
          {
            title: '1. Chuyên viên Marketing tổng hợp (General Marketer)',
            content: [
              'Thực hiện đa nhiệm các công việc: Lên kế hoạch tiếp thị sản phẩm, điều phối sự kiện, chăm sóc fanpage và phối hợp với đội ngũ Sales thúc đẩy doanh số.',
            ],
          },
          {
            title: '2. Chuyên viên Quản trị Thương hiệu (Brand Executive / Brand Specialist)',
            content: [
              'Chăm sóc "đứa con tinh thần" của doanh nghiệp: Nghiên cứu thị trường, theo dõi sức khỏe thương hiệu, phối hợp với Agency để sản xuất TVC, Billboard và chiến dịch truyền thông lớn.',
            ],
          },
          {
            title: '3. Chuyên viên Sáng tạo Nội dung (Content Creator / Copywriter)',
            content: [
              'Người thổi hồn vào sản phẩm thông qua con chữ, hình ảnh và kịch bản video viral. Viết bài blog chuẩn SEO, bài PR báo chí, kịch bản TikTok/Reels và thông điệp quảng cáo bắt tai.',
            ],
          },
          {
            title: '4. Chuyên viên Chạy Ads & Tối ưu Hiệu suất (Performance Ads Specialist)',
            content: [
              'Trực tiếp quản lý ngân sách quảng cáo trên Meta Ads, Google Ads, TikTok Ads. Đo lường chỉ số CPA, ROAS, chuyển đổi và đưa ra quyết định scale chiến dịch.',
            ],
          },
          {
            title: '5. Chuyên viên Tối ưu hóa Công cụ Tìm kiếm (SEO Specialist)',
            content: [
              'Phân tích từ khóa, xây dựng cấu trúc website, tối ưu on-page/off-page nhằm đưa thứ hạng website lên trang đầu kết quả tìm kiếm Google tự nhiên không mất tiền quảng cáo.',
            ],
          },
          {
            title: '6. Chuyên viên Quản lý Mạng xã hội (Social Media Specialist)',
            content: [
              'Vận hành và xây dựng cộng đồng trên các nền tảng Facebook, Instagram, TikTok, Threads, LinkedIn, gia tăng mức độ tương tác và nhận diện thương hiệu.',
            ],
          },
          {
            title: '7. Chuyên viên Quan hệ Công chúng (PR Specialist)',
            content: [
              'Xây dựng mối quan hệ tốt đẹp với các cơ quan báo chí, phóng viên, người có tầm ảnh hưởng (KOLs/KOCs), viết thông cáo báo chí và tham gia xử lý khủng hoảng truyền thông.',
            ],
          },
          {
            title: '8. Chuyên viên Nghiên cứu Thị trường (Market Research Specialist)',
            content: [
              'Thu thập và phân tích dữ liệu thị trường, phỏng vấn nhóm khách hàng (focus group), giải mã insight người dùng để tham mưu cho ban giám đốc phát triển sản phẩm mới.',
            ],
          },
          {
            title: '9. Chuyên viên Marketing Tự động hóa (Marketing Automation Specialist)',
            content: [
              'Xây dựng luồng kịch bản chăm sóc khách hàng tự động qua Email, SMS, Zalo ZNS dựa trên hành vi người dùng, nâng cao tỷ lệ giữ chân và mua lại (Retention).',
            ],
          },
        ],
      },
      {
        id: 'muc-luong-nganh-marketing',
        title: '6. Mức lương ngành Marketing bao nhiêu?',
        leadText:
          'Thu nhập trong ngành Marketing phụ thuộc chặt chẽ vào năng lực thực chiến, kinh nghiệm quản lý và quy mô doanh nghiệp bạn cống hiến.',
        paragraphs: [
          'Khảo sát trên 5.000 việc làm Marketing tại InterVue năm 2026 cho thấy mức thu nhập trung bình theo từng cấp bậc kinh nghiệm rất hấp dẫn:',
          'Ngoài mức lương cứng cố định, nhiều vị trí như Performance Marketer hay Growth Marketer còn nhận thêm khoản thưởng hoa hồng (commission/bonus) dựa trên doanh thu mang về cho doanh nghiệp.',
        ],
      },
      {
        id: 'lo-trinh-thang-tien-nganh-marketing',
        title: '7. Lộ trình thăng tiến trong ngành Marketing',
        leadText:
          'Một lộ trình sự nghiệp rõ ràng sẽ giúp bạn chủ động tích lũy kỹ năng và đón đầu các nấc thang thăng tiến trong sự nghiệp.',
        paragraphs: [
          'Từ một thực tập sinh mới chập chững bước vào nghề cho đến vị trí Giám đốc Marketing (CMO) là hành trình đòi hỏi sự kiên trì, không ngừng cập nhật xu hướng và nâng cao tư duy quản trị.',
          'Tại Việt Nam, con đường thăng tiến thường trải qua 5 nấc thang tiêu chuẩn: Intern (0-6 tháng) -> Fresher/Junior (6 tháng - 2 năm) -> Senior Specialist (2-5 năm) -> Marketing Manager (5-8 năm) -> CMO / Marketing Director (8+ năm).',
        ],
      },
      {
        id: 'nhung-to-chat-ky-nang-can-co',
        title: '8. Tố chất và kỹ năng cần có để phát triển trong ngành Marketing',
        leadText:
          'Marketing là sự giao thoa hoàn hảo giữa Khoa học dữ liệu (Data Science) và Nghệ thuật sáng tạo (Creative Art).',
        paragraphs: [
          'Để trở thành một Marketer xuất sắc và không bị đào thải trước sự phát triển của công nghệ, bạn cần rèn luyện các nhóm kỹ năng sau:',
        ],
        subsections: [
          {
            title: '1. Tư duy phản biện & Thấu cảm khách hàng (Customer Empathy)',
            content: [
              'Khả năng đặt mình vào vị trí của người tiêu dùng để hiểu được nỗi đau (pain point), mong muốn tiềm ẩn và rào cản khiến họ chưa quyết định mua hàng.',
            ],
          },
          {
            title: '2. Tư duy dựa trên dữ liệu (Data-driven Mindset)',
            content: [
              'Không ra quyết định cảm tính. Biết đọc hiểu các chỉ số CTR, CPC, CPA, ROAS, Bounce Rate, LTV để đánh giá chính xác hiệu quả từng đồng chi phí bỏ ra.',
            ],
          },
          {
            title: '3. Thành thạo công cụ AI & Tự động hóa',
            content: [
              'Khả năng ứng dụng các công cụ trí tuệ nhân tạo (ChatGPT, Claude, Midjourney, Canva AI, Descript) để rút ngắn 50% thời gian nghiên cứu và sản xuất nội dung.',
            ],
          },
          {
            title: '4. Khả năng giao tiếp & Thuyết trình thuyết phục',
            content: [
              'Trình bày ý tưởng sáng tạo rõ ràng trước sếp hoặc đối tác, bảo vệ được chiến lược của mình và truyền cảm hứng cho đội ngũ thực thi.',
            ],
          },
        ],
      },
      {
        id: 'xu-huong-nganh-marketing-2026',
        title: '9. Xu hướng ngành Marketing năm 2026',
        leadText:
          'Năm 2026 đánh dấu bước ngoặt lớn về công nghệ ứng dụng và sự thay đổi trong hành vi tiêu dùng của thế hệ Gen Z và Gen Alpha.',
        paragraphs: ['Dưới đây là 4 xu hướng tiếp thị thống trị mà mọi Marketer cần nắm vững:'],
        subsections: [
          {
            title: 'Tiếp thị cá nhân hóa bằng AI (Hyper-Personalization)',
            content: [
              'Sử dụng thuật toán học máy để tự động gợi ý sản phẩm, viết email và điều chỉnh thông điệp quảng cáo riêng biệt cho từng cá nhân theo thời gian thực.',
            ],
          },
          {
            title: 'Bùng nổ Video ngắn & Tiếp thị qua Live Commerce',
            content: [
              'TikTok Shop, Shopee Live và Reels tiếp tục là kênh chốt đơn trực tiếp quan trọng nhất. Nội dung giải trí kết hợp mua sắm (Shoppertainment) giữ vị trí độc tôn.',
            ],
          },
          {
            title: 'Chuyển dịch sang Dữ liệu bên thứ nhất (First-party Data)',
            content: [
              'Khi cookie bên thứ ba bị hạn chế, các doanh nghiệp tập trung xây dựng tệp dữ liệu khách hàng trung thành (CDP, CRM) và chăm sóc qua Zalo OA, Email Marketing.',
            ],
          },
          {
            title: 'Micro & Nano Influencer lên ngôi',
            content: [
              'Thay vì chi trả hàng trăm triệu cho người nổi tiếng hạng A, doanh nghiệp ưu tiên hợp tác với các nhà sáng tạo nội dung nhỏ có tệp khán giả trung thành và độ tin cậy cao.',
            ],
          },
        ],
      },
      {
        id: 'tim-viec-lam-nganh-marketing-o-dau',
        title: '10. Tìm việc làm ngành Marketing ở đâu?',
        leadText:
          'InterVue là nền tảng tuyển dụng thông minh hàng đầu, kết nối bạn với hàng ngàn cơ hội việc làm Marketing tại các công ty uy tín nhất Việt Nam.',
        paragraphs: [
          'Tại InterVue, bạn có thể dễ dàng tìm kiếm việc làm Marketing theo từng chuyên ngành (Digital, Content, Brand, SEO, Ads), lọc theo mức lương mong muốn và thành phố làm việc.',
          'Đặc biệt, hệ thống InterVue AI Interview còn cho phép bạn luyện phỏng vấn thử 1-1 với trợ lý ảo mô phỏng các câu hỏi tình huống thực tế của nhà tuyển dụng hàng đầu.',
        ],
      },
    ],
    relatedArticles: [
      {
        id: 'art-sales',
        slug: 'nhan-vien-sales-la-gi',
        title: 'Nhân viên kinh doanh/Sales là gì? Từ A đến Z về nghề Sales & Bí quyết bứt phá thu nhập',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/sales-la-gi (3).png6a673b584620f.png',
        category: 'Định hướng nghề nghiệp',
        readTime: '10 phút đọc',
        publishedAt: '08/09/2026',
      },
      {
        id: 'art-media',
        slug: 'nganh-truyen-thong-la-gi',
        title: 'Ngành truyền thông là gì? Triển vọng nghề nghiệp và mức lương chi tiết 2026',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-truyen-thong-la-gi-topcv-0.png67be7685174b7.png',
        category: 'Kiến thức chuyên ngành',
        readTime: '9 phút đọc',
        publishedAt: '15/09/2026',
      },
      {
        id: 'art-logistics',
        slug: 'logistics-la-gi',
        title: 'Logistics là gì? Tất cả những điều bạn cần biết về ngành Logistics & Quản lý chuỗi cung ứng',
        coverImage:
          'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/logistics-la-gi (1).png69c62be842c61.png',
        category: 'Định hướng nghề nghiệp',
        readTime: '11 phút đọc',
        publishedAt: '28/08/2026',
      },
    ],
  },
  {
    id: 'art-sales',
    slug: 'nhan-vien-sales-la-gi',
    title: 'Nhân viên kinh doanh/Sales là gì? Từ A đến Z về nghề Sales & Bí quyết bứt phá thu nhập',
    category: 'Định hướng nghề nghiệp',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Nghề Sales là bệ phóng tài chính và bản lĩnh vượt trội. Khám phá mô hình Sales B2B, B2C, kỹ năng đàm phán chốt deal đỉnh cao và lộ trình trở thành Giám đốc Kinh doanh (CCO).',
    coverImage: 'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/sales-la-gi (3).png6a673b584620f.png',
    publishedAt: '08/09/2026',
    readTime: '10 phút đọc',
    viewsCount: '48.1K',
    isFeatured: true,
    tags: ['Sales', 'Kinh doanh', 'Đàm phán', 'Kỹ năng mềm', 'Thu nhập hoa hồng'],
    author: {
      name: 'Vũ Minh Tuấn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia Huấn luyện Bán hàng B2B & Tuyển dụng Cấp cao',
    },
    tableOfContents: [
      { id: 'sales-la-gi', title: '1. Nhân viên kinh doanh/Sales là gì?', level: 1 },
      { id: 'cac-loai-hinh-sales', title: '2. Các loại hình Sales phổ biến (B2B, B2C, Telesales)', level: 1 },
      { id: 'muc-luong-nghe-sales', title: '3. Cơ cấu thu nhập nghề Sales: Lương cứng + Hoa hồng', level: 1 },
      { id: 'lo-trinh-thang-tien-sales', title: '4. Lộ trình thăng tiến đến CCO', level: 1 },
    ],
    sections: [
      {
        id: 'sales-la-gi',
        title: '1. Nhân viên kinh doanh/Sales là gì?',
        paragraphs: [
          'Nhân viên kinh doanh (Sales Representative) là người trực tiếp kết nối với khách hàng tiềm năng, giới thiệu sản phẩm/dịch vụ, giải quyết thắc mắc và thúc đẩy hành vi mua hàng nhằm đem về doanh thu cho doanh nghiệp.',
          'Nghề Sales không đòi hỏi bằng cấp quá khắt khe nhưng đòi hỏi kỷ luật cao, tư duy linh hoạt và khả năng chịu áp lực doanh số (KPI).',
        ],
      },
    ],
  },
  {
    id: 'art-logistics',
    slug: 'logistics-la-gi',
    title: 'Logistics là gì? Tất cả những điều bạn cần biết về ngành Logistics & Chuỗi cung ứng',
    category: 'Định hướng nghề nghiệp',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Tìm hiểu chi tiết về huyết mạch của nền kinh tế toàn cầu: Quản lý kho bãi, giao nhận vận tải quốc tế (Freight Forwarding), thủ tục hải quan và mức lương ngành Logistics 2026.',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/logistics-la-gi (1).png69c62be842c61.png',
    publishedAt: '28/08/2026',
    readTime: '11 phút đọc',
    viewsCount: '39.8K',
    isFeatured: true,
    tags: ['Logistics', 'Supply Chain', 'Xuất nhập khẩu', 'Kho vận'],
    author: {
      name: 'Nguyễn Thị Hải Yến',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      role: 'Chuyên gia Logistics & Supply Chain Consultant',
    },
    tableOfContents: [
      { id: 'logistics-la-gi', title: '1. Logistics là gì?', level: 1 },
      { id: 'cac-vi-tri-trong-logistics', title: '2. Các vị trí việc làm tiêu biểu', level: 1 },
      { id: 'muc-luong-nganh-logistics', title: '3. Bảng lương chi tiết ngành Logistics', level: 1 },
    ],
    sections: [
      {
        id: 'logistics-la-gi',
        title: '1. Logistics là gì?',
        paragraphs: [
          'Logistics là chuỗi các hoạt động bao gồm lập kế hoạch, thực hiện và kiểm soát dòng dịch chuyển của hàng hóa, thông tin và tài chính từ điểm xuất phát đến tay người tiêu dùng cuối cùng.',
        ],
      },
    ],
  },
  {
    id: 'art-media',
    slug: 'nganh-truyen-thong-la-gi',
    title: 'Ngành truyền thông là gì? Triển vọng nghề nghiệp và mức lương chi tiết 2026',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Truyền thông đa phương tiện, PR báo chí, tổ chức sự kiện và sáng tạo video: Ngành nghề dành cho những bạn trẻ yêu thích sáng tạo, kết nối cộng đồng và tạo sức ảnh hưởng.',
    coverImage:
      'https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-truyen-thong-la-gi-topcv-0.png67be7685174b7.png',
    publishedAt: '15/09/2026',
    readTime: '9 phút đọc',
    viewsCount: '35.2K',
    tags: ['Truyền thông', 'Báo chí', 'PR', 'Sự kiện', 'Sáng tạo'],
    author: {
      name: 'Trần Bảo Anh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      role: 'Senior Communications Lead',
    },
    tableOfContents: [
      { id: 'truyen-thong-la-gi', title: '1. Ngành truyền thông là gì?', level: 1 },
      { id: 'co-hoi-viec-lam', title: '2. Cơ hội việc làm ngành truyền thông', level: 1 },
    ],
    sections: [
      {
        id: 'truyen-thong-la-gi',
        title: '1. Ngành truyền thông là gì?',
        paragraphs: [
          'Ngành truyền thông bao gồm các hoạt động truyền tải thông điệp, tri thức và giá trị thông qua ngôn ngữ, hình ảnh, âm thanh và các kênh đại chúng.',
        ],
      },
    ],
  },
  {
    id: 'art-it',
    slug: 'nganh-cong-nghe-thong-tin-it-la-gi',
    title: 'Ngành Công nghệ thông tin (IT): Lộ trình từ Fresher đến Tech Lead & Kỹ sư AI',
    category: 'Định hướng nghề nghiệp',
    categorySlug: 'dinh-huong-nghe-nghiep',
    excerpt:
      'Khám phá thế giới lập trình: Software Engineer, AI/Data Engineer, DevOps, Cybersecurity cùng lộ trình học tập và mức lương lập trình viên hấp dẫn nhất thị trường.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    publishedAt: '02/10/2026',
    readTime: '14 phút đọc',
    viewsCount: '64.9K',
    tags: ['Công nghệ thông tin', 'Lập trình', 'Kỹ sư AI', 'Fullstack', 'Mức lương IT'],
    author: {
      name: 'Lê Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      role: 'Principal Software Architect & Tech Mentor',
    },
    tableOfContents: [
      { id: 'it-la-gi', title: '1. Ngành Công nghệ thông tin là gì?', level: 1 },
      { id: 'cac-huong-di-it', title: '2. Các hướng đi nghề nghiệp tiêu biểu', level: 1 },
    ],
    sections: [
      {
        id: 'it-la-gi',
        title: '1. Ngành Công nghệ thông tin là gì?',
        paragraphs: [
          'Ngành Công nghệ thông tin (IT) là việc sử dụng máy tính, phần mềm và mạng viễn thông để lưu trữ, bảo mật, xử lý và truyền tải thông tin số.',
        ],
      },
    ],
  },
  {
    id: 'art-finance',
    slug: 'nganh-tai-chinh-ngan-hang-la-gi',
    title: 'Ngành Tài chính - Ngân hàng: Các vị trí thu nhập cao nhất & Xu hướng Fintech 2026',
    category: 'Kiến thức chuyên ngành',
    categorySlug: 'kien-thuc-chuyen-nganh',
    excerpt:
      'Tổng quan cơ hội nghề nghiệp trong ngành Tài chính: Chuyên viên phân tích đầu tư, Quan hệ khách hàng doanh nghiệp (RM), Quản trị rủi ro và Ngân hàng số Fintech.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    publishedAt: '25/09/2026',
    readTime: '11 phút đọc',
    viewsCount: '29.3K',
    tags: ['Tài chính', 'Ngân hàng', 'Fintech', 'Đầu tư', 'Phân tích tài chính'],
    author: {
      name: 'Đỗ Thùy Trang',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      role: 'CFA Charterholder & Financial Advisor',
    },
    tableOfContents: [
      { id: 'tai-chinh-la-gi', title: '1. Ngành Tài chính - Ngân hàng là gì?', level: 1 },
      { id: 'cac-vi-tri-tai-chinh', title: '2. Các vị trí nghề nghiệp nổi bật', level: 1 },
    ],
    sections: [
      {
        id: 'tai-chinh-la-gi',
        title: '1. Ngành Tài chính - Ngân hàng là gì?',
        paragraphs: [
          'Ngành Tài chính - Ngân hàng nghiên cứu dòng tiền, huy động vốn, đầu tư sinh lời và quản trị rủi ro tài chính cho cá nhân, doanh nghiệp và các định chế tài chính.',
        ],
      },
    ],
  },
];

// Helper functions
export function getAllCareerArticles(): CareerArticle[] {
  return CAREER_ARTICLES;
}

export function getFeaturedCareerArticles(): CareerArticle[] {
  return CAREER_ARTICLES.filter((art) => art.isFeatured);
}

export function getCareerArticleBySlug(slug: string): CareerArticle | undefined {
  return CAREER_ARTICLES.find((art) => art.slug === slug);
}

export function getCareerCategories(): CareerCategory[] {
  return CAREER_CATEGORIES;
}

export function getTrendingIndustries(): CareerTrendingIndustry[] {
  return TRENDING_INDUSTRIES;
}
