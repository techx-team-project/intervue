import 'package:intervue_flutter/app/routes/route_names.dart';

abstract final class ChatLinkResolver {
  static const Map<String, String> _exactRoutes = {
    '/jobs': RouteNames.jobs,
    '/cv-templates': RouteNames.resume,
    '/candidate/profile': RouteNames.applications,
    '/account/security': RouteNames.security,
    '/candidate/mock-interviews': RouteNames.mockInterviews,
  };

  static String? routeFor(String url) {
    final uri = Uri.tryParse(url);
    if (uri == null || uri.hasScheme) return null;
    final path = uri.path;
    if (path.startsWith('/jobs/') || path.startsWith('/companies/')) {
      return RouteNames.jobs;
    }
    return _exactRoutes[path];
  }

  static bool isExternal(String url) {
    final uri = Uri.tryParse(url);
    return uri != null && uri.hasScheme;
  }
}
