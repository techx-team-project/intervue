import 'dart:async';

import 'package:flutter/foundation.dart';

/// Chuyển một [Stream] thành [Listenable] để `GoRouter.refreshListenable`
/// chạy lại `redirect` mỗi khi trạng thái đăng nhập thay đổi.
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    _subscription = stream.listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    unawaited(_subscription.cancel());
    super.dispose();
  }
}
