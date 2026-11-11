import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_state.dart';
import 'package:mocktail/mocktail.dart';

class MockResumeRepository extends Mock implements ResumeRepositoryImpl {}

class MockAuthBloc extends Mock implements AuthBloc {}

void main() {
  const sampleCv = CandidateResumeModel(
    id: 1,
    fileName: 'NguyenVanA_CV.pdf',
    fileSizeBytes: 102400,
    isDefault: true,
  );

  late MockResumeRepository repository;
  late MockAuthBloc authBloc;
  late CandidateCvCubit cubit;

  setUp(() {
    repository = MockResumeRepository();
    authBloc = MockAuthBloc();
    when(() => authBloc.state).thenReturn(const AuthUnknown());
    when(() => authBloc.stream).thenAnswer((_) => const Stream.empty());
    cubit = CandidateCvCubit(repository, authBloc);
  });

  tearDown(() => cubit.close());

  test('trạng thái ban đầu là CandidateCvInitial', () {
    expect(cubit.state, const CandidateCvInitial());
  });

  test('loadCvs thành công: Loading -> Loaded', () async {
    when(() => authBloc.state).thenReturn(const AuthAuthenticated());
    when(() => repository.getCandidateCvs())
        .thenAnswer((_) async => [sampleCv]);

    final expected = expectLater(
      cubit.stream,
      emitsInOrder([
        const CandidateCvLoading(),
        const CandidateCvLoaded(cvs: [sampleCv]),
      ]),
    );

    await cubit.loadCvs();
    await expected;
  });

  test('loadCvs thất bại: Loading -> Error', () async {
    when(() => authBloc.state).thenReturn(const AuthAuthenticated());
    when(() => repository.getCandidateCvs())
        .thenThrow(const ServerException('Lỗi mạng'));

    final expected = expectLater(
      cubit.stream,
      emitsInOrder([
        const CandidateCvLoading(),
        const CandidateCvError('Lỗi mạng'),
      ]),
    );

    await cubit.loadCvs();
    await expected;
  });

  test('uploadCv thành công: tải lên và reload danh sách mới', () async {
    when(
      () => repository.uploadCandidateCv(
        bytes: any(named: 'bytes'),
        fileName: any(named: 'fileName'),
      ),
    ).thenAnswer((_) async => sampleCv);

    when(() => repository.getCandidateCvs())
        .thenAnswer((_) async => [sampleCv]);

    final ok = await cubit.uploadCv(bytes: [1, 2, 3], fileName: 'test.pdf');

    expect(ok, true);
    expect(
      cubit.state,
      const CandidateCvLoaded(
        cvs: [sampleCv],
        actionMessage: 'Tải lên CV thành công!',
      ),
    );
  });

  test('deleteCv thành công: gọi delete và reload danh sách', () async {
    when(() => repository.deleteCandidateCv(1)).thenAnswer((_) async {});
    when(() => repository.getCandidateCvs()).thenAnswer((_) async => []);

    final ok = await cubit.deleteCv(1);

    expect(ok, true);
    expect(
      cubit.state,
      const CandidateCvLoaded(cvs: [], actionMessage: 'Đã xóa CV thành công!'),
    );
  });
}
