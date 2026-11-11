import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_model.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_cubit.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_state.dart';
import 'package:intervue_flutter/features/job_alert/presentation/widgets/create_job_alert_modal.dart';

class JobAlertScreen extends StatefulWidget {
  const JobAlertScreen({super.key});

  @override
  State<JobAlertScreen> createState() => _JobAlertScreenState();
}

class _JobAlertScreenState extends State<JobAlertScreen> {
  int _selectedFilterTab = 0; // 0: Tất cả, 1: Đang bật, 2: Tạm dừng

  @override
  void initState() {
    super.initState();
    unawaited(context.read<JobAlertListCubit>().loadAlerts());
  }

  void _openCreateModal() async {
    final request = await CreateJobAlertModal.show(context);
    if (request != null && mounted) {
      unawaited(context.read<JobAlertListCubit>().createAlert(request));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<JobAlertListCubit, JobAlertListState>(
      listener: (context, state) {
        if (state is JobAlertListLoaded) {
          if (state.actionMessage != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.actionMessage!),
                backgroundColor: AppColors.primary,
              ),
            );
            context.read<JobAlertListCubit>().clearAction();
          } else if (state.actionError != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.actionError!),
                backgroundColor: AppColors.error,
              ),
            );
            context.read<JobAlertListCubit>().clearAction();
          }
        } else if (state is JobAlertListError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text(
            'Thông báo việc làm phù hợp',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          actions: [
            TextButton.icon(
              onPressed: _openCreateModal,
              icon: const Icon(Icons.add, size: 18, color: AppColors.primary),
              label: const Text(
                'Tạo mới',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
        body: BlocBuilder<JobAlertListCubit, JobAlertListState>(
          builder: (context, state) {
            if (state is JobAlertListLoading) {
              return const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              );
            }

            if (state is JobAlertListError) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 48,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 12),
                    Text(state.message, style: const TextStyle(fontSize: 14)),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () =>
                          context.read<JobAlertListCubit>().loadAlerts(),
                      child: const Text('Thử lại'),
                    ),
                  ],
                ),
              );
            }

            if (state is JobAlertListLoaded) {
              final alerts = switch (_selectedFilterTab) {
                1 => state.activeAlerts,
                2 => state.pausedAlerts,
                _ => state.alerts,
              };

              return RefreshIndicator(
                color: AppColors.primary,
                onRefresh: () async {
                  await context.read<JobAlertListCubit>().loadAlerts(
                    silent: true,
                  );
                },
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // KPI Summary Cards
                    _buildSummaryCard(state),
                    const SizedBox(height: 14),

                    // Filter Tabs
                    _buildFilterTabs(state),
                    const SizedBox(height: 14),

                    // Alerts List or Empty
                    if (alerts.isEmpty)
                      _buildEmptyState()
                    else
                      ...alerts.map((alert) => _buildAlertCard(alert)),
                  ],
                ),
              );
            }

            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildSummaryCard(JobAlertListLoaded state) {
    final summary = state.summary;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          _buildKpiItem(
            'Tổng thông báo',
            '${summary.totalAlerts}',
            Icons.notifications_outlined,
            AppColors.primary,
          ),
          const SizedBox(
            height: 36,
            child: VerticalDivider(width: 24, color: AppColors.border),
          ),
          _buildKpiItem(
            'Đang bật',
            '${summary.activeAlerts}',
            Icons.bolt,
            const Color(0xFF10B981),
          ),
          const SizedBox(
            height: 36,
            child: VerticalDivider(width: 24, color: AppColors.border),
          ),
          _buildKpiItem(
            'Việc đã gửi',
            '${summary.totalDeliveries}',
            Icons.mark_email_read_outlined,
            AppColors.accentBlue,
          ),
        ],
      ),
    );
  }

  Widget _buildKpiItem(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterTabs(JobAlertListLoaded state) {
    return Row(
      children: [
        _buildTabItem(0, 'Tất cả (${state.alerts.length})'),
        const SizedBox(width: 8),
        _buildTabItem(1, 'Đang bật (${state.activeAlerts.length})'),
        const SizedBox(width: 8),
        _buildTabItem(2, 'Tạm dừng (${state.pausedAlerts.length})'),
      ],
    );
  }

  Widget _buildTabItem(int index, String label) {
    final isSelected = _selectedFilterTab == index;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedFilterTab = index),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? Colors.white : AppColors.textPrimary,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAlertCard(JobAlertModel alert) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: alert.isActive
              ? AppColors.primary.withValues(alpha: 0.35)
              : AppColors.border,
          width: alert.isActive ? 1.2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Title, Frequency Badge, Switch
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      alert.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: alert.isActive
                            ? AppColors.primaryLight
                            : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Nhận ${alert.frequencyLabelVi.toLowerCase()}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: alert.isActive
                              ? AppColors.primaryDarker
                              : AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Switch.adaptive(
                value: alert.isActive,
                activeTrackColor: AppColors.primary,
                onChanged: (_) {
                  unawaited(
                    context.read<JobAlertListCubit>().toggleAlert(alert.id),
                  );
                },
              ),
            ],
          ),
          const Divider(height: 18),

          // Filters summary
          Wrap(
            spacing: 8,
            runSpacing: 6,
            children: [
              if (alert.city != null && alert.city!.isNotEmpty)
                _buildTagChip(Icons.location_on_outlined, alert.city!),
              if (alert.keyword != null && alert.keyword!.isNotEmpty)
                _buildTagChip(Icons.tag, alert.keyword!),
              if (alert.workMode != null)
                _buildTagChip(Icons.work_outline, alert.workModeLabelVi),
              if (alert.careerLevel != null)
                _buildTagChip(Icons.stairs_outlined, alert.careerLevelLabelVi),
              _buildTagChip(Icons.attach_money, alert.salaryLabelVi),
            ],
          ),

          const SizedBox(height: 12),

          // Deliveries & Actions
          Row(
            children: [
              Icon(
                Icons.mark_email_read_outlined,
                size: 15,
                color: Colors.grey.shade600,
              ),
              const SizedBox(width: 6),
              Text(
                'Đã gửi: ${alert.deliveredCount} việc làm',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
              const Spacer(),
              // Send Test Email Action
              IconButton(
                tooltip: 'Gửi email thử nghiệm',
                icon: const Icon(
                  Icons.send_outlined,
                  size: 18,
                  color: AppColors.primary,
                ),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () {
                  unawaited(
                    context.read<JobAlertListCubit>().sendTestEmail(alert.id),
                  );
                },
              ),
              const SizedBox(width: 14),
              // Delete Action
              IconButton(
                tooltip: 'Xóa thông báo',
                icon: const Icon(
                  Icons.delete_outline,
                  size: 18,
                  color: Colors.redAccent,
                ),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Xác nhận xóa'),
                      content: Text(
                        'Bạn có chắc muốn xóa thông báo việc làm "${alert.title}"?',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, false),
                          child: const Text('Hủy'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, true),
                          child: const Text(
                            'Xóa',
                            style: TextStyle(color: AppColors.error),
                          ),
                        ),
                      ],
                    ),
                  );
                  if (confirm == true && mounted) {
                    unawaited(
                      context.read<JobAlertListCubit>().deleteAlert(alert.id),
                    );
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTagChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11.5,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(28),
      margin: const EdgeInsets.only(top: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.notifications_off_outlined,
              size: 40,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'Chưa có thông báo việc làm nào',
            style: TextStyle(
              fontSize: 15.5,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Hãy tạo thông báo việc làm phù hợp để nhận cơ hội nghề nghiệp IT hấp dẫn nhất ngay khi nhà tuyển dụng đăng tin.',
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 18),
          ElevatedButton.icon(
            onPressed: _openCreateModal,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            ),
            icon: const Icon(Icons.add, size: 18),
            label: const Text(
              'Tạo thông báo việc làm ngay',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
