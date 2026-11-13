import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_summary.dart';
import 'package:intervue_flutter/features/mock_interview/data/repositories/mock_interview_repository_impl.dart';

sealed class MockInterviewHistoryState extends Equatable {
  const MockInterviewHistoryState();

  @override
  List<Object?> get props => [];
}

final class MockInterviewHistoryLoading extends MockInterviewHistoryState {
  const MockInterviewHistoryLoading();
}

final class MockInterviewHistoryLoaded extends MockInterviewHistoryState {
  const MockInterviewHistoryLoaded(this.sessions);

  final List<MockInterviewSummary> sessions;

  @override
  List<Object?> get props => [sessions];
}

final class MockInterviewHistoryError extends MockInterviewHistoryState {
  const MockInterviewHistoryError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}

class MockInterviewHistoryCubit extends Cubit<MockInterviewHistoryState> {
  MockInterviewHistoryCubit(this._repository)
    : super(const MockInterviewHistoryLoading());

  final MockInterviewRepositoryImpl _repository;

  Future<void> load({bool isRefresh = false}) async {
    if (!isRefresh) emit(const MockInterviewHistoryLoading());
    try {
      emit(MockInterviewHistoryLoaded(await _repository.listHistory()));
    } catch (e) {
      emit(MockInterviewHistoryError(Failure.fromException(e).message));
    }
  }
}
