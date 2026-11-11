import 'package:equatable/equatable.dart';

class BlogPost extends Equatable {
  const BlogPost({
    required this.id,
    required this.slug,
    required this.title,
    required this.categoryName,
    required this.readTimeMinutes,
    required this.viewsCount,
    this.categorySlug = '',
    this.excerpt = '',
    this.coverImageUrl,
  });

  factory BlogPost.fromJson(Map<String, dynamic> json) => BlogPost(
    id: (json['id'] as num).toInt(),
    slug: json['slug'] as String? ?? '',
    title: json['title'] as String? ?? '',
    categoryName: json['categoryName'] as String? ?? '',
    categorySlug: json['categorySlug'] as String? ?? '',
    excerpt: json['excerpt'] as String? ?? '',
    coverImageUrl: json['coverImageUrl'] as String?,
    readTimeMinutes: (json['readTimeMinutes'] as num?)?.toInt() ?? 0,
    viewsCount: (json['viewsCount'] as num?)?.toInt() ?? 0,
  );

  final int id;
  final String slug;
  final String title;
  final String categoryName;
  final String categorySlug;
  final String excerpt;
  final String? coverImageUrl;
  final int readTimeMinutes;
  final int viewsCount;

  @override
  List<Object?> get props => [
    id,
    slug,
    title,
    categoryName,
    categorySlug,
    excerpt,
    coverImageUrl,
    readTimeMinutes,
    viewsCount,
  ];
}
