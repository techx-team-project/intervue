import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/application/data/models/application_summary_model.dart';

sealed class ApplicationListState extends Equatable {
  const ApplicationListState();

  @override
  List<Object?> get props => [];
}

final class ApplicationListInitial extends ApplicationListState {
  const ApplicationListInitial();
}

final class ApplicationListLoading extends ApplicationListState {
  const ApplicationListLoading();
}

final class ApplicationListLoaded extends ApplicationListState {
  const ApplicationListLoaded({
    required this.applications,
    this.selectedFilter = 'ALL',
    this.actionMessage,
    this.actionError,
  });

  final List<ApplicationSummaryModel> applications;
  final String selectedFilter;
  final String? actionMessage;
  final String? actionError;

  List<ApplicationSummaryModel> get filteredItems {
    switch (selectedFilter) {
      case 'IN_PROGRESS':
        return applications
            .where((a) => a.isApplied || a.isViewed || a.isInReview)
            .toList();
      case 'INTERVIEW':
        return applications
            .where((a) => a.isInterview || a.isOffer || a.isHired)
            .toList();
      case 'ENDED':
        return applications
            .where((a) => a.isRejected || a.isWithdrawn || a.isJobClosed)
            .toList();
      case 'ALL':
      default:
        return applications;
    }
  }

  ApplicationListLoaded copyWith({
    List<ApplicationSummaryModel>? applications,
    String? selectedFilter,
    String? actionMessage,
    String? actionError,
    bool clearAction = false,
  }) {
    return ApplicationListLoaded(
      applications: applications ?? this.applications,
      selectedFilter: selectedFilter ?? this.selectedFilter,
      actionMessage: clearAction ? null : (actionMessage ?? this.actionMessage),
      actionError: clearAction ? null : (actionError ?? this.actionError),
    );
  }

  @override
  List<Object?> get props => [
    applications,
    selectedFilter,
    actionMessage,
    actionError,
  ];
}

final class ApplicationListError extends ApplicationListState {
  const ApplicationListError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
