import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/notification/data/models/notification_item.dart';
import 'package:intervue_flutter/features/notification/data/repositories/notification_repository_impl.dart';

part 'notifications_state.dart';

class NotificationsCubit extends Cubit<NotificationsState> {
  NotificationsCubit(this._repository, this._authBloc)
    : super(const NotificationsState()) {
    _authSubscription = _authBloc.stream.listen(_onAuthChanged);
    _onAuthChanged(_authBloc.state);
  }

  final NotificationRepositoryImpl _repository;
  final AuthBloc _authBloc;
  late final StreamSubscription<AuthState> _authSubscription;

  void _onAuthChanged(AuthState authState) {
    switch (authState) {
      case AuthAuthenticated():
        if (state.status == NotificationsStatus.initial ||
            state.status == NotificationsStatus.failure) {
          unawaited(load());
        }
      case AuthUnauthenticated():
        emit(const NotificationsState());
      case AuthUnknown():
        break;
    }
  }

  Future<void> load() async {
    emit(state.copyWith(status: NotificationsStatus.loading));
    try {
      final items = await _repository.fetchNotifications();
      final unread = await _repository.fetchUnreadCount();
      if (_authBloc.state is! AuthAuthenticated) return;
      emit(
        NotificationsState(
          status: NotificationsStatus.loaded,
          items: items,
          unreadCount: unread,
        ),
      );
    } catch (e) {
      if (_authBloc.state is! AuthAuthenticated) return;
      emit(
        NotificationsState(
          status: NotificationsStatus.failure,
          errorMessage: Failure.fromException(e).message,
        ),
      );
    }
  }

  Future<void> markRead(NotificationItem item) async {
    if (!item.isUnread) return;
    try {
      await _repository.markRead(item.id);
    } catch (_) {
      return;
    }
    emit(
      state.copyWith(
        items: [
          for (final e in state.items) e.id == item.id ? e.markedRead() : e,
        ],
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
      ),
    );
  }

  Future<void> markAllRead() async {
    try {
      await _repository.markAllRead();
    } catch (_) {
      return;
    }
    emit(
      state.copyWith(
        items: [for (final e in state.items) e.markedRead()],
        unreadCount: 0,
      ),
    );
  }

  @override
  Future<void> close() {
    unawaited(_authSubscription.cancel());
    return super.close();
  }
}
