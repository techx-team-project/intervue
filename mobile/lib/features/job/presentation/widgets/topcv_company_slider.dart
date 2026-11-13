import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';
import 'package:intervue_flutter/features/company/presentation/widgets/company_detail_sheet.dart';
import 'package:intervue_flutter/features/job/data/datasources/topcv_mock_data.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';

class TopCvCompanySlider extends StatelessWidget {
  const TopCvCompanySlider({this.onCompanyTap, super.key});

  final ValueChanged<TopCvCompany>? onCompanyTap;

  static const List<int> _logoColors = [
    0xFF0F766E,
    0xFF1D4ED8,
    0xFF9333EA,
    0xFFEA580C,
    0xFFBE123C,
    0xFF0369A1,
  ];
  static const int _maxCompanies = 8;

  static List<TopCvCompany> _fromJobs(List<JobEntity> jobs) {
    final counts = <String, int>{};
    final places = <String, String>{};
    for (final job in jobs) {
      counts.update(job.companyName, (value) => value + 1, ifAbsent: () => 1);
      places.putIfAbsent(job.companyName, () => job.location ?? '');
    }
    final names = counts.keys.toList()
      ..sort((a, b) {
        final byCount = counts[b]!.compareTo(counts[a]!);
        return byCount != 0 ? byCount : a.compareTo(b);
      });
    return names.take(_maxCompanies).map((name) {
      final words = name.trim().split(RegExp(r'\s+'));
      final initials = words.length > 1
          ? (words.first[0] + words[1][0]).toUpperCase()
          : name.substring(0, name.length.clamp(1, 3)).toUpperCase();
      return TopCvCompany(
        name: name,
        industry: places[name]!.isEmpty ? 'Hiring' : places[name]!,
        jobCount: counts[name]!,
        avatarText: initials,
        logoBgColorHex: _logoColors[name.hashCode.abs() % _logoColors.length],
        verified: false,
        badge: 'Hiring',
      );
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final jobsState = context.watch<JobListCubit>().state;
    final companies = jobsState is JobListLoaded && jobsState.jobs.isNotEmpty
        ? _fromJobs(jobsState.jobs)
        : TopCvMockData.featuredCompanies;

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
                        Icons.stars_rounded,
                        color: AppColors.star,
                        size: 20,
                      ),
                      SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          'Top leading companies',
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
                  onTap: () {},
                  child: const Text(
                    'View all',
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
            height: 152,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: companies.length,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final company = companies[index];
                return SizedBox(
                  width: 160,
                  child: LiquidGlassCard(
                    borderRadius: 16,
                    blur: 14,
                    padding: const EdgeInsets.all(12),
                    backgroundColor: Colors.white.withValues(alpha: 0.8),
                    borderColor: Colors.white.withValues(alpha: 0.9),
                    onTap: () {
                      if (onCompanyTap != null) {
                        onCompanyTap!(company);
                      } else {
                        CompanyDetailSheet.show(
                          context,
                          companyId: company.id ?? 1,
                        );
                      }
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Avatar + Verified
                        Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: Color(company.logoBgColorHex),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(company.logoBgColorHex)
                                        .withValues(alpha: 0.35),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                company.avatarText,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                            if (company.verified)
                              const Positioned(
                                right: -2,
                                bottom: -2,
                                child: Icon(
                                  Icons.check_circle_rounded,
                                  color: AppColors.primary,
                                  size: 16,
                                ),
                              ),
                          ],
                        ),

                        // Company info
                        Column(
                          children: [
                            Text(
                              company.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              company.industry,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 10.5,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),

                        // Job count pill
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight.withValues(
                              alpha: 0.85,
                            ),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: AppColors.primary.withValues(alpha: 0.25),
                            ),
                          ),
                          child: Text(
                            '${company.jobCount} jobs',
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: AppColors.primaryDarker,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
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
