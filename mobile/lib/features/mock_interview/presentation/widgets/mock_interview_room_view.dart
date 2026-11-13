import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/app_button.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_question.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/submit_answer_result.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_room_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/widgets/mock_interview_score.dart';

class MockInterviewRoomView extends StatefulWidget {
  const MockInterviewRoomView({required this.state, super.key});

  final MockInterviewRoomState state;

  @override
  State<MockInterviewRoomView> createState() => _MockInterviewRoomViewState();
}

class _MockInterviewRoomViewState extends State<MockInterviewRoomView> {
  final _answerController = TextEditingController();
  final _followUpController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _answerController.addListener(_onTextChanged);
    _followUpController.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    _answerController.dispose();
    _followUpController.dispose();
    super.dispose();
  }

  void _onTextChanged() => setState(() {});

  @override
  Widget build(BuildContext context) {
    final state = widget.state;
    final session = state.session!;
    final question = session.currentQuestion;
    if (question == null) {
      return const Center(
        child: Text('No questions found for this interview session.'),
      );
    }
    final result = state.result;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _Header(session: session),
        const SizedBox(height: 12),
        _QuestionCard(question: question),
        const SizedBox(height: 12),
        if (state.phase == MockInterviewPhase.answering)
          _buildAnswerForm(state)
        else if (result != null)
          _buildFeedback(state, result),
      ],
    );
  }

  Widget _buildAnswerForm(MockInterviewRoomState state) {
    final isEmpty = _answerController.text.trim().isEmpty;
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _Label('Your Answer'),
          const SizedBox(height: 8),
          TextField(
            controller: _answerController,
            enabled: !state.isSubmitting,
            minLines: 5,
            maxLines: 10,
            textCapitalization: TextCapitalization.sentences,
            decoration: _decoration(
              'Explain your approach, technical solution, or practical experience...',
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Tip: Structure your response using the STAR method (Situation, Task, Action, Result).',
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ),
              Text(
                '${_answerController.text.length} characters',
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 46,
            child: AppButton(
              label: 'Submit Answer',
              isLoading: state.isSubmitting,
              onPressed: isEmpty
                  ? null
                  : () => context.read<MockInterviewRoomCubit>().submitAnswer(
                      _answerController.text,
                    ),
            ),
          ),
          if (state.isSubmitting) const _EvaluatingNote(),
        ],
      ),
    );
  }

  Widget _buildFeedback(
    MockInterviewRoomState state,
    SubmitAnswerResult result,
  ) {
    final cubit = context.read<MockInterviewRoomCubit>();
    final followUpEmpty = _followUpController.text.trim().isEmpty;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (state.submittedAnswer != null)
          _Card(
            tint: AppColors.chipBackground,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _Label('Your Answer'),
                const SizedBox(height: 6),
                Text(
                  state.submittedAnswer!,
                  style: const TextStyle(
                    fontSize: 13,
                    height: 1.5,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 12),
        _Card(
          tint: AppColors.primaryLight,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.auto_awesome,
                    size: 16,
                    color: AppColors.primary,
                  ),
                  const SizedBox(width: 6),
                  const Expanded(child: _Label('AI Feedback & Assessment')),
                  if (result.score != null)
                    MockInterviewScoreChip(score: result.score!),
                ],
              ),
              if (result.feedback?.isNotEmpty ?? false) ...[
                const SizedBox(height: 8),
                Text(
                  result.feedback!,
                  style: const TextStyle(
                    fontSize: 13,
                    height: 1.5,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
              if (result.idealAnswer?.isNotEmpty ?? false) ...[
                const Divider(height: 24),
                const Row(
                  children: [
                    Icon(
                      Icons.lightbulb_outline_rounded,
                      size: 16,
                      color: AppColors.success,
                    ),
                    SizedBox(width: 6),
                    _Label('Model Answer / Recommendation'),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  result.idealAnswer!,
                  style: const TextStyle(
                    fontSize: 12.5,
                    height: 1.5,
                    fontStyle: FontStyle.italic,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 12),
        if (result.needsFollowUp && result.followUpQuestion != null)
          _Card(
            tint: const Color(0xFFFFFBEB),
            borderColor: const Color(0xFFFCD34D),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(
                      Icons.help_outline_rounded,
                      size: 16,
                      color: Color(0xFFB45309),
                    ),
                    SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'AI Follow-Up Clarification (Max 1 follow-up question)',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF92400E),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  result.followUpQuestion!,
                  style: const TextStyle(
                    fontSize: 14,
                    height: 1.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _followUpController,
                  enabled: !state.isSubmitting,
                  minLines: 4,
                  maxLines: 8,
                  textCapitalization: TextCapitalization.sentences,
                  decoration: _decoration(
                    'Enter your additional explanation to clarify this question...',
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: AppButton(
                    label: 'Submit Clarification',
                    isLoading: state.isSubmitting,
                    onPressed: followUpEmpty
                        ? null
                        : () => cubit.submitFollowUp(_followUpController.text),
                  ),
                ),
                if (state.isSubmitting) const _EvaluatingNote(),
              ],
            ),
          )
        else
          SizedBox(
            width: double.infinity,
            height: 46,
            child: FilledButton.icon(
              onPressed: cubit.nextQuestion,
              icon: const Icon(Icons.arrow_forward_rounded),
              label: const Text('Proceed to Next Question'),
            ),
          ),
      ],
    );
  }

  InputDecoration _decoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.all(14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.session});

  final MockInterviewDetail session;

  @override
  Widget build(BuildContext context) {
    final position = session.currentQuestionIndex + 1;
    final total = session.questionCount == 0 ? 1 : session.questionCount;
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    session.targetRole,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryDarker,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.chipBackground,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  session.seniorityLevel,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Question $position of ${session.questionCount}',
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: (position / total).clamp(0, 1).toDouble(),
              minHeight: 8,
              backgroundColor: AppColors.borderSubtle,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
}

class _QuestionCard extends StatelessWidget {
  const _QuestionCard({required this.question});

  final MockInterviewQuestion question;

  @override
  Widget build(BuildContext context) {
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.help_outline_rounded,
                size: 16,
                color: AppColors.primary,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Question ${question.questionOrder} • Category: ${question.category}',
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.6,
                    color: AppColors.textMuted,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            question.questionText,
            style: const TextStyle(
              fontSize: 17,
              height: 1.5,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _EvaluatingNote extends StatelessWidget {
  const _EvaluatingNote();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.only(top: 10),
      child: Text(
        'AI is evaluating your answer, please wait a moment...',
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 12,
          fontStyle: FontStyle.italic,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}

class _Label extends StatelessWidget {
  const _Label(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 12.5,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
    );
  }
}

class _Card extends StatelessWidget {
  const _Card({
    required this.child,
    this.tint = Colors.white,
    this.borderColor = AppColors.border,
  });

  final Widget child;
  final Color tint;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: tint,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: child,
    );
  }
}
