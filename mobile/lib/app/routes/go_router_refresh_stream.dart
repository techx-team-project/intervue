import 'dart:async';

import 'package:flutter/foundation.dart';

/// Turns a [Stream] into a [Listenable] so `GoRouter.refreshListenable`
/// re-runs `redirect` whenever the sign-in state changes.
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
