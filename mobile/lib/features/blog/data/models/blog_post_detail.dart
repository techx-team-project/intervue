import 'package:equatable/equatable.dart';

class BlogPostDetail extends Equatable {
  const BlogPostDetail({
    required this.title,
    required this.content,
    required this.categoryName,
    required this.readTimeMinutes,
    required this.viewsCount,
    this.coverImageUrl,
    this.authorName,
    this.tags = const [],
  });

  factory BlogPostDetail.fromJson(Map<String, dynamic> json) {
    final category = json['category'] as Map<String, dynamic>?;
    final author = json['author'] as Map<String, dynamic>?;
    return BlogPostDetail(
      title: json['title'] as String? ?? '',
      content: json['content'] as String? ?? '',
      categoryName: category?['name'] as String? ?? '',
      readTimeMinutes: (json['readTimeMinutes'] as num?)?.toInt() ?? 0,
      viewsCount: (json['viewsCount'] as num?)?.toInt() ?? 0,
      coverImageUrl: json['coverImageUrl'] as String?,
      authorName: author?['name'] as String?,
      tags: (json['tags'] as List<dynamic>? ?? const [])
          .map((e) => e.toString())
          .toList(),
    );
  }

  final String title;
  final String content;
  final String categoryName;
  final int readTimeMinutes;
  final int viewsCount;
  final String? coverImageUrl;
  final String? authorName;
  final List<String> tags;

  @override
  List<Object?> get props => [
    title,
    content,
    categoryName,
    readTimeMinutes,
    viewsCount,
    coverImageUrl,
    authorName,
    tags,
  ];
}
