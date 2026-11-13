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

  String _selectedCity = 'Nationwide';
  String _selectedLevel = 'ALL';
  String _selectedWorkMode = 'ALL';
  String _selectedFrequency = 'DAILY';

  static const List<String> _cities = [
    'Nationwide',
    'Hanoi',
    'Ho Chi Minh City',
    'Da Nang',
    'Binh Duong',
    'Hai Phong',
    'Can Tho',
    'Remote',
  ];

  static const Map<String, String> _levels = {
    'ALL': 'All levels',
    'INTERN': 'Intern',
    'FRESHER': 'Fresher',
    'JUNIOR': 'Junior',
    'MIDDLE': 'Middle',
    'SENIOR': 'Senior',
    'LEAD': 'Lead',
    'MANAGER': 'Manager',
  };

  static const Map<String, String> _workModes = {
    'ALL': 'All work modes',
    'ONSITE': 'Onsite',
    'REMOTE': 'Remote',
    'HYBRID': 'Hybrid',
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
      city: _selectedCity != 'Nationwide' ? _selectedCity : null,
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
                          'Create job alert',
                          style: TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Get the best matching jobs as soon as they are posted',
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
                        'Alert name *',
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
                          hintText: 'e.g. Flutter Developer in Hanoi',
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
                            ? 'Please enter an alert name'
                            : null,
                      ),
                      const SizedBox(height: 14),

                      // Keyword
                      const Text(
                        'Keywords',
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
                        'Work area',
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
                                  'Level',
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
                                  'Work mode',
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
                        'Minimum salary (million VND / month)',
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
                          hintText: 'e.g. 15 (equals 15,000,000 VND)',
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
                        'Alert frequency',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          _buildFrequencyChip('DAILY', 'Daily', Icons.today),
                          const SizedBox(width: 8),
                          _buildFrequencyChip(
                            'WEEKLY',
                            'Weekly',
                            Icons.date_range,
                          ),
                          const SizedBox(width: 8),
                          _buildFrequencyChip('INSTANT', 'Instant', Icons.bolt),
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
                            'Save job alert',
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
