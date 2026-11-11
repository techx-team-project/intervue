import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';

class TopCvServiceGrid extends StatelessWidget {
  const TopCvServiceGrid({required this.onServiceTap, super.key});

  final ValueChanged<String> onServiceTap;

  static const List<_ServiceItem> _services = [
    _ServiceItem(
      title: 'Tạo CV',
      icon: Icons.description_outlined,
      iconColor: Color(0xFF00B14F),
      bgColor: Color(0xFFECFDF5),
    ),
    _ServiceItem(
      title: 'AI Chấm CV',
      icon: Icons.document_scanner_outlined,
      iconColor: Color(0xFF0284C7),
      bgColor: Color(0xFFE0F2FE),
      isAi: true,
    ),
    _ServiceItem(
      title: 'AI Phỏng Vấn',
      icon: Icons.smart_toy_outlined,
      iconColor: Color(0xFF8B5CF6),
      bgColor: Color(0xFFF3E8FF),
      isAi: true,
    ),
    _ServiceItem(
      title: 'Việc làm IT',
      icon: Icons.code_rounded,
      iconColor: Color(0xFF0F172A),
      bgColor: Color(0xFFF1F5F9),
    ),
    _ServiceItem(
      title: 'Gross - Net',
      icon: Icons.calculate_outlined,
      iconColor: Color(0xFF059669),
      bgColor: Color(0xFFECFDF5),
    ),
    _ServiceItem(
      title: 'Top Công Ty',
      icon: Icons.apartment_rounded,
      iconColor: Color(0xFFD97706),
      bgColor: Color(0xFFFEF3C7),
    ),
    _ServiceItem(
      title: 'Test MBTI',
      icon: Icons.psychology_outlined,
      iconColor: Color(0xFF9333EA),
      bgColor: Color(0xFFFAF5FF),
    ),
    _ServiceItem(
      title: 'Bật tìm việc',
      icon: Icons.bolt_rounded,
      iconColor: Color(0xFFE11D48),
      bgColor: Color(0xFFFFF1F2),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return LiquidGlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      borderRadius: 18,
      blur: 16,
      backgroundColor: Colors.white.withValues(alpha: 0.78),
      borderColor: Colors.white.withValues(alpha: 0.9),
      hasSheen: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.grid_view_rounded,
                      size: 18,
                      color: AppColors.primary,
                    ),
                    SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Tiện ích thông minh InterVue',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => onServiceTap('Tất cả tiện ích'),
                child: const Text(
                  'Xem tất cả',
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Row 1 (4 Equal Blocks)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (int i = 0; i < 4; i++)
                Expanded(child: _buildServiceItem(_services[i])),
            ],
          ),

          const SizedBox(height: 14),

          // Row 2 (4 Equal Blocks)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (int i = 4; i < 8; i++)
                Expanded(child: _buildServiceItem(_services[i])),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildServiceItem(_ServiceItem service) {
    return InkWell(
      onTap: () => onServiceTap(service.title),
      borderRadius: BorderRadius.circular(14),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: service.bgColor.withValues(alpha: 0.85),
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.9),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: service.iconColor.withValues(alpha: 0.15),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Icon(service.icon, color: service.iconColor, size: 24),
                ),
                if (service.isAi)
                  Positioned(
                    top: -4,
                    right: -6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 5,
                        vertical: 1.5,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF10B981), Color(0xFF059669)],
                        ),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: Colors.white, width: 1.0),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF059669)
                                .withValues(alpha: 0.3),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Text(
                        'AI',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 8.5,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 7),
            Text(
              service.title,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ServiceItem {
  const _ServiceItem({
    required this.title,
    required this.icon,
    required this.iconColor,
    required this.bgColor,
    this.isAi = false,
  });

  final String title;
  final IconData icon;
  final Color iconColor;
  final Color bgColor;
  final bool isAi;
}
