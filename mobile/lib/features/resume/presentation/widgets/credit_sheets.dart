import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/resume_review_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/cv_review_options.dart';

abstract final class CreditSheets {
  static Future<void> showTopup(BuildContext context) {
    final cubit = context.read<ResumeReviewCubit>();
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) =>
          BlocProvider.value(value: cubit, child: const _TopupSheet()),
    );
  }

  static Future<void> showHistory(BuildContext context) {
    final cubit = context.read<ResumeReviewCubit>();
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) =>
          BlocProvider.value(value: cubit, child: const _HistorySheet()),
    );
  }
}

class _SheetFrame extends StatelessWidget {
  const _SheetFrame({
    required this.title,
    required this.description,
    required this.child,
  });

  final String title;
  final String description;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        20,
        16,
        20,
        20 + MediaQuery.of(context).viewInsets.bottom,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: const TextStyle(
                fontSize: 12.5,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 14),
            child,
          ],
        ),
      ),
    );
  }
}

class _TopupSheet extends StatefulWidget {
  const _TopupSheet();

  @override
  State<_TopupSheet> createState() => _TopupSheetState();
}

class _TopupSheetState extends State<_TopupSheet> {
  int _selectedAmount = CvReviewOptions.defaultTopupAmount;

  Future<void> _topup() async {
    final messenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);
    final amount = _selectedAmount;
    final ok = await context.read<ResumeReviewCubit>().topup(amount);
    if (!mounted) return;
    if (ok) {
      navigator.pop();
      messenger.showSnackBar(
        SnackBar(content: Text('$amount credits added to your account.')),
      );
    } else {
      messenger.showSnackBar(
        const SnackBar(
          content: Text(
            'Could not top up credits right now. Please try again.',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ResumeReviewCubit, ResumeReviewState>(
      builder: (context, state) {
        return _SheetFrame(
          title: 'Top up review credits',
          description:
              'Current balance: ${state.creditBalance} credits. A job match review uses 1 credit.',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ...CvReviewOptions.topupPackages.map(
                (pkg) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: InkWell(
                    onTap: () => setState(() => _selectedAmount = pkg.amount),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: _selectedAmount == pkg.amount
                            ? AppColors.primaryLight
                            : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: _selectedAmount == pkg.amount
                              ? AppColors.primary
                              : AppColors.border,
                          width: _selectedAmount == pkg.amount ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      '${pkg.amount} credits',
                                      style: const TextStyle(
                                        fontSize: 14.5,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    if (pkg.popular) ...[
                                      const SizedBox(width: 8),
                                      const Text(
                                        'Popular',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                Text(
                                  pkg.description,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            pkg.price,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Credits are available immediately. If the AI fails during an analysis, the credit is refunded automatically.',
                style: TextStyle(
                  fontSize: 12,
                  height: 1.4,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                height: 46,
                child: FilledButton(
                  onPressed: state.isToppingUp ? null : _topup,
                  child: state.isToppingUp
                      ? const SizedBox.square(
                          dimension: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text('Add $_selectedAmount credits'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _HistorySheet extends StatelessWidget {
  const _HistorySheet();

  static const Map<String, String> _typeLabels = {
    'CHARGE': 'Charge',
    'REFUND': 'Automatic refund',
    'TOPUP': 'Top up',
    'INITIAL_GRANT': 'Welcome credit',
  };

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ResumeReviewCubit, ResumeReviewState>(
      builder: (context, state) {
        final transactions = state.credits?.recentTransactions ?? const [];
        return _SheetFrame(
          title: 'Credit history',
          description:
              'Current balance: ${state.creditBalance} credits. Every charge and refund is recorded here.',
          child: transactions.isEmpty
              ? const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                    child: Text(
                      'No credit transactions yet.',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                )
              : ConstrainedBox(
                  constraints: BoxConstraints(
                    maxHeight: MediaQuery.of(context).size.height * 0.5,
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    itemCount: transactions.length,
                    separatorBuilder: (_, _) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final tx = transactions[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _typeLabels[tx.type] ?? tx.type,
                                    style: const TextStyle(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    tx.description,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                  if (tx.createdAt != null)
                                    Text(
                                      Formatters.date(tx.createdAt!),
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  tx.amount > 0
                                      ? '+${tx.amount}'
                                      : '${tx.amount}',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: tx.amount < 0
                                        ? AppColors.error
                                        : AppColors.primary,
                                  ),
                                ),
                                Text(
                                  'Balance ${tx.balanceAfter}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
        );
      },
    );
  }
}
