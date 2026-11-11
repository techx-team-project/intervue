import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_category.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post_detail.dart';

class BlogRemoteDataSource {
  BlogRemoteDataSource(this._client);

  final ApiClient _client;

  Future<List<BlogPost>> getFeaturedPosts() async {
    final data = await _client.get(ApiEndpoints.featuredBlogs, skipAuth: true);
    if (data is! List<dynamic>) {
      throw const ServerException('Dữ liệu bài viết không hợp lệ');
    }
    return data
        .map((e) => BlogPost.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<BlogPost>> getPosts({
    String? categorySlug,
    int page = 0,
    int size = 30,
  }) async {
    final data = await _client.get(
      ApiEndpoints.blogs,
      skipAuth: true,
      queryParameters: {
        'page': page,
        'size': size,
        'categorySlug': ?categorySlug,
      },
    );
    final items = data is Map<String, dynamic> ? data['items'] : null;
    if (items is! List<dynamic>) {
      throw const ServerException('Dữ liệu bài viết không hợp lệ');
    }
    return items
        .map((e) => BlogPost.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<BlogCategory>> getCategories() async {
    final data = await _client.get(ApiEndpoints.blogCategories, skipAuth: true);
    if (data is! List<dynamic>) {
      throw const ServerException('Dữ liệu danh mục không hợp lệ');
    }
    return data
        .map((e) => BlogCategory.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<BlogPostDetail> getPost(String categorySlug, String slug) async {
    final data = await _client.get(
      ApiEndpoints.blogPost(categorySlug, slug),
      skipAuth: true,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu bài viết không hợp lệ');
    }
    return BlogPostDetail.fromJson(data);
  }
}
