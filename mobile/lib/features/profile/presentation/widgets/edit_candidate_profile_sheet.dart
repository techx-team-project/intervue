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
    {'value': 'MALE', 'label': 'Male'},
    {'value': 'FEMALE', 'label': 'Female'},
    {'value': 'OTHER', 'label': 'Other'},
  ];

  static const _levels = [
    {'value': 'INTERN', 'label': 'Intern'},
    {'value': 'FRESHER', 'label': 'Entry level (Fresher)'},
    {'value': 'JUNIOR', 'label': 'Junior (1 - 2 years)'},
    {'value': 'MIDDLE', 'label': 'Middle (2 - 4 years)'},
    {'value': 'SENIOR', 'label': 'Senior (5+ years)'},
    {'value': 'LEAD', 'label': 'Lead'},
    {'value': 'MANAGER', 'label': 'Manager'},
  ];

  static const _workModes = [
    {'value': 'ONSITE', 'label': 'Onsite'},
    {'value': 'REMOTE', 'label': 'Remote'},
    {'value': 'HYBRID', 'label': 'Hybrid'},
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
                  'Edit profile information',
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
                      _buildSectionHeader('1. Basic personal information'),
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Full name *',
                          hintText: 'e.g. Nguyen Van A',
                        ),
                        validator: (v) {
                          if (v == null || v.trim().length < 2) {
                            return 'Please enter a name of 2 to 50 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _headlineController,
                        decoration: const InputDecoration(
                          labelText: 'Headline',
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
                                labelText: 'Gender',
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
                                labelText: 'Birth year',
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
                          labelText: 'Contact email',
                          hintText: 'contact@example.com',
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          labelText: 'Address / Work area',
                          hintText: 'VD: Cau Giay, Hanoi',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _bioController,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          labelText: 'About me (Bio)',
                          hintText: 'A short description of your experience, strengths and passion for technology...',
                        ),
                      ),
                      const SizedBox(height: 20),

                      _buildSectionHeader('2. Career goals & expectations'),
                      TextFormField(
                        controller: _desiredRoleController,
                        decoration: const InputDecoration(
                          labelText: 'Desired position *',
                          hintText: 'VD: Flutter Developer, Mobile Tech Lead',
                        ),
                        validator: (v) => v == null || v.trim().isEmpty
                            ? 'Please enter the position'
                            : null,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              initialValue: _desiredLevel,
                              decoration: const InputDecoration(
                                labelText: 'Desired level',
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
                                labelText: 'Years of experience (YOE)',
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
                          labelText: 'Work mode',
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
                                labelText: 'Minimum salary (million VND)',
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
                                labelText: 'Maximum salary (million VND)',
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
                          'Salary is negotiable',
                          style: TextStyle(fontSize: 13),
                        ),
                        value: _salaryNegotiable,
                        activeThumbColor: AppColors.primary,
                        onChanged: (val) =>
                            setState(() => _salaryNegotiable = val),
                      ),
                      const SizedBox(height: 20),

                      _buildSectionHeader('3. Social links & Portfolio'),
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
                          labelText: 'Personal website / Portfolio',
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
                  'Save profile changes',
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
