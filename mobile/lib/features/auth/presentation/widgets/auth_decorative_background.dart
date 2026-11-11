import 'package:flutter/material.dart';

/// Replicates the ambient background glows and dot pattern of web AuthLayout:
/// - Soft #f4f6f8 background
/// - 2 large ambient emerald radial glows (blur-3xl)
/// - Subtle 24px dot grid pattern
/// - Left chevron dotted pattern on wide screens
class AuthDecorativeBackground extends StatelessWidget {
  const AuthDecorativeBackground({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isWide = size.width >= 800;

    return ColoredBox(
      color: const Color(0xFFF4F6F8),
      child: Stack(
        children: [
          // Ambient Emerald Glow - Top Right
          Positioned(
            top: -80,
            right: -80,
            width: 380,
            height: 380,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF00B14F).withValues(alpha: 0.08),
                      const Color(0xFF00B14F).withValues(alpha: 0.0),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Ambient Emerald Glow - Bottom Left
          Positioned(
            bottom: -80,
            left: -80,
            width: 380,
            height: 380,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFF00B14F).withValues(alpha: 0.08),
                      const Color(0xFF00B14F).withValues(alpha: 0.0),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Subtle dot grid across the entire canvas
          const Positioned.fill(
            child: IgnorePointer(child: CustomPaint(painter: DotGridPainter())),
          ),

          // Left Chevron Pattern on wide screens (web desktop)
          if (isWide)
            const Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              width: 180,
              child: IgnorePointer(
                child: CustomPaint(painter: LeftChevronPainter()),
              ),
            ),

          // Foreground child
          Positioned.fill(child: child),
        ],
      ),
    );
  }
}

/// Subtle 24px dot grid matching CSS `radial-gradient(#e2e8f0 1px, transparent 1px) [24px 24px]`
class DotGridPainter extends CustomPainter {
  const DotGridPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF94A3B8).withValues(alpha: 0.22)
      ..style = PaintingStyle.fill;

    const step = 24.0;
    for (double x = 12.0; x < size.width; x += step) {
      for (double y = 12.0; y < size.height; y += step) {
        canvas.drawCircle(Offset(x, y), 0.85, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Exact port of web `LeftChevronPattern.tsx`:
/// Dotted green chevrons floating on the left side of the screen
class LeftChevronPainter extends CustomPainter {
  const LeftChevronPainter();

  @override
  void paint(Canvas canvas, Size size) {
    const apexX = 135.0;
    final apexY = size.height / 2;
    const slope = 1.9;
    const bandWidth = 28.0;
    const stepX = 6.0;
    const stepY = 11.0;
    const chevronOffsets = [0.0, -42.0];

    final paint = Paint()..style = PaintingStyle.fill;

    for (final offset in chevronOffsets) {
      final curApexX = apexX + offset;
      for (double x = 0; x <= curApexX; x += stepX) {
        final distFromApexX = curApexX - x;
        final baseYTop = apexY - distFromApexX * slope;
        final baseYBottom = apexY + distFromApexX * slope;

        for (double b = -bandWidth / 2; b <= bandWidth / 2; b += stepY * 0.7) {
          final yTop = baseYTop + b;
          final yBottom = baseYBottom + b;

          final bandFactor = (1.0 - (b.abs() / (bandWidth / 2))).clamp(
            0.0,
            1.0,
          );
          final xFactor = (x / 30.0).clamp(0.0, 1.0);
          final r = (1.2 + bandFactor * 1.8).clamp(0.8, 3.0);
          final opacity = ((0.35 + bandFactor * 0.55) * xFactor).clamp(
            0.05,
            0.85,
          );

          paint.color = const Color(0xFF00B14F).withValues(alpha: opacity);

          if (yTop >= 10 && yTop <= size.height - 10) {
            canvas.drawCircle(Offset(x, yTop), r, paint);
          }
          if (yBottom >= 10 &&
              yBottom <= size.height - 10 &&
              (yBottom - yTop).abs() > 6) {
            canvas.drawCircle(Offset(x, yBottom), r, paint);
          }
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Dashed divider line for "Or sign in with email"
class DashedLinePainter extends CustomPainter {
  const DashedLinePainter({this.color = const Color(0xFFE2E8F0)});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    const dashWidth = 4.0;
    const dashSpace = 3.0;
    double startX = 0;
    final y = size.height / 2;

    while (startX < size.width) {
      canvas.drawLine(
        Offset(startX, y),
        Offset((startX + dashWidth).clamp(0, size.width), y),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
