import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class AddCertificationDialog extends StatefulWidget {
  const AddCertificationDialog({super.key});

  static Future<Map<String, dynamic>?> show(BuildContext context) {
    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddCertificationDialog(),
    );
  }

  @override
  State<AddCertificationDialog> createState() => _AddCertificationDialogState();
}

class _AddCertificationDialogState extends State<AddCertificationDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _issuerController = TextEditingController();
  final _credentialIdController = TextEditingController();
  final _credentialUrlController = TextEditingController();
  DateTime? _issueDate = DateTime.now().subtract(const Duration(days: 90));

  @override
  void dispose() {
    _nameController.dispose();
    _issuerController.dispose();
    _credentialIdController.dispose();
    _credentialUrlController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final dateFmt = DateFormat('yyyy-MM-dd');
    final data = <String, dynamic>{
      'name': _nameController.text.trim(),
      'issuer': _issuerController.text.trim(),
      if (_issueDate != null) 'issueDate': dateFmt.format(_issueDate!),
      if (_credentialIdController.text.trim().isNotEmpty)
        'credentialId': _credentialIdController.text.trim(),
      if (_credentialUrlController.text.trim().isNotEmpty)
        'credentialUrl': _credentialUrlController.text.trim(),
    };

    Navigator.of(context).pop(data);
  }

  @override
  Widget build(BuildContext context) {
    final dateFmt = DateFormat('MM/yyyy');

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text(
        'Add certification',
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
                  labelText: 'Certification name *',
                  hintText: 'VD: AWS Certified Solutions Architect',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Please enter the certification name'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _issuerController,
                decoration: const InputDecoration(
                  labelText: 'Issuing organization *',
                  hintText: 'VD: Amazon Web Services (AWS)',
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Please enter the issuing organization'
                    : null,
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                icon: const Icon(Icons.calendar_month, size: 16),
                label: Text(
                  _issueDate != null
                      ? 'Issued: ${dateFmt.format(_issueDate!)}'
                      : 'Select issue date',
                  style: const TextStyle(fontSize: 12),
                ),
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _issueDate ?? DateTime.now(),
                    firstDate: DateTime(2000),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    setState(() => _issueDate = picked);
                  }
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _credentialIdController,
                decoration: const InputDecoration(
                  labelText: 'Credential ID (optional)',
                  hintText: 'VD: AWS-12345678',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _credentialUrlController,
                decoration: const InputDecoration(
                  labelText: 'Verification URL (optional)',
                  hintText: 'https://verify.cert.com/...',
                ),
                keyboardType: TextInputType.url,
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
          child: const Text('Save certification'),
        ),
      ],
    );
  }
}
