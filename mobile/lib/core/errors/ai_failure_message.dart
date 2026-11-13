import 'package:intervue_flutter/core/errors/failures.dart';

String aiFailureMessage(Failure failure) => switch (failure) {
  NetworkFailure() =>
    'Unable to reach the server, please check your connection.',
  UnauthorizedFailure() => 'Your session has expired, please sign in again.',
  ForbiddenFailure() => 'You do not have permission to perform this action.',
  ServerFailure() => _serverMessage(failure),
  _ => 'Something went wrong, please try again later.',
};

String _serverMessage(ServerFailure failure) {
  switch (failure.code) {
    case 'AI_USER_QUOTA_EXCEEDED':
      return 'You have reached your daily AI usage limit. Please come back tomorrow.';
    case 'RATE_LIMITED':
      final wait = failure.retryAfterSeconds;
      return wait != null && wait > 0
          ? 'Too many requests. Please try again in $wait seconds.'
          : 'Too many requests. Please try again in a few minutes.';
    case 'CV_TEXT_NOT_READABLE':
      return 'We could not read text from this CV. Please upload a text-based PDF, not a scanned image.';
    case 'AI_NOT_CONFIGURED':
    case 'AI_PROVIDER_BUSY':
    case 'AI_PROVIDER_TIMEOUT':
    case 'AI_PROVIDER_ERROR':
    case 'AI_REQUEST_REFUSED':
      return 'The AI service is busy or unavailable. Please try again shortly.';
    default:
      return failure.message;
  }
}
