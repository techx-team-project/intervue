import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddSkillDialog extends StatefulWidget {
  const AddSkillDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddSkillDialog(),
    );
  }

  @override
  State<AddSkillDialog> createState() => _AddSkillDialogState();
}

class _AddSkillDialogState extends State<AddSkillDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _yearsController = TextEditingController(text: '2');
  final String _category = 'TECHNICAL';
  String _level = 'INTERMEDIATE';

  @override
  void dispose() {
    _nameController.dispose();
    _yearsController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final years = int.tryParse(_yearsController.text.trim()) ?? 1;
    final data = <String, dynamic>{
      'name': _nameController.text.trim(),
      'category': _category,
      'level': _level,
      'years': years,
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Add professional skill',
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
                  labelText: 'Skill name *',
                  hintText: 'VD: Flutter, React, SQL, Java',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Please enter the skill name'
                    : null,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _level,
                decoration: const InputDecoration(labelText: 'Proficiency'),
                items: const [
                  DropdownMenuItem(value: 'BEGINNER', child: Text('Basic')),
                  DropdownMenuItem(
                    value: 'INTERMEDIATE',
                    child: Text('Intermediate'),
                  ),
                  DropdownMenuItem(value: 'ADVANCED', child: Text('Fluent')),
                  DropdownMenuItem(value: 'EXPERT', child: Text('Expert')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _level = val);
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _yearsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Years of experience',
                  suffixText: 'years',
                ),
                validator: (v) =>
                    v == null || int.tryParse(v) == null ? 'Invalid' : null,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _submit,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Save'),
        ),
      ],
    );
  }
}
