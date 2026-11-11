import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class TopCvBannerCarousel extends StatefulWidget {
  const TopCvBannerCarousel({this.onBannerTap, super.key});

  final ValueChanged<int>? onBannerTap;

  @override
  State<TopCvBannerCarousel> createState() => _TopCvBannerCarouselState();
}

class _TopCvBannerCarouselState extends State<TopCvBannerCarousel> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;

  final List<_BannerItem> _banners = const [
    _BannerItem(
      title: 'Top 100 Doanh Nghiệp IT\nĐược Yêu Thích 2026',
      subtitle: 'Khám phá văn hóa & cơ hội từ các tập đoàn công nghệ',
      ctaText: 'Khám phá ngay',
      gradient: [Color(0xFF064E24), Color(0xFF00B14F)],
      accentColor: AppColors.star,
      icon: Icons.emoji_events,
    ),
    _BannerItem(
      title: 'Bật Chế Độ Tìm Việc\nĐón Cơ Hội Vàng',
      subtitle: 'Tăng 300% cơ hội tiếp cận 320.000+ Nhà tuyển dụng',
      ctaText: 'Bật tìm việc ngay',
      gradient: [Color(0xFF0F766E), Color(0xFF059669)],
      accentColor: Color(0xFF5EEAD4),
      icon: Icons.rocket_launch,
    ),
    _BannerItem(
      title: 'InterVue Tech Fest\nViệc Làm IT Lương \$3,000',
      subtitle: 'Hơn 5.000 vị trí Software Engineer, Data & AI',
      ctaText: 'Xem việc IT ngay',
      gradient: [Color(0xFF064E24), Color(0xFF00B14F)],
      accentColor: AppColors.star,
      icon: Icons.code,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (!mounted) return;
      final nextPage = (_currentPage + 1) % _banners.length;
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 140,
          child: PageView.builder(
            controller: _pageController,
            itemCount: _banners.length,
            onPageChanged: (index) {
              setState(() => _currentPage = index);
            },
            itemBuilder: (context, index) {
              final banner = _banners[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: InkWell(
                  onTap: () => widget.onBannerTap?.call(index),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: banner.gradient,
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: banner.gradient.last.withValues(alpha: 0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Background decorative circle
                        Positioned(
                          right: -20,
                          bottom: -20,
                          child: Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                        ),

                        // Icon watermark
                        Positioned(
                          right: 16,
                          bottom: 12,
                          child: Icon(
                            banner.icon,
                            size: 72,
                            color: Colors.white.withValues(alpha: 0.16),
                          ),
                        ),

                        // Content
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    banner.title,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      height: 1.25,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    banner.subtitle,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      color: Colors.white.withValues(
                                        alpha: 0.9,
                                      ),
                                      fontSize: 11.5,
                                    ),
                                  ),
                                ],
                              ),

                              // CTA
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          banner.ctaText,
                                          style: TextStyle(
                                            color: banner.gradient.first,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Icon(
                                          Icons.arrow_forward,
                                          size: 12,
                                          color: banner.gradient.first,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 8),

        // Indicator Dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_banners.length, (index) {
            final isSelected = index == _currentPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              height: 5,
              width: isSelected ? 18 : 5,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.border,
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }
}

class _BannerItem {
  const _BannerItem({
    required this.title,
    required this.subtitle,
    required this.ctaText,
    required this.gradient,
    required this.accentColor,
    required this.icon,
  });

  final String title;
  final String subtitle;
  final String ctaText;
  final List<Color> gradient;
  final Color accentColor;
  final IconData icon;
}
