import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';

class TopCvCompany {
  const TopCvCompany({
    this.id,
    required this.name,
    required this.industry,
    required this.jobCount,
    required this.avatarText,
    required this.logoBgColorHex,
    required this.verified,
    this.badge = 'Top Employer',
  });

  final int? id;
  final String name;
  final String industry;
  final int jobCount;
  final String avatarText;
  final int logoBgColorHex;
  final bool verified;
  final String badge;
}

class TopCvArticle {
  const TopCvArticle({
    required this.title,
    required this.category,
    required this.readTime,
    required this.viewCount,
    this.categorySlug,
    this.slug,
  });

  factory TopCvArticle.fromBlogPost(BlogPost post) => TopCvArticle(
    title: post.title,
    categorySlug: post.categorySlug,
    slug: post.slug,
    category: post.categoryName,
    readTime: '${post.readTimeMinutes} phút',
    viewCount: '${Formatters.compactCount(post.viewsCount)} lượt xem',
  );

  final String title;
  final String category;
  final String readTime;
  final String viewCount;
  final String? categorySlug;
  final String? slug;
}

abstract final class TopCvMockData {
  static final List<TopCvCompany> featuredCompanies = [
    const TopCvCompany(
      name: 'FPT Software',
      industry: 'Công nghệ thông tin',
      jobCount: 128,
      avatarText: 'FPT',
      logoBgColorHex: 0xFFFF6600,
      verified: true,
      badge: 'Đối tác Vàng',
    ),
    const TopCvCompany(
      name: 'Viettel Telecom',
      industry: 'Viễn thông & CNTT',
      jobCount: 86,
      avatarText: 'VTL',
      logoBgColorHex: 0xFFED1C24,
      verified: true,
      badge: 'Top Employer',
    ),
    const TopCvCompany(
      name: 'Techcombank',
      industry: 'Ngân hàng & Tài chính',
      jobCount: 64,
      avatarText: 'TCB',
      logoBgColorHex: 0xFFDA251D,
      verified: true,
      badge: 'Top Nơi làm việc',
    ),
    const TopCvCompany(
      name: 'Vingroup',
      industry: 'Tập đoàn Đa ngành',
      jobCount: 95,
      avatarText: 'VIN',
      logoBgColorHex: 0xFF104E8B,
      verified: true,
      badge: 'Top Employer',
    ),
    const TopCvCompany(
      name: 'MoMo (Fintech)',
      industry: 'Tài chính Công nghệ',
      jobCount: 42,
      avatarText: 'MoMo',
      logoBgColorHex: 0xFFA50064,
      verified: true,
      badge: 'Kỳ Lân Công Nghệ',
    ),
    const TopCvCompany(
      name: 'Shopee Việt Nam',
      industry: 'Thương mại điện tử',
      jobCount: 73,
      avatarText: 'SHO',
      logoBgColorHex: 0xFFEE4D2D,
      verified: true,
      badge: 'Thương hiệu hàng đầu',
    ),
  ];

  static final List<TopCvArticle> careerArticles = [
    const TopCvArticle(
      title:
          '5 quy tắc vàng viết CV chuẩn ATS chinh phục nhà tuyển dụng trong 6s',
      category: 'Bí kíp viết CV',
      readTime: '4 phút',
      viewCount: '45.2K lượt xem',
    ),
    const TopCvArticle(
      title:
          'Cách đàm phán (Deal lương) tự tin, tăng 20-35% khi chuyển việc mới',
      category: 'Kỹ năng phỏng vấn',
      readTime: '6 phút',
      viewCount: '38.6K lượt xem',
    ),
    const TopCvArticle(
      title:
          'Báo cáo thị trường IT Việt Nam 2025: Lương kỹ sư AI & Cloud bứt phá',
      category: 'Xu hướng thị trường',
      readTime: '7 phút',
      viewCount: '62.1K lượt xem',
    ),
    const TopCvArticle(
      title: 'Top 10 câu hỏi phỏng vấn hành vi (STAR Method) hay gặp nhất',
      category: 'Cẩm nang nghề',
      readTime: '5 phút',
      viewCount: '29.4K lượt xem',
    ),
  ];

