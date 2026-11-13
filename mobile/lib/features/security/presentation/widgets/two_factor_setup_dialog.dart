import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_setup_model.dart';

class TwoFactorSetupDialog extends StatefulWidget {
  const TwoFactorSetupDialog({
    required this.setupData,
    required this.onConfirm,
    super.key,
  });

  final TwoFactorSetupModel setupData;
  final ValueChanged<String> onConfirm;

  static void show(
    BuildContext context, {
    required TwoFactorSetupModel setupData,
    required ValueChanged<String> onConfirm,
  }) {
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) =>
          TwoFactorSetupDialog(setupData: setupData, onConfirm: onConfirm),
    );
  }

  @override
  State<TwoFactorSetupDialog> createState() => _TwoFactorSetupDialogState();
}

class _TwoFactorSetupDialogState extends State<TwoFactorSetupDialog> {
  final _codeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    widget.onConfirm(_codeController.text.trim());
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Row(
        children: [
          Icon(Icons.security, color: AppColors.primary, size: 22),
          SizedBox(width: 8),
          Text(
            'Enable 2FA',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
          ),
        ],
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '1. Open your authenticator app (Google Authenticator, Authy, Microsoft Authenticator) and enter the secret key below:',
                style: TextStyle(
                  fontSize: 12.5,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: SelectableText(
                        widget.setupData.secret,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                          color: AppColors.primaryDarker,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, size: 18),
                      tooltip: 'Copy key',
                      onPressed: () {
                        Clipboard.setData(
                          ClipboardData(text: widget.setupData.secret),
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Secret key copied to clipboard!'),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                '2. Enter the 6-digit OTP shown in your authenticator app to enable:',
                style: TextStyle(
                  fontSize: 12.5,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _codeController,
                textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                maxLength: 6,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 4,
                ),
                decoration: const InputDecoration(
                  hintText: '000000',
                  counterText: '',
                ),
                validator: (v) {
                  if (v == null || v.trim().length != 6) {
                    return 'Please enter all 6 digits';
                  }
                  return null;
                },
              ),
              if (widget.setupData.backupCodes.isNotEmpty) ...[
                const SizedBox(height: 14),
                const Text(
                  'Backup codes (save them in case you lose your device):',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: widget.setupData.backupCodes
                      .map(
                        (c) => Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.amber.shade50,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: Colors.amber.shade200),
                          ),
                          child: Text(
                            c,
                            style: const TextStyle(
                              fontSize: 11,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
              ],
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
          child: const Text('Confirm & Enable 2FA'),
        ),
      ],
    );
  }
}
