import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/blog/data/models/blog_post.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_list_cubit.dart';

class BlogListScreen extends StatelessWidget {
  const BlogListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Career handbook',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: BlocBuilder<BlogListCubit, BlogListState>(
        builder: (context, state) {
          return Column(
            children: [
              _CategoryChips(state: state),
              Expanded(child: _content(context, state)),
            ],
          );
        },
      ),
    );
  }

  Widget _content(BuildContext context, BlogListState state) {
    switch (state.status) {
      case BlogListStatus.loading:
        return const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        );
      case BlogListStatus.failure:
        return Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(state.errorMessage ?? 'Unable to load the article'),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.read<BlogListCubit>().load(
                  categorySlug: state.selectedCategory,
                ),
                child: const Text('Try again'),
              ),
            ],
          ),
        );
      case BlogListStatus.loaded:
        if (state.posts.isEmpty) {
          return const Center(child: Text('No articles in this category yet'));
        }
        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          itemCount: state.posts.length,
          separatorBuilder: (_, _) => const SizedBox(height: 12),
          itemBuilder: (context, index) => _PostCard(post: state.posts[index]),
        );
    }
  }
}

class _CategoryChips extends StatelessWidget {
  const _CategoryChips({required this.state});

  final BlogListState state;

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<BlogListCubit>();
    return SizedBox(
      height: 52,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: const Text('All'),
              selected: state.selectedCategory == null,
              onSelected: (_) => cubit.load(),
            ),
          ),
          for (final category in state.categories)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(category.name),
                selected: state.selectedCategory == category.slug,
                onSelected: (_) => cubit.load(categorySlug: category.slug),
              ),
            ),
        ],
      ),
    );
  }
}

class _PostCard extends StatelessWidget {
  const _PostCard({required this.post});

  final BlogPost post;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () =>
            context.push(RouteNames.blogPost(post.categorySlug, post.slug)),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.accentOrangeLight,
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Text(
                        post.categoryName,
                        style: const TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.bold,
                          color: AppColors.accentOrange,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      post.title,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.bold,
                        height: 1.3,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (post.excerpt.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        post.excerpt,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12.5,
                          height: 1.35,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                    const SizedBox(height: 8),
                    Text(
                      '${post.readTimeMinutes} min read • ${Formatters.compactCount(post.viewsCount)} views',
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              if (post.coverImageUrl != null) ...[
                const SizedBox(width: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: CachedNetworkImage(
                    imageUrl: post.coverImageUrl!,
                    width: 84,
                    height: 84,
                    fit: BoxFit.cover,
                    errorWidget: (_, _, _) =>
                        const SizedBox(width: 84, height: 84),
                    placeholder: (_, _) =>
                        const SizedBox(width: 84, height: 84),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
