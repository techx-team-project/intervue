/// Keys in `RequestOptions.extra` that control the interceptors.
abstract final class RequestFlags {
  /// Public request: no Bearer token attached, no refresh on 401.
  static const String skipAuth = 'skipAuth';

  /// Request already retried after a token refresh, to avoid infinite loops.
  static const String retried = 'retried';
}
