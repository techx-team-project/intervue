part of 'career_guide_cubit.dart';

sealed class CareerGuideState extends Equatable {
  const CareerGuideState();

  @override
  List<Object?> get props => [];
}

final class CareerGuideLoading extends CareerGuideState {
  const CareerGuideLoading();
}

final class CareerGuideLoaded extends CareerGuideState {
  const CareerGuideLoaded(this.posts);

  final List<BlogPost> posts;

  @override
  List<Object?> get props => [posts];
}

final class CareerGuideFailure extends CareerGuideState {
  const CareerGuideFailure(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
