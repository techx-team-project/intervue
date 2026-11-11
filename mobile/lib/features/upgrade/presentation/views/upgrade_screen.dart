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
    this.buttonText = 'Nâng cấp ngay',
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
      name: 'Gói Thường',
      price: 0,
      priceText: 'Miễn phí',
      periodText: 'Vĩnh viễn',
      buttonText: 'Gói hiện tại',
      features: [
        'Tạo tối đa 6 CV & 6 Cover Letter',
        'Thời gian chờ tải: 5 giây',
        'Sử dụng các mẫu CV cơ bản',
        'Huy hiệu xác minh: Không',
        'Đẩy Top hiển thị: Không',
        'Thông tin cạnh tranh: 3 việc làm',
      ],
    ),
    UpgradePlan(
      id: 'pro',
      name: 'Gói Pro VIP',
      price: 50000,
      priceText: '50.000 đ',
      periodText: '1 tháng',
      badge: 'PHỔ BIẾN',
      buttonText: 'Nâng cấp Pro',
      features: [
        'Tạo 12 CV & 12 Cover Letter cao cấp',
        'Thời gian chờ tải siêu nhanh: 3 giây',
        'Mở khóa trọn bộ Mẫu CV & CL Cao Cấp',
        'Đẩy Top hồ sơ với NTD: 1 lần / ngày',
        'Tích xanh xác minh tài khoản nổi bật',
        'Ẩn watermark ©intervue.vn trên bản in',
        'Tặng tài khoản Gitiho PRO trị giá 299K',
        'Xem mức độ cạnh tranh không giới hạn',
      ],
    ),
    UpgradePlan(
      id: 'premium',
      name: 'Gói Premium VIP',
      price: 500000,
      priceText: '500.000 đ',
      periodText: '1 năm (12 tháng)',
      badge: 'NỔI BẬT NHẤT',
      isHighlight: true,
      buttonText: 'Nâng cấp Premium',
      features: [
        'Tất cả quyền lợi của Gói Pro VIP',
        'Tạo KHÔNG GIỚI HẠN CV & Cover Letter',
        'Tải CV siêu tốc ngay lập tức (0s chờ)',
        'Đẩy Top ưu tiên cao nhất với 320.000+ NTD',
        'Mở khóa trọn bộ kịch bản Luyện Phỏng Vấn AI',
        'Phân tích & Tối ưu từ khóa CV chuẩn ATS',
        'Tặng trọn đời khóa học Tin học VP Gitiho',
        'Hỗ trợ kỹ thuật & CV 1:1 ưu tiên 24/7',
      ],
    ),
  ];

  final List<Map<String, String>> _faqs = const [
    {
      'q': 'Tài khoản VIP được kích hoạt như thế nào sau khi thanh toán?',
      'a': 'Hệ thống InterVue sẽ tự động kích hoạt tài khoản VIP ngay khi giao dịch chuyển khoản ngân hàng qua mã VietQR được xác nhận thành công (thông thường chỉ từ 10 - 30 giây).',
    },
    {
      'q': 'Tôi có thể thanh toán nâng cấp tài khoản bằng hình thức nào?',
      'a': 'Bạn có thể thanh toán qua quét mã VietQR tự động từ mọi ứng dụng ngân hàng di động (Vietcombank, MB, Techcombank, VPBank,...) hoặc các ví điện tử như MoMo, ZaloPay.',
    },
    {
      'q': 'Quyền lợi tài khoản VIP có áp dụng cho cả ứng dụng điện thoại không?',
      'a': 'Có. Toàn bộ đặc quyền VIP được đồng bộ thời gian thực trên cả website máy tính, ứng dụng InterVue Android và iOS mà không phát sinh thêm chi phí.',
    },
    {
      'q': 'Khi hết hạn gói tài khoản VIP, hồ sơ CV của tôi có bị xóa không?',
      'a': 'Không. Toàn bộ hồ sơ CV, thư xin việc và chứng chỉ của bạn vẫn được lưu giữ an toàn vĩnh viễn trên hệ thống. Tài khoản chỉ chuyển về trạng thái hạn mức gói Thường.',
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
        _voucherMessage = 'Áp dụng mã thành công! Bạn được giảm 20%.';
      } else if (code == 'PROVIP') {
        _appliedVoucher = code;
        _discountPercent = 0.10; // 10% off
        _voucherMessage = 'Áp dụng mã thành công! Bạn được giảm 10%.';
      } else {
        _appliedVoucher = null;
        _discountPercent = 0.0;
        _voucherMessage = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.';
      }
    });
  }

  void _openPaymentQrModal(UpgradePlan plan) {
    if (plan.price == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Bạn đang sử dụng gói tài khoản này.'),
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
          'Nâng cấp tài khoản VIP',
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
            tooltip: 'Hỗ trợ nâng cấp',
            icon: const Icon(
              Icons.support_agent_rounded,
              color: AppColors.primary,
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Hotline hỗ trợ tài khoản VIP: 1900 068 889 (nhánh 2)',
                  ),
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
                  'NÂNG CẤP TÀI KHOẢN VIP',
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
            'Mở khóa nhiều quyền lợi hơn',
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
            'Nâng tầm hồ sơ ứng tuyển, loại bỏ mọi giới hạn tải CV và tiếp cận nhanh chóng với các Nhà tuyển dụng hàng đầu.',
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
                'Mã ưu đãi / Voucher giảm giá',
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
                    hintText: 'Nhập mã (VD: TOPCV2026, INTERVUEVIP)',
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
                  'Áp dụng',
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
                        'Thời hạn: ${plan.periodText}',
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
                        '${discountedPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')} đ',
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
                'So sánh quyền lợi chi tiết',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _comparisonRow('Số lượng CV tạo', '6 CV', '12 CV', 'Không giới hạn'),
          _comparisonRow('Thời gian chờ tải', '5s', '3s', 'Tải ngay (0s)'),
          _comparisonRow(
            'Đẩy Top hồ sơ',
            '—',
            '1 lần/ngày',
            'Ưu tiên cao nhất',
          ),
          _comparisonRow('Tích xanh VIP', '—', '✓ Có', '✓ Có'),
          _comparisonRow('Mẫu CV Cao Cấp', '—', '✓ Mở khóa', '✓ Trọn bộ'),
          _comparisonRow(
            'Luyện phỏng vấn AI',
            'Cơ bản',
            'Cơ bản',
            'Mở khóa trọn bộ',
          ),
          _comparisonRow(
            'Quà tặng Gitiho 299K',
            '—',
            '✓ Tặng kèm',
            '✓ Tặng kèm',
          ),
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
                'Câu hỏi thường gặp',
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
        content: Text('Đã sao chép $label'),
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
        '${widget.finalPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')} đ';

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
                  'Kích hoạt ${widget.plan.name} thành công!',
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
                'Chúc mừng bạn! Toàn bộ đặc quyền VIP đã sẵn sàng. Bạn có thể tạo CV không giới hạn, tải siêu tốc và đẩy Top hồ sơ với nhà tuyển dụng ngay.',
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
                    'Hoàn tất & Tiếp tục',
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
                          'Thời hạn: ${widget.plan.periodText}',
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
                          'Hết hạn: ${_formatCountdown(_countdown)}',
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
                  'Mở app Ngân hàng hoặc Ví để quét mã VietQR',
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
                    _infoRow('Ngân hàng', 'MB Bank (Quân Đội)', null),
                    _infoRow(
                      'Số tài khoản',
                      '0987654321',
                      () => _copyToClipboard('0987654321', 'Số tài khoản'),
                    ),
                    _infoRow('Chủ tài khoản', 'CONG TY INTERVUE', null),
                    _infoRow(
                      'Nội dung CK',
                      widget.orderCode,
                      () => _copyToClipboard(widget.orderCode, 'Nội dung CK'),
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
                              'Tôi đã chuyển khoản',
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
