import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/career_guide_cubit.dart';
import 'package:intervue_flutter/features/job/data/datasources/topcv_mock_data.dart';

class TopCvCareerGuide extends StatelessWidget {
  const TopCvCareerGuide({this.onArticleTap, super.key});

  final ValueChanged<TopCvArticle>? onArticleTap;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CareerGuideCubit, CareerGuideState>(
      builder: (context, state) => _buildSection(context, switch (state) {
        CareerGuideLoading() => null,
        CareerGuideLoaded(:final posts) when posts.isNotEmpty =>
          posts.map(TopCvArticle.fromBlogPost).toList(),
        _ => TopCvMockData.careerArticles,
      }),
    );
  }

  Widget _buildSection(BuildContext context, List<TopCvArticle>? articles) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Row(
                    children: [
                      Icon(
                        Icons.lightbulb_outline,
                        color: AppColors.accentOrange,
                        size: 20,
                      ),
                      SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          'Cẩm nang nghề nghiệp & Bí kíp CV',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  onTap: () => context.push(RouteNames.blog),
                  child: const Text(
                    'Xem thêm',
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 130,
            child: articles == null
                ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    scrollDirection: Axis.horizontal,
                    itemCount: articles.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 12),
                    itemBuilder: (context, index) {
                      final article = articles[index];
                      return SizedBox(
                        width: 240,
                        child: LiquidGlassCard(
                          borderRadius: 16,
                          blur: 14,
                          padding: const EdgeInsets.all(12),
                          backgroundColor: Colors.white.withValues(alpha: 0.8),
                          borderColor: Colors.white.withValues(alpha: 0.9),
                          onTap: () => onArticleTap?.call(article),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // Category + Read time
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Flexible(
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 7,
                                        vertical: 2.5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.accentOrangeLight,
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(
                                          color: AppColors.accentOrange
                                              .withValues(alpha: 0.25),
                                        ),
                                      ),
                                      child: Text(
                                        article.category,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.accentOrange,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    article.readTime,
                                    style: const TextStyle(
                                      fontSize: 10.5,
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                ],
                              ),

                              // Title
                              Text(
                                article.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                  height: 1.25,
                                ),
                              ),

                              // View count
                              Row(
                                children: [
                                  const Icon(
                                    Icons.remove_red_eye_outlined,
                                    size: 13,
                                    color: AppColors.textMuted,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    article.viewCount,
                                    style: const TextStyle(
                                      fontSize: 10.5,
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
