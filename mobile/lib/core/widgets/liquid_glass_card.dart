import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/liquid_glass_theme.dart';

/// Ambient fluid background that creates the organic color glow
/// beneath translucent glass surfaces.
class LiquidGlassBackground extends StatelessWidget {
  const LiquidGlassBackground({
    required this.child,
    this.showOrbs = true,
    this.primaryOrbColor,
    this.secondaryOrbColor,
    this.tertiaryOrbColor,
    super.key,
  });

  final Widget child;
  final bool showOrbs;
  final Color? primaryOrbColor;
  final Color? secondaryOrbColor;
  final Color? tertiaryOrbColor;

  @override
  Widget build(BuildContext context) {
    if (!showOrbs) {
      return Container(color: LiquidGlassTheme.glassCanvas, child: child);
    }

    final prim = primaryOrbColor ?? LiquidGlassTheme.liquidEmerald;
    final sec = secondaryOrbColor ?? LiquidGlassTheme.liquidCyan;
    final tert = tertiaryOrbColor ?? LiquidGlassTheme.liquidViolet;

    return Stack(
      children: [
        // Base canvas color
        Container(color: LiquidGlassTheme.glassCanvas),

        // Fluid Orb 1: Top-Right (Emerald glow)
        Positioned(
          top: -60,
          right: -40,
          child: IgnorePointer(
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    prim.withValues(alpha: 0.16),
                    prim.withValues(alpha: 0.05),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.55, 1.0],
                ),
              ),
            ),
          ),
        ),

        // Fluid Orb 2: Center-Left (Cyan / Sky glow)
        Positioned(
          top: 280,
          left: -70,
          child: IgnorePointer(
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    sec.withValues(alpha: 0.12),
                    sec.withValues(alpha: 0.03),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.6, 1.0],
                ),
              ),
            ),
          ),
        ),

        // Fluid Orb 3: Bottom-Right (Violet / Indigo glow)
        Positioned(
          bottom: 40,
          right: -50,
          child: IgnorePointer(
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    tert.withValues(alpha: 0.10),
                    tert.withValues(alpha: 0.02),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.65, 1.0],
                ),
              ),
            ),
          ),
        ),

        // Foreground content that sits and scrolls above fluid orbs
        child,
      ],
    );
  }
}

/// A premium translucent frosted glass container with specular border highlights
/// and soft ambient depth.
class LiquidGlassCard extends StatelessWidget {
  const LiquidGlassCard({
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 18.0,
    this.blur = LiquidGlassTheme.standardBlur,
    this.backgroundColor,
    this.borderColor,
    this.borderWidth = 1.2,
    this.boxShadow,
    this.hasSheen = true,
    this.tintColor,
    this.onTap,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final double blur;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderWidth;
  final List<BoxShadow>? boxShadow;
  final bool hasSheen;
  final Color? tintColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final effectiveBg =
        backgroundColor ??
        (tintColor != null
            ? tintColor!.withValues(alpha: 0.12)
            : LiquidGlassTheme.glassSurface);

    final effectiveBorder = borderColor ?? LiquidGlassTheme.glassBorder;
    final r = BorderRadius.circular(borderRadius);

    Widget content = Container(
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: effectiveBg,
        borderRadius: r,
        border: Border.all(color: effectiveBorder, width: borderWidth),
      ),
      child: child,
    );

    if (hasSheen) {
      content = Stack(
        children: [
          content,
          // Subtle specular light sheen on top-left edge
          Positioned.fill(
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: r,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.white.withValues(alpha: 0.35),
                      Colors.white.withValues(alpha: 0.05),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.25, 0.6],
                  ),
                ),
              ),
            ),
          ),
        ],
      );
    }

    Widget glass = ClipRRect(
      borderRadius: r,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: content,
      ),
    );

    if (onTap != null) {
      glass = Material(
        color: Colors.transparent,
        borderRadius: r,
        child: InkWell(borderRadius: r, onTap: onTap, child: glass),
      );
    }

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: r,
        boxShadow: boxShadow ?? LiquidGlassTheme.glassShadow,
      ),
      child: glass,
    );
  }
}

/// Translucent frosted pill badge for status, tags, and metrics.
class LiquidGlassBadge extends StatelessWidget {
  const LiquidGlassBadge({
    required this.label,
    this.icon,
    this.color = LiquidGlassTheme.liquidEmerald,
    this.backgroundColor,
    this.borderColor,
    this.fontSize = 11.5,
    this.padding,
    this.isGlowing = false,
    super.key,
  });

  final String label;
  final IconData? icon;
  final Color color;
  final Color? backgroundColor;
  final Color? borderColor;
  final double fontSize;
  final EdgeInsetsGeometry? padding;
  final bool isGlowing;

  @override
  Widget build(BuildContext context) {
    final bg = backgroundColor ?? color.withValues(alpha: 0.12);
    final border = borderColor ?? color.withValues(alpha: 0.28);

    return Container(
      padding:
          padding ?? const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: border, width: 1.0),
        boxShadow: isGlowing
            ? [
                BoxShadow(
                  color: color.withValues(alpha: 0.24),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ]
            : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(icon, size: fontSize + 2.5, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
              color: color,
              letterSpacing: -0.1,
            ),
          ),
        ],
      ),
    );
  }
}

/// Glossy liquid gradient button with subtle specular highlight and glow.
class LiquidGlassButton extends StatelessWidget {
  const LiquidGlassButton({
    required this.label,
    required this.onPressed,
    this.icon,
    this.gradient = LiquidGlassTheme.liquidEmeraldGradient,
    this.textColor = Colors.white,
    this.height = 48,
    this.borderRadius = 14.0,
    this.isLoading = false,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Gradient gradient;
  final Color textColor;
  final double height;
  final double borderRadius;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    final r = BorderRadius.circular(borderRadius);

    return Container(
      height: height,
      decoration: BoxDecoration(
        gradient: onPressed != null ? gradient : null,
        color: onPressed == null ? Colors.grey.shade300 : null,
        borderRadius: r,
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.4),
          width: 1.0,
        ),
        boxShadow: onPressed != null
            ? [
                BoxShadow(
                  color:
                      (gradient is LinearGradient &&
                          (gradient as LinearGradient).colors.isNotEmpty)
                      ? (gradient as LinearGradient).colors.first.withValues(
                          alpha: 0.35,
                        )
                      : LiquidGlassTheme.liquidEmerald.withValues(alpha: 0.35),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: r,
          onTap: isLoading ? null : onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Center(
              child: isLoading
                  ? SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.2,
                        color: textColor,
                      ),
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (icon != null) ...[
                          Icon(icon, color: textColor, size: 19),
                          const SizedBox(width: 8),
                        ],
                        Text(
                          label,
                          style: TextStyle(
                            color: textColor,
                            fontSize: 14.5,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
