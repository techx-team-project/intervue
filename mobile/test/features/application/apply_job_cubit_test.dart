import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/apply_form_model.dart';
import 'package:intervue_flutter/features/application/data/models/save_application_request.dart';
import 'package:intervue_flutter/features/application/data/models/screening_question_model.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_cubit.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_state.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';
import 'package:mocktail/mocktail.dart';

class MockApplicationRepository extends Mock
    implements ApplicationRepositoryImpl {}

class MockResumeRepository extends Mock implements ResumeRepositoryImpl {}

class FakeSaveApplicationRequest extends Fake
    implements SaveApplicationRequest {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakeSaveApplicationRequest());
  });

  const sampleForm = ApplyFormModel(
    jobId: 101,
    jobTitle: 'Flutter Senior Developer',
    companyName: 'TechX Corp',
    open: true,
    questions: [
      ScreeningQuestionModel(
        id: 1,
        type: ScreeningQuestionType.choice,
        prompt: 'Kinh nghiệm?',
        required: true,
        options: ['1 năm', '2 years', '3+ năm'],
      ),
    ],
  );

  const sampleCv = CandidateResumeModel(
    id: 1,
    fileName: 'MyCv.pdf',
    fileSizeBytes: 10240,
    isDefault: true,
  );

  const sampleApp = ApplicationModel(
    id: 99,
    status: 'APPLIED',
    jobId: 101,
    jobTitle: 'Flutter Senior Developer',
    resumeId: 1,
  );

  late MockApplicationRepository appRepo;
  late MockResumeRepository resumeRepo;
  late ApplyJobCubit cubit;

  setUp(() {
    appRepo = MockApplicationRepository();
    resumeRepo = MockResumeRepository();
    cubit = ApplyJobCubit(
      applicationRepository: appRepo,
      resumeRepository: resumeRepo,
    );
  });

  tearDown(() => cubit.close());

  test('trạng thái ban đầu là ApplyJobInitial', () {
    expect(cubit.state, const ApplyJobInitial());
  });

  test(
    'loadForm thành công: Loading -> Ready với CV mặc định được chọn',
    () async {
      when(() => appRepo.getForm(101)).thenAnswer((_) async => sampleForm);
      when(() => resumeRepo.getCandidateCvs())
          .thenAnswer((_) async => [sampleCv]);

      final expected = expectLater(
        cubit.stream,
        emitsInOrder([
          const ApplyJobLoading(),
          isA<ApplyJobReady>()
              .having((s) => s.form.jobId, 'jobId', 101)
              .having((s) => s.resumes.length, 'cvCount', 1)
              .having((s) => s.selectedResumeId, 'selectedResumeId', 1),
        ]),
      );

      await cubit.loadForm(101);
      await expected;
    },
  );

  test('loadForm thất bại: Loading -> Failure', () async {
    when(() => appRepo.getForm(101))
        .thenThrow(const ServerException('Không tìm thấy việc làm'));

    final expected = expectLater(
      cubit.stream,
      emitsInOrder([
        const ApplyJobLoading(),
        const ApplyJobFailure('Không tìm thấy việc làm'),
      ]),
    );

    await cubit.loadForm(101);
    await expected;
  });

  test(
    'submit thành công khi điền đủ câu hỏi bắt buộc và đã chọn CV',
    () async {
      when(() => appRepo.getForm(101)).thenAnswer((_) async => sampleForm);
      when(() => resumeRepo.getCandidateCvs())
          .thenAnswer((_) async => [sampleCv]);
      when(() => appRepo.submit(any())).thenAnswer((_) async => sampleApp);

      await cubit.loadForm(101);
      cubit.updateAnswer(1, '3+ năm');
      cubit.updateCoverLetter('Tôi rất muốn ứng tuyển');

      final expected = expectLater(
        cubit.stream,
        emitsInOrder([
          isA<ApplyJobReady>().having(
            (s) => s.isSubmitting,
            'isSubmitting',
            true,
          ),
          isA<ApplyJobSuccess>()
              .having((s) => s.application.id, 'id', 99)
              .having(
                (s) => s.message,
                'message',
                'Application submitted successfully!',
              ),
        ]),
      );

      await cubit.submit();
      await expected;
    },
  );

  test('submit báo lỗi actionError nếu câu hỏi bắt buộc bị bỏ trống', () async {
    when(() => appRepo.getForm(101)).thenAnswer((_) async => sampleForm);
    when(() => resumeRepo.getCandidateCvs())
        .thenAnswer((_) async => [sampleCv]);

    await cubit.loadForm(101);

    await cubit.submit();

    expect(
      cubit.state,
      isA<ApplyJobReady>().having(
        (s) => s.actionError,
        'actionError',
        contains('Please answer the required question'),
      ),
    );
  });
}
