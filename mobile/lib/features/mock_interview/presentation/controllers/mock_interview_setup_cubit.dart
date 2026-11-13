import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/ai_failure_message.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/start_mock_interview_request.dart';
import 'package:intervue_flutter/features/mock_interview/data/repositories/mock_interview_repository_impl.dart';

class MockInterviewSetupState extends Equatable {
  const MockInterviewSetupState({
    this.isStarting = false,
    this.errorMessage,
    this.startedSession,
  });

  final bool isStarting;
  final String? errorMessage;
  final MockInterviewDetail? startedSession;

  MockInterviewSetupState copyWith({
    bool? isStarting,
    String? errorMessage,
    MockInterviewDetail? startedSession,
  }) => MockInterviewSetupState(
    isStarting: isStarting ?? this.isStarting,
    errorMessage: errorMessage,
    startedSession: startedSession ?? this.startedSession,
  );

  @override
  List<Object?> get props => [isStarting, errorMessage, startedSession];
}

class MockInterviewSetupCubit extends Cubit<MockInterviewSetupState> {
  MockInterviewSetupCubit(this._interviews)
    : super(const MockInterviewSetupState());

  final MockInterviewRepositoryImpl _interviews;

  Future<void> start(StartMockInterviewRequest request) async {
    if (state.isStarting) return;
    emit(state.copyWith(isStarting: true));
    try {
      final session = await _interviews.startSession(request);
      emit(state.copyWith(isStarting: false, startedSession: session));
    } catch (e) {
      emit(
        state.copyWith(
          isStarting: false,
          errorMessage: aiFailureMessage(Failure.fromException(e)),
        ),
      );
    }
  }
}
