import 'dart:async';

/// Notifies the whole app when the token cannot be refreshed (sign-in required again).
class SessionExpiredNotifier {
  final StreamController<void> _controller = StreamController<void>.broadcast();

  Stream<void> get stream => _controller.stream;

  void notify() {
    if (!_controller.isClosed) _controller.add(null);
  }

  Future<void> dispose() => _controller.close();
}