  static List<JobEntity> getSampleJobs() {
    final now = DateTime.now();
    return [
      JobEntity(
        id: 'mock-1',
        title: 'Senior Mobile Flutter Developer (Clean Architecture / BLoC)',
        companyName: 'Công Ty Cổ Phần Giải Pháp Thanh Toán Việt Nam (VNPAY)',
        displaySalary: '25 - 45 triệu',
        location: 'Cầu Giấy, Hà Nội',
        deadline: now.add(const Duration(days: 14)),
        experience: '3 - 5 năm',
        isHot: true,
        isUrgent: true,
        jobLevel: 'Senior / Lead',
        companyScale: '1000+ nhân viên',
        tags: const [
          'Flutter',
          'Dart',
          'BLoC',
          'Fintech',
          'Clean Architecture',
        ],
        description: 'Chịu trách nhiệm kiến trúc và phát triển các tính năng thanh toán & tiện ích trên ứng dụng mobile VNPAY phục vụ hàng triệu người dùng hoạt động mỗi ngày.',
        requirements: 'Ít nhất 3 năm kinh nghiệm với Flutter & Dart. Nắm vững State Management (BLoC/Cubit), REST API, Websocket, Performance profiling.',
        benefits: 'Thưởng dự án và tháng lương 13-15. Gói bảo hiểm sức khỏe cao cấp. Du lịch nghỉ mát hằng năm cùng công ty.',
      ),
      JobEntity(
        id: 'mock-2',
        title: 'Chuyên Viên Digital Marketing & Performance (Growth Ads)',
        companyName: 'Shopee Việt Nam',
        displaySalary: '18 - 30 triệu',
        location: 'Quận 1, TP. Hồ Chí Minh',
        deadline: now.add(const Duration(days: 9)),
        experience: '2 năm kinh nghiệm',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Chuyên viên',
        companyScale: '2000+ nhân viên',
        tags: const [
          'Marketing',
          'Facebook Ads',
          'Google Ads',
          'TikTok Ads',
          'E-commerce',
        ],
        description: 'Lên kế hoạch và trực tiếp tối ưu hóa ngân sách các chiến dịch quảng cáo đa kênh (Meta, Google, TikTok) cho các ngày siêu sale.',
        requirements: 'Có kinh nghiệm quản lý ngân sách lớn từ 200 triệu/tháng. Kỹ năng phân tích số liệu nhạy bén, sử dụng thành thạo Google Analytics, Looker Studio.',
        benefits: 'Môi trường làm việc năng động chuẩn Tech Hub quốc tế. Ăn trưa miễn phí, đồ ăn nhẹ không giới hạn.',
      ),
      JobEntity(
        id: 'mock-3',
        title: 'Backend Software Engineer (Java Spring Boot / Microservices)',
        companyName: 'FPT Software',
        displaySalary: '22 - 40 triệu',
        location: 'Khu CNC Hòa Lạc, Hà Nội',
        deadline: now.add(const Duration(days: 20)),
        experience: '2 - 4 năm',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Chuyên viên',
        companyScale: '30.000+ nhân viên',
        tags: const [
          'Java',
          'Spring Boot',
          'PostgreSQL',
          'Docker',
          'Kubernetes',
        ],
        description: 'Tham gia xây dựng nền tảng backend microservices phục vụ khách hàng Fortune 500 tại thị trường Nhật Bản và Bắc Mỹ.',
        requirements: 'Thành thạo Java 17+, Spring Framework, JPA/Hibernate. Hiểu biết về Message Queue (Kafka/RabbitMQ) và kiến trúc phân tán.',
        benefits: 'Cơ hội onsite Nhật Bản, Mỹ, Châu Âu. Được cấp laptop cấu hình cao, hỗ trợ xe đưa đón nội thành.',
      ),
      JobEntity(
        id: 'mock-4',
        title: 'Chuyên Viên Quản Lý Khách Hàng Doanh Nghiệp (Corporate RM)',
        companyName: 'Ngân Hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
        displaySalary: '18 - 35 triệu',
        location: 'Quận Hoàn Kiếm, Hà Nội',
        deadline: now.add(const Duration(days: 5)),
        experience: '1 - 3 năm',
        isHot: false,
        isUrgent: true,
        jobLevel: 'Chuyên viên',
        companyScale: '10.000+ nhân viên',
        tags: const ['Ngân hàng', 'Tín dụng', 'Tài chính', 'Bán hàng', 'B2B'],
        description: 'Tìm kiếm, tư vấn và cung cấp các giải pháp tài chính toàn diện (tín dụng, bảo lãnh, tài trợ thương mại) cho doanh nghiệp vừa và lớn.',
        requirements: 'Tốt nghiệp đại học chuyên ngành Tài chính - Ngân hàng, Kinh tế. Kỹ năng giao tiếp và thuyết phục xuất sắc.',
        benefits: 'Lương kinh doanh không giới hạn theo năng lực. Lộ trình thăng tiến rõ ràng lên Giám đốc Quan hệ khách hàng.',
      ),
      JobEntity(
        id: 'mock-5',
        title: 'Kế Toán Tổng Hợp Doanh Nghiệp (Tiếng Anh Giao Tiếp)',
        companyName: 'Tập Đoàn Vingroup (VinFast)',
        displaySalary: '15 - 22 triệu',
        location: 'Gia Lâm, Hà Nội',
        deadline: now.add(const Duration(days: 12)),
        experience: '2 năm',
        isHot: false,
        isUrgent: false,
        jobLevel: 'Nhân viên chính thức',
        companyScale: '5000+ nhân viên',
        tags: const ['Kế toán', 'Báo cáo thuế', 'SAP', 'Excel', 'Tiếng Anh'],
        description: 'Thực hiện hạch toán chi phí, kiểm tra đối chiếu số liệu, lập báo cáo tài chính và báo cáo thuế định kỳ theo chuẩn mực VAS.',
        requirements: 'Có chứng chỉ kế toán tổng hợp hoặc kế toán trưởng. Sử dụng thành thạo phần mềm ERP/SAP và Excel nâng cao.',
        benefits: 'Chính sách ưu đãi mua nhà Vinhomes, xe VinFast. Bảo hiểm Bảo Việt toàn diện.',
      ),
      JobEntity(
        id: 'mock-6',
        title: 'Data Analyst / BI Specialist (Looker / Python / SQL)',
        companyName: 'Công Ty Cổ Phần Dịch Vụ Di Động Trực Tuyến (MoMo)',
        displaySalary: '20 - 36 triệu',
        location: 'Quận 7, TP. Hồ Chí Minh',
        deadline: now.add(const Duration(days: 18)),
        experience: '2 - 3 năm',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Chuyên viên',
        companyScale: '1500+ nhân viên',
        tags: const ['SQL', 'Python', 'Tableau', 'PowerBI', 'Fintech'],
        description: 'Xây dựng các dashboard trực quan hóa hành vi người dùng, phối hợp cùng Product Manager để đưa ra quyết định dựa trên dữ liệu (Data-driven).',
        requirements: 'Kỹ năng viết truy vấn SQL phức tạp, tối ưu query trên BigQuery. Có kiến thức thống kê và mô hình phân khúc người dùng.',
        benefits: 'Môi trường làm việc mở, trẻ trung. Trợ cấp ăn trưa, teambuilding định kỳ.',
      ),
      JobEntity(
        id: 'mock-7',
        title: 'Frontend ReactJS / Next.js Developer (Hybrid / Remote)',
        companyName: 'One Mount Group',
        displaySalary: '18 - 32 triệu',
        location: 'Làm việc từ xa (Remote)',
        deadline: now.add(const Duration(days: 7)),
        experience: '1 - 3 năm',
        isHot: false,
        isUrgent: true,
        jobLevel: 'Junior / Middle',
        companyScale: '1000+ nhân viên',
        tags: const [
          'ReactJS',
          'Next.js',
          'TypeScript',
          'TailwindCSS',
          'Remote',
        ],
        description: 'Phát triển giao diện web portal hiện đại, tối ưu SEO và Core Web Vitals cho hệ sinh thái VinID & VinShop.',
        requirements: 'Thành thạo ReactJS, Next.js (App router), TypeScript và CSS hiện đại. Kỹ năng tự chủ công việc khi làm việc từ xa.',
        benefits: 'Chế độ làm việc linh hoạt (Làm từ xa hoặc hybrid). Đánh giá lương 2 lần/năm.',
      ),
      JobEntity(
        id: 'mock-8',
        title: 'Thực Tập Sinh Lập Trình Lập Trình Viên (Fresher / Intern Có Lương)',
        companyName: 'Tổng Công Ty Giải Pháp Doanh Nghiệp Viettel (VTS)',
        displaySalary: '7 - 12 triệu',
        location: 'Thanh Xuân, Hà Nội',
        deadline: now.add(const Duration(days: 25)),
        experience: 'Chưa có kinh nghiệm',
        isHot: false,
        isUrgent: false,
        jobLevel: 'Thực tập sinh / Fresher',
        companyScale: '5000+ nhân viên',
        tags: const [
          'Fresher',
          'Intern',
          'Java',
          'Python',
          'Training có lương',
        ],
        description: 'Được đào tạo bài bản từ chuyên gia công nghệ Viettel theo mô hình dự án thực tế. Cơ hội ký hợp đồng chính thức sau 3 tháng.',
        requirements: 'Sinh viên năm cuối hoặc mới tốt nghiệp ngành CNTT/Điện tử viễn thông. Có nền tảng thuật toán và tư duy logic tốt.',
        benefits: 'Được nhận phụ cấp đào tạo hàng tháng. Cấp chứng chỉ thực tập và ưu tiên tuyển dụng chính thức.',
      ),
    ];
  }
}
