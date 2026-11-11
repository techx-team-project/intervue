import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/blog/data/repositories/blog_repository_impl.dart';

part 'career_guide_state.dart';

class CareerGuideCubit extends Cubit<CareerGuideState> {
  CareerGuideCubit(this._repository) : super(const CareerGuideLoading());

  final BlogRepositoryImpl _repository;

  Future<void> load() async {
    emit(const CareerGuideLoading());
    try {
      emit(CareerGuideLoaded(await _repository.fetchFeaturedPosts()));
    } catch (e) {
      emit(CareerGuideFailure(Failure.fromException(e).message));
    }
  }
}
