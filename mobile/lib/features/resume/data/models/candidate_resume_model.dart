import 'package:equatable/equatable.dart';

class CandidateResumeModel extends Equatable {
  const CandidateResumeModel({
    required this.id,
    required this.fileName,
    this.url,
    required this.fileSizeBytes,
    this.contentType,
    this.isDefault = false,
    this.parsedSummary,
    this.createdAt,
  });

  factory CandidateResumeModel.fromJson(Map<String, dynamic> json) =>
      CandidateResumeModel(
        id: (json['id'] as num).toInt(),
        fileName: json['fileName'] as String? ?? 'CV.pdf',
        url: json['url'] as String?,
        fileSizeBytes: (json['fileSizeBytes'] as num?)?.toInt() ?? 0,
        contentType: json['contentType'] as String?,
        isDefault:
            json['isDefault'] as bool? ?? json['default'] as bool? ?? false,
        parsedSummary: json['parsedSummary'] as String?,
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt'] as String)
            : null,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'fileName': fileName,
    'url': url,
    'fileSizeBytes': fileSizeBytes,
    'contentType': contentType,
    'isDefault': isDefault,
    'parsedSummary': parsedSummary,
    'createdAt': createdAt?.toIso8601String(),
  };

  final int id;
  final String fileName;
  final String? url;
  final int fileSizeBytes;
  final String? contentType;
  final bool isDefault;
  final String? parsedSummary;
  final DateTime? createdAt;

  CandidateResumeModel copyWith({
    int? id,
    String? fileName,
    String? url,
    int? fileSizeBytes,
    String? contentType,
    bool? isDefault,
    String? parsedSummary,
    DateTime? createdAt,
  }) => CandidateResumeModel(
    id: id ?? this.id,
    fileName: fileName ?? this.fileName,
    url: url ?? this.url,
    fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
    contentType: contentType ?? this.contentType,
    isDefault: isDefault ?? this.isDefault,
    parsedSummary: parsedSummary ?? this.parsedSummary,
    createdAt: createdAt ?? this.createdAt,
  );

  @override
  List<Object?> get props => [
    id,
    fileName,
    url,
    fileSizeBytes,
    contentType,
    isDefault,
    parsedSummary,
    createdAt,
  ];
}
