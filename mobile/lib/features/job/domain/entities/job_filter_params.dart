import 'package:equatable/equatable.dart';

class JobFilterParams extends Equatable {
  const JobFilterParams({
    this.keyword,
    this.location,
    this.minSalary,
    this.level,
    this.workingArrangement,
  });

  final String? keyword;
  final String? location;

  /// Unit: million VND.
  final double? minSalary;
  final String? level;
  final String? workingArrangement;

  bool get isEmpty =>
      keyword == null &&
      location == null &&
      minSalary == null &&
      level == null &&
      workingArrangement == null;

  @override
  List<Object?> get props => [
    keyword,
    location,
    minSalary,
    level,
    workingArrangement,
  ];
}
