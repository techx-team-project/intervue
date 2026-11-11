import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/job_alert/data/models/create_job_alert_request.dart';

class CreateJobAlertModal extends StatefulWidget {
  const CreateJobAlertModal({super.key});

  static Future<CreateJobAlertRequest?> show(BuildContext context) {
    return showModalBottomSheet<CreateJobAlertRequest>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const CreateJobAlertModal(),
    );
  }

  @override
  State<CreateJobAlertModal> createState() => _CreateJobAlertModalState();
}

class _CreateJobAlertModalState extends State<CreateJobAlertModal> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _keywordController = TextEditingController();
  final _salaryMinController = TextEditingController(text: '15');

  String _selectedCity = 'Toàn quốc';
  String _selectedLevel = 'ALL';
  String _selectedWorkMode = 'ALL';
  String _selectedFrequency = 'DAILY';

  static const List<String> _cities = [
    'Toàn quốc',
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Bình Dương',
    'Hải Phòng',
    'Cần Thơ',
    'Làm từ xa (Remote)',
  ];

  static const Map<String, String> _levels = {
    'ALL': 'Tất cả cấp bậc',
    'INTERN': 'Thực tập sinh (Intern)',
    'FRESHER': 'Fresher',
    'JUNIOR': 'Junior',
    'MIDDLE': 'Middle',
    'SENIOR': 'Senior',
    'LEAD': 'Trưởng nhóm (Lead)',
    'MANAGER': 'Quản lý (Manager)',
  };

  static const Map<String, String> _workModes = {
    'ALL': 'Tất cả hình thức',
    'ONSITE': 'Tại văn phòng (Onsite)',
    'REMOTE': 'Làm từ xa (Remote)',
    'HYBRID': 'Linh hoạt (Hybrid)',
  };

  @override
  void dispose() {
    _titleController.dispose();
    _keywordController.dispose();
    _salaryMinController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final millions = int.tryParse(_salaryMinController.text.trim()) ?? 0;
    final salaryMin = millions > 0 ? millions * 1000000 : null;

    final request = CreateJobAlertRequest(
      title: _titleController.text.trim(),
      keyword: _keywordController.text.trim().isNotEmpty
          ? _keywordController.text.trim()
          : null,
      city: _selectedCity != 'Toàn quốc' ? _selectedCity : null,
      careerLevel: _selectedLevel != 'ALL' ? _selectedLevel : null,
      workMode: _selectedWorkMode != 'ALL' ? _selectedWorkMode : null,
      salaryMin: salaryMin,
      currency: 'VND',
      frequency: _selectedFrequency,
    );

    Navigator.of(context).pop(request);
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.88,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          children: [
            // Handle bar
            const SizedBox(height: 12),
            Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 12),

            // Modal Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.notifications_active_outlined,
                      color: AppColors.primary,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Tạo thông báo việc làm',
                          style: TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Nhận việc làm phù hợp nhất ngay khi có tin mới',
                          style: TextStyle(
                            fontSize: 11.5,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 16),

            // Form Body
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(20, 8, 20, 20 + bottomInset),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Alert Title
                      const Text(
                        'Tên thông báo *',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _titleController,
                        decoration: InputDecoration(
                          hintText: 'VD: Flutter Developer Hà Nội',
                          prefixIcon: const Icon(
                            Icons.badge_outlined,
                            size: 20,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                        ),
                        validator: (v) => v == null || v.trim().isEmpty
                            ? 'Vui lòng nhập tên thông báo'
                            : null,
                      ),
                      const SizedBox(height: 14),

                      // Keyword
                      const Text(
                        'Từ khóa chuyên môn',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _keywordController,
                        decoration: InputDecoration(
                          hintText: 'VD: Flutter, Dart, BLoC, React',
                          prefixIcon: const Icon(Icons.search, size: 20),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // City Dropdown
                      const Text(
                        'Khu vực làm việc',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      DropdownButtonFormField<String>(
                        initialValue: _selectedCity,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(
                            Icons.location_on_outlined,
                            size: 20,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                        ),
                        items: _cities.map((city) {
                          return DropdownMenuItem(
                            value: city,
                            child: Text(
                              city,
                              style: const TextStyle(fontSize: 13.5),
                            ),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedCity = val);
                        },
                      ),
                      const SizedBox(height: 14),

                      // Level & Work Mode Row
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Cấp bậc',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                DropdownButtonFormField<String>(
                                  initialValue: _selectedLevel,
                                  decoration: InputDecoration(
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 12,
                                    ),
                                  ),
                                  isExpanded: true,
                                  items: _levels.entries.map((entry) {
                                    return DropdownMenuItem(
                                      value: entry.key,
                                      child: Text(
                                        entry.value,
                                        style: const TextStyle(fontSize: 12.5),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    );
                                  }).toList(),
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() => _selectedLevel = val);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Hình thức',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                DropdownButtonFormField<String>(
                                  initialValue: _selectedWorkMode,
                                  decoration: InputDecoration(
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 12,
                                    ),
                                  ),
                                  isExpanded: true,
                                  items: _workModes.entries.map((entry) {
                                    return DropdownMenuItem(
                                      value: entry.key,
                                      child: Text(
                                        entry.value,
                                        style: const TextStyle(fontSize: 12.5),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    );
                                  }).toList(),
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() => _selectedWorkMode = val);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Salary Min
                      const Text(
                        'Mức lương tối thiểu (triệu VND / tháng)',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _salaryMinController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: 'VD: 15 (tương đương 15.000.000 đ)',
                          prefixIcon: const Icon(Icons.attach_money, size: 20),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Frequency Selector
                      const Text(
                        'Tần suất nhận thông báo',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          _buildFrequencyChip(
                            'DAILY',
                            'Hàng ngày',
                            Icons.today,
                          ),
                          const SizedBox(width: 8),
                          _buildFrequencyChip(
                            'WEEKLY',
                            'Hàng tuần',
                            Icons.date_range,
                          ),
                          const SizedBox(width: 8),
                          _buildFrequencyChip('INSTANT', 'Tức thì', Icons.bolt),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton.icon(
                          onPressed: _submit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          icon: const Icon(
                            Icons.notifications_active,
                            size: 20,
                          ),
                          label: const Text(
                            'Lưu thông báo việc làm',
                            style: TextStyle(
                              fontSize: 14.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFrequencyChip(String value, String label, IconData icon) {
    final isSelected = _selectedFrequency == value;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedFrequency = value),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primaryLight : Colors.grey.shade50,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
              width: isSelected ? 1.4 : 1,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected
                      ? AppColors.primaryDarker
                      : AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
