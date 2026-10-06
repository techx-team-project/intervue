import type { CandidateProfile } from '@/types/candidate';

export const MOCK_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-883921',
  fullName: 'Nguyễn Hoàng Nam',
  title: 'Senior Fullstack Engineer & AI Solutions Architect',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  email: 'nam.nguyen.tech@gmail.com',
  phone: '0988 123 456',
  location: 'Cầu Giấy, TP. Hà Nội',
  birthYear: 1996,
  gender: 'Nam',
  status: 'actively_looking',
  bio: 'Kỹ sư phần mềm 6+ năm kinh nghiệm phát triển kiến trúc hệ thống phân tán chịu tải cao (High-Concurrency SaaS) và tích hợp các mô hình AI/LLM vào quy trình tự động hóa nghiệp vụ. Đam mê xây dựng trải nghiệm người dùng hiện đại, tối ưu hóa hiệu năng Core Web Vitals và áp dụng văn hóa CI/CD, Microservices bền vững.',
  links: {
    github: 'https://github.com/namnguyen-dev',
    linkedin: 'https://linkedin.com/in/namnguyen-engineer',
    portfolio: 'https://namnguyen.tech',
  },
  aiScore: {
    overallScore: 94,
    atsReadiness: 96,
    starScore: 92,
    mockInterviewCount: 16,
    averageInterviewScore: 9.3,
    topRankPercentile: 5,
    highlightStrengths: [
      'Tư duy thiết kế kiến trúc hệ thống Microservices & Clean Architecture rất vững chắc',
      'Nắm vững phương pháp trả lời STAR, diễn đạt mạch lạc các bài toán xử lý sự cố thực tế',
      'Kinh nghiệm thực chiến với Next.js 15, Spring Boot 3, Redis Cache và Vector Database',
    ],
    suggestedImprovements: [
      'Nâng cao thêm phần phân tích đánh đổi chi phí khi thiết kế cụm Kubernetes đa vùng (Multi-Region)',
      'Bổ sung thêm các ví dụ thực tế về tối ưu hóa chi phí token LLM khi scale cho hàng triệu người dùng',
    ],
  },
  preferences: {
    desiredRole: 'Senior Fullstack Engineer / Tech Lead',
    desiredSalary: '45,000,000 - 65,000,000 VNĐ / tháng',
    workMode: 'Hybrid',
    jobType: 'Toàn thời gian',
    desiredLocation: ['Hà Nội', 'TP. Hồ Chí Minh', 'Làm việc từ xa (Remote)'],
    level: 'Senior / Lead',
    industries: ['Công nghệ thông tin', 'Fintech', 'AI / EdTech', 'Thương mại điện tử'],
  },
  skills: [
    // Core Tech
    { name: 'TypeScript / JavaScript', level: 'Chuyên gia', years: 6, category: 'core' },
    { name: 'React & Next.js 15', level: 'Chuyên gia', years: 5, category: 'core' },
    { name: 'Node.js & Express / NestJS', level: 'Thành thạo', years: 5, category: 'core' },
    { name: 'Java & Spring Boot 3', level: 'Thành thạo', years: 4, category: 'core' },
    { name: 'MySQL & PostgreSQL', level: 'Thành thạo', years: 6, category: 'core' },
    { name: 'Redis Cache & Pub/Sub', level: 'Thành thạo', years: 4, category: 'core' },
    { name: 'Docker & Kubernetes', level: 'Khá', years: 3, category: 'core' },
    { name: 'Tailwind CSS & Design Systems', level: 'Chuyên gia', years: 5, category: 'core' },

    // AI & Data
    { name: 'OpenAI API & Anthropic Claude', level: 'Thành thạo', years: 2, category: 'ai' },
    { name: 'LangChain & LlamaIndex', level: 'Khá', years: 2, category: 'ai' },
    { name: 'Vector DB (Pinecone, Qdrant)', level: 'Khá', years: 2, category: 'ai' },
    { name: 'RAG Architecture Implementation', level: 'Thành thạo', years: 2, category: 'ai' },

    // Tools & DevOps
    { name: 'Git & GitHub Actions CI/CD', level: 'Chuyên gia', years: 6, category: 'tool' },
    { name: 'AWS (S3, EC2, CloudFront, RDS)', level: 'Thành thạo', years: 4, category: 'tool' },
    { name: 'Kafka & RabbitMQ', level: 'Khá', years: 3, category: 'tool' },

    // Soft Skills
    { name: 'Lãnh đạo kỹ thuật (Tech Lead)', level: 'Thành thạo', years: 3, category: 'soft' },
    { name: 'Quản lý dự án Agile / Scrum', level: 'Thành thạo', years: 4, category: 'soft' },
    { name: 'Giao tiếp & Phản biện kỹ thuật', level: 'Chuyên gia', years: 6, category: 'soft' },
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Senior Fullstack Engineer & Team Lead',
      company: 'TechX Digital Solutions JSC',
      companyLogo: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/default.png',
      location: 'Hà Nội, Việt Nam',
      startDate: '03/2023',
      endDate: 'Hiện tại',
      isCurrent: true,
      description:
        'Chịu trách nhiệm kiến trúc kỹ thuật và dẫn dắt đội ngũ kỹ sư 8 thành viên phát triển nền tảng tuyển dụng thông minh ứng dụng Generative AI phục vụ hơn 500,000 người dùng hàng tháng.',
      achievements: [
        'Thiết kế và triển khai hệ thống gợi ý việc làm thông minh dựa trên AI vector embeddings, giúp tăng tỷ lệ nộp đơn thành công thêm 34%.',
        'Tái cấu trúc giao diện ứng dụng từ SPA sang Server Components (Next.js 14+), giảm thời gian First Contentful Paint (FCP) từ 2.4s xuống 0.8s.',
        'Thiết lập pipeline CI/CD tự động hóa kiểm thử và kiểm tra mã nguồn, giảm thời gian phát hành phiên bản từ 4 giờ xuống còn 20 phút.',
        'Đạt giải thưởng "Kỹ sư xuất sắc nhất năm 2024" của khối kỹ thuật TechX.',
      ],
      skills: ['Next.js', 'TypeScript', 'Node.js', 'Spring Boot', 'Redis', 'Docker', 'OpenAI'],
    },
    {
      id: 'exp-2',
      role: 'Fullstack Software Engineer',
      company: 'VNG Corporation',
      companyLogo: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/default.png',
      location: 'TP. Hồ Chí Minh',
      startDate: '08/2020',
      endDate: '02/2023',
      isCurrent: false,
      description:
        'Tham gia phát triển hệ thống quản lý thanh toán và cổng đối tác cho nền tảng ZaloPay. Làm việc trực tiếp với các luồng giao dịch tài chính yêu cầu tính nhất quán (ACID) cao.',
      achievements: [
        'Xây dựng các API xử lý giao dịch thời gian thực với độ trễ P99 < 80ms, xử lý tải cao điểm lên tới 12,000 requests/giây.',
        'Phát triển dashboard phân tích số liệu tài chính cho đối tác doanh nghiệp bằng React và Recharts, hỗ trợ xuất báo cáo triệu dòng chỉ trong vài giây.',
        'Tối ưu hóa các câu truy vấn cơ sở dữ liệu quan hệ, giảm 40% tải CPU trên cụm cơ sở dữ liệu sản xuất.',
      ],
      skills: ['React', 'Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis', 'Kubernetes'],
    },
    {
      id: 'exp-3',
      role: 'Frontend Developer',
      company: 'FPT Software',
      companyLogo: 'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/default.png',
      location: 'Hà Nội, Việt Nam',
      startDate: '06/2018',
      endDate: '07/2020',
      isCurrent: false,
      description:
        'Phát triển các module giao diện người dùng cho các hệ thống ngân hàng số và thương mại điện tử phục vụ khách hàng thị trường Nhật Bản và Singapore.',
      achievements: [
        'Hoàn thành xuất sắc 4 dự án bàn giao đúng tiến độ, nhận đánh giá 100% CSAT (Customer Satisfaction Score) từ đối tác khách hàng.',
        'Xây dựng thư viện UI Component dùng chung (UI Library) giúp tiết kiệm 25% thời gian phát triển giao diện cho 3 nhóm dự án nội bộ.',
      ],
      skills: ['JavaScript', 'React', 'Redux', 'HTML5/SCSS', 'Webpack', 'Jest'],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'Đại học Bách Khoa Hà Nội (HUST)',
      degree: 'Kỹ sư Kỹ thuật Phần mềm (Software Engineering)',
      major: 'Công nghệ Thông tin & Truyền thông',
      startDate: '2014',
      endDate: '2019',
      gpa: '3.62 / 4.0 (Tốt nghiệp loại Giỏi)',
      achievements: [
        'Học bổng Khuyến khích học tập 6 kỳ liên tiếp',
        'Giải Ba cuộc thi Sinh viên Nghiên cứu Khoa học cấp Viện CNTT năm 2018',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'InterVue AI Mock Interview Engine',
      role: 'Lead Architect & Core Developer',
      startDate: '01/2024',
      endDate: 'Hiện tại',
      description:
        'Hệ sinh thái luyện phỏng vấn kỹ thuật trực tiếp với trợ lý ảo AI qua âm thanh và hình ảnh, ứng dụng kỹ thuật đánh giá phương pháp STAR và trích xuất điểm mạnh yếu ngay sau buổi phỏng vấn.',
      highlights: [
        'Xây dựng luồng streaming âm thanh độ trễ thấp < 350ms sử dụng WebSockets và Whisper API.',
        'Hơn 85,000 lượt phỏng vấn thử nghiệm được hoàn thành với tỷ lệ hài lòng 96.8%.',
      ],
      technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'OpenAI Realtime API', 'Tailwind CSS', 'Redis'],
      githubUrl: 'https://github.com/namnguyen-dev/intervue-engine',
      demoUrl: 'https://intervue.vn',
    },
    {
      id: 'proj-2',
      name: 'OmniFlow - High Concurrency Task Orchestrator',
      role: 'Creator & Maintainer',
      startDate: '06/2023',
      endDate: '12/2023',
      description:
        'Dự án mã nguồn mở hỗ trợ lập lịch và phân phối tác vụ nền (Distributed Background Jobs) cho các ứng dụng Node.js & Go quy mô lớn.',
      highlights: [
        'Đạt hơn 1,200 sao (Stars) trên GitHub và được tích hợp bởi hơn 20 công ty công nghệ tại Việt Nam.',
        'Hỗ trợ failover tự động và dead-letter queue với giao diện web giám sát trực quan.',
      ],
      technologies: ['TypeScript', 'Node.js', 'Redis', 'Docker', 'React', 'Prometheus'],
      githubUrl: 'https://github.com/namnguyen-dev/omniflow',
      demoUrl: 'https://omniflow-demo.dev',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issuerLogo: 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8860-0d739f25d9e9/image.png',
      issueDate: '10/2023 - 10/2026',
      credentialId: 'AWS-ASA-9948123',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta (Coursera)',
      issuerLogo: 'https://images.credly.com/size/340x340/images/37628205-d601-4475-b6d3-9bc253100650/image.png',
      issueDate: '04/2022',
      credentialId: 'META-FED-88401',
      credentialUrl: 'https://coursera.org/verify/META-FED-88401',
    },
  ],
  languages: [
    { name: 'Tiếng Việt', proficiency: 'Bản ngữ (Native)' },
    { name: 'Tiếng Anh', proficiency: 'Thành thạo công việc (Professional)', certificate: 'IELTS 7.5' },
  ],
  resumes: [
    {
      id: 'cv-1',
      fileName: 'Nguyen-Hoang-Nam-Senior-Fullstack-ATS.pdf',
      fileSize: '348 KB',
      uploadedAt: '15/09/2026',
      isDefault: true,
      atsScore: 96,
      downloadUrl: '#',
    },
    {
      id: 'cv-2',
      fileName: 'Nguyen-Hoang-Nam-AI-Solutions-CV-EN.pdf',
      fileSize: '412 KB',
      uploadedAt: '28/08/2026',
      isDefault: false,
      atsScore: 93,
      downloadUrl: '#',
    },
  ],
  stats: {
    profileViewsThisWeek: 168,
    recruiterSearches: 432,
    interviewInvites: 8,
    savedByRecruiters: 24,
  },
};
