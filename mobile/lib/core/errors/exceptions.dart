import 'package:dio/dio.dart';

/// Ngoại lệ ném ra từ tầng data (Dio, storage...). Tầng presentation không bắt
/// trực tiếp mà chuyển qua `Failure.fromException`.
class AppException implements Exception {
  const AppException(this.message, {this.statusCode});

  /// Ánh xạ lỗi Dio sang ngoại lệ nghiệp vụ, ưu tiên `message` do Spring Boot trả về.
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
        return switch (status) {
          401 => UnauthorizedException(message, statusCode: status),
          403 => ForbiddenException(message, statusCode: status),
          _ => ServerException(
            message ?? 'Máy chủ gặp sự cố, vui lòng thử lại sau',
            statusCode: status,
          ),
        };
      case DioExceptionType.cancel:
        return const AppException('Yêu cầu đã bị huỷ');
      case DioExceptionType.badCertificate:
      case DioExceptionType.unknown:
        return const AppException('Đã xảy ra lỗi không xác định');
    }
  }

  final String message;
  final int? statusCode;

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
  const ServerException(super.message, {super.statusCode});
}

class UnauthorizedException extends AppException {
  const UnauthorizedException(String? message, {super.statusCode})
    : super(message ?? 'Phiên đăng nhập đã hết hạn');
}

class ForbiddenException extends AppException {
  const ForbiddenException(String? message, {super.statusCode})
    : super(message ?? 'Bạn không có quyền thực hiện thao tác này');
}

class NetworkException extends AppException {
  const NetworkException()
    : super('Không thể kết nối, vui lòng kiểm tra mạng và thử lại');
}

class CacheException extends AppException {
  const CacheException([super.message = 'Không đọc được dữ liệu lưu trên máy']);
}
