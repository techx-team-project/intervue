import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';

class TopCvMarketInsights extends StatelessWidget {
  const TopCvMarketInsights({this.onTap, super.key});

  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return LiquidGlassCard(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(13),
      borderRadius: 16,
      blur: 16,
      backgroundColor: Colors.white.withValues(alpha: 0.78),
      borderColor: Colors.white.withValues(alpha: 0.9),
      hasSheen: true,
      child: Column(
        children: [
          Row(
            children: [
              // Glowing Live Dot with outer halo
              Container(
                width: 9,
                height: 9,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.5),
                      blurRadius: 6,
                      spreadRadius: 1,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'The IT job market is buzzing today',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: onTap,
                child: const Row(
                  children: [
                    Text(
                      '2026 report',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                    Icon(
                      Icons.chevron_right,
                      size: 14,
                      color: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildStatItem(
                label: 'New jobs',
                value: '48.250+',
                color: AppColors.primary,
              ),
              Container(
                width: 1,
                height: 28,
                color: Colors.white.withValues(alpha: 0.8),
              ),
              _buildStatItem(
                label: 'Companies',
                value: '320.000+',
                color: AppColors.accentBlue,
              ),
              Container(
                width: 1,
                height: 28,
                color: Colors.white.withValues(alpha: 0.8),
              ),
              _buildStatItem(
                label: '24h response',
                value: '95%',
                color: AppColors.accentOrange,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required String label,
    required String value,
    required Color color,
  }) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 14.5,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
