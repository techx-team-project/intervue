import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class TopCvHeader extends StatelessWidget {
  const TopCvHeader({
    required this.selectedLocation,
    required this.onLocationChanged,
    required this.savedJobsCount,
    required this.unreadNotificationsCount,
    this.onSavedJobsTap,
    this.onNotificationsTap,
    this.onMenuTap,
    super.key,
  });

  final String selectedLocation;
  final ValueChanged<String> onLocationChanged;
  final int savedJobsCount;
  final int unreadNotificationsCount;
  final VoidCallback? onSavedJobsTap;
  final VoidCallback? onNotificationsTap;
  final VoidCallback? onMenuTap;

  static const List<String> availableLocations = [
    'Toàn quốc',
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Bình Dương',
    'Hải Phòng',
    'Cần Thơ',
    'Làm từ xa (Remote)',
  ];

  void _showLocationPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Chọn tỉnh / thành phố',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),
                const Divider(),
                Flexible(
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: availableLocations.length,
                    itemBuilder: (context, index) {
                      final loc = availableLocations[index];
                      final isSelected = loc == selectedLocation;
                      return ListTile(
                        leading: Icon(
                          loc == 'Toàn quốc'
                              ? Icons.public
                              : loc.contains('Remote')
                              ? Icons.laptop_mac
                              : Icons.location_on_outlined,
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.textSecondary,
                        ),
                        title: Text(
                          loc,
                          style: TextStyle(
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: isSelected
                                ? AppColors.primary
                                : AppColors.textPrimary,
                          ),
                        ),
                        trailing: isSelected
                            ? const Icon(
                                Icons.check_circle,
                                color: AppColors.primary,
                              )
                            : null,
                        onTap: () {
                          onLocationChanged(loc);
                          Navigator.pop(ctx);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.85),
            border: Border(
              bottom: BorderSide(
                color: Colors.white.withValues(alpha: 0.6),
                width: 1,
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF003820).withValues(alpha: 0.04),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
          child: Row(
            children: [
              // Liquid Glass Menu / Sidebar Trigger
              Container(
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.7),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.85),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  tooltip: 'Menu tính năng',
                  onPressed: onMenuTap,
                  visualDensity: VisualDensity.compact,
                  padding: const EdgeInsets.all(6),
                  constraints: const BoxConstraints(),
                  icon: const Icon(
                    Icons.menu_rounded,
                    color: AppColors.textPrimary,
                    size: 22,
                  ),
                ),
              ),

              // Brand Favicon Icon: InterVue Icon Mark
              Image.asset(
                'assets/images/intervue-icon.png',
                height: 30,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => const Icon(
                  Icons.auto_awesome_rounded,
                  color: AppColors.primary,
                  size: 26,
                ),
              ),

              const SizedBox(width: 10),

              // Frosted Glass Location Selector
              Expanded(
                child: InkWell(
                  onTap: () => _showLocationPicker(context),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.9),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.location_on,
                          size: 15,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            selectedLocation,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 2),
                        const Icon(
                          Icons.keyboard_arrow_down,
                          size: 16,
                          color: AppColors.textSecondary,
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 8),

              // Saved Jobs Action (Frosted Glass button)
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.7),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.85),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  tooltip: 'Việc làm đã lưu',
                  onPressed: onSavedJobsTap,
                  visualDensity: VisualDensity.compact,
                  padding: const EdgeInsets.all(7),
                  constraints: const BoxConstraints(),
                  icon: Badge(
                    isLabelVisible: savedJobsCount > 0,
                    label: Text('$savedJobsCount'),
                    backgroundColor: AppColors.accentOrange,
                    child: const Icon(
                      Icons.bookmark_border_rounded,
                      color: AppColors.textPrimary,
                      size: 21,
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 8),

              // Notifications Action (Frosted Glass button)
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.7),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.85),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  tooltip: 'Thông báo',
                  onPressed: onNotificationsTap,
                  visualDensity: VisualDensity.compact,
                  padding: const EdgeInsets.all(7),
                  constraints: const BoxConstraints(),
                  icon: Badge(
                    isLabelVisible: unreadNotificationsCount > 0,
                    label: Text('$unreadNotificationsCount'),
                    backgroundColor: AppColors.badgeUrgent,
                    child: const Icon(
                      Icons.notifications_none_rounded,
                      color: AppColors.textPrimary,
                      size: 21,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
