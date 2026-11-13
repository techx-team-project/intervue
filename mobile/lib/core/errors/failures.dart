import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';

/// UI-friendly error. Bloc/Cubit only work with `Failure`.
sealed class Failure extends Equatable {
  const Failure(this.message);

  factory Failure.fromException(Object error) {
    return switch (error) {
      NetworkException() => NetworkFailure(error.message),
      UnauthorizedException() => UnauthorizedFailure(error.message),
      ForbiddenException() => ForbiddenFailure(error.message),
      ServerException() => ServerFailure(
        error.message,
        code: error.code,
        retryAfterSeconds: error.retryAfterSeconds,
      ),
      CacheException() => CacheFailure(error.message),
      AppException() => UnknownFailure(error.message),
      _ => const UnknownFailure('An unknown error occurred'),
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
  const ServerFailure(super.message, {this.code, this.retryAfterSeconds});

  final String? code;
  final int? retryAfterSeconds;

  @override
  List<Object?> get props => [...super.props, code, retryAfterSeconds];
}

final class CacheFailure extends Failure {
  const CacheFailure(super.message);
}

final class UnknownFailure extends Failure {
  const UnknownFailure(super.message);
}
