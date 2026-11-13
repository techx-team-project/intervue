import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class UpgradePlan {
  const UpgradePlan({
    required this.id,
    required this.name,
    required this.price,
    required this.priceText,
    required this.periodText,
    required this.features,
    this.badge,
    this.isHighlight = false,
    this.buttonText = 'Upgrade now',
  });

  final String id;
  final String name;
  final int price;
  final String priceText;
  final String periodText;
  final List<String> features;
  final String? badge;
  final bool isHighlight;
  final String buttonText;
}

class UpgradeScreen extends StatefulWidget {
  const UpgradeScreen({super.key});

  @override
  State<UpgradeScreen> createState() => _UpgradeScreenState();
}

class _UpgradeScreenState extends State<UpgradeScreen> {
  final _voucherController = TextEditingController();
  String? _appliedVoucher;
  double _discountPercent = 0.0;
  String? _voucherMessage;

  final List<UpgradePlan> _plans = const [
    UpgradePlan(
      id: 'free',
      name: 'Free Plan',
      price: 0,
      priceText: 'Free',
      periodText: 'Forever',
      buttonText: 'Current plan',
      features: [
        'Create up to 6 CVs & 6 cover letters',
        'Download wait time: 5 seconds',
        'Use basic CV templates',
        'Verified badge: No',
        'Top placement boost: No',
        'Competition insights: 3 jobs',
      ],
    ),
    UpgradePlan(
      id: 'pro',
      name: 'Pro VIP Plan',
      price: 50000,
      priceText: '50,000 VND',
      periodText: '1 month',
      badge: 'PHỔ BIẾN',
      buttonText: 'Upgrade to Pro',
      features: [
        'Create 12 premium CVs & 12 cover letters',
        'Super fast download wait time: 3 seconds',
        'Unlock all premium CV & cover letter templates',
        'Boost your profile to recruiters: once a day',
        'Highlighted verified badge',
        'Hide the ©intervue.vn watermark on printouts',
        'Free Gitiho PRO account worth 299K',
        'Unlimited competition insights',
      ],
    ),
    UpgradePlan(
      id: 'premium',
      name: 'Premium VIP Plan',
      price: 500000,
      priceText: '500,000 VND',
      periodText: '1 year (12 months)',
      badge: 'NỔI BẬT NHẤT',
      isHighlight: true,
      buttonText: 'Upgrade to Premium',
      features: [
        'All benefits of the Pro VIP plan',
        'UNLIMITED CVs & cover letters',
        'Instant CV download (0s wait)',
        'Highest-priority top placement with recruiters',
        'Unlock all AI Mock Interview scenarios',
        'ATS-ready CV keyword analysis & optimization',
        'Lifetime Gitiho Office skills course',
        'Priority 1:1 technical & CV support 24/7',
      ],
    ),
  ];

  final List<Map<String, String>> _faqs = const [
    {
      'q': 'How is the VIP account activated after payment?',
      'a': 'InterVue activates your VIP account automatically as soon as the VietQR bank transfer is confirmed (usually within 10 - 30 seconds).',
    },
    {
      'q': 'Which payment methods can I use to upgrade?',
      'a': 'You can pay by scanning the VietQR code from any mobile banking app (Vietcombank, MB, Techcombank, VPBank, ...) or e-wallets such as MoMo and ZaloPay.',
    },
    {
      'q': 'Do VIP benefits apply to the mobile app too?',
      'a': 'Yes. All VIP perks sync in real time across the website and the InterVue Android and iOS apps at no extra cost.',
    },
    {
      'q': 'If my VIP plan expires, will my CVs be deleted?',
      'a': 'No. All your CVs, cover letters and certificates stay safely stored. Your account simply returns to the Free plan limits.',
    },
  ];

  @override
  void dispose() {
    _voucherController.dispose();
    super.dispose();
  }

  void _applyVoucher() {
    final code = _voucherController.text.trim().toUpperCase();
    setState(() {
      if (code == 'TOPCV2026' || code == 'INTERVUEVIP') {
        _appliedVoucher = code;
        _discountPercent = 0.20; // 20% off
        _voucherMessage = 'Code applied! You get 20% off.';
      } else if (code == 'PROVIP') {
        _appliedVoucher = code;
        _discountPercent = 0.10; // 10% off
        _voucherMessage = 'Code applied! You get 10% off.';
      } else {
        _appliedVoucher = null;
        _discountPercent = 0.0;
        _voucherMessage = 'The discount code is invalid or has expired.';
      }
    });
  }

