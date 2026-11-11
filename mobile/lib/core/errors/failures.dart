import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';

/// Lỗi ở dạng thân thiện cho UI. Bloc/Cubit chỉ làm việc với `Failure`.
sealed class Failure extends Equatable {
  const Failure(this.message);

  factory Failure.fromException(Object error) {
    return switch (error) {
      NetworkException() => NetworkFailure(error.message),
      UnauthorizedException() => UnauthorizedFailure(error.message),
      ForbiddenException() => ForbiddenFailure(error.message),
      ServerException() => ServerFailure(error.message),
      CacheException() => CacheFailure(error.message),
      AppException() => UnknownFailure(error.message),
      _ => const UnknownFailure('Đã xảy ra lỗi không xác định'),
    };
  }

  final String message;

  @override
  List<Object?> get props => [message];
}

final class NetworkFailure extends Failure {
  const NetworkFailure(super.message);
}

final class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure(super.message);
}

final class ForbiddenFailure extends Failure {
  const ForbiddenFailure(super.message);
}

final class ServerFailure extends Failure {
  const ServerFailure(super.message);
}

final class CacheFailure extends Failure {
  const CacheFailure(super.message);
}

final class UnknownFailure extends Failure {
  const UnknownFailure(super.message);
}
