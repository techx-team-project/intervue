part of 'blog_detail_cubit.dart';

enum BlogDetailStatus { loading, loaded, failure }

class BlogDetailState extends Equatable {
  const BlogDetailState({
    this.status = BlogDetailStatus.loading,
    this.post,
    this.errorMessage,
  });

  final BlogDetailStatus status;
  final BlogPostDetail? post;
  final String? errorMessage;

  @override
  List<Object?> get props => [status, post, errorMessage];
}
