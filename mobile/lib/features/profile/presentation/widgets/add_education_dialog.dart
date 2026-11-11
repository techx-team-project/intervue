import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddEducationDialog extends StatefulWidget {
  const AddEducationDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddEducationDialog(),
    );
  }

  @override
  State<AddEducationDialog> createState() => _AddEducationDialogState();
}

class _AddEducationDialogState extends State<AddEducationDialog> {
  final _formKey = GlobalKey<FormState>();
  final _schoolController = TextEditingController();
  final _majorController = TextEditingController();
  final _degreeController = TextEditingController();
  final _startYearController = TextEditingController(
    text: (DateTime.now().year - 4).toString(),
  );
  final _endYearController = TextEditingController(
    text: DateTime.now().year.toString(),
  );

  @override
  void dispose() {
    _schoolController.dispose();
    _majorController.dispose();
    _degreeController.dispose();
    _startYearController.dispose();
    _endYearController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final startYear = int.tryParse(_startYearController.text.trim()) ?? 2020;
    final endYear = int.tryParse(_endYearController.text.trim());

    final data = <String, dynamic>{
      'school': _schoolController.text.trim(),
      if (_degreeController.text.trim().isNotEmpty)
        'degree': _degreeController.text.trim(),
      if (_majorController.text.trim().isNotEmpty)
        'major': _majorController.text.trim(),
      'startYear': startYear,
      'endYear': ?endYear,
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Thêm thông tin học vấn',
        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _schoolController,
                decoration: const InputDecoration(
                  labelText: 'Trường học *',
                  hintText: 'VD: Đại học Bách Khoa',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Vui lòng nhập trường học'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _majorController,
                decoration: const InputDecoration(
                  labelText: 'Chuyên ngành',
                  hintText: 'VD: Công nghệ thông tin',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _degreeController,
                decoration: const InputDecoration(
                  labelText: 'Hệ / Bằng cấp',
                  hintText: 'VD: Kỹ sư, Cử nhân',
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _startYearController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Năm bắt đầu *',
                      ),
                      validator: (v) => v == null || int.tryParse(v) == null
                          ? 'Không hợp lệ'
                          : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _endYearController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Năm tốt nghiệp',
                      ),
                    ),
                  ),
                ],
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
          child: const Text('Lưu'),
        ),
      ],
    );
  }
}
