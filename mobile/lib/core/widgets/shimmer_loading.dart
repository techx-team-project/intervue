import 'package:flutter/material.dart';

/// Shimmer effect for any child widget (usually [ShimmerBox] items).
class ShimmerLoading extends StatefulWidget {
  const ShimmerLoading({required this.child, super.key});

  final Widget child;

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  static const Color _base = Color(0xFFE5E7EB);
  static const Color _highlight = Color(0xFFF3F4F6);

  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  )..repeat();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      child: widget.child,
      builder: (context, child) {
        final slide = _controller.value * 3 - 1.5;
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) => LinearGradient(
            colors: const [_base, _highlight, _base],
            stops: const [0.1, 0.5, 0.9],
            begin: Alignment(-1 + slide, 0),
            end: Alignment(1 + slide, 0),
          ).createShader(bounds),
          child: child,
        );
      },
    );
  }
}

/// Rounded rectangle placeholder block.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({this.width, this.height = 16, this.radius = 8, super.key});

  final double? width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
