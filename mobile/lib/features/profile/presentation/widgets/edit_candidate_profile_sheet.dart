import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';

class EditCandidateProfileSheet extends StatefulWidget {
  const EditCandidateProfileSheet({
    required this.profile,
    required this.onSave,
    super.key,
  });

  final CandidateProfileModel profile;
  final ValueChanged<Map<String, dynamic>> onSave;

  static Future<void> show(
    BuildContext context, {
    required CandidateProfileModel profile,
    required ValueChanged<Map<String, dynamic>> onSave,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) =>
          EditCandidateProfileSheet(profile: profile, onSave: onSave),
    );
  }

  @override
  State<EditCandidateProfileSheet> createState() =>
      _EditCandidateProfileSheetState();
}

class _EditCandidateProfileSheetState extends State<EditCandidateProfileSheet> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _headlineController;
  late TextEditingController _bioController;
  late TextEditingController _contactEmailController;
  late TextEditingController _addressController;
  late TextEditingController _birthYearController;
  late TextEditingController _desiredRoleController;
  late TextEditingController _yoeController;
  late TextEditingController _salaryMinController;
  late TextEditingController _salaryMaxController;
  late TextEditingController _githubController;
  late TextEditingController _linkedinController;
  late TextEditingController _portfolioController;

  String? _gender;
  String? _desiredLevel;
  String? _workMode;
  late bool _salaryNegotiable;

  static const _genders = [
    {'value': 'MALE', 'label': 'Nam'},
    {'value': 'FEMALE', 'label': 'Nữ'},
    {'value': 'OTHER', 'label': 'Khác'},
  ];

  static const _levels = [
    {'value': 'INTERN', 'label': 'Thực tập sinh (Intern)'},
    {'value': 'FRESHER', 'label': 'Mới đi làm (Fresher)'},
    {'value': 'JUNIOR', 'label': 'Junior (1 - 2 năm)'},
    {'value': 'MIDDLE', 'label': 'Middle (2 - 4 năm)'},
    {'value': 'SENIOR', 'label': 'Senior (5+ năm)'},
    {'value': 'LEAD', 'label': 'Trưởng nhóm (Lead)'},
    {'value': 'MANAGER', 'label': 'Quản lý (Manager)'},
  ];

  static const _workModes = [
    {'value': 'ONSITE', 'label': 'Làm tại văn phòng (Onsite)'},
    {'value': 'REMOTE', 'label': 'Làm từ xa (Remote)'},
    {'value': 'HYBRID', 'label': 'Linh hoạt (Hybrid)'},
  ];

  @override
  void initState() {
    super.initState();
    final p = widget.profile;
    _nameController = TextEditingController(text: p.name ?? '');
    _headlineController = TextEditingController(text: p.headline ?? '');
    _bioController = TextEditingController(text: p.bio ?? '');
    _contactEmailController = TextEditingController(
      text: p.contactEmail ?? p.email ?? '',
    );
    _addressController = TextEditingController(text: p.address ?? '');
    _birthYearController = TextEditingController(
      text: p.birthYear?.toString() ?? '',
    );
    _desiredRoleController = TextEditingController(
      text: p.desiredRole ?? 'Software Engineer',
    );
    _yoeController = TextEditingController(
      text: p.totalYoe?.toString() ?? '1.0',
    );
    _salaryMinController = TextEditingController(
      text: p.salaryMin != null ? (p.salaryMin! ~/ 1000000).toString() : '15',
    );
    _salaryMaxController = TextEditingController(
      text: p.salaryMax != null ? (p.salaryMax! ~/ 1000000).toString() : '30',
    );
    _githubController = TextEditingController(text: p.githubUrl ?? '');
    _linkedinController = TextEditingController(text: p.linkedinUrl ?? '');
    _portfolioController = TextEditingController(text: p.portfolioUrl ?? '');

    _gender = p.gender;
    _desiredLevel = p.desiredLevel ?? 'MIDDLE';
    _workMode = 'HYBRID';
    _salaryNegotiable = true;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _headlineController.dispose();
    _bioController.dispose();
    _contactEmailController.dispose();
    _addressController.dispose();
    _birthYearController.dispose();
    _desiredRoleController.dispose();
    _yoeController.dispose();
    _salaryMinController.dispose();
    _salaryMaxController.dispose();
    _githubController.dispose();
    _linkedinController.dispose();
    _portfolioController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final birthYearInt = int.tryParse(_birthYearController.text.trim());
    final yoeDouble = double.tryParse(_yoeController.text.trim()) ?? 1.0;
    final minSalMillions = int.tryParse(_salaryMinController.text.trim());
    final maxSalMillions = int.tryParse(_salaryMaxController.text.trim());

    final data = <String, dynamic>{
      'name': _nameController.text.trim(),
      'headline': _headlineController.text.trim(),
      if (_bioController.text.trim().isNotEmpty)
        'bio': _bioController.text.trim(),
      if (_contactEmailController.text.trim().isNotEmpty)
        'contactEmail': _contactEmailController.text.trim(),
      if (_addressController.text.trim().isNotEmpty)
        'address': _addressController.text.trim(),
      'gender': ?_gender,
      'birthYear': ?birthYearInt,
      'desiredRole': _desiredRoleController.text.trim(),
      'desiredLevel': ?_desiredLevel,
      'totalYoe': yoeDouble,
      'salaryNegotiable': _salaryNegotiable,
      if (minSalMillions != null) 'salaryMin': minSalMillions * 1000000,
      if (maxSalMillions != null) 'salaryMax': maxSalMillions * 1000000,
      'currency': widget.profile.currency,
      'workMode': ?_workMode,
      if (_githubController.text.trim().isNotEmpty)
        'githubUrl': _githubController.text.trim(),
      if (_linkedinController.text.trim().isNotEmpty)
        'linkedinUrl': _linkedinController.text.trim(),
      if (_portfolioController.text.trim().isNotEmpty)
        'portfolioUrl': _portfolioController.text.trim(),
      'showPersonalDetails': true,
      'searchableByRecruiters': widget.profile.isActivelyLooking,
      'jobSearchStatus': widget.profile.jobSearchStatus,
    };

    widget.onSave(data);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);

    return Container(
      constraints: BoxConstraints(maxHeight: mediaQuery.size.height * 0.9),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.fromLTRB(
        20,
        16,
        20,
        mediaQuery.viewInsets.bottom + 16,
      ),
      child: SafeArea(
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Chỉnh sửa thông tin hồ sơ',
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
            Expanded(
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionHeader('1. Thông tin cá nhân cơ bản'),
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Họ và tên *',
                          hintText: 'VD: Nguyễn Văn A',
                        ),
                        validator: (v) {
                          if (v == null || v.trim().length < 2) {
                            return 'Vui lòng nhập tên từ 2 đến 50 ký tự';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _headlineController,
                        decoration: const InputDecoration(
                          labelText: 'Chức danh ngắn gọn / Headline',
                          hintText: 'VD: Senior Flutter Developer | Clean Architecture',
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              initialValue: _gender,
                              decoration: const InputDecoration(
                                labelText: 'Giới tính',
                              ),
                              items: _genders
                                  .map(
                                    (g) => DropdownMenuItem(
                                      value: g['value'],
                                      child: Text(g['label']!),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (val) => setState(() => _gender = val),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _birthYearController,
                              decoration: const InputDecoration(
                                labelText: 'Năm sinh',
                                hintText: '1998',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _contactEmailController,
                        decoration: const InputDecoration(
                          labelText: 'Email liên hệ',
                          hintText: 'contact@example.com',
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          labelText: 'Địa chỉ / Khu vực làm việc',
                          hintText: 'VD: Cầu Giấy, Hà Nội',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _bioController,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          labelText: 'Giới thiệu bản thân (Bio)',
                          hintText: 'Mô tả ngắn gọn về kinh nghiệm, thế mạnh và đam mê công nghệ...',
                        ),
                      ),
                      const SizedBox(height: 20),

                      _buildSectionHeader('2. Mục tiêu & Kỳ vọng nghề nghiệp'),
                      TextFormField(
                        controller: _desiredRoleController,
                        decoration: const InputDecoration(
                          labelText: 'Vị trí công việc mong muốn *',
                          hintText: 'VD: Flutter Developer, Mobile Tech Lead',
                        ),
                        validator: (v) => v == null || v.trim().isEmpty
                            ? 'Vui lòng nhập vị trí'
                            : null,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              initialValue: _desiredLevel,
                              decoration: const InputDecoration(
                                labelText: 'Cấp bậc mong muốn',
                              ),
                              items: _levels
                                  .map(
                                    (l) => DropdownMenuItem(
                                      value: l['value'],
                                      child: Text(
                                        l['label']!,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (val) =>
                                  setState(() => _desiredLevel = val),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _yoeController,
                              decoration: const InputDecoration(
                                labelText: 'Số năm kinh nghiệm (YOE)',
                                hintText: 'VD: 3.5',
                              ),
                              keyboardType:
                                  const TextInputType.numberWithOptions(
                                    decimal: true,
                                  ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: _workMode,
                        decoration: const InputDecoration(
                          labelText: 'Hình thức làm việc',
                        ),
                        items: _workModes
                            .map(
                              (m) => DropdownMenuItem(
                                value: m['value'],
                                child: Text(m['label']!),
                              ),
                            )
                            .toList(),
                        onChanged: (val) => setState(() => _workMode = val),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _salaryMinController,
                              decoration: const InputDecoration(
                                labelText: 'Lương tối thiểu (Triệu VND)',
                                hintText: '15',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _salaryMaxController,
                              decoration: const InputDecoration(
                                labelText: 'Lương tối đa (Triệu VND)',
                                hintText: '30',
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                        ],
                      ),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text(
                          'Mức lương có thể thương lượng',
                          style: TextStyle(fontSize: 13),
                        ),
                        value: _salaryNegotiable,
                        activeThumbColor: AppColors.primary,
                        onChanged: (val) =>
                            setState(() => _salaryNegotiable = val),
                      ),
                      const SizedBox(height: 20),

                      _buildSectionHeader('3. Liên kết xã hội & Portfolio'),
                      TextFormField(
                        controller: _githubController,
                        decoration: const InputDecoration(
                          labelText: 'GitHub URL',
                          hintText: 'https://github.com/username',
                        ),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _linkedinController,
                        decoration: const InputDecoration(
                          labelText: 'LinkedIn URL',
                          hintText: 'https://linkedin.com/in/username',
                        ),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _portfolioController,
                        decoration: const InputDecoration(
                          labelText: 'Website / Portfolio cá nhân',
                          hintText: 'https://myportfolio.dev',
                        ),
                        keyboardType: TextInputType.url,
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  'Lưu thay đổi hồ sơ',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, top: 4),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: AppColors.primary,
        ),
      ),
    );
  }
}
