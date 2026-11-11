import 'package:intervue_flutter/features/auth/data/models/user_model.dart';
import 'package:intervue_flutter/features/profile/data/datasources/profile_remote_data_source.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';

class ProfileRepositoryImpl {
  ProfileRepositoryImpl(this._remote);

  final ProfileRemoteDataSource _remote;

  Future<UserModel> fetchCurrentUser() => _remote.getCurrentUser();

  Future<CandidateProfileModel> fetchCandidateProfile() =>
      _remote.getCandidateProfile();

  Future<CandidateProfileModel> updateCandidateProfile(
    Map<String, dynamic> body,
  ) => _remote.updateCandidateProfile(body);

  Future<CandidateProfileModel> addExperience(Map<String, dynamic> body) =>
      _remote.addExperience(body);

  Future<CandidateProfileModel> deleteExperience(int id) =>
      _remote.deleteExperience(id);

  Future<CandidateProfileModel> addEducation(Map<String, dynamic> body) =>
      _remote.addEducation(body);

  Future<CandidateProfileModel> deleteEducation(int id) =>
      _remote.deleteEducation(id);

  Future<CandidateProfileModel> addSkill(Map<String, dynamic> body) =>
      _remote.addSkill(body);

  Future<CandidateProfileModel> deleteSkill(int id) => _remote.deleteSkill(id);

  Future<CandidateProfileModel> addProject(Map<String, dynamic> body) =>
      _remote.addProject(body);

  Future<CandidateProfileModel> deleteProject(int id) =>
      _remote.deleteProject(id);

  Future<CandidateProfileModel> addCertification(Map<String, dynamic> body) =>
      _remote.addCertification(body);

  Future<CandidateProfileModel> deleteCertification(int id) =>
      _remote.deleteCertification(id);

  Future<CandidateProfileModel> addLanguage(Map<String, dynamic> body) =>
      _remote.addLanguage(body);

  Future<CandidateProfileModel> deleteLanguage(int id) =>
      _remote.deleteLanguage(id);

  Future<CandidateProfileModel> uploadAvatar(String filePath) =>
      _remote.uploadAvatar(filePath);

  Future<CandidateProfileModel> removeAvatar() => _remote.removeAvatar();
}