  void _openPaymentQrModal(UpgradePlan plan) {
    if (plan.price == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You are already on this plan.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    final originalPrice = plan.price;
    final finalPrice = (originalPrice * (1.0 - _discountPercent)).round();
    final orderCode =
        'IVVIP_${plan.id.toUpperCase()}_${DateTime.now().millisecondsSinceEpoch % 1000000}';

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _PaymentQrBottomSheet(
        plan: plan,
        finalPrice: finalPrice,
        orderCode: orderCode,
        discountPercent: _discountPercent,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Upgrade to VIP',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              context.go(RouteNames.jobs);
            }
          },
        ),
        actions: [
          IconButton(
            tooltip: 'Upgrade support',
            icon: const Icon(
              Icons.support_agent_rounded,
              color: AppColors.primary,
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('VIP support hotline: 1900 068 889 (ext. 2)'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
        ],
        elevation: 0,
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // 1. Hero Section matching web UpgradeHero
            _buildHeroSection(),

            // 2. Voucher / Promo code section
            _buildVoucherSection(),

            // 3. Pricing Plan Cards
            _buildPlansList(),

            // 4. Feature Comparison Table
            _buildFeatureComparison(),

            // 5. Frequently Asked Questions (Accordion)
            _buildFaqSection(),

            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 28),
      decoration: const BoxDecoration(
        color: Color(0xFFEBFDF2),
        border: Border(bottom: BorderSide(color: Color(0xFFE2F4E9))),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: const Color(0xFFB9F1D3)),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.stars_rounded, color: AppColors.primary, size: 16),
                SizedBox(width: 6),
                Text(
                  'UPGRADE TO VIP',
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                    color: AppColors.primaryDarker,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Unlock more benefits',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: AppColors.primaryDark,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Elevate your application, remove all CV download limits and reach top recruiters faster.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: Color(0xFF475569),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVoucherSection() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.confirmation_number_outlined,
                color: AppColors.primary,
                size: 20,
              ),
              SizedBox(width: 8),
              Text(
                'Promo code / discount voucher',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _voucherController,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: 'Enter code (e.g. TOPCV2026, INTERVUEVIP)',
                    hintStyle: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF94A3B8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 11,
                    ),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: _applyVoucher,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                child: const Text(
                  'Apply',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          if (_voucherMessage != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  _appliedVoucher != null
                      ? Icons.check_circle
                      : Icons.error_outline,
                  size: 15,
                  color: _appliedVoucher != null
                      ? AppColors.primary
                      : AppColors.error,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    _voucherMessage!,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _appliedVoucher != null
                          ? AppColors.primaryDark
                          : AppColors.error,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPlansList() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 850;
        if (isWide) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: _plans.map((plan) {
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    child: _buildPlanCard(plan),
                  ),
                );
              }).toList(),
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            children: _plans.map((plan) => _buildPlanCard(plan)).toList(),
          ),
        );
      },
    );
  }

  Widget _buildPlanCard(UpgradePlan plan) {
    final isHighlight = plan.isHighlight;
    final discountedPrice = (plan.price * (1.0 - _discountPercent)).round();

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isHighlight ? AppColors.primary : const Color(0xFFE2E8F0),
          width: isHighlight ? 2 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: isHighlight
                ? AppColors.primary.withValues(alpha: 0.12)
                : Colors.black.withValues(alpha: 0.03),
            blurRadius: isHighlight ? 16 : 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Top Header Banner of the Plan
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isHighlight
                  ? const Color(0xFFF0FDF4)
                  : const Color(0xFFF8FAFC),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(18),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: 6,
                        runSpacing: 4,
                        children: [
                          Text(
                            plan.name,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: isHighlight
                                  ? AppColors.primaryDarker
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                          if (plan.badge != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: isHighlight
                                    ? AppColors.primary
                                    : const Color(0xFF0284C7),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                plan.badge!,
                                style: const TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Duration: ${plan.periodText}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (_discountPercent > 0 && plan.price > 0) ...[
                      Text(
                        plan.priceText,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF94A3B8),
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                      Text(
                        '${discountedPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} VND',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primary,
                        ),
                      ),
                    ] else ...[
                      Text(
                        plan.priceText,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: isHighlight
                              ? AppColors.primary
                              : const Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: Color(0xFFF1F5F9)),

          // Feature List
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              children: [
                ...plan.features.map(
                  (feat) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          isHighlight
                              ? Icons.check_circle_rounded
                              : Icons.check_circle_outline_rounded,
                          color: isHighlight
                              ? AppColors.primary
                              : const Color(0xFF10B981),
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            feat,
                            style: const TextStyle(
                              fontSize: 13,
                              height: 1.35,
                              color: Color(0xFF334155),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // CTA Button
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    onPressed: () => _openPaymentQrModal(plan),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isHighlight
                          ? AppColors.primary
                          : plan.price > 0
                          ? const Color(0xFF0F172A)
                          : const Color(0xFFF1F5F9),
                      foregroundColor: plan.price > 0
                          ? Colors.white
                          : const Color(0xFF64748B),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          plan.buttonText,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        if (plan.price > 0) ...[
                          const SizedBox(width: 6),
                          const Icon(Icons.arrow_forward_rounded, size: 16),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureComparison() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.compare_arrows_rounded,
                color: AppColors.primary,
                size: 22,
              ),
              SizedBox(width: 8),
              Text(
                'Detailed benefit comparison',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _comparisonRow('CVs you can create', '6 CVs', '12 CVs', 'Unlimited'),
          _comparisonRow('Download wait time', '5s', '3s', 'Instant (0s)'),
          _comparisonRow(
            'Profile boost',
            '—',
            'Once a day',
            'Highest priority',
          ),
          _comparisonRow('VIP verified badge', '—', '✓ Yes', '✓ Yes'),
          _comparisonRow(
            'Premium CV templates',
            '—',
            '✓ Unlocked',
            '✓ Full set',
          ),
          _comparisonRow(
            'AI Mock Interview',
            'Basic',
            'Basic',
            'Fully unlocked',
          ),
          _comparisonRow('Gitiho 299K gift', '—', '✓ Included', '✓ Included'),
        ],
      ),
    );
  }

  Widget _comparisonRow(
    String title,
    String freeVal,
    String proVal,
    String premVal,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 9),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                color: Color(0xFF475569),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              freeVal,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              proVal,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF0F172A),
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              premVal,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFaqSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.help_outline_rounded,
                color: AppColors.primary,
                size: 22,
              ),
              SizedBox(width: 8),
              Text(
                'Frequently asked questions',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._faqs.map(
            (faq) => Theme(
              data: Theme.of(context)
                  .copyWith(dividerColor: Colors.transparent),
              child: ExpansionTile(
                tilePadding: EdgeInsets.zero,
                childrenPadding: const EdgeInsets.only(bottom: 12),
                title: Text(
                  faq['q']!,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1E293B),
                  ),
                ),
                children: [
                  Text(
                    faq['a']!,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.5,
                      color: Color(0xFF475569),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// VietQR Payment BottomSheet exactly matching web's PaymentQrModal
class _PaymentQrBottomSheet extends StatefulWidget {
  const _PaymentQrBottomSheet({
    required this.plan,
    required this.finalPrice,
    required this.orderCode,
    required this.discountPercent,
  });

  final UpgradePlan plan;
  final int finalPrice;
  final String orderCode;
  final double discountPercent;

  @override
  State<_PaymentQrBottomSheet> createState() => _PaymentQrBottomSheetState();
}

class _PaymentQrBottomSheetState extends State<_PaymentQrBottomSheet> {
  int _countdown = 900; // 15:00
  Timer? _timer;
  bool _isProcessing = false;
  bool _isSuccess = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_countdown > 0) {
        setState(() => _countdown--);
      } else {
        t.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Copied $label'),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _confirmPayment() {
    setState(() => _isProcessing = true);
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (!mounted) return;
      setState(() {
        _isProcessing = false;
        _isSuccess = true;
      });
    });
  }

  String _formatCountdown(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final formattedPrice =
        '${widget.finalPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} VND';

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.sizeOf(context).height * 0.88,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 32),
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            if (_isSuccess) ...[
              // Success Screen
              Center(
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: const BoxDecoration(
                    color: AppColors.primaryLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_rounded,
                    color: AppColors.primary,
                    size: 40,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  '${widget.plan.name} activated successfully!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Congratulations! All VIP perks are ready. You can now create unlimited CVs, download instantly and boost your profile to recruiters.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  height: 1.45,
                  color: Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                height: 46,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Done & Continue',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ] else ...[
              // Order Summary Box
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F8F0),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFB9F1D3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.plan.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Duration: ${widget.plan.periodText}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF475569),
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          formattedPrice,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryDark,
                          ),
                        ),
                        Text(
                          'Expires in: ${_formatCountdown(_countdown)}',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.badgeUrgent,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // QR Code Image
              Center(
                child: Container(
                  width: 190,
                  height: 190,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Image.network(
                    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=247_MBBANK_INTERVUE_${widget.orderCode}_${widget.finalPrice}',
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) => const Center(
                      child: Icon(
                        Icons.qr_code_2_rounded,
                        size: 80,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Center(
                child: Text(
                  'Open your banking app or wallet to scan the VietQR code',
                  style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
              ),
              const SizedBox(height: 16),

              // Banking details box
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _infoRow('Bank', 'MB Bank (Military Bank)', null),
                    _infoRow(
                      'Account number',
                      '0987654321',
                      () => _copyToClipboard('0987654321', 'Account number'),
                    ),
                    _infoRow('Account holder', 'CONG TY INTERVUE', null),
                    _infoRow(
                      'Transfer note',
                      widget.orderCode,
                      () => _copyToClipboard(widget.orderCode, 'Transfer note'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Action Buttons
              SizedBox(
                height: 46,
                child: ElevatedButton(
                  onPressed: _isProcessing ? null : _confirmPayment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isProcessing
                      ? const SizedBox.square(
                          dimension: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle_outline_rounded, size: 18),
                            SizedBox(width: 8),
                            Text(
                              'I have transferred',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value, VoidCallback? onCopy) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              if (onCopy != null) ...[
                const SizedBox(width: 6),
                InkWell(
                  onTap: onCopy,
                  child: const Padding(
                    padding: EdgeInsets.all(2),
                    child: Icon(
                      Icons.copy_rounded,
                      size: 15,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
