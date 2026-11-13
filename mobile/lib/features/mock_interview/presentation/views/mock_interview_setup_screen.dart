import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/core/widgets/app_button.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_enums.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/start_mock_interview_request.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_setup_cubit.dart';

class MockInterviewSetupScreen extends StatefulWidget {
  const MockInterviewSetupScreen({super.key});

  @override
  State<MockInterviewSetupScreen> createState() =>
      _MockInterviewSetupScreenState();
}

class _MockInterviewSetupScreenState extends State<MockInterviewSetupScreen> {
  static const List<String> _seniorityLevels = [
    'Intern',
    'Fresher',
    'Junior',
    'Middle',
    'Senior',
    'Lead',
  ];
  static const List<int> _questionCounts = [5, 6, 7, 8, 9, 10];

  final _roleController = TextEditingController(
    text: 'Senior Java Backend Engineer',
  );
  PlatformFile? _cvFile;
  String _seniority = 'Senior';
  MockInterviewFocusArea _focusArea = MockInterviewFocusArea.mixed;
  int _questionCount = 5;

  @override
  void dispose() {
    _roleController.dispose();
    super.dispose();
  }

  Future<void> _pickCv() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['pdf'],
      withData: true,
    );
    final file = result?.files.single;
    if (file == null || !mounted) return;
    if (file.size > AppConstants.maxCvSizeBytes) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('The CV must be 5 MB or smaller.')),
      );
      return;
    }
    setState(() => _cvFile = file);
  }

  void _submit() {
    final role = _roleController.text.trim();
    if (role.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your target job role')),
      );
      return;
    }
    context.read<MockInterviewSetupCubit>().start(
      StartMockInterviewRequest(
        cvBytes: _cvFile?.bytes,
        cvFileName: _cvFile?.name,
        targetRole: role,
        seniorityLevel: _seniority,
        focusArea: _focusArea,
        questionCount: _questionCount,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<MockInterviewSetupCubit, MockInterviewSetupState>(
      listener: (context, state) {
        final session = state.startedSession;
        if (session != null) {
          context.pushReplacement(
            RouteNames.mockInterview(session.id),
            extra: session,
          );
        } else if (state.errorMessage != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage!),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      builder: (context, state) {
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text(
              'Configure AI Mock Interview',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            elevation: 0,
            backgroundColor: Colors.white,
            foregroundColor: AppColors.textPrimary,
            centerTitle: true,
          ),
          body: Stack(
            children: [
              ListView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                children: [
                  _section(
                    '1. Upload Your CV (Optional)',
                    'AI reads this CV only for this interview to ask realistic questions. It is not added to your profile.',
                    _buildCvPicker(),
                  ),
                  _section(
                    '2. Target Job Role',
                    null,
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          controller: _roleController,
                          textInputAction: TextInputAction.done,
                          decoration: _inputDecoration(
                            'e.g. Senior Java Backend Developer',
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Seniority Level',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _seniorityLevels
                              .map(
                                (level) => ChoiceChip(
                                  label: Text(level),
                                  selected: _seniority == level,
                                  onSelected: (_) =>
                                      setState(() => _seniority = level),
                                ),
                              )
                              .toList(),
                        ),
                      ],
                    ),
                  ),
                  _section(
                    '3. Interview Focus Area',
                    null,
                    Column(
                      children: MockInterviewFocusArea.values
                          .map(_buildFocusAreaTile)
                          .toList(),
                    ),
                  ),
                  _section(
                    '4. Number of Questions (5 - 10)',
                    'Each question may have up to 1 follow-up question if clarification is needed.',
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _questionCounts
                          .map(
                            (count) => ChoiceChip(
                              label: Text('$count'),
                              selected: _questionCount == count,
                              onSelected: (_) =>
                                  setState(() => _questionCount = count),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 48,
                    child: AppButton(
                      label: 'Start Interview Now',
                      isLoading: state.isStarting,
                      onPressed: _submit,
                    ),
                  ),
                ],
              ),
              if (state.isStarting) const _StartingOverlay(),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCvPicker() {
    final file = _cvFile;
    if (file != null) {
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.primaryLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.primary),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.picture_as_pdf_rounded,
              size: 20,
              color: AppColors.primary,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    file.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    FileHelpers.formatSize(file.size),
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              tooltip: 'Remove CV',
              icon: const Icon(Icons.close_rounded, size: 20),
              onPressed: () => setState(() => _cvFile = null),
            ),
          ],
        ),
      );
    }
    return InkWell(
      onTap: _pickCv,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: const Column(
          children: [
            Icon(Icons.upload_file_rounded, color: AppColors.textSecondary),
            SizedBox(height: 4),
            Text(
              'Choose a PDF CV (max 5 MB)',
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            Text(
              'Without a CV, AI interviews you based on your target role.',
              style: TextStyle(fontSize: 11, color: AppColors.textMuted),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFocusAreaTile(MockInterviewFocusArea area) {
    return _choiceTile(
      icon: Icons.track_changes_rounded,
      title: area.label,
      subtitle: area.description,
      selected: _focusArea == area,
      onTap: () => setState(() => _focusArea = area),
    );
  }

  Widget _choiceTile({
    required IconData icon,
    required String title,
    required bool selected,
    required VoidCallback onTap,
    String? subtitle,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: selected ? AppColors.primaryLight : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: selected ? AppColors.primary : AppColors.border,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: selected ? AppColors.primary : AppColors.textMuted,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (subtitle != null)
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 11.5,
                          color: AppColors.textSecondary,
                        ),
                      ),
                  ],
                ),
              ),
              if (selected)
                const Icon(
                  Icons.check_circle_rounded,
                  size: 18,
                  color: AppColors.primary,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _section(String title, String? hint, Widget child) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 13.5,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          if (hint != null) ...[
            const SizedBox(height: 2),
            Text(
              hint,
              style: const TextStyle(
                fontSize: 11.5,
                color: AppColors.textSecondary,
              ),
            ),
          ],
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.border),
      ),
    );
  }
}

class _StartingOverlay extends StatelessWidget {
  const _StartingOverlay();

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: ColoredBox(
        color: Colors.black.withValues(alpha: 0.35),
        child: const Center(
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text(
                    'AI is preparing your questions...',
                    style: TextStyle(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
