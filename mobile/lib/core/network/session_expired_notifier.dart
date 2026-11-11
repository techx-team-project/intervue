import 'dart:async';

/// Thông báo cho toàn app khi không thể refresh token (phải đăng nhập lại).
class SessionExpiredNotifier {
  final StreamController<void> _controller = StreamController<void>.broadcast();

  Stream<void> get stream => _controller.stream;

  void notify() {
    if (!_controller.isClosed) _controller.add(null);
  }

  Future<void> dispose() => _controller.close();
}
