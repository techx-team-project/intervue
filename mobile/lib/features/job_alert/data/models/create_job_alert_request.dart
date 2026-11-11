import 'package:equatable/equatable.dart';

class CreateJobAlertRequest extends Equatable {
  const CreateJobAlertRequest({
    required this.title,
    this.keyword,
    this.city,
    this.careerLevel,
    this.workMode,
    this.salaryMin,
    this.currency = 'VND',
    this.frequency = 'DAILY',
  });

  final String title;
  final String? keyword;
  final String? city;
  final String? careerLevel;
  final String? workMode;
  final int? salaryMin;
  final String currency;
  final String frequency;

  Map<String, dynamic> toJson() => {
    'title': title,
    'keyword': ?keyword,
    'city': ?city,
    'careerLevel': ?careerLevel,
    'workMode': ?workMode,
    'salaryMin': ?salaryMin,
    'currency': currency,
    'frequency': frequency,
  };

  @override
  List<Object?> get props => [
    title,
    keyword,
    city,
    careerLevel,
    workMode,
    salaryMin,
    currency,
    frequency,
  ];
}
