abstract final class ApiEndpoints {
  static const String _v1 = '/api/v1';

  static const String login = '$_v1/auth/login';
  static const String verifyTwoFactor = '$_v1/auth/verify-2fa';
  static const String register = '$_v1/auth/register';
  static const String logout = '$_v1/auth/logout';
  static const String refreshToken = '$_v1/auth/refresh';

  static const String aiChat = '$_v1/ai/chat';
  static const String coverLetter = '$_v1/ai/cover-letter';

  static const String featuredBlogs = '$_v1/blogs/featured';
  static const String blogs = '$_v1/blogs';
  static const String blogCategories = '$_v1/blogs/categories';
  static String blogPost(String categorySlug, String slug) =>
      '$_v1/blogs/$categorySlug/$slug';
  static const String currentUser = '$_v1/users/me';

  static const String notifications = '$_v1/notifications';
  static const String notificationsUnreadCount =
      '$_v1/notifications/unread-count';
  static const String notificationsReadAll = '$_v1/notifications/read-all';
  static String notificationRead(int id) => '$_v1/notifications/$id/read';

  static const String cvReviewUpload = '$_v1/ai/cv-reviews/upload';
  static const String cvReviewQuota = '$_v1/ai/cv-reviews/quota';

  static const String candidateCvs = '$_v1/candidate/cvs';
  static String candidateCv(int id) => '$_v1/candidate/cvs/$id';
  static String candidateCvDownload(int id) =>
      '$_v1/candidate/cvs/$id/download';

  static const String candidateApplications = '$_v1/candidate/applications';
  static String candidateApplicationForm(int jobId) =>
      '$_v1/candidate/applications/form?jobId=$jobId';
  static String candidateApplicationDetail(int id) =>
      '$_v1/candidate/applications/$id';
  static const String candidateApplicationDraft =
      '$_v1/candidate/applications/draft';
  static String candidateApplicationWithdraw(int id) =>
      '$_v1/candidate/applications/$id/withdraw';
  static String candidateApplicationReapply(int id) =>
      '$_v1/candidate/applications/$id/reapply';
  static String candidateApplicationCvDownload(int id) =>
      '$_v1/candidate/applications/$id/cv';

  static const String candidateProfile = '$_v1/candidate/profile';
  static const String candidateProfileAvatar = '$_v1/candidate/profile/avatar';
  static const String candidateProfileCover = '$_v1/candidate/profile/cover';
  static const String candidateProfileExperiences =
      '$_v1/candidate/profile/experiences';
  static String candidateProfileExperience(int id) =>
      '$_v1/candidate/profile/experiences/$id';
  static const String candidateProfileEducations =
      '$_v1/candidate/profile/educations';
  static String candidateProfileEducation(int id) =>
      '$_v1/candidate/profile/educations/$id';
  static const String candidateProfileSkills = '$_v1/candidate/profile/skills';
  static String candidateProfileSkill(int id) =>
      '$_v1/candidate/profile/skills/$id';

  static const String candidateProfileProjects =
      '$_v1/candidate/profile/projects';
  static String candidateProfileProject(int id) =>
      '$_v1/candidate/profile/projects/$id';

  static const String candidateProfileCertifications =
      '$_v1/candidate/profile/certifications';
  static String candidateProfileCertification(int id) =>
      '$_v1/candidate/profile/certifications/$id';

  static const String candidateProfileLanguages =
      '$_v1/candidate/profile/languages';
  static String candidateProfileLanguage(int id) =>
      '$_v1/candidate/profile/languages/$id';

  static const String candidateJobAlerts = '$_v1/candidate/job-alerts';
  static const String candidateJobAlertSummary =
      '$_v1/candidate/job-alerts/summary';
  static String candidateJobAlertDetail(int id) =>
      '$_v1/candidate/job-alerts/$id';
  static String candidateJobAlertToggle(int id) =>
      '$_v1/candidate/job-alerts/$id/toggle';
  static String candidateJobAlertTestSend(int id) =>
      '$_v1/candidate/job-alerts/$id/test-send';

  static const String companies = '$_v1/companies';
  static String companyDetail(int id) => '$_v1/companies/$id';

  static const String jobs = '$_v1/jobs';
  static String jobDetail(String jobId) => '$_v1/jobs/$jobId';

  static const String userTwoFactor = '$_v1/user/two-factor';
  static const String userTwoFactorSetup = '$_v1/user/two-factor/setup';
  static const String userTwoFactorConfirm = '$_v1/user/two-factor/confirm';
  static const String userTwoFactorDisable = '$_v1/user/two-factor/disable';
  static const String userChangePassword = '$_v1/users/me/change-password';
  static const String userSessions = '$_v1/users/me/sessions';
  static String userSession(String id) => '$_v1/users/me/sessions/$id';
}
