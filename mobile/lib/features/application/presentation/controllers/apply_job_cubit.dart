import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/application/data/models/save_application_request.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_state.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';

class ApplyJobCubit extends Cubit<ApplyJobState> {
  ApplyJobCubit({
    required ApplicationRepositoryImpl applicationRepository,
    required ResumeRepositoryImpl resumeRepository,
  }) : _appRepo = applicationRepository,
       _resumeRepo = resumeRepository,
       super(const ApplyJobInitial());

  final ApplicationRepositoryImpl _appRepo;
  final ResumeRepositoryImpl _resumeRepo;

  Future<void> loadForm(int jobId) async {
    emit(const ApplyJobLoading());
    try {
      final form = await _appRepo.getForm(jobId);
      List<CandidateResumeModel> resumes = const [];
      try {
        resumes = await _resumeRepo.getCandidateCvs();
      } catch (_) {
        // Continue if CV loading fails so user can still see form
      }

      final existingApp = form.application;
      int? selectedId;
      final answers = <int, String>{};
      String initialCoverLetter = '';

      if (existingApp != null) {
        selectedId = existingApp.resumeId;
        initialCoverLetter = existingApp.coverLetter ?? '';
        for (final ans in existingApp.answers) {
          answers[ans.questionId] = ans.answer;
        }
      }

      if (selectedId == null && resumes.isNotEmpty) {
        final defaultCv = resumes.where((r) => r.isDefault).firstOrNull;
        selectedId = defaultCv?.id ?? resumes.first.id;
      }

      emit(
        ApplyJobReady(
          form: form,
          resumes: resumes,
          selectedResumeId: selectedId,
          answers: answers,
          coverLetter: initialCoverLetter,
        ),
      );
    } catch (e) {
      emit(ApplyJobFailure(Failure.fromException(e).message));
    }
  }

  void selectResume(int resumeId) {
    final state = this.state;
    if (state is! ApplyJobReady) return;
    emit(state.copyWith(selectedResumeId: resumeId, clearActionError: true));
  }

  void addAndSelectResume(CandidateResumeModel resume) {
    final state = this.state;
    if (state is! ApplyJobReady) return;
    final updatedList = [
      resume,
      ...state.resumes.where((r) => r.id != resume.id),
    ];
    emit(
      state.copyWith(
        resumes: updatedList,
        selectedResumeId: resume.id,
        clearActionError: true,
      ),
    );
  }

  void updateAnswer(int questionId, String answer) {
    final state = this.state;
    if (state is! ApplyJobReady) return;
    final updated = Map<int, String>.from(state.answers);
    updated[questionId] = answer;
    emit(state.copyWith(answers: updated, clearActionError: true));
  }

  void updateCoverLetter(String text) {
    final state = this.state;
    if (state is! ApplyJobReady) return;
    emit(state.copyWith(coverLetter: text, clearActionError: true));
  }

  Future<void> submit() async {
    final state = this.state;
    if (state is! ApplyJobReady || state.isSubmitting) return;

    if (state.selectedResumeId == null) {
      emit(
        state.copyWith(
          actionError: 'Vui lòng chọn hoặc tải lên một CV để ứng tuyển',
        ),
      );
      return;
    }

    for (final q in state.form.questions) {
      if (q.required) {
        final ans = state.answers[q.id]?.trim() ?? '';
        if (ans.isEmpty) {
          emit(
            state.copyWith(
              actionError: 'Vui lòng trả lời câu hỏi bắt buộc: "${q.prompt}"',
            ),
          );
          return;
        }
      }
    }

    emit(state.copyWith(isSubmitting: true, clearActionError: true));

    try {
      final answerList = state.answers.entries
          .where((e) => e.value.trim().isNotEmpty)
          .map(
            (e) => SaveApplicationAnswer(
              questionId: e.key,
              answer: e.value.trim(),
            ),
          )
          .toList();

      final request = SaveApplicationRequest(
        jobId: state.form.jobId,
        resumeId: state.selectedResumeId,
        coverLetter: state.coverLetter,
        answers: answerList,
      );

      final result = await _appRepo.submit(request);
      emit(
        ApplyJobSuccess(
          application: result,
          message: 'Nộp hồ sơ ứng tuyển thành công!',
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          isSubmitting: false,
          actionError: Failure.fromException(e).message,
        ),
      );
    }
  }

  Future<void> saveDraft() async {
    final state = this.state;
    if (state is! ApplyJobReady || state.isSavingDraft) return;

    emit(state.copyWith(isSavingDraft: true, clearActionError: true));

    try {
      final answerList = state.answers.entries
          .where((e) => e.value.trim().isNotEmpty)
          .map(
            (e) => SaveApplicationAnswer(
              questionId: e.key,
              answer: e.value.trim(),
            ),
          )
          .toList();

      final request = SaveApplicationRequest(
        jobId: state.form.jobId,
        resumeId: state.selectedResumeId,
        coverLetter: state.coverLetter,
        answers: answerList,
      );

      final result = await _appRepo.saveDraft(request);
      emit(
        ApplyJobSuccess(
          application: result,
          isDraft: true,
          message: 'Lưu bản nháp thành công!',
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          isSavingDraft: false,
          actionError: Failure.fromException(e).message,
        ),
      );
    }
  }

  Future<void> reapply(int resumeId) async {
    final state = this.state;
    if (state is! ApplyJobReady || state.isSubmitting) return;

    final app = state.form.application;
    if (app == null) return;

    emit(state.copyWith(isSubmitting: true, clearActionError: true));

    try {
      final result = await _appRepo.reapply(app.id, resumeId);
      emit(
        ApplyJobSuccess(
          application: result,
          message: 'Nộp lại hồ sơ thành công!',
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          isSubmitting: false,
          actionError: Failure.fromException(e).message,
        ),
      );
    }
  }

  Future<void> withdraw() async {
    final state = this.state;
    if (state is! ApplyJobReady || state.isSubmitting) return;

    final app = state.form.application;
    if (app == null) return;

    emit(state.copyWith(isSubmitting: true, clearActionError: true));

    try {
      final result = await _appRepo.withdraw(app.id);
      emit(
        ApplyJobSuccess(
          application: result,
          message: 'Đã rút hồ sơ ứng tuyển.',
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          isSubmitting: false,
          actionError: Failure.fromException(e).message,
        ),
      );
    }
  }
}
