import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/theme/liquid_glass_theme.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';
import 'package:intervue_flutter/core/widgets/shimmer_loading.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/job/data/datasources/topcv_mock_data.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';
import 'package:intervue_flutter/features/notification/presentation/controllers/notifications_cubit.dart';
import 'package:intervue_flutter/features/notification/presentation/views/notifications_tab.dart';
import 'package:intervue_flutter/features/job/presentation/views/topcv_cv_builder_tab.dart';
import 'package:intervue_flutter/features/job/presentation/views/topcv_profile_tab.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/intervue_ai_spotlight_card.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/intervue_glass_drawer.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_banner_carousel.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_career_guide.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_company_slider.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_filter_bottom_sheet.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_header.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_job_card.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_market_insights.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_search_bar.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_service_grid.dart';

class JobFeedScreen extends StatefulWidget {
  const JobFeedScreen({super.key});

  @override
  State<JobFeedScreen> createState() => _JobFeedScreenState();
}

class _JobFeedScreenState extends State<JobFeedScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _currentTabIndex = 0;
  String _selectedLocation = 'Nationwide';
  String _selectedKeyword = '';
  String _selectedCategory = 'Recommended';
  TopCvFilterData _filterData = const TopCvFilterData();
  final TextEditingController _searchController = TextEditingController();
  final Set<String> _bookmarkedJobIds = {};
  int get _unreadCount => context.read<NotificationsCubit>().state.unreadCount;

  static const List<String> _jobCategories = [
    'Recommended',
    'Hot Jobs',
    'Urgent Hiring (24h)',
    'Internship / Fresher',
    'Remote',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onKeywordSelected(String keyword) {
    setState(() {
      _selectedKeyword = keyword;
      _searchController.text = keyword;
    });
    _triggerSearch();
  }

  void _triggerSearch() {
    final query = _searchController.text.trim();
    context.read<JobListCubit>().loadJobs(
      filter: JobFilterParams(
        keyword: query.isNotEmpty ? query : null,
        location: _selectedLocation != 'Nationwide' ? _selectedLocation : null,
      ),
      silent: true,
    );
  }

  void _toggleBookmark(JobEntity job) {
    if (context.read<AuthBloc>().state is! AuthAuthenticated) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            content: const Text('Please sign in to save jobs'),
            action: SnackBarAction(
              label: 'Sign in',
              onPressed: () => context.push(RouteNames.login),
            ),
          ),
        );
      return;
    }
    setState(() {
      if (_bookmarkedJobIds.contains(job.id)) {
        _bookmarkedJobIds.remove(job.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            duration: const Duration(seconds: 1),
            content: Text('Removed from saved jobs: ${job.title}'),
          ),
        );
      } else {
        _bookmarkedJobIds.add(job.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            duration: const Duration(seconds: 1),
            backgroundColor: AppColors.primary,
            content: Text('Saved job: ${job.title}'),
          ),
        );
      }
    });
  }

  void _openFilterModal() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => TopCvFilterBottomSheet(
        initialFilter: _filterData,
        skillOptions: _skillOptions(),
        onApply: (newFilter) {
          setState(() => _filterData = newFilter);
          _triggerSearch();
        },
      ),
    );
  }

  void _handleServiceTap(String serviceName) {
    switch (serviceName) {
      case 'Create CV':
        setState(() => _currentTabIndex = 2);
      case 'AI CV Scoring':
        context.push(RouteNames.resume);
      case 'AI Interview':
        context.push(RouteNames.mockInterviews);
      case 'IT Jobs':
        _onKeywordSelected('IT');
      case 'Top Companies':
        _onKeywordSelected('Technology');
      case 'Gross - Net':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📊 Opening the 2026 Gross to Net salary calculator'),
          ),
        );
      case 'MBTI Test':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              '🧠 Opening the 16-type MBTI career personality test',
            ),
          ),
        );
      case 'Open to Work':
        setState(() => _currentTabIndex = 4);
      default:
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Opening tool: $serviceName')));
    }
  }

  static const Map<String, (double, double)> _salaryRanges = {
    'Under 10M VND': (0, 10),
    '10 - 15M VND': (10, 15),
    '15 - 25M VND': (15, 25),
    '25 - 40M VND': (25, 40),
    'Over 40M VND': (40, double.infinity),
  };

  bool _matchesSalary(JobEntity job, String range) {
    if (range == 'Negotiable') return job.isSalaryNegotiable;
    final bounds = _salaryRanges[range];
    final min = job.salaryMinMillions ?? job.salaryMaxMillions;
    final max = job.salaryMaxMillions ?? job.salaryMinMillions;
    if (bounds == null || min == null || max == null) return false;
    return max >= bounds.$1 && min <= bounds.$2;
  }

  List<String> _skillOptions() {
    final state = context.read<JobListCubit>().state;
    if (state is! JobListLoaded) return const ['All'];
    final counts = <String, int>{};
    for (final job in state.jobs) {
      for (final tag in job.tags) {
        counts.update(tag, (value) => value + 1, ifAbsent: () => 1);
      }
    }
    final skills = counts.keys.toList()
      ..sort((a, b) {
        final byCount = counts[b]!.compareTo(counts[a]!);
        return byCount != 0 ? byCount : a.compareTo(b);
      });
    return ['All', ...skills.take(14)];
  }

  List<JobEntity> _filterJobs(List<JobEntity> rawJobs) {
    var list = rawJobs;

    // Filter by category tab
    if (_selectedCategory == 'Hot Jobs') {
      list = list.where((j) => j.isHot).toList();
    } else if (_selectedCategory == 'Urgent Hiring (24h)') {
      list = list.where((j) => j.isUrgent).toList();
    } else if (_selectedCategory == 'Internship / Fresher') {
      list = list
          .where(
            (j) =>
                (j.experience?.toLowerCase().contains('no experience') ??
                    false) ||
                (j.jobLevel?.toLowerCase().contains('intern') ?? false) ||
                (j.title.toLowerCase().contains('fresher') ||
                    j.title.toLowerCase().contains('intern')),
          )
          .toList();
    } else if (_selectedCategory == 'Remote') {
      list = list
          .where(
            (j) =>
                (j.location?.toLowerCase().contains('remote') ?? false) ||
                (j.location?.toLowerCase().contains('remote') ?? false) ||
                j.tags.any((t) => t.toLowerCase() == 'remote'),
          )
          .toList();
    }

    // Filter by location
    if (_selectedLocation != 'Nationwide') {
      list = list.where((j) {
        if (j.location == null) return false;
        return j.location!.toLowerCase().contains(
          _selectedLocation.toLowerCase().replaceAll('tp. ', ''),
        );
      }).toList();
    }

    // Filter by search keyword
    final query = _searchController.text.trim().toLowerCase();
    if (query.isNotEmpty) {
      list = list.where((j) {
        final inTitle = j.title.toLowerCase().contains(query);
        final inCompany = j.companyName.toLowerCase().contains(query);
        final inLocation = j.location?.toLowerCase().contains(query) ?? false;
        final inTags = j.tags.any((t) => t.toLowerCase().contains(query));
        return inTitle || inCompany || inLocation || inTags;
      }).toList();
    }

    // Filter by advanced filter sheet
    if (_filterData.hasFilter) {
      if (_filterData.location != 'Nationwide') {
        list = list.where((j) {
          if (j.location == null) return false;
          return j.location!.toLowerCase().contains(
            _filterData.location.toLowerCase().replaceAll('tp. ', ''),
          );
        }).toList();
      }

      if (_filterData.skill != 'All') {
        final skillQuery = _filterData.skill.toLowerCase();
        list = list.where((j) {
          final inTitle = j.title.toLowerCase().contains(skillQuery);
          final inDesc =
              j.description?.toLowerCase().contains(skillQuery) ?? false;
          final inTags = j.tags.any(
            (t) => t.toLowerCase().contains(skillQuery),
          );
          final inReq =
              j.requirements?.toLowerCase().contains(skillQuery) ?? false;
          return inTitle || inDesc || inTags || inReq;
        }).toList();
      }

      if (_filterData.level != 'All') {
        final levelQuery = _filterData.level.toLowerCase();
        list = list.where((j) {
          final inLevel =
              j.jobLevel?.toLowerCase().contains(levelQuery) ?? false;
          final inTitle = j.title.toLowerCase().contains(levelQuery);
          return inLevel || inTitle;
        }).toList();
      }

      if (_filterData.workMode != 'All') {
        final mode = _filterData.backendWorkMode;
        list = list.where((j) {
          if (mode != null && j.workingArrangement != null) {
            return j.workingArrangement == mode;
          }
          final loc = (j.location ?? '').toLowerCase();
          final title = j.title.toLowerCase();
          if (mode == 'REMOTE') {
            return loc.contains('remote') ||
                loc.contains('remote') ||
                title.contains('remote');
          } else if (mode == 'HYBRID') {
            return loc.contains('hybrid') ||
                loc.contains('flexible') ||
                title.contains('hybrid');
          } else {
            return !loc.contains('remote') && !loc.contains('remote');
          }
        }).toList();
      }

      if (_filterData.salaryRange != 'All') {
        list = list
            .where((j) => _matchesSalary(j, _filterData.salaryRange))
            .toList();
      }
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    context.watch<AuthBloc>();
    context.watch<NotificationsCubit>();
    return Scaffold(
      key: _scaffoldKey,
      drawer: IntervueGlassDrawer(
        onSelectTab: (idx) => setState(() => _currentTabIndex = idx),
        onMockInterviewTap: () => _handleServiceTap('AI Interview'),
        onCvScoreTap: () => _handleServiceTap('AI CV Scoring'),
        onSavedJobsTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('You have ${_bookmarkedJobIds.length} saved jobs'),
            ),
          );
        },
      ),
      extendBody: true,
      backgroundColor: LiquidGlassTheme.glassCanvas,
      body: LiquidGlassBackground(
        child: SafeArea(
          bottom: false,
          child: IndexedStack(
            index: _currentTabIndex,
            children: [
              // Tab 0: Home Page (TopCV Mobile Flagship)
              _buildHomeTab(),

              // Tab 1: All Jobs Feed
              _buildJobsFeedTab(),

              // Tab 2: CV Builder
              const TopCvBuilderTab(),

              // Tab 3: Notifications
              const NotificationsTab(),

              // Tab 4: Profile & Settings
              const TopCvProfileTab(),
            ],
          ),
        ),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 56),
        child: FloatingActionButton(
          heroTag: 'intervue_ai_mascot_fab',
          tooltip: 'InterVue AI Assistant',
          onPressed: () => context.push(RouteNames.aiChat),
          elevation: 6,
          backgroundColor: AppColors.primary,
          shape: const CircleBorder(),
          child: Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF00B14F), Color(0xFF059669)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.35),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Center(
              child: Icon(
                Icons.smart_toy_rounded,
                color: Colors.white,
                size: 28,
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: _buildLiquidGlassBottomNav(),
    );
  }

  Widget _buildLiquidGlassBottomNav() {
    final navItems = [
      (Icons.home_outlined, Icons.home_rounded, 'Home'),
      (Icons.work_outline_rounded, Icons.work_rounded, 'Jobs'),
      (Icons.description_outlined, Icons.description_rounded, 'Create CV'),
      (
        Icons.notifications_none_rounded,
        Icons.notifications_rounded,
        'Notifications',
      ),
      (Icons.person_outline_rounded, Icons.person_rounded, 'Profile'),
    ];

    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(26),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
            child: Container(
              height: 66,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.82),
                borderRadius: BorderRadius.circular(26),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.9),
                  width: 1.2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF003820).withValues(alpha: 0.08),
                    blurRadius: 28,
                    offset: const Offset(0, 10),
                  ),
                  BoxShadow(
                    color: Colors.white.withValues(alpha: 0.6),
                    blurRadius: 1,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(navItems.length, (index) {
                  final item = navItems[index];
                  final isSelected = _currentTabIndex == index;

                  Widget iconWidget = Icon(
                    isSelected ? item.$2 : item.$1,
                    size: 22,
                    color: isSelected ? AppColors.primary : AppColors.textMuted,
                  );

                  if (index == 3 && _unreadCount > 0) {
                    iconWidget = Badge(
                      label: Text('$_unreadCount'),
                      backgroundColor: AppColors.badgeUrgent,
                      child: iconWidget,
                    );
                  }

                  return Expanded(
                    child: InkWell(
                      onTap: () => setState(() => _currentTabIndex = index),
                      borderRadius: BorderRadius.circular(18),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 4,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          gradient: isSelected
                              ? const LinearGradient(
                                  colors: [
                                    Color(0xFFE8F8F0),
                                    Color(0xFFD1FAE5),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                )
                              : null,
                          borderRadius: BorderRadius.circular(18),
                          border: isSelected
                              ? Border.all(
                                  color: AppColors.primary.withValues(
                                    alpha: 0.35,
                                  ),
                                  width: 1.0,
                                )
                              : null,
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: AppColors.primary.withValues(
                                      alpha: 0.12,
                                    ),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ]
                              : null,
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            iconWidget,
                            const SizedBox(height: 2),
                            Text(
                              item.$3,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.w500,
                                color: isSelected
                                    ? AppColors.primaryDarker
                                    : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHomeTab() {
    return Column(
      children: [
        // Sticky Header & Search
        TopCvHeader(
          selectedLocation: _selectedLocation,
          onLocationChanged: (loc) {
            setState(() => _selectedLocation = loc);
            _triggerSearch();
          },
          savedJobsCount: _bookmarkedJobIds.length,
          unreadNotificationsCount: _unreadCount,
          onSavedJobsTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'You have ${_bookmarkedJobIds.length} saved jobs',
                ),
              ),
            );
          },
          onNotificationsTap: () => setState(() => _currentTabIndex = 3),
          onMenuTap: () => _scaffoldKey.currentState?.openDrawer(),
        ),

        TopCvSearchBar(
          controller: _searchController,
          onChanged: (_) => setState(() {}),
          onSubmitted: (_) => _triggerSearch(),
          onClear: () {
            setState(() {
              _searchController.clear();
              _selectedKeyword = '';
            });
            _triggerSearch();
          },
          onFilterTap: _openFilterModal,
          selectedKeyword: _selectedKeyword,
          onKeywordTap: _onKeywordSelected,
          hasActiveFilters: _filterData.hasFilter,
        ),

        // Scrollable Body
        Expanded(
          child: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () async {
              await context.read<JobListCubit>().loadJobs(silent: true);
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),

                  // Promotional Carousel
                  TopCvBannerCarousel(
                    onBannerTap: (idx) {
                      if (idx == 1) {
                        setState(() => _currentTabIndex = 4);
                      } else if (idx == 2) {
                        _onKeywordSelected('IT');
                      }
                    },
                  ),

                  const SizedBox(height: 12),

                  // Service Shortcuts Grid (8 Equal Blocks)
                  TopCvServiceGrid(onServiceTap: _handleServiceTap),

                  const SizedBox(height: 14),

                  // InterVue AI Spotlight Card
                  IntervueAiSpotlightCard(
                    onMockInterviewTap: () => _handleServiceTap('AI Interview'),
                    onCvScoringTap: () => _handleServiceTap('AI CV Scoring'),
                  ),

                  const SizedBox(height: 14),

                  // Market Pulse / Insights Card
                  TopCvMarketInsights(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'Loading the 2026 IT hiring market report...',
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // Job Category Tabs
                  _buildCategoryTabs(),

                  const SizedBox(height: 12),

                  // Job Feed Section
                  BlocBuilder<JobListCubit, JobListState>(
                    builder: (context, state) {
                      final rawJobs = switch (state) {
                        JobListLoaded(:final jobs) when jobs.isNotEmpty => jobs,
                        _ => TopCvMockData.getSampleJobs(),
                      };

                      final isUsingMockFallback =
                          state is! JobListLoaded || state.jobs.isEmpty;

                      final filteredJobs = _filterJobs(rawJobs);

                      if (state is JobListLoading) {
                        return const _JobListSkeleton();
                      }

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (isUsingMockFallback)
                            Container(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 6,
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primaryLight,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: AppColors.primary.withValues(
                                    alpha: 0.3,
                                  ),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.info_outline,
                                    color: AppColors.primaryDarker,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 8),
                                  const Expanded(
                                    child: Text(
                                      'Preview mode (InterVue IT sample job data)',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.primaryDarker,
                                      ),
                                    ),
                                  ),
                                  InkWell(
                                    onTap: () =>
                                        context.read<JobListCubit>().loadJobs(),
                                    child: const Text(
                                      'Reload',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primary,
                                        decoration: TextDecoration.underline,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                          // Count header
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 4,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Found ${filteredJobs.length} job opportunities',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                                if (_selectedKeyword.isNotEmpty ||
                                    _selectedLocation != 'Nationwide' ||
                                    _filterData.hasFilter)
                                  InkWell(
                                    onTap: () {
                                      setState(() {
                                        _selectedKeyword = '';
                                        _selectedLocation = 'Nationwide';
                                        _searchController.clear();
                                        _filterData = const TopCvFilterData();
                                      });
                                    },
                                    child: const Text(
                                      'Clear filters',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.error,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 6),

                          if (filteredJobs.isEmpty)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 40,
                              ),
                              alignment: Alignment.center,
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.search_off,
                                    size: 48,
                                    color: Colors.grey.shade400,
                                  ),
                                  const SizedBox(height: 10),
                                  const Text(
                                    'No matching jobs found',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'Try a different keyword or adjust the filters',
                                    style: TextStyle(
                                      fontSize: 12.5,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 6,
                              ),
                              itemCount: filteredJobs.length,
                              separatorBuilder: (_, _) =>
                                  const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final job = filteredJobs[index];
                                final isBookmarked = _bookmarkedJobIds.contains(
                                  job.id,
                                );
                                return TopCvJobCard(
                                  job: job,
                                  isBookmarked: isBookmarked,
                                  onBookmarkTap: () => _toggleBookmark(job),
                                );
                              },
                            ),
                        ],
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // Featured Top Companies Slider
                  TopCvCompanySlider(
                    onCompanyTap: (company) {
                      _onKeywordSelected(company.name);
                    },
                  ),

                  const SizedBox(height: 14),

                  // Career Guides & Tips
                  TopCvCareerGuide(
                    onArticleTap: (article) {
                      final category = article.categorySlug;
                      final slug = article.slug;
                      if (category == null || slug == null) {
                        context.push(RouteNames.blog);
                        return;
                      }
                      context.push(RouteNames.blogPost(category, slug));
                    },
                  ),

                  const SizedBox(height: 24),

                  // Footer info
                  Center(
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Image.asset(
                              'assets/images/intervue-logo.png',
                              height: 22,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) =>
                                  const Text(
                                    'InterVue',
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 15,
                                    ),
                                  ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Boost your edge - Connect to success',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 5),
                        const Text(
                          'The leading AI recruitment and interview practice platform in Vietnam',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 84),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildJobsFeedTab() {
    return Column(
      children: [
        TopCvHeader(
          selectedLocation: _selectedLocation,
          onLocationChanged: (loc) {
            setState(() => _selectedLocation = loc);
            _triggerSearch();
          },
          savedJobsCount: _bookmarkedJobIds.length,
          unreadNotificationsCount: _unreadCount,
          onSavedJobsTap: () {},
          onNotificationsTap: () => setState(() => _currentTabIndex = 3),
          onMenuTap: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        TopCvSearchBar(
          controller: _searchController,
          onChanged: (_) => setState(() {}),
          onSubmitted: (_) => _triggerSearch(),
          onClear: () {
            setState(() {
              _searchController.clear();
              _selectedKeyword = '';
            });
            _triggerSearch();
          },
          onFilterTap: _openFilterModal,
          selectedKeyword: _selectedKeyword,
          onKeywordTap: _onKeywordSelected,
          hasActiveFilters: _filterData.hasFilter,
        ),
        _buildCategoryTabs(),
        const SizedBox(height: 8),
        Expanded(
          child: BlocBuilder<JobListCubit, JobListState>(
            builder: (context, state) {
              final rawJobs = switch (state) {
                JobListLoaded(:final jobs) when jobs.isNotEmpty => jobs,
                _ => TopCvMockData.getSampleJobs(),
              };

              final filtered = _filterJobs(rawJobs);

              return ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 84),
                itemCount: filtered.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final job = filtered[index];
                  return TopCvJobCard(
                    job: job,
                    isBookmarked: _bookmarkedJobIds.contains(job.id),
                    onBookmarkTap: () => _toggleBookmark(job),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryTabs() {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: _jobCategories.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = _jobCategories[index];
          final isSelected = cat == _selectedCategory;
          return InkWell(
            onTap: () => setState(() => _selectedCategory = cat),
            borderRadius: BorderRadius.circular(20),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? LiquidGlassTheme.liquidEmeraldGradient
                    : null,
                color: isSelected ? null : Colors.white.withValues(alpha: 0.72),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected
                      ? Colors.white.withValues(alpha: 0.8)
                      : Colors.white.withValues(alpha: 0.9),
                  width: 1.1,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.35),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
              ),
              child: Center(
                child: Text(
                  cat,
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _JobListSkeleton extends StatelessWidget {
  const _JobListSkeleton();

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        itemCount: 4,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (_, _) => Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  ShimmerBox(height: 44, width: 44),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ShimmerBox(height: 16, width: 200),
                        SizedBox(height: 6),
                        ShimmerBox(height: 12, width: 140),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 14),
              Row(
                children: [
                  ShimmerBox(height: 22, width: 80),
                  SizedBox(width: 8),
                  ShimmerBox(height: 22, width: 100),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
