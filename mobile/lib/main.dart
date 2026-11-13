import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/app/app.dart';
import 'package:intervue_flutter/app/app_bloc_observer.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  Bloc.observer = const AppBlocObserver();
  configureDependencies();
  // Reads the stored token; the router on splash navigates once there is a result.
  getIt<AuthBloc>().add(const AuthStarted());
  runApp(const App());
}
