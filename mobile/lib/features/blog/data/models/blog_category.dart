import 'package:equatable/equatable.dart';

class BlogCategory extends Equatable {
  const BlogCategory({
    required this.slug,
    required this.name,
    required this.articleCount,
  });

  factory BlogCategory.fromJson(Map<String, dynamic> json) => BlogCategory(
    slug: json['slug'] as String? ?? '',
    name: json['name'] as String? ?? '',
    articleCount: (json['articleCount'] as num?)?.toInt() ?? 0,
  );

  final String slug;
  final String name;
  final int articleCount;

  @override
  List<Object?> get props => [slug, name, articleCount];
}
