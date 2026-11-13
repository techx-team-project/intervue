import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';

class ProfileIdentity {
  const ProfileIdentity({
    required this.name,
    required this.subtitle,
    required this.initials,
    required this.isGuest,
  });

  factory ProfileIdentity.resolve({
    required bool isAuthenticated,
    required ProfileState profile,
  }) {
    if (!isAuthenticated) {
      return const ProfileIdentity(
        name: 'You are not signed in',
        subtitle: 'Sign in to sync your profile',
        initials: '?',
        isGuest: true,
      );
    }
    final user = profile is ProfileLoaded ? profile.user : null;
    if (user == null) {
      return const ProfileIdentity(
        name: 'Loading account...',
        subtitle: '',
        initials: '...',
        isGuest: false,
      );
    }
    final fullName = user.fullName?.trim();
    final name = (fullName == null || fullName.isEmpty) ? user.email : fullName;
    return ProfileIdentity(
      name: name,
      subtitle: user.email,
      initials: _initialsOf(name),
      isGuest: false,
    );
  }

  final String name;
  final String subtitle;
  final String initials;
  final bool isGuest;

  static String _initialsOf(String name) {
    final words = name
        .split(RegExp(r'\s+'))
        .where((w) => w.isNotEmpty)
        .toList();
    if (words.isEmpty) return '?';
    if (words.length == 1) return words.first[0].toUpperCase();
    return (words.first[0] + words.last[0]).toUpperCase();
  }
}
