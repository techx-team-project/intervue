import 'package:equatable/equatable.dart';

class CandidateCreditTransaction extends Equatable {
  const CandidateCreditTransaction({
    required this.id,
    required this.amount,
    required this.balanceAfter,
    required this.type,
    required this.description,
    this.createdAt,
  });

  factory CandidateCreditTransaction.fromJson(Map<String, dynamic> json) =>
      CandidateCreditTransaction(
        id: (json['id'] as num).toInt(),
        amount: (json['amount'] as num?)?.toInt() ?? 0,
        balanceAfter: (json['balanceAfter'] as num?)?.toInt() ?? 0,
        type: json['type'] as String? ?? '',
        description: json['description'] as String? ?? '',
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '')
            ?.toLocal(),
      );

  final int id;
  final int amount;
  final int balanceAfter;
  final String type;
  final String description;
  final DateTime? createdAt;

  @override
  List<Object?> get props => [
    id,
    amount,
    balanceAfter,
    type,
    description,
    createdAt,
  ];
}

class CandidateCreditSummary extends Equatable {
  const CandidateCreditSummary({
    required this.currentBalance,
    this.recentTransactions = const [],
  });

  factory CandidateCreditSummary.fromJson(Map<String, dynamic> json) =>
      CandidateCreditSummary(
        currentBalance: (json['currentBalance'] as num?)?.toInt() ?? 0,
        recentTransactions:
            (json['recentTransactions'] as List<dynamic>? ?? const [])
                .map(
                  (e) => CandidateCreditTransaction.fromJson(
                    e as Map<String, dynamic>,
                  ),
                )
                .toList(),
      );

  final int currentBalance;
  final List<CandidateCreditTransaction> recentTransactions;

  @override
  List<Object?> get props => [currentBalance, recentTransactions];
}
