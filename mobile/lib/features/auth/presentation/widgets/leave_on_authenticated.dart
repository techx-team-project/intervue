import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';

/// Rời màn đăng nhập ngay khi đăng nhập thành công, dù màn được mở bằng `go` hay `push`.
class LeaveOnAuthenticated extends StatelessWidget {
  const LeaveOnAuthenticated({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listenWhen: (previous, current) =>
          current is AuthAuthenticated && previous is! AuthAuthenticated,
      listener: (context, _) {
        final router = GoRouter.of(context);
        if (router.canPop()) {
          router.pop();
        } else {
          router.go(RouteNames.jobs);
        }
      },
      child: child,
    );
  }
}
