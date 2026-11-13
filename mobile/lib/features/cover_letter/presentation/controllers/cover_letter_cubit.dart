import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/cover_letter/data/models/cover_letter_result.dart';
import 'package:intervue_flutter/features/cover_letter/data/repositories/cover_letter_repository_impl.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';

part 'cover_letter_state.dart';

class CoverLetterCubit extends Cubit<CoverLetterState> {
  CoverLetterCubit(this._repository, this._profileRepository, this._authBloc)
    : super(const CoverLetterState());

  final CoverLetterRepositoryImpl _repository;
  final ProfileRepositoryImpl _profileRepository;
  final AuthBloc _authBloc;

  Future<void> generate(
    JobEntity job, {
    CoverLetterLanguage language = CoverLetterLanguage.vietnamese,
  }) async {
    emit(CoverLetterState(language: language));
    try {
      final letter = await _repository.generate(
        jobTitle: job.title,
        companyName: job.companyName,
        requirements: _splitLines(job.requirements),
        description: '${job.description ?? ''}\n\n${language.instruction}'
            .trim(),
        candidateName: await _candidateName(),
      );
      emit(
        CoverLetterState(
          status: CoverLetterStatus.success,
          language: language,
          letter: letter,
        ),
      );
    } catch (e) {
      emit(
        CoverLetterState(
          status: CoverLetterStatus.failure,
          language: language,
          errorMessage: _messageFor(e),
        ),
      );
    }
  }

  Future<String?> _candidateName() async {
    if (_authBloc.state is! AuthAuthenticated) return null;
    try {
      return (await _profileRepository.fetchCurrentUser()).fullName;
    } catch (_) {
      return null;
    }
  }

  static List<String> _splitLines(String? text) {
    if (text == null) return const [];
    return text
        .split('\n')
        .map((line) => line.replaceFirst(RegExp(r'^\s*[-•*]\s*'), '').trim())
        .where((line) => line.isNotEmpty)
        .toList();
  }

  static String _messageFor(Object error) {
    if (error is AppException) {
      switch (error.statusCode) {
        case 429:
          return 'You have used all your AI requests. Please try again later or sign in for more.';
        case 503:
          return 'The AI service is busy, please try again in a few minutes.';
      }
    }
    return Failure.fromException(error).message;
  }
}
