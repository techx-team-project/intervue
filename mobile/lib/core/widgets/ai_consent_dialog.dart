import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract final class AiConsent {
  static const String _storageKey = 'intervue_ai_personal_data_consent';
  static const String _version = '1.0.0';

  static const List<(String, String)> _sections = [
    (
      '1. Scope of personal data collected',
      'Includes the information in the CV you upload (name, email, phone number, work history, education, skills, projects) and the career preferences you set.',
    ),
    (
      '2. Purpose of AI processing',
      'Extracting text from your CV, suggesting profile fields, checking fit with job posts and giving objective CV improvement feedback.',
    ),
    (
      '3. Security commitment & AI ethics',
      'InterVue will not share or sell personal data to unauthorized third parties. AI never uses sensitive attributes (age, gender, photo, place of origin) in any assessment.',
    ),
    (
      '4. Data subject rights & duration',
      'Your consent applies to the current policy version. You may review, correct or delete your data, or withdraw this consent at any time in Account settings.',
    ),
  ];

  static Future<bool> ensure(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getString(_storageKey) == _version) return true;
    if (!context.mounted) return false;
    final agreed = await showDialog<bool>(
      context: context,
      builder: (_) => const _AiConsentDialog(),
    );
    if (agreed != true) return false;
    await prefs.setString(_storageKey, _version);
    return true;
  }
}

class _AiConsentDialog extends StatelessWidget {
  const _AiConsentDialog();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text(
        'Consent to personal data processing for AI features',
        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                'Compliant with Decree 13/2023/ND-CP',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDarker,
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'To use Artificial Intelligence (AI) features that parse CVs, assess fit and suggest jobs, InterVue needs your explicit consent to process personal data as required by law.',
              style: TextStyle(fontSize: 13, height: 1.5),
            ),
            for (final section in AiConsent._sections) ...[
              const SizedBox(height: 12),
              Text(
                section.$1,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                section.$2,
                style: const TextStyle(
                  fontSize: 12.5,
                  height: 1.5,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
            const SizedBox(height: 12),
            const Text(
              'If you do not agree, you can keep using InterVue standard features and update your profile manually.',
              style: TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Later (enter manually)'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Agree and continue'),
        ),
      ],
    );
  }
}
