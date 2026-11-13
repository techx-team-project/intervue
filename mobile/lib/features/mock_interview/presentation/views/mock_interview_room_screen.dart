import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_room_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/widgets/mock_interview_result_view.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/widgets/mock_interview_room_view.dart';

class MockInterviewRoomScreen extends StatefulWidget {
  const MockInterviewRoomScreen({required this.sessionId, super.key});

  final int sessionId;

  @override
  State<MockInterviewRoomScreen> createState() =>
      _MockInterviewRoomScreenState();
}

class _MockInterviewRoomScreenState extends State<MockInterviewRoomScreen> {
  @override
  void initState() {
    super.initState();
    context.read<MockInterviewRoomCubit>().load(widget.sessionId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'AI Mock Interview',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        centerTitle: true,
      ),
      body: BlocConsumer<MockInterviewRoomCubit, MockInterviewRoomState>(
        listener: (context, state) {
          final message = state.errorMessage;
          if (message != null && state.session != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(message),
                backgroundColor: AppColors.error,
              ),
            );
            context.read<MockInterviewRoomCubit>().clearError();
          }
        },
        builder: (context, state) {
          final session = state.session;
          return switch (state.phase) {
            MockInterviewPhase.loading => const Center(
              child: CircularProgressIndicator(),
            ),
            MockInterviewPhase.failure => _FailureView(
              message:
                  state.errorMessage ??
                  'Unable to load this interview session.',
              onRetry: () =>
                  context.read<MockInterviewRoomCubit>().load(widget.sessionId),
            ),
            MockInterviewPhase.completed when session != null =>
              MockInterviewResultView(
                session: session,
                onStartNew: () =>
                    context.pushReplacement(RouteNames.mockInterviewNew),
                onViewHistory: () => context.go(RouteNames.mockInterviews),
              ),
            _ when session != null => MockInterviewRoomView(
              key: ValueKey(
                'room-${session.currentQuestionIndex}-${state.phase.name}',
              ),
              state: state,
            ),
            _ => const SizedBox.shrink(),
          };
        },
      ),
    );
  }
}

class _FailureView extends StatelessWidget {
  const _FailureView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 40,
              color: AppColors.error,
            ),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            OutlinedButton(onPressed: onRetry, child: const Text('Try Again')),
          ],
        ),
      ),
    );
  }
}
