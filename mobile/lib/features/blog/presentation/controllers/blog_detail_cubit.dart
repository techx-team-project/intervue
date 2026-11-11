import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post_detail.dart';
import 'package:intervue_flutter/features/blog/data/repositories/blog_repository_impl.dart';

part 'blog_detail_state.dart';

class BlogDetailCubit extends Cubit<BlogDetailState> {
  BlogDetailCubit(this._repository) : super(const BlogDetailState());

  final BlogRepositoryImpl _repository;

  Future<void> load(String categorySlug, String slug) async {
    emit(const BlogDetailState());
    try {
      emit(
        BlogDetailState(
          status: BlogDetailStatus.loaded,
          post: await _repository.fetchPost(categorySlug, slug),
        ),
      );
    } catch (e) {
      emit(
        BlogDetailState(
          status: BlogDetailStatus.failure,
          errorMessage: Failure.fromException(e).message,
        ),
      );
    }
  }
}
