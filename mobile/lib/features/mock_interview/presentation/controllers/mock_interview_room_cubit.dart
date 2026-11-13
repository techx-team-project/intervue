import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/ai_failure_message.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/submit_answer_result.dart';
import 'package:intervue_flutter/features/mock_interview/data/repositories/mock_interview_repository_impl.dart';

enum MockInterviewPhase { loading, answering, feedback, completed, failure }

class MockInterviewRoomState extends Equatable {
  const MockInterviewRoomState({
    this.phase = MockInterviewPhase.loading,
    this.session,
    this.result,
    this.submittedAnswer,
    this.isSubmitting = false,
    this.errorMessage,
  });

  final MockInterviewPhase phase;
  final MockInterviewDetail? session;
  final SubmitAnswerResult? result;
  final String? submittedAnswer;
  final bool isSubmitting;
  final String? errorMessage;

  MockInterviewRoomState copyWith({
    MockInterviewPhase? phase,
    MockInterviewDetail? session,
    SubmitAnswerResult? result,
    String? submittedAnswer,
    bool? isSubmitting,
    String? errorMessage,
    bool clearResult = false,
  }) => MockInterviewRoomState(
    phase: phase ?? this.phase,
    session: session ?? this.session,
    result: clearResult ? null : result ?? this.result,
    submittedAnswer: clearResult
        ? null
        : submittedAnswer ?? this.submittedAnswer,
    isSubmitting: isSubmitting ?? this.isSubmitting,
    errorMessage: errorMessage,
  );

  @override
  List<Object?> get props => [
    phase,
    session,
    result,
    submittedAnswer,
    isSubmitting,
    errorMessage,
  ];
}

class MockInterviewRoomCubit extends Cubit<MockInterviewRoomState> {
  MockInterviewRoomCubit(this._repository, {MockInterviewDetail? initial})
    : super(
        initial == null ? const MockInterviewRoomState() : _stateFor(initial),
      );

  final MockInterviewRepositoryImpl _repository;

  static MockInterviewRoomState _stateFor(MockInterviewDetail session) {
    if (session.isCompleted) {
      return MockInterviewRoomState(
        phase: MockInterviewPhase.completed,
        session: session,
      );
    }
    final question = session.currentQuestion;
    if (question == null) {
      return const MockInterviewRoomState(phase: MockInterviewPhase.failure);
    }
    if (question.hasPendingFollowUp) {
      return MockInterviewRoomState(
        phase: MockInterviewPhase.feedback,
        session: session,
        result: SubmitAnswerResult.pendingFollowUp(question),
        submittedAnswer: question.candidateAnswer,
      );
    }
    return MockInterviewRoomState(
      phase: MockInterviewPhase.answering,
      session: session,
    );
  }

  Future<void> load(int id) async {
    if (state.session != null) return;
    emit(const MockInterviewRoomState());
    try {
      emit(_stateFor(await _repository.getSessionDetail(id)));
    } catch (e) {
      emit(
        MockInterviewRoomState(
          phase: MockInterviewPhase.failure,
          errorMessage: Failure.fromException(e).message,
        ),
      );
    }
  }

  Future<void> submitAnswer(String answer) async {
    final session = state.session;
    final question = session?.currentQuestion;
    if (session == null || question == null || state.isSubmitting) return;
    final trimmed = answer.trim();
    emit(state.copyWith(isSubmitting: true));
    try {
      final result = await _repository.submitAnswer(
        sessionId: session.id,
        questionId: question.id,
        answer: trimmed,
      );
      emit(_afterSubmit(result, submittedAnswer: trimmed));
    } catch (e) {
      emit(_submitFailed(e));
    }
  }

  Future<void> submitFollowUp(String followUpAnswer) async {
    final session = state.session;
    final question = session?.currentQuestion;
    if (session == null || question == null || state.isSubmitting) return;
    emit(state.copyWith(isSubmitting: true));
    try {
      final result = await _repository.submitFollowUp(
        sessionId: session.id,
        questionId: question.id,
        followUpAnswer: followUpAnswer.trim(),
      );
      emit(_afterSubmit(result));
    } catch (e) {
      emit(_submitFailed(e));
    }
  }

  void nextQuestion() {
    final session = state.session;
    final result = state.result;
    if (session == null || result == null || result.needsFollowUp) return;
    final answered = state.submittedAnswer;
    final questions = session.questions
        .map(
          (q) => q.id == result.questionId
              ? q.copyWith(
                  candidateAnswer: answered,
                  feedback: result.feedback,
                  score: result.score,
                  idealAnswer: result.idealAnswer,
                )
              : q,
        )
        .toList();
    emit(
      MockInterviewRoomState(
        phase: MockInterviewPhase.answering,
        session: session.copyWith(
          currentQuestionIndex: session.currentQuestionIndex + 1,
          questions: questions,
        ),
      ),
    );
  }

  void clearError() => emit(state.copyWith());

  MockInterviewRoomState _afterSubmit(
    SubmitAnswerResult result, {
    String? submittedAnswer,
  }) {
    final completed = result.completedSession;
    if (result.sessionCompleted && completed != null) {
      return MockInterviewRoomState(
        phase: MockInterviewPhase.completed,
        session: completed,
      );
    }
    return state.copyWith(
      phase: MockInterviewPhase.feedback,
      result: result,
      submittedAnswer: submittedAnswer,
      isSubmitting: false,
    );
  }

  MockInterviewRoomState _submitFailed(Object error) => state.copyWith(
    isSubmitting: false,
    errorMessage: aiFailureMessage(Failure.fromException(error)),
  );
}
