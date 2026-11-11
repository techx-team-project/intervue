import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddProjectDialog extends StatefulWidget {
  const AddProjectDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddProjectDialog(),
    );
  }

  @override
  State<AddProjectDialog> createState() => _AddProjectDialogState();
}

class _AddProjectDialogState extends State<AddProjectDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _roleController = TextEditingController();
  final _descController = TextEditingController();
  final _highlightsController = TextEditingController();
  final _githubController = TextEditingController();
  final _demoController = TextEditingController();
  final _techController = TextEditingController();

  DateTime _startDate = DateTime.now().subtract(const Duration(days: 180));
  DateTime? _endDate;
  bool _isCurrent = true;

  @override
  void dispose() {
    _nameController.dispose();
    _roleController.dispose();
    _descController.dispose();
    _highlightsController.dispose();
    _githubController.dispose();
    _demoController.dispose();
    _techController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final dateFmt = DateFormat('yyyy-MM-dd');
    final techList = _techController.text
        .split(',')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final data = <String, dynamic>{
      'name': _nameController.text.trim(),
      if (_roleController.text.trim().isNotEmpty)
        'role': _roleController.text.trim(),
      'startDate': dateFmt.format(_startDate),
      if (!_isCurrent && _endDate != null) 'endDate': dateFmt.format(_endDate!),
      'current': _isCurrent,
      if (_descController.text.trim().isNotEmpty)
        'description': _descController.text.trim(),
      if (_highlightsController.text.trim().isNotEmpty)
        'highlights': _highlightsController.text.trim(),
      if (_githubController.text.trim().isNotEmpty)
        'githubUrl': _githubController.text.trim(),
      if (_demoController.text.trim().isNotEmpty)
        'demoUrl': _demoController.text.trim(),
      'technologies': techList,
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    final dateFmt = DateFormat('MM/yyyy');

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Thêm dự án nổi bật',
        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Tên dự án *',
                  hintText: 'VD: Intervue Mobile App',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Vui lòng nhập tên dự án'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _roleController,
                decoration: const InputDecoration(
                  labelText: 'Vai trò trong dự án',
                  hintText: 'VD: Lead Mobile Developer',
                ),
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text(
                  'Dự án đang thực hiện',
                  style: TextStyle(fontSize: 13),
                ),
                value: _isCurrent,
                activeThumbColor: AppColors.primary,
                onChanged: (val) => setState(() => _isCurrent = val),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.calendar_month, size: 16),
                      label: Text(
                        'Bắt đầu: ${dateFmt.format(_startDate)}',
                        style: const TextStyle(fontSize: 11),
                      ),
                      onPressed: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: _startDate,
                          firstDate: DateTime(2000),
                          lastDate: DateTime.now(),
                        );
                        if (picked != null) {
                          setState(() => _startDate = picked);
                        }
                      },
                    ),
                  ),
                  if (!_isCurrent) ...[
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.calendar_month, size: 16),
                        label: Text(
                          _endDate != null
                              ? 'Kết thúc: ${dateFmt.format(_endDate!)}'
                              : 'Chọn ngày',
                          style: const TextStyle(fontSize: 11),
                        ),
                        onPressed: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _endDate ?? DateTime.now(),
                            firstDate: _startDate,
                            lastDate: DateTime.now().add(
                              const Duration(days: 365),
                            ),
                          );
                          if (picked != null) {
                            setState(() => _endDate = picked);
                          }
                        },
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _techController,
                decoration: const InputDecoration(
                  labelText: 'Công nghệ sử dụng (cách nhau dấu phẩy)',
                  hintText: 'VD: Flutter, Dart, Bloc, REST API',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _githubController,
                decoration: const InputDecoration(
                  labelText: 'GitHub URL (tùy chọn)',
                  hintText: 'https://github.com/username/project',
                ),
                keyboardType: TextInputType.url,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _demoController,
                decoration: const InputDecoration(
                  labelText: 'Demo URL (tùy chọn)',
                  hintText: 'https://project-demo.com',
                ),
                keyboardType: TextInputType.url,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Mô tả dự án',
                  hintText: 'Giới thiệu ngắn về dự án và mục tiêu...',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _highlightsController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Kết quả / Điểm nổi bật',
                  hintText:
                      'VD: Đạt 10,000 users, cải thiện 30% performance...',
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Hủy'),
        ),
        ElevatedButton(
          onPressed: _submit,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Lưu dự án'),
        ),
      ],
    );
  }
}
