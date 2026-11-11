import 'package:intervue_flutter/features/blog/data/datasources/blog_remote_data_source.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_category.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post_detail.dart';

class BlogRepositoryImpl {
  BlogRepositoryImpl(this._remote);

  final BlogRemoteDataSource _remote;

  Future<List<BlogPost>> fetchFeaturedPosts() => _remote.getFeaturedPosts();

  Future<List<BlogPost>> fetchPosts({String? categorySlug}) =>
      _remote.getPosts(categorySlug: categorySlug);

  Future<List<BlogCategory>> fetchCategories() => _remote.getCategories();

  Future<BlogPostDetail> fetchPost(String categorySlug, String slug) =>
      _remote.getPost(categorySlug, slug);
}
