import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Social authentication buttons matching the web InterVue design:
/// - Google full-width pill button
/// - Facebook & LinkedIn 50/50 split pill buttons
class SocialAuthButtons extends StatelessWidget {
  const SocialAuthButtons({
    this.isRegister = false,
    this.onGooglePressed,
    this.onFacebookPressed,
    this.onLinkedInPressed,
    super.key,
  });

  final bool isRegister;
  final VoidCallback? onGooglePressed;
  final VoidCallback? onFacebookPressed;
  final VoidCallback? onLinkedInPressed;

  static const String _googleSvg = '''
<svg viewBox="0 0 24 24">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
</svg>
''';

  static const String _facebookSvg = '''
<svg viewBox="0 0 24 24">
  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
</svg>
''';

  static const String _linkedInSvg = '''
<svg viewBox="0 0 24 24">
  <path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
</svg>
''';

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Google button
        _SocialPillButton(
          onTap: onGooglePressed,
          icon: SvgPicture.string(_googleSvg, width: 18, height: 18),
          label: isRegister ? 'Sign up with Google' : 'Sign in with Google',
        ),
        const SizedBox(height: 12),

        // Facebook & LinkedIn
        Row(
          children: [
            Expanded(
              child: _SocialPillButton(
                onTap: onFacebookPressed,
                icon: SvgPicture.string(_facebookSvg, width: 18, height: 18),
                label: 'Facebook',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _SocialPillButton(
                onTap: onLinkedInPressed,
                icon: SvgPicture.string(_linkedInSvg, width: 18, height: 18),
                label: 'Linkedin',
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _SocialPillButton extends StatefulWidget {
  const _SocialPillButton({
    required this.icon,
    required this.label,
    this.onTap,
  });

  final Widget icon;
  final String label;
  final VoidCallback? onTap;

  @override
  State<_SocialPillButton> createState() => _SocialPillButtonState();
}

class _SocialPillButtonState extends State<_SocialPillButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: _isHovered ? const Color(0xFFF8FAFC) : Colors.white,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: _isHovered
                  ? const Color(0xFFCBD5E1)
                  : const Color(0xFFE2E8F0),
              width: 1.1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: _isHovered ? 0.04 : 0.01),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              widget.icon,
              const SizedBox(width: 9),
              Flexible(
                child: Text(
                  widget.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFF0F172A),
                    fontSize: 13.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
