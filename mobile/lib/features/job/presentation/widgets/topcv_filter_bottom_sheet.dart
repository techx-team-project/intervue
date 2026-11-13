import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class TopCvFilterData {
  const TopCvFilterData({
    this.salaryRange = 'All',
    this.location = 'Nationwide',
    this.level = 'All',
    this.skill = 'All',
    this.workMode = 'All',
  });

  final String salaryRange;
  final String location;
  final String level;
  final String skill;
  final String workMode;

  bool get hasFilter =>
      salaryRange != 'All' ||
      location != 'Nationwide' ||
      level != 'All' ||
      skill != 'All' ||
      workMode != 'All';

  String? get backendLevel {
    switch (level) {
      case 'Intern':
        return 'INTERN';
      case 'Junior':
        return 'JUNIOR';
      case 'Middle':
        return 'MIDDLE';
      case 'Senior':
        return 'SENIOR';
      case 'Lead':
        return 'LEAD';
      default:
        return null;
    }
  }

  String? get backendWorkMode {
    switch (workMode) {
      case 'Onsite':
        return 'ONSITE';
      case 'Remote':
        return 'REMOTE';
      case 'Hybrid':
        return 'HYBRID';
      default:
        return null;
    }
  }

  TopCvFilterData copyWith({
    String? salaryRange,
    String? location,
    String? level,
    String? skill,
    String? workMode,
  }) {
    return TopCvFilterData(
      salaryRange: salaryRange ?? this.salaryRange,
      location: location ?? this.location,
      level: level ?? this.level,
      skill: skill ?? this.skill,
      workMode: workMode ?? this.workMode,
    );
  }
}

class TopCvFilterBottomSheet extends StatefulWidget {
  const TopCvFilterBottomSheet({
    required this.initialFilter,
    required this.onApply,
    this.skillOptions = const ['All'],
    super.key,
  });

  final TopCvFilterData initialFilter;
  final ValueChanged<TopCvFilterData> onApply;
  final List<String> skillOptions;

  static const List<String> salaryOptions = [
    'All',
    'Under 10M VND',
    '10 - 15M VND',
    '15 - 25M VND',
    '25 - 40M VND',
    'Over 40M VND',
    'Negotiable',
  ];

  static const List<String> locationOptions = [
    'Nationwide',
    'Hanoi',
    'Ho Chi Minh City',
    'Da Nang',
    'Binh Duong',
    'Remote',
  ];

  static const List<String> levelOptions = [
    'All',
    'Intern',
    'Junior',
    'Middle',
    'Senior',
    'Lead',
  ];

  static const List<String> workModeOptions = [
    'All',
    'Onsite',
    'Remote',
    'Hybrid',
  ];

  @override
  State<TopCvFilterBottomSheet> createState() => _TopCvFilterBottomSheetState();
}

class _TopCvFilterBottomSheetState extends State<TopCvFilterBottomSheet> {
  late TopCvFilterData _filter;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Advanced search filters',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(),

            Flexible(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionTitle('Work mode'),
                    _buildChipWrap(
                      options: TopCvFilterBottomSheet.workModeOptions,
                      selected: _filter.workMode,
                      onSelect: (val) => setState(
                        () => _filter = _filter.copyWith(workMode: val),
                      ),
                    ),
                    const SizedBox(height: 16),

                    _buildSectionTitle('Skills & Domain'),
                    _buildChipWrap(
                      options: widget.skillOptions,
                      selected: _filter.skill,
                      onSelect: (val) => setState(
                        () => _filter = _filter.copyWith(skill: val),
                      ),
                    ),
                    const SizedBox(height: 16),

                    _buildSectionTitle('Desired salary'),
                    _buildChipWrap(
                      options: TopCvFilterBottomSheet.salaryOptions,
                      selected: _filter.salaryRange,
                      onSelect: (val) => setState(
                        () => _filter = _filter.copyWith(salaryRange: val),
                      ),
                    ),
                    const SizedBox(height: 16),

                    _buildSectionTitle('Work location'),
                    _buildChipWrap(
                      options: TopCvFilterBottomSheet.locationOptions,
                      selected: _filter.location,
                      onSelect: (val) => setState(
                        () => _filter = _filter.copyWith(location: val),
                      ),
                    ),
                    const SizedBox(height: 16),

                    _buildSectionTitle('Level'),
                    _buildChipWrap(
                      options: TopCvFilterBottomSheet.levelOptions,
                      selected: _filter.level,
                      onSelect: (val) => setState(
                        () => _filter = _filter.copyWith(level: val),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Actions
            Row(
              children: [
                Expanded(
                  flex: 1,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      side: const BorderSide(color: AppColors.border),
                    ),
                    onPressed: () {
                      setState(() => _filter = const TopCvFilterData());
                    },
                    child: const Text(
                      'Reset',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 0,
                    ),
                    onPressed: () {
                      widget.onApply(_filter);
                      Navigator.pop(context);
                    },
                    child: const Text(
                      'Apply filters',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 13.5,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }

  Widget _buildChipWrap({
    required List<String> options,
    required String selected,
    required ValueChanged<String> onSelect,
  }) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: options.map((option) {
        final isSelected = option == selected;
        return ChoiceChip(
          label: Text(option),
          selected: isSelected,
          onSelected: (_) => onSelect(option),
          selectedColor: AppColors.primaryLight,
          backgroundColor: AppColors.background,
          labelStyle: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? AppColors.primary : AppColors.textSecondary,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: BorderSide(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          showCheckmark: false,
        );
      }).toList(),
    );
  }
}
