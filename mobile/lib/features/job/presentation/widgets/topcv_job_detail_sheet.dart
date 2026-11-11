import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/application/presentation/widgets/candidate_apply_modal.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/company/presentation/widgets/company_detail_sheet.dart';
import 'package:intervue_flutter/features/cover_letter/presentation/views/cover_letter_sheet.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';

class TopCvJobDetailSheet extends StatefulWidget {
  const TopCvJobDetailSheet({
    required this.job,
    this.isBookmarked = false,
    this.onBookmarkTap,
    this.onApplyTap,
    super.key,
  });

  final JobEntity job;
  final bool isBookmarked;
  final VoidCallback? onBookmarkTap;
  final VoidCallback? onApplyTap;

  @override
  State<TopCvJobDetailSheet> createState() => _TopCvJobDetailSheetState();
}

class _TopCvJobDetailSheetState extends State<TopCvJobDetailSheet> {
  late bool _bookmarked;
  late JobEntity _job;

  @override
  void initState() {
    super.initState();
    _bookmarked = widget.isBookmarked;
    _job = widget.job;
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    if (_job.description != null || int.tryParse(_job.id) == null) return;
    try {
      final detail = await GetIt.instance<IJobRepository>().fetchJobDetail(
        _job.id,
      );
      if (mounted) {
        setState(() => _job = detail);
      }
    } catch (_) {
      return;
    }
  }

