import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddExperienceDialog extends StatefulWidget {
  const AddExperienceDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddExperienceDialog(),
    );
  }

  @override
  State<AddExperienceDialog> createState() => _AddExperienceDialogState();
}

class _AddExperienceDialogState extends State<AddExperienceDialog> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _companyController = TextEditingController();
  final _descController = TextEditingController();
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 365));
  DateTime? _endDate;
  bool _isCurrent = true;

  @override
  void dispose() {
    _titleController.dispose();
    _companyController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final dateFmt = DateFormat('yyyy-MM-dd');
    final data = <String, dynamic>{
      'title': _titleController.text.trim(),
      'companyName': _companyController.text.trim(),
      'startDate': dateFmt.format(_startDate),
      if (!_isCurrent && _endDate != null) 'endDate': dateFmt.format(_endDate!),
      'current': _isCurrent,
      if (_descController.text.trim().isNotEmpty)
        'description': _descController.text.trim(),
      'skills': <String>[],
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    final dateFmt = DateFormat('MM/yyyy');

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Add work experience',
        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Position / Title *',
                  hintText: 'VD: Flutter Developer',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Please enter the position'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _companyController,
                decoration: const InputDecoration(
                  labelText: 'Company *',
                  hintText: 'VD: FPT Software',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Please enter the company name'
                    : null,
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text(
                  'I currently work here',
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
                    child: OutlinedButton(
                      onPressed: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: _startDate,
                          firstDate: DateTime(1980),
                          lastDate: DateTime.now(),
                        );
                        if (picked != null) setState(() => _startDate = picked);
                      },
                      child: Text(
                        'Start: ${dateFmt.format(_startDate)}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                  ),
                  if (!_isCurrent) ...[
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _endDate ?? DateTime.now(),
                            firstDate: _startDate,
                            lastDate: DateTime.now(),
                          );
                          if (picked != null) setState(() => _endDate = picked);
                        },
                        child: Text(
                          _endDate != null
                              ? 'To: ${dateFmt.format(_endDate!)}'
                              : 'Select end date',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Job description & Achievements',
                  hintText: 'Main projects, technologies used...',
                ),
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
