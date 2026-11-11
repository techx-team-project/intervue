abstract final class RouteNames {
  // Public
  static const String splash = '/splash';
  static const String login = '/login';
  static const String register = '/register';
  static const String upgrade = '/upgrade';
  static const String aiChat = '/ai-chat';
  static const String jobs = '/jobs';
  static const String blog = '/blog';
  static String blogPost(String categorySlug, String slug) =>
      '/blog/$categorySlug/$slug';

  // Protected (yêu cầu đăng nhập)
  static const String resume = '/resume';
  static const String applications = '/applications';
  static const String jobAlerts = '/job-alerts';
  static const String security = '/security';

  static const List<String> protectedRoutes = [
    resume,
    applications,
    jobAlerts,
    security,
  ];
}
