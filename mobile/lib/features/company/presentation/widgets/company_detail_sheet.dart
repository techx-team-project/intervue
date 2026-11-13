import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/company/data/models/public_company_model.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_cubit.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_state.dart';

class CompanyDetailSheet extends StatelessWidget {
  const CompanyDetailSheet({required this.companyId, super.key});

  final int companyId;

  static Future<void> show(BuildContext context, {required int companyId}) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider(
        create: (_) => getIt<CompanyDetailCubit>()..loadCompany(companyId),
        child: CompanyDetailSheet(companyId: companyId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(top: 12, bottom: 8),
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Expanded(
                child: BlocBuilder<CompanyDetailCubit, CompanyDetailState>(
                  builder: (context, state) {
                    return switch (state) {
                      CompanyDetailInitial() || CompanyDetailLoading() =>
                        const Center(child: CircularProgressIndicator()),
                      CompanyDetailError(:final message) => _buildErrorView(
                        context,
                        message,
                      ),
                      CompanyDetailLoaded(:final company) =>
                        _buildLoadedContent(context, company, scrollController),
                    };
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildErrorView(BuildContext context, String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () =>
                  context.read<CompanyDetailCubit>().loadCompany(companyId),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Try again'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadedContent(
    BuildContext context,
    PublicCompanyModel company,
    ScrollController scrollController,
  ) {
    return ListView(
      controller: scrollController,
      padding: const EdgeInsets.all(20),
      children: [
        // Company Header
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Center(
                child: Text(
                  company.initials,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryDarker,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    company.displayName,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  if (company.industry != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      company.industry!,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        // Quick Info Grid
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              if (company.size != null)
                _buildInfoRow(
                  Icons.people_outline,
                  'Company size',
                  company.size!,
                ),
              if (company.address != null) ...[
                const Divider(height: 16),
                _buildInfoRow(
                  Icons.location_on_outlined,
                  'Headquarters',
                  company.address!,
                ),
              ],
              if (company.website != null) ...[
                const Divider(height: 16),
                _buildInfoRow(
                  Icons.language_outlined,
                  'Website',
                  company.website!,
                ),
              ],
              if (company.email != null) ...[
                const Divider(height: 16),
                _buildInfoRow(
                  Icons.email_outlined,
                  'Contact email',
                  company.email!,
                ),
              ],
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Company Description
        if (company.description != null && company.description!.isNotEmpty) ...[
          const Text(
            'About the company',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            company.description!,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 20),
        ],

        // Company Benefits
        if (company.benefits != null && company.benefits!.isNotEmpty) ...[
          const Text(
            'Benefits & Culture',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primaryLight.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.2),
              ),
            ),
            child: Text(
              company.benefits!,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textPrimary,
                height: 1.45,
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
