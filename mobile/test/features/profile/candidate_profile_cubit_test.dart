import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_certification_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_education_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_experience_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_language_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_project_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_skill_model.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_state.dart';
import 'package:mocktail/mocktail.dart';

class MockProfileRepository extends Mock implements ProfileRepositoryImpl {}

class MockAuthBloc extends Mock implements AuthBloc {}

void main() {
  late MockProfileRepository mockRepo;
  late MockAuthBloc mockAuthBloc;
  late CandidateProfileCubit cubit;

  final sampleProfile = CandidateProfileModel(
    userId: 1,
    name: 'Nguyễn Văn A',
    email: 'candidate@test.com',
    jobSearchStatus: 'ACTIVELY_LOOKING',
    experiences: [
      CandidateExperienceModel(
        id: 10,
        title: 'Flutter Developer',
        companyName: 'TechX',
        startDate: DateTime(2023, 1, 1),
        current: true,
      ),
    ],
    educations: const [
      CandidateEducationModel(
        id: 20,
        school: 'Đại học Bách Khoa',
        degree: 'Kỹ sư',
        major: 'CNTT',
        startYear: 2019,
        endYear: 2023,
      ),
    ],
    skills: const [
      CandidateSkillModel(
        id: 30,
        name: 'Flutter',
        category: 'TECHNICAL',
        level: 'ADVANCED',
        years: 3,
      ),
    ],
    projects: [
      CandidateProjectModel(
        id: 40,
        name: 'Intervue App',
        startDate: DateTime(2023, 6, 1),
        current: true,
      ),
    ],
    certifications: const [
      CandidateCertificationModel(
        id: 50,
        name: 'AWS Solutions Architect',
        issuer: 'AWS',
      ),
    ],
    languages: const [
      CandidateLanguageModel(
        id: 60,
        language: 'English',
        proficiency: 'ADVANCED',
      ),
    ],
  );

  setUp(() {
    mockRepo = MockProfileRepository();
    mockAuthBloc = MockAuthBloc();
    when(() => mockAuthBloc.state).thenReturn(const AuthUnknown());
    when(() => mockAuthBloc.stream).thenAnswer((_) => const Stream.empty());
    cubit = CandidateProfileCubit(mockRepo, mockAuthBloc);
  });

  tearDown(() {
    cubit.close();
  });

  Future<void> loadAuthenticatedProfile() {
    when(() => mockAuthBloc.state).thenReturn(const AuthAuthenticated());
    return cubit.loadProfile();
  }

  group('CandidateProfileCubit', () {
    test('initial state is CandidateProfileInitial', () {
      expect(cubit.state, const CandidateProfileInitial());
    });

    test('loadProfile skips API when unauthenticated', () async {
      when(() => mockAuthBloc.state).thenReturn(const AuthUnauthenticated());

      await cubit.loadProfile();

      expect(cubit.state, const CandidateProfileInitial());
      verifyNever(() => mockRepo.fetchCandidateProfile());
    });

    test('loadProfile emits [CandidateProfileLoading, CandidateProfileLoaded] on success', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final expected = expectLater(
        cubit.stream,
        emitsInOrder([
          const CandidateProfileLoading(),
          CandidateProfileLoaded(profile: sampleProfile),
        ]),
      );

      await loadAuthenticatedProfile();
      await expected;
    });

    test('loadProfile emits [CandidateProfileLoading, CandidateProfileError] on failure', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenThrow(const ServerException('Lỗi tải hồ sơ'));

      final expected = expectLater(
        cubit.stream,
        emitsInOrder([
          const CandidateProfileLoading(),
          const CandidateProfileError('Lỗi tải hồ sơ'),
        ]),
      );

      await loadAuthenticatedProfile();
      await expected;
    });

    test('toggleJobSearchStatus updates profile successfully', () async {
      final updatedProfile = sampleProfile.copyWith(
        jobSearchStatus: 'NOT_LOOKING',
      );

      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);
      when(() => mockRepo.updateCandidateProfile(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.toggleJobSearchStatus(false);

      expect(cubit.state, isA<CandidateProfileLoaded>());
      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.jobSearchStatus, 'NOT_LOOKING');
      expect(loaded.actionMessage, 'Open to work is off.');
    });

    test('addExperience adds new experience to profile', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final newExp = CandidateExperienceModel(
        id: 11,
        title: 'Backend Dev',
        companyName: 'FPT',
        startDate: DateTime(2021, 1, 1),
      );
      final updatedProfile = sampleProfile.copyWith(
        experiences: [...sampleProfile.experiences, newExp],
      );

      when(() => mockRepo.addExperience(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.addExperience({
        'title': 'Backend Dev',
        'companyName': 'FPT',
        'startDate': '2021-01-01',
      });

      expect(cubit.state, isA<CandidateProfileLoaded>());
      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.experiences.length, 2);
      expect(loaded.actionMessage, 'Work experience added!');
    });

    test('deleteExperience removes experience from profile', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final updatedProfile = sampleProfile.copyWith(experiences: const []);
      when(() => mockRepo.deleteExperience(10))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.deleteExperience(10);

      expect(cubit.state, isA<CandidateProfileLoaded>());
      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.experiences, isEmpty);
      expect(loaded.actionMessage, 'Work experience deleted.');
    });

    test('addSkill and deleteSkill operate correctly', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      const newSkill = CandidateSkillModel(
        id: 31,
        name: 'Dart',
        category: 'TECHNICAL',
        level: 'EXPERT',
      );
      final updatedProfile = sampleProfile.copyWith(
        skills: [...sampleProfile.skills, newSkill],
      );

      when(() => mockRepo.addSkill(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.addSkill({'name': 'Dart', 'level': 'EXPERT'});

      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.skills.length, 2);
      expect(loaded.actionMessage, 'Skill added!');

      when(() => mockRepo.deleteSkill(31))
          .thenAnswer((_) async => sampleProfile);

      await cubit.deleteSkill(31);
      final afterDelete = cubit.state as CandidateProfileLoaded;
      expect(afterDelete.profile.skills.length, 1);
      expect(afterDelete.actionMessage, 'Skill deleted.');
    });

    test('addProject and deleteProject operate correctly', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final newProj = CandidateProjectModel(
        id: 41,
        name: 'AI Agent Portal',
        startDate: DateTime(2024, 1, 1),
        current: true,
      );
      final updatedProfile = sampleProfile.copyWith(
        projects: [...sampleProfile.projects, newProj],
      );

      when(() => mockRepo.addProject(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.addProject({
        'name': 'AI Agent Portal',
        'startDate': '2024-01-01',
        'current': true,
      });

      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.projects.length, 2);
      expect(loaded.actionMessage, 'Project added!');

      when(() => mockRepo.deleteProject(41))
          .thenAnswer((_) async => sampleProfile);

      await cubit.deleteProject(41);
      final afterDelete = cubit.state as CandidateProfileLoaded;
      expect(afterDelete.profile.projects.length, 1);
      expect(afterDelete.actionMessage, 'Project deleted.');
    });

    test(
      'addCertification and deleteCertification operate correctly',
      () async {
        when(() => mockRepo.fetchCandidateProfile())
            .thenAnswer((_) async => sampleProfile);

        const newCert = CandidateCertificationModel(
          id: 51,
          name: 'Google Cloud Professional',
          issuer: 'Google Cloud',
        );
        final updatedProfile = sampleProfile.copyWith(
          certifications: [...sampleProfile.certifications, newCert],
        );

        when(() => mockRepo.addCertification(any()))
            .thenAnswer((_) async => updatedProfile);

        await loadAuthenticatedProfile();
        await cubit.addCertification({
          'name': 'Google Cloud Professional',
          'issuer': 'Google Cloud',
        });

        final loaded = cubit.state as CandidateProfileLoaded;
        expect(loaded.profile.certifications.length, 2);
        expect(loaded.actionMessage, 'Certification added!');

        when(() => mockRepo.deleteCertification(51))
            .thenAnswer((_) async => sampleProfile);

        await cubit.deleteCertification(51);
        final afterDelete = cubit.state as CandidateProfileLoaded;
        expect(afterDelete.profile.certifications.length, 1);
        expect(afterDelete.actionMessage, 'Certification deleted.');
      },
    );

    test('addLanguage and deleteLanguage operate correctly', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      const newLang = CandidateLanguageModel(
        id: 61,
        language: 'Japanese',
        proficiency: 'INTERMEDIATE',
      );
      final updatedProfile = sampleProfile.copyWith(
        languages: [...sampleProfile.languages, newLang],
      );

      when(() => mockRepo.addLanguage(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.addLanguage({
        'language': 'Japanese',
        'proficiency': 'INTERMEDIATE',
      });

      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.languages.length, 2);
      expect(loaded.actionMessage, 'Language added!');

      when(() => mockRepo.deleteLanguage(61))
          .thenAnswer((_) async => sampleProfile);

      await cubit.deleteLanguage(61);
      final afterDelete = cubit.state as CandidateProfileLoaded;
      expect(afterDelete.profile.languages.length, 1);
      expect(afterDelete.actionMessage, 'Language deleted.');
    });

    test('updateProfile updates general candidate information', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final updatedProfile = sampleProfile.copyWith(
        name: 'Nguyễn Văn B',
        headline: 'Lead Mobile Architect',
      );
      when(() => mockRepo.updateCandidateProfile(any()))
          .thenAnswer((_) async => updatedProfile);

      await loadAuthenticatedProfile();
      await cubit.updateProfile({
        'name': 'Nguyễn Văn B',
        'headline': 'Lead Mobile Architect',
      });

      final loaded = cubit.state as CandidateProfileLoaded;
      expect(loaded.profile.name, 'Nguyễn Văn B');
      expect(loaded.profile.headline, 'Lead Mobile Architect');
      expect(loaded.actionMessage, 'Profile updated successfully!');
    });

    test('uploadAvatar and removeAvatar operate correctly', () async {
      when(() => mockRepo.fetchCandidateProfile())
          .thenAnswer((_) async => sampleProfile);

      final withAvatar = sampleProfile.copyWith(
        avatarUrl: 'https://example.com/new-avatar.jpg',
      );
      when(() => mockRepo.uploadAvatar(any()))
          .thenAnswer((_) async => withAvatar);

      await loadAuthenticatedProfile();
      await cubit.uploadAvatar('/path/to/avatar.jpg');

      final loadedWithAvatar = cubit.state as CandidateProfileLoaded;
      expect(
        loadedWithAvatar.profile.avatarUrl,
        'https://example.com/new-avatar.jpg',
      );
      expect(loadedWithAvatar.actionMessage, 'Avatar updated successfully!');

      when(() => mockRepo.removeAvatar())
          .thenAnswer((_) async => sampleProfile);

      await cubit.removeAvatar();
      final afterRemove = cubit.state as CandidateProfileLoaded;
      expect(afterRemove.actionMessage, 'Avatar removed.');
    });
  });
}
