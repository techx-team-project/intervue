import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/auth/data/models/user_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';

class ProfileRemoteDataSource {
  ProfileRemoteDataSource(this._client);

  final ApiClient _client;

  Future<UserModel> getCurrentUser() async {
    final data = await _client.get(ApiEndpoints.currentUser);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid account data');
    }
    return UserModel.fromJson(data);
  }

  Future<CandidateProfileModel> getCandidateProfile() async {
    final data = await _client.get(ApiEndpoints.candidateProfile);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid candidate profile data');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> updateCandidateProfile(
    Map<String, dynamic> body,
  ) async {
    final data = await _client.put(ApiEndpoints.candidateProfile, data: body);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to update the candidate profile');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addExperience(Map<String, dynamic> body) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileExperiences,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add work experience');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteExperience(int id) async {
    final data = await _client.delete(
      ApiEndpoints.candidateProfileExperience(id),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete work experience');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addEducation(Map<String, dynamic> body) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileEducations,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add education');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteEducation(int id) async {
    final data = await _client.delete(
      ApiEndpoints.candidateProfileEducation(id),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete education');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addSkill(Map<String, dynamic> body) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileSkills,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add the skill');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteSkill(int id) async {
    final data = await _client.delete(ApiEndpoints.candidateProfileSkill(id));
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete the skill');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addProject(Map<String, dynamic> body) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileProjects,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add the project');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteProject(int id) async {
    final data = await _client.delete(ApiEndpoints.candidateProfileProject(id));
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete the project');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addCertification(
    Map<String, dynamic> body,
  ) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileCertifications,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add the certification');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteCertification(int id) async {
    final data = await _client.delete(
      ApiEndpoints.candidateProfileCertification(id),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete the certification');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> addLanguage(Map<String, dynamic> body) async {
    final data = await _client.post(
      ApiEndpoints.candidateProfileLanguages,
      data: body,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to add the language');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> deleteLanguage(int id) async {
    final data = await _client.delete(
      ApiEndpoints.candidateProfileLanguage(id),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to delete the language');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> uploadAvatar(String filePath) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
    });
    final data = await _client.post(
      ApiEndpoints.candidateProfileAvatar,
      data: formData,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to upload the avatar');
    }
    return CandidateProfileModel.fromJson(data);
  }

  Future<CandidateProfileModel> removeAvatar() async {
    final data = await _client.delete(ApiEndpoints.candidateProfileAvatar);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Unable to remove the avatar');
    }
    return CandidateProfileModel.fromJson(data);
  }
}
