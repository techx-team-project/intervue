import 'package:dio/dio.dart';

/// Exception thrown from the data layer (Dio, storage...). The presentation layer does not catch it
/// directly but maps it through `Failure.fromException`.
class AppException implements Exception {
  const AppException(this.message, {this.statusCode});

  /// Maps Dio errors to domain exceptions, preferring the `message` returned by Spring Boot.
  factory AppException.fromDioException(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.transformTimeout:
      case DioExceptionType.connectionError:
        return const NetworkException();
      case DioExceptionType.badResponse:
        final status = e.response?.statusCode;
        final message = _messageFromBody(e.response?.data);
        final code = _codeFromBody(e.response?.data);
        final retryAfter = int.tryParse(
          e.response?.headers.value('retry-after') ?? '',
        );
        return switch (status) {
          401 => UnauthorizedException(message, statusCode: status),
          403 => ForbiddenException(message, statusCode: status),
          _ => ServerException(
            message ?? 'Server error, please try again later',
            statusCode: status,
            code: code,
            retryAfterSeconds: retryAfter,
          ),
        };
      case DioExceptionType.cancel:
        return const AppException('Request cancelled');
      case DioExceptionType.badCertificate:
      case DioExceptionType.unknown:
        return const AppException('An unknown error occurred');
    }
  }

  final String message;
  final int? statusCode;

  static String? _codeFromBody(Object? body) {
    if (body is Map<String, dynamic>) {
      final error = body['error'];
      if (error is Map<String, dynamic>) {
        final code = error['code'];
        if (code is String && code.isNotEmpty) return code;
      }
    }
    return null;
  }

  static String? _messageFromBody(Object? body) {
    if (body is Map<String, dynamic>) {
      final message = body['message'];
      if (message is String && message.isNotEmpty) return message;
    }
    return null;
  }

  @override
  String toString() => '$runtimeType($statusCode): $message';
}

class ServerException extends AppException {
  const ServerException(
    super.message, {
    super.statusCode,
    this.code,
    this.retryAfterSeconds,
  });

  final String? code;
  final int? retryAfterSeconds;
}

class UnauthorizedException extends AppException {
  const UnauthorizedException(String? message, {super.statusCode})
    : super(message ?? 'Your session has expired');
}

class ForbiddenException extends AppException {
  const ForbiddenException(String? message, {super.statusCode})
    : super(message ?? 'You do not have permission to perform this action');
}

class NetworkException extends AppException {
  const NetworkException()
    : super('Unable to connect, please check your network and try again');
}

class CacheException extends AppException {
  const CacheException([super.message = 'Unable to read locally stored data']);
}
