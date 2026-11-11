import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_certification_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_education_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_experience_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_language_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_project_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_skill_model.dart';

class CandidateProfileModel extends Equatable {
  const CandidateProfileModel({
    required this.userId,
    this.name,
    this.email,
    this.contactEmail,
    this.phone,
    this.phoneVerified = false,
    this.address,
    this.avatarUrl,
    this.coverUrl,
    this.headline,
    this.bio,
    this.gender,
    this.birthYear,
    this.jobSearchStatus = 'ACTIVELY_LOOKING',
    this.desiredRole,
    this.desiredLevel,
    this.totalYoe,
    this.salaryMin,
    this.salaryMax,
    this.currency = 'VND',
    this.githubUrl,
    this.linkedinUrl,
    this.portfolioUrl,
    this.experiences = const [],
    this.educations = const [],
    this.skills = const [],
    this.projects = const [],
    this.certifications = const [],
    this.languages = const [],
  });

  factory CandidateProfileModel.fromJson(
    Map<String, dynamic> json,
  ) => CandidateProfileModel(
    userId: (json['userId'] as num).toInt(),
    name: json['name'] as String?,
    email: json['email'] as String?,
    contactEmail: json['contactEmail'] as String?,
    phone: json['phone'] as String?,
    phoneVerified: json['phoneVerified'] as bool? ?? false,
    address: json['address'] as String?,
    avatarUrl: json['avatarUrl'] as String?,
    coverUrl: json['coverUrl'] as String?,
    headline: json['headline'] as String?,
    bio: json['bio'] as String?,
    gender: json['gender'] as String?,
    birthYear: (json['birthYear'] as num?)?.toInt(),
    jobSearchStatus: json['jobSearchStatus'] as String? ?? 'ACTIVELY_LOOKING',
    desiredRole: json['desiredRole'] as String?,
    desiredLevel: json['desiredLevel'] as String?,
    totalYoe: (json['totalYoe'] as num?)?.toDouble(),
    salaryMin: (json['salaryMin'] as num?)?.toInt(),
    salaryMax: (json['salaryMax'] as num?)?.toInt(),
    currency: json['currency'] as String? ?? 'VND',
    githubUrl: json['githubUrl'] as String?,
    linkedinUrl: json['linkedinUrl'] as String?,
    portfolioUrl: json['portfolioUrl'] as String?,
    experiences:
        (json['experiences'] as List<dynamic>?)
            ?.map(
              (e) =>
                  CandidateExperienceModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    educations:
        (json['educations'] as List<dynamic>?)
            ?.map(
              (e) =>
                  CandidateEducationModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    skills:
        (json['skills'] as List<dynamic>?)
            ?.map(
              (e) => CandidateSkillModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    projects:
        (json['projects'] as List<dynamic>?)
            ?.map(
              (e) => CandidateProjectModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    certifications:
        (json['certifications'] as List<dynamic>?)
            ?.map(
              (e) => CandidateCertificationModel.fromJson(
                e as Map<String, dynamic>,
              ),
            )
            .toList() ??
        const [],
    languages:
        (json['languages'] as List<dynamic>?)
            ?.map(
              (e) => CandidateLanguageModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
  );

  Map<String, dynamic> toJson() => {
    'userId': userId,
    if (name != null) 'name': name,
    if (email != null) 'email': email,
    if (contactEmail != null) 'contactEmail': contactEmail,
    if (phone != null) 'phone': phone,
    'phoneVerified': phoneVerified,
    if (address != null) 'address': address,
    if (avatarUrl != null) 'avatarUrl': avatarUrl,
    if (coverUrl != null) 'coverUrl': coverUrl,
    if (headline != null) 'headline': headline,
    if (bio != null) 'bio': bio,
    if (gender != null) 'gender': gender,
    if (birthYear != null) 'birthYear': birthYear,
    'jobSearchStatus': jobSearchStatus,
    if (desiredRole != null) 'desiredRole': desiredRole,
    if (desiredLevel != null) 'desiredLevel': desiredLevel,
    if (totalYoe != null) 'totalYoe': totalYoe,
    if (salaryMin != null) 'salaryMin': salaryMin,
    if (salaryMax != null) 'salaryMax': salaryMax,
    'currency': currency,
    if (githubUrl != null) 'githubUrl': githubUrl,
    if (linkedinUrl != null) 'linkedinUrl': linkedinUrl,
    if (portfolioUrl != null) 'portfolioUrl': portfolioUrl,
    'experiences': experiences.map((e) => e.toJson()).toList(),
    'educations': educations.map((e) => e.toJson()).toList(),
    'skills': skills.map((e) => e.toJson()).toList(),
    'projects': projects.map((e) => e.toJson()).toList(),
    'certifications': certifications.map((e) => e.toJson()).toList(),
    'languages': languages.map((e) => e.toJson()).toList(),
  };

  final int userId;
  final String? name;
  final String? email;
  final String? contactEmail;
  final String? phone;
  final bool phoneVerified;
  final String? address;
  final String? avatarUrl;
  final String? coverUrl;
  final String? headline;
  final String? bio;
  final String? gender;
  final int? birthYear;
  final String jobSearchStatus;
  final String? desiredRole;
  final String? desiredLevel;
  final double? totalYoe;
  final int? salaryMin;
  final int? salaryMax;
  final String currency;
  final String? githubUrl;
  final String? linkedinUrl;
  final String? portfolioUrl;
  final List<CandidateExperienceModel> experiences;
  final List<CandidateEducationModel> educations;
  final List<CandidateSkillModel> skills;
  final List<CandidateProjectModel> projects;
  final List<CandidateCertificationModel> certifications;
  final List<CandidateLanguageModel> languages;

  bool get isActivelyLooking =>
      jobSearchStatus == 'ACTIVELY_LOOKING' ||
      jobSearchStatus == 'OPEN_TO_OFFERS';

  CandidateProfileModel copyWith({
    int? userId,
    String? name,
    String? email,
    String? contactEmail,
    String? phone,
    bool? phoneVerified,
    String? address,
    String? avatarUrl,
    String? coverUrl,
    String? headline,
    String? bio,
    String? gender,
    int? birthYear,
    String? jobSearchStatus,
    String? desiredRole,
    String? desiredLevel,
    double? totalYoe,
    int? salaryMin,
    int? salaryMax,
    String? currency,
    String? githubUrl,
    String? linkedinUrl,
    String? portfolioUrl,
    List<CandidateExperienceModel>? experiences,
    List<CandidateEducationModel>? educations,
    List<CandidateSkillModel>? skills,
    List<CandidateProjectModel>? projects,
    List<CandidateCertificationModel>? certifications,
    List<CandidateLanguageModel>? languages,
  }) => CandidateProfileModel(
    userId: userId ?? this.userId,
    name: name ?? this.name,
    email: email ?? this.email,
    contactEmail: contactEmail ?? this.contactEmail,
    phone: phone ?? this.phone,
    phoneVerified: phoneVerified ?? this.phoneVerified,
    address: address ?? this.address,
    avatarUrl: avatarUrl ?? this.avatarUrl,
    coverUrl: coverUrl ?? this.coverUrl,
    headline: headline ?? this.headline,
    bio: bio ?? this.bio,
    gender: gender ?? this.gender,
    birthYear: birthYear ?? this.birthYear,
    jobSearchStatus: jobSearchStatus ?? this.jobSearchStatus,
    desiredRole: desiredRole ?? this.desiredRole,
    desiredLevel: desiredLevel ?? this.desiredLevel,
    totalYoe: totalYoe ?? this.totalYoe,
    salaryMin: salaryMin ?? this.salaryMin,
    salaryMax: salaryMax ?? this.salaryMax,
    currency: currency ?? this.currency,
    githubUrl: githubUrl ?? this.githubUrl,
    linkedinUrl: linkedinUrl ?? this.linkedinUrl,
    portfolioUrl: portfolioUrl ?? this.portfolioUrl,
    experiences: experiences ?? this.experiences,
    educations: educations ?? this.educations,
    skills: skills ?? this.skills,
    projects: projects ?? this.projects,
    certifications: certifications ?? this.certifications,
    languages: languages ?? this.languages,
  );

  @override
  List<Object?> get props => [
    userId,
    name,
    email,
    contactEmail,
    phone,
    phoneVerified,
    address,
    avatarUrl,
    coverUrl,
    headline,
    bio,
    gender,
    birthYear,
    jobSearchStatus,
    desiredRole,
    desiredLevel,
    totalYoe,
    salaryMin,
    salaryMax,
    currency,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    experiences,
    educations,
    skills,
    projects,
    certifications,
    languages,
  ];
}
