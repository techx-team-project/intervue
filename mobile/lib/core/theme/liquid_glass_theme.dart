import 'package:flutter/material.dart';

/// Design tokens and styling helpers for Liquid Glassmorphism UI.
abstract final class LiquidGlassTheme {
  // --- Glass Surface Opacities & Colors ---
  static const Color glassCanvas = Color(0xFFF4F7F6);
  static final Color glassSurface = Colors.white.withValues(alpha: 0.72);
  static final Color glassSurfaceElevated = Colors.white.withValues(
    alpha: 0.86,
  );
  static final Color glassSurfaceSubtle = Colors.white.withValues(alpha: 0.48);
  static final Color glassDarkSurface = const Color(0xFF0F172A)
      .withValues(alpha: 0.78);

  // --- Specular & Bevel Borders ---
  static final Color glassBorder = Colors.white.withValues(alpha: 0.85);
  static final Color glassBorderSubtle = Colors.white.withValues(alpha: 0.45);
  static final Color glassBorderGlowing = const Color(0xFF10B981)
      .withValues(alpha: 0.35);

  // --- Liquid Accent Colors ---
  static const Color liquidEmerald = Color(0xFF00B14F);
  static const Color liquidMint = Color(0xFF10B981);
  static const Color liquidTeal = Color(0xFF14B8A6);
  static const Color liquidCyan = Color(0xFF06B6D4);
  static const Color liquidBlue = Color(0xFF0EA5E9);
  static const Color liquidIndigo = Color(0xFF6366F1);
  static const Color liquidViolet = Color(0xFF8B5CF6);
  static const Color liquidAmber = Color(0xFFF59E0B);
  static const Color liquidRose = Color(0xFFF43F5E);

  // --- Liquid Gradients ---
  static const LinearGradient liquidEmeraldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00B14F), Color(0xFF10B981)],
  );

  static const LinearGradient liquidCyanGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0EA5E9), Color(0xFF06B6D4)],
  );

  static const LinearGradient liquidVioletGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF8B5CF6), Color(0xFF6366F1)],
  );

  static const LinearGradient liquidDarkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0F172A), Color(0xFF064E3B), Color(0xFF022C22)],
  );

  static final LinearGradient glassBorderGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Colors.white.withValues(alpha: 0.95),
      Colors.white.withValues(alpha: 0.30),
      Colors.white.withValues(alpha: 0.10),
      Colors.white.withValues(alpha: 0.65),
    ],
    stops: const [0.0, 0.4, 0.7, 1.0],
  );

  // --- Diffused Ambient Shadows ---
  static List<BoxShadow> get glassShadow => [
    BoxShadow(
      color: const Color(0xFF003820).withValues(alpha: 0.05),
      blurRadius: 18,
      offset: const Offset(0, 6),
      spreadRadius: -2,
    ),
    BoxShadow(
      color: Colors.white.withValues(alpha: 0.6),
      blurRadius: 1,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> get glassShadowElevated => [
    BoxShadow(
      color: const Color(0xFF003820).withValues(alpha: 0.08),
      blurRadius: 26,
      offset: const Offset(0, 10),
      spreadRadius: -2,
    ),
    BoxShadow(
      color: Colors.white.withValues(alpha: 0.8),
      blurRadius: 2,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> liquidGlowShadow(
    Color color, {
    double alpha = 0.28,
    double blur = 16,
  }) => [
    BoxShadow(
      color: color.withValues(alpha: alpha),
      blurRadius: blur,
      offset: const Offset(0, 6),
    ),
  ];

  // --- Blur Settings ---
  static const double standardBlur = 18.0;
  static const double deepBlur = 24.0;
  static const double subtleBlur = 10.0;
}
