import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/core/widgets/simple_markdown.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post_detail.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_detail_cubit.dart';

class BlogDetailScreen extends StatelessWidget {
  const BlogDetailScreen({
    required this.categorySlug,
    required this.slug,
    super.key,
  });

  final String categorySlug;
  final String slug;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text(
          'Bài viết',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: BlocBuilder<BlogDetailCubit, BlogDetailState>(
        builder: (context, state) {
          switch (state.status) {
            case BlogDetailStatus.loading:
              return const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              );
            case BlogDetailStatus.failure:
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(state.errorMessage ?? 'Không tải được bài viết'),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: () => context.read<BlogDetailCubit>().load(
                        categorySlug,
                        slug,
                      ),
                      child: const Text('Thử lại'),
                    ),
                  ],
                ),
              );
            case BlogDetailStatus.loaded:
              return _Article(post: state.post!);
          }
        },
      ),
    );
  }
}

class _Article extends StatelessWidget {
  const _Article({required this.post});

  final BlogPostDetail post;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
      children: [
        if (post.coverImageUrl != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: CachedNetworkImage(
                imageUrl: post.coverImageUrl!,
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorWidget: (_, _, _) => const SizedBox.shrink(),
                placeholder: (_, _) => const SizedBox(height: 180),
              ),
            ),
          ),
        Container(
          alignment: Alignment.centerLeft,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.accentOrangeLight,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              post.categoryName,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppColors.accentOrange,
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          post.title,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            height: 1.3,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          [
            if (post.authorName != null) post.authorName!,
            '${post.readTimeMinutes} phút đọc',
            '${Formatters.compactCount(post.viewsCount)} lượt xem',
          ].join(' • '),
          style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
        ),
        const SizedBox(height: 16),
        SimpleMarkdown(data: post.content),
        if (post.tags.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final tag in post.tags)
                Chip(
                  label: Text(tag, style: const TextStyle(fontSize: 12)),
                  backgroundColor: AppColors.chipBackground,
                  side: BorderSide.none,
                ),
            ],
          ),
        ],
      ],
    );
  }
}