  void _onApplyPressed(BuildContext context) {
    final authState = context.read<AuthBloc>().state;
    if (authState is! AuthAuthenticated) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Vui lòng đăng nhập để nộp hồ sơ ứng tuyển'),
            backgroundColor: AppColors.accentOrange,
          ),
        );
      context.push(RouteNames.login);
      return;
    }

    final jobId = int.tryParse(_job.id);
    if (jobId == null) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Mã việc làm không hợp lệ'),
            backgroundColor: AppColors.error,
          ),
        );
      return;
    }

    CandidateApplyModal.show(
      context,
      jobId: jobId,
      jobTitle: _job.title,
      companyName: _job.companyName,
      jobEntity: _job,
    );
    widget.onApplyTap?.call();
  }

  @override
  Widget build(BuildContext context) {
    final job = _job;
    final deadline = job.deadline;

    return DraggableScrollableSheet(
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.96,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // Drag Handle
              Center(
                child: Container(
                  margin: const EdgeInsets.only(top: 10, bottom: 6),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Title Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Chi tiết việc làm',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),

              // Scrollable Content
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Job Title
                    Text(
                      job.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Company Name
                    InkWell(
                      onTap: () {
                        final compId = int.tryParse(job.id) ?? 1;
                        CompanyDetailSheet.show(context, companyId: compId);
                      },
                      child: Row(
                        children: [
                          Flexible(
                            child: Text(
                              job.companyName,
                              style: const TextStyle(
                                fontSize: 13.5,
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.check_circle,
                            color: AppColors.primary,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.info_outline,
                            color: AppColors.textMuted,
                            size: 14,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Key Overview Cards Grid
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              _buildInfoTile(
                                icon: Icons.payments_outlined,
                                iconColor: AppColors.primary,
                                label: 'Mức lương',
                                value: job.displaySalary,
                                isPrimaryValue: true,
                              ),
                              _buildInfoTile(
                                icon: Icons.location_on_outlined,
                                iconColor: AppColors.accentBlue,
                                label: 'Địa điểm',
                                value: job.location ?? 'Thỏa thuận',
                              ),
                            ],
                          ),
                          const Divider(height: 20),
                          Row(
                            children: [
                              _buildInfoTile(
                                icon: Icons.work_outline,
                                iconColor: AppColors.accentOrange,
                                label: 'Kinh nghiệm',
                                value: job.experience ?? 'Không yêu cầu',
                              ),
                              _buildInfoTile(
                                icon: Icons.schedule,
                                iconColor: AppColors.textSecondary,
                                label: 'Hạn nộp hồ sơ',
                                value: deadline != null
                                    ? Formatters.date(deadline)
                                    : 'Tuyển liên tục',
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Tags
                    if (job.tags.isNotEmpty) ...[
                      const Text(
                        'Kỹ năng & Chuyên môn',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: job.tags.map((tag) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 5,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.chipBackground,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Text(
                              tag,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // AI CV Review CTA
                    _buildCvReviewCtaCard(context),
                    const SizedBox(height: 14),

                    // Description Section
                    _buildSectionCard(
                      title: 'Mô tả công việc',
                      icon: Icons.description_outlined,
                      content:
                          job.description ??
                          '• Tham gia phát triển và duy trì hệ thống ứng dụng đáp ứng yêu cầu kinh doanh.\n'
                              '• Phối hợp chặt chẽ cùng các thành viên trong nhóm Product, Design, QA để tối ưu trải nghiệm người dùng.\n'
                              '• Nghiên cứu và áp dụng các công nghệ mới nhằm nâng cao hiệu suất và chất lượng sản phẩm.',
                    ),

                    const SizedBox(height: 14),

                    // Requirements Section
                    _buildSectionCard(
                      title: 'Yêu cầu ứng viên',
                      icon: Icons.checklist_outlined,
                      content:
                          job.requirements ??
                          '• Nắm vững kiến thức nền tảng và có kinh nghiệm thực tế phù hợp với vị trí ứng tuyển.\n'
                              '• Tư duy logic tốt, khả năng làm việc nhóm và giao tiếp hiệu quả.\n'
                              '• Tinh thần trách nhiệm cao, chủ động trong công việc và sẵn sàng học hỏi cái mới.',
                    ),

                    const SizedBox(height: 14),

                    // Benefits Section
                    _buildSectionCard(
                      title: 'Quyền lợi được hưởng',
                      icon: Icons.card_giftcard_outlined,
                      content:
                          job.benefits ??
                          '• Mức thu nhập cạnh tranh, xem xét tăng lương định kỳ 1-2 lần/năm.\n'
                              '• Thưởng tháng 13, thưởng hiệu quả kinh doanh và các dịp lễ tết.\n'
                              '• Đầy đủ chế độ BHXH, BHYT theo quy định pháp luật cùng gói bảo hiểm sức khỏe cao cấp.\n'
                              '• Du lịch thường niên, teambuilding, môi trường làm việc cởi mở, sáng tạo.',
                    ),

                    OutlinedButton.icon(
                      onPressed: () => CoverLetterSheet.show(context, _job),
                      icon: const Icon(Icons.auto_awesome_rounded),
                      label: const Text('Viết thư xin việc bằng AI'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.primary,
                        side: const BorderSide(color: AppColors.primary),
                        minimumSize: const Size.fromHeight(48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),

                    const SizedBox(height: 10),

                    OutlinedButton.icon(
                      onPressed: () {
                        context.push(
                          RouteNames.aiChat,
                          extra: ChatContext(
                            pageType: 'job_detail',
                            entityId: int.tryParse(_job.id),
                            jobTitle: _job.title,
                            companyName: _job.companyName,
                          ),
                        );
                      },
                      icon: const Icon(Icons.smart_toy_outlined),
                      label: const Text('Hỏi InterVue Bot về việc này'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF0284C7),
                        side: const BorderSide(color: Color(0xFF0284C7)),
                        minimumSize: const Size.fromHeight(48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),

                    const SizedBox(height: 80), // Space for sticky bottom bar
                  ],
                ),
              ),

              // Bottom Sticky Action Bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 10,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: SafeArea(
                  top: false,
                  child: Row(
                    children: [
                      // Bookmark toggle button
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.border),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: IconButton(
                          icon: Icon(
                            _bookmarked
                                ? Icons.bookmark_rounded
                                : Icons.bookmark_border_rounded,
                            color: _bookmarked
                                ? AppColors.primary
                                : AppColors.textSecondary,
                          ),
                          onPressed: () {
                            setState(() => _bookmarked = !_bookmarked);
                            widget.onBookmarkTap?.call();
                          },
                        ),
                      ),

                      const SizedBox(width: 12),

                      // Apply Button
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          onPressed: () => _onApplyPressed(context),
                          child: const Text(
                            'Ứng tuyển ngay',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCvReviewCtaCard(BuildContext context) {
    final isAuthenticated =
        context.watch<AuthBloc>().state is AuthAuthenticated;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryLight.withValues(alpha: 0.35),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.auto_awesome, color: AppColors.primary, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Đánh giá & tối ưu CV bằng AI',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  isAuthenticated
                      ? 'Kiểm tra điểm mạnh, lỗ hổng kỹ năng trước khi nộp đơn'
                      : 'Đăng nhập để sử dụng AI chấm điểm và gợi ý sửa CV',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () => context.push(
              isAuthenticated ? RouteNames.resume : RouteNames.login,
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(
              isAuthenticated ? 'Chấm điểm CV' : 'Đăng nhập',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
    bool isPrimaryValue = false,
  }) {
    return Expanded(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isPrimaryValue
                        ? FontWeight.w800
                        : FontWeight.w600,
                    color: isPrimaryValue
                        ? AppColors.primaryDarker
                        : AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required String content,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: AppColors.primary),
              const SizedBox(width: 6),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textPrimary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
