part of 'blog_list_cubit.dart';

enum BlogListStatus { loading, loaded, failure }

class BlogListState extends Equatable {
  const BlogListState({
    this.status = BlogListStatus.loading,
    this.categories = const [],
    this.posts = const [],
    this.selectedCategory,
    this.errorMessage,
  });

  final BlogListStatus status;
  final List<BlogCategory> categories;
  final List<BlogPost> posts;
  final String? selectedCategory;
  final String? errorMessage;

  @override
  List<Object?> get props => [
    status,
    categories,
    posts,
    selectedCategory,
    errorMessage,
  ];
}
