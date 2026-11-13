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
    readTime: '${post.readTimeMinutes} min read',
    viewCount: '${Formatters.compactCount(post.viewsCount)} views',
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
      industry: 'Information Technology',
      jobCount: 128,
      avatarText: 'FPT',
      logoBgColorHex: 0xFFFF6600,
      verified: true,
      badge: 'Gold Partner',
    ),
    const TopCvCompany(
      name: 'Viettel Telecom',
      industry: 'Telecom & IT',
      jobCount: 86,
      avatarText: 'VTL',
      logoBgColorHex: 0xFFED1C24,
      verified: true,
      badge: 'Top Employer',
    ),
    const TopCvCompany(
      name: 'Techcombank',
      industry: 'Banking & Finance',
      jobCount: 64,
      avatarText: 'TCB',
      logoBgColorHex: 0xFFDA251D,
      verified: true,
      badge: 'Top Workplace',
    ),
    const TopCvCompany(
      name: 'Vingroup',
      industry: 'Multi-industry Group',
      jobCount: 95,
      avatarText: 'VIN',
      logoBgColorHex: 0xFF104E8B,
      verified: true,
      badge: 'Top Employer',
    ),
    const TopCvCompany(
      name: 'MoMo (Fintech)',
      industry: 'Fintech',
      jobCount: 42,
      avatarText: 'MoMo',
      logoBgColorHex: 0xFFA50064,
      verified: true,
      badge: 'Tech Unicorn',
    ),
    const TopCvCompany(
      name: 'Shopee Vietnam',
      industry: 'E-commerce',
      jobCount: 73,
      avatarText: 'SHO',
      logoBgColorHex: 0xFFEE4D2D,
      verified: true,
      badge: 'Leading brand',
    ),
  ];

  static final List<TopCvArticle> careerArticles = [
    const TopCvArticle(
      title: '5 golden rules for an ATS-ready CV that wins recruiters in 6 seconds',
      category: 'CV writing tips',
      readTime: '4 min read',
      viewCount: '45.2K views',
    ),
    const TopCvArticle(
      title: 'How to negotiate your salary with confidence and gain 20-35% in a new job',
      category: 'Interview skills',
      readTime: '6 min read',
      viewCount: '38.6K views',
    ),
    const TopCvArticle(
      title:
          'Vietnam IT market report 2025: AI & Cloud engineer salaries surge',
      category: 'Market trends',
      readTime: '7 min read',
      viewCount: '62.1K views',
    ),
    const TopCvArticle(
      title: 'Top 10 most common behavioral interview questions (STAR method)',
      category: 'Career handbook',
      readTime: '5 min read',
      viewCount: '29.4K views',
    ),
  ];

  static List<JobEntity> getSampleJobs() {
    final now = DateTime.now();
    return [
      JobEntity(
        id: 'mock-1',
        title: 'Senior Mobile Flutter Developer (Clean Architecture / BLoC)',
        companyName: 'Vietnam Payment Solution Joint Stock Company (VNPAY)',
        displaySalary: '25 - 45M VND',
        location: 'Cau Giay, Hanoi',
        deadline: now.add(const Duration(days: 14)),
        experience: '3 - 5 years',
        isHot: true,
        isUrgent: true,
        jobLevel: 'Senior / Lead',
        companyScale: '1000+ employees',
        tags: const [
          'Flutter',
          'Dart',
          'BLoC',
          'Fintech',
          'Clean Architecture',
        ],
        description: 'Responsible for the architecture and development of payment features and utilities in the VNPAY mobile app serving millions of daily active users.',
        requirements: 'At least 3 years of experience with Flutter & Dart. Solid knowledge of state management (BLoC/Cubit), REST API, WebSocket and performance profiling.',
        benefits: 'Project bonus and 13th-15th month salary. Premium health insurance. Annual company trip.',
      ),
      JobEntity(
        id: 'mock-2',
        title: 'Digital Marketing & Performance Specialist (Growth Ads)',
        companyName: 'Shopee Vietnam',
        displaySalary: '18 - 30M VND',
        location: 'District 1, Ho Chi Minh City',
        deadline: now.add(const Duration(days: 9)),
        experience: '2 years of experience',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Specialist',
        companyScale: '2000+ employees',
        tags: const [
          'Marketing',
          'Facebook Ads',
          'Google Ads',
          'TikTok Ads',
          'E-commerce',
        ],
        description: 'Plan and directly optimize the budget of multi-channel ad campaigns (Meta, Google, TikTok) for mega-sale days.',
        requirements: 'Experience managing budgets of 200M VND per month or more. Sharp data analysis skills and proficiency with Google Analytics and Looker Studio.',
        benefits: 'Dynamic, international Tech Hub work environment. Free lunch and unlimited snacks.',
      ),
      JobEntity(
        id: 'mock-3',
        title: 'Backend Software Engineer (Java Spring Boot / Microservices)',
        companyName: 'FPT Software',
        displaySalary: '22 - 40M VND',
        location: 'Hoa Lac Hi-Tech Park, Hanoi',
        deadline: now.add(const Duration(days: 20)),
        experience: '2 - 4 years',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Specialist',
        companyScale: '30,000+ employees',
        tags: const [
          'Java',
          'Spring Boot',
          'PostgreSQL',
          'Docker',
          'Kubernetes',
        ],
        description: 'Help build the microservices backend platform for Fortune 500 customers in Japan and North America.',
        requirements: 'Proficient in Java 17+, Spring Framework and JPA/Hibernate. Knowledge of message queues (Kafka/RabbitMQ) and distributed architecture.',
        benefits: 'Onsite opportunities in Japan, the US and Europe. High-spec laptop provided and city shuttle support.',
      ),
      JobEntity(
        id: 'mock-4',
        title: 'Corporate Relationship Manager (Corporate RM)',
        companyName: 'Vietnam Technological and Commercial Joint Stock Bank (Techcombank)',
        displaySalary: '18 - 35M VND',
        location: 'Hoan Kiem District, Hanoi',
        deadline: now.add(const Duration(days: 5)),
        experience: '1 - 3 years',
        isHot: false,
        isUrgent: true,
        jobLevel: 'Specialist',
        companyScale: '10,000+ employees',
        tags: const ['Banking', 'Credit', 'Finance', 'Sales', 'B2B'],
        description: 'Find, advise and provide comprehensive financial solutions (credit, guarantees, trade finance) for medium and large enterprises.',
        requirements: 'University degree in Finance - Banking or Economics. Excellent communication and persuasion skills.',
        benefits: 'Uncapped performance-based sales income. Clear career path to Head of Customer Relations.',
      ),
      JobEntity(
        id: 'mock-5',
        title: 'General Accountant (Conversational English)',
        companyName: 'Vingroup (VinFast)',
        displaySalary: '15 - 22M VND',
        location: 'Gia Lam, Hanoi',
        deadline: now.add(const Duration(days: 12)),
        experience: '2 years',
        isHot: false,
        isUrgent: false,
        jobLevel: 'Full-time staff',
        companyScale: '5000+ employees',
        tags: const ['Accounting', 'Tax reporting', 'SAP', 'Excel', 'English'],
        description: 'Handle cost accounting, reconcile figures, and prepare periodic financial and tax reports under VAS standards.',
        requirements: 'General accountant or chief accountant certificate. Proficient with ERP/SAP software and advanced Excel.',
        benefits: 'Preferential policies for buying Vinhomes properties and VinFast cars. Comprehensive Bao Viet insurance.',
      ),
      JobEntity(
        id: 'mock-6',
        title: 'Data Analyst / BI Specialist (Looker / Python / SQL)',
        companyName: 'M_Service Joint Stock Company (MoMo)',
        displaySalary: '20 - 36M VND',
        location: 'District 7, Ho Chi Minh City',
        deadline: now.add(const Duration(days: 18)),
        experience: '2 - 3 years',
        isHot: true,
        isUrgent: false,
        jobLevel: 'Specialist',
        companyScale: '1500+ employees',
        tags: const ['SQL', 'Python', 'Tableau', 'PowerBI', 'Fintech'],
        description: 'Build dashboards that visualize user behavior and work with Product Managers to make data-driven decisions.',
        requirements: 'Skilled at writing complex SQL queries and optimizing queries on BigQuery. Knowledge of statistics and user segmentation models.',
        benefits: 'Open, young work environment. Lunch allowance and regular team building.',
      ),
      JobEntity(
        id: 'mock-7',
        title: 'Frontend ReactJS / Next.js Developer (Hybrid / Remote)',
        companyName: 'One Mount Group',
        displaySalary: '18 - 32M VND',
        location: 'Remote',
        deadline: now.add(const Duration(days: 7)),
        experience: '1 - 3 years',
        isHot: false,
        isUrgent: true,
        jobLevel: 'Junior / Middle',
        companyScale: '1000+ employees',
        tags: const [
          'ReactJS',
          'Next.js',
          'TypeScript',
          'TailwindCSS',
          'Remote',
        ],
        description: 'Develop a modern web portal UI and optimize SEO and Core Web Vitals for the VinID & VinShop ecosystem.',
        requirements: 'Proficient in ReactJS, Next.js (App Router), TypeScript and modern CSS. Self-managed working skills for remote work.',
        benefits: 'Flexible working mode (remote or hybrid). Salary reviews twice a year.',
      ),
      JobEntity(
        id: 'mock-8',
        title: 'Software Developer Intern (Paid Fresher / Intern)',
        companyName: 'Viettel Business Solutions Corporation (VTS)',
        displaySalary: '7 - 12M VND',
        location: 'Thanh Xuan, Hanoi',
        deadline: now.add(const Duration(days: 25)),
        experience: 'No experience yet',
        isHot: false,
        isUrgent: false,
        jobLevel: 'Intern / Fresher',
        companyScale: '5000+ employees',
        tags: const ['Fresher', 'Intern', 'Java', 'Python', 'Paid training'],
        description: 'Structured training from Viettel technology experts on real projects. A chance to sign a full-time contract after 3 months.',
        requirements: 'Final-year student or recent graduate in IT or Electronics and Telecommunications. Strong algorithmic foundation and logical thinking.',
        benefits: 'Monthly training allowance. Internship certificate and priority for full-time hiring.',
      ),
    ];
  }
}
