import 'package:equatable/equatable.dart';

class CandidateCertificationModel extends Equatable {
  const CandidateCertificationModel({
    required this.id,
    required this.name,
    required this.issuer,
    this.issueDate,
    this.credentialId,
    this.credentialUrl,
    this.imageUrl,
  });

  factory CandidateCertificationModel.fromJson(Map<String, dynamic> json) =>
      CandidateCertificationModel(
        id: (json['id'] as num).toInt(),
        name: json['name'] as String? ?? '',
        issuer: json['issuer'] as String? ?? '',
        issueDate: json['issueDate'] != null
            ? DateTime.tryParse(json['issueDate'] as String)
            : null,
        credentialId: json['credentialId'] as String?,
        credentialUrl: json['credentialUrl'] as String?,
        imageUrl: json['imageUrl'] as String?,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'issuer': issuer,
    if (issueDate != null)
      'issueDate':
          "${issueDate!.year.toString().padLeft(4, '0')}-${issueDate!.month.toString().padLeft(2, '0')}-${issueDate!.day.toString().padLeft(2, '0')}",
    if (credentialId != null) 'credentialId': credentialId,
    if (credentialUrl != null) 'credentialUrl': credentialUrl,
    if (imageUrl != null) 'imageUrl': imageUrl,
  };

  final int id;
  final String name;
  final String issuer;
  final DateTime? issueDate;
  final String? credentialId;
  final String? credentialUrl;
  final String? imageUrl;

  @override
  List<Object?> get props => [
    id,
    name,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    imageUrl,
  ];
}
