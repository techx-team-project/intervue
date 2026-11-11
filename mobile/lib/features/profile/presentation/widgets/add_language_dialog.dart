import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddLanguageDialog extends StatefulWidget {
  const AddLanguageDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddLanguageDialog(),
    );
  }

  @override
  State<AddLanguageDialog> createState() => _AddLanguageDialogState();
}

class _AddLanguageDialogState extends State<AddLanguageDialog> {
  final _formKey = GlobalKey<FormState>();
  final _languageController = TextEditingController();
  final _certController = TextEditingController();
  String _proficiency = 'INTERMEDIATE';

  static const _levels = [
    {'value': 'BASIC', 'label': 'Sơ cấp (A1 - A2)'},
    {'value': 'INTERMEDIATE', 'label': 'Trung cấp (B1 - B2)'},
    {'value': 'ADVANCED', 'label': 'Nâng cao (C1)'},
    {'value': 'FLUENT', 'label': 'Thành thạo (C2)'},
    {'value': 'NATIVE', 'label': 'Bản ngữ'},
  ];

  @override
  void dispose() {
    _languageController.dispose();
    _certController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final data = <String, dynamic>{
      'language': _languageController.text.trim(),
      'proficiency': _proficiency,
      if (_certController.text.trim().isNotEmpty)
        'certificate': _certController.text.trim(),
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Thêm ngoại ngữ',
        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _languageController,
                decoration: const InputDecoration(
                  labelText: 'Ngôn ngữ *',
                  hintText: 'VD: Tiếng Anh, Tiếng Nhật, Tiếng Hàn',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Vui lòng nhập tên ngôn ngữ'
                    : null,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _proficiency,
                decoration: const InputDecoration(labelText: 'Trình độ *'),
                items: _levels
                    .map(
                      (item) => DropdownMenuItem(
                        value: item['value'],
                        child: Text(item['label']!),
                      ),
                    )
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _proficiency = val);
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _certController,
                decoration: const InputDecoration(
                  labelText: 'Chứng chỉ đạt được (tùy chọn)',
                  hintText: 'VD: IELTS 7.5, JLPT N2, TOEIC 850',
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
          child: const Text('Lưu ngoại ngữ'),
        ),
      ],
    );
  }
}
