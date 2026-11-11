import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_category.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/blog/data/repositories/blog_repository_impl.dart';

part 'blog_list_state.dart';

class BlogListCubit extends Cubit<BlogListState> {
  BlogListCubit(this._repository) : super(const BlogListState());

  final BlogRepositoryImpl _repository;

  Future<void> load({String? categorySlug}) async {
    emit(
      BlogListState(
        status: BlogListStatus.loading,
        categories: state.categories,
        selectedCategory: categorySlug,
      ),
    );
    try {
      final categories = state.categories.isEmpty
          ? await _repository.fetchCategories()
          : state.categories;
      final posts = await _repository.fetchPosts(categorySlug: categorySlug);
      emit(
        BlogListState(
          status: BlogListStatus.loaded,
          categories: categories,
          posts: posts,
          selectedCategory: categorySlug,
        ),
      );
    } catch (e) {
      emit(
        BlogListState(
          status: BlogListStatus.failure,
          categories: state.categories,
          selectedCategory: categorySlug,
          errorMessage: Failure.fromException(e).message,
        ),
      );
    }
  }
}
