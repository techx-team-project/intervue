import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';

part 'resume_review_state.dart';

class ResumeReviewCubit extends Cubit<ResumeReviewState> {
  ResumeReviewCubit(this._repository) : super(const ResumeReviewState());

  final ResumeRepositoryImpl _repository;

  Future<void> loadQuota() async {
    try {
      emit(state.copyWith(quota: await _repository.fetchQuota()));
    } catch (_) {
      return;
    }
  }

  Future<void> reviewCv({
    required List<int> bytes,
    required String fileName,
    required int sizeBytes,
    String? targetPosition,
  }) async {
    if (FileHelpers.extensionOf(fileName) != 'pdf') {
      emit(
        state.copyWith(
          status: ResumeReviewStatus.failure,
          errorMessage: 'Chỉ hỗ trợ chấm CV định dạng PDF.',
        ),
      );
      return;
    }
    if (sizeBytes > AppConstants.maxCvSizeBytes) {
      final maxSize = FileHelpers.formatSize(AppConstants.maxCvSizeBytes);
      emit(
        state.copyWith(
          status: ResumeReviewStatus.failure,
          errorMessage: 'File vượt quá $maxSize, vui lòng chọn file nhẹ hơn.',
        ),
      );
      return;
    }

    emit(
      state.copyWith(
        status: ResumeReviewStatus.uploading,
        fileName: fileName,
        clearReview: true,
        clearError: true,
      ),
    );
    try {
      final review = await _repository.reviewCv(
        bytes: bytes,
        fileName: fileName,
        targetPosition: targetPosition?.trim(),
      );
      emit(state.copyWith(status: ResumeReviewStatus.success, review: review));
      await loadQuota();
    } catch (e) {
      emit(
        state.copyWith(
          status: ResumeReviewStatus.failure,
          errorMessage: _messageFor(e),
        ),
      );
    }
  }

  static String _messageFor(Object error) {
    if (error is AppException) {
      switch (error.statusCode) {
        case 429:
          return 'Bạn đã hết lượt chấm CV hôm nay. Vui lòng quay lại vào ngày mai.';
        case 404:
          return 'Bạn cần hoàn thiện hồ sơ ứng viên trước khi chấm CV. Hãy lưu hồ sơ rồi thử lại.';
        case 400:
          return 'Không đọc được nội dung CV. Hãy dùng file PDF dạng văn bản (không phải ảnh scan).';
        case 503:
          return 'Dịch vụ AI đang bận, vui lòng thử lại sau ít phút.';
      }
    }
    return Failure.fromException(error).message;
  }
}
