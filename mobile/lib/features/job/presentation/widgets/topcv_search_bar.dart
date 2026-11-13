import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class TopCvSearchBar extends StatefulWidget {
  const TopCvSearchBar({
    required this.controller,
    required this.onChanged,
    required this.onSubmitted,
    required this.onClear,
    required this.onFilterTap,
    this.selectedKeyword = '',
    this.onKeywordTap,
    this.hasActiveFilters = false,
    this.focusNode,
    super.key,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final ValueChanged<String> onSubmitted;
  final VoidCallback onClear;
  final VoidCallback onFilterTap;
  final String selectedKeyword;
  final ValueChanged<String>? onKeywordTap;
  final bool hasActiveFilters;
  final FocusNode? focusNode;

  static const List<String> suggestionKeywords = [
    'Flutter',
    'Java',
    'ReactJS',
    'Python / AI',
    'NodeJS',
    'Golang',
    'Marketing',
    'Accounting',
    'Sales',
    'Intern',
    'Remote',
  ];

  @override
  State<TopCvSearchBar> createState() => _TopCvSearchBarState();
}

class _TopCvSearchBarState extends State<TopCvSearchBar> {
  FocusNode? _internalFocusNode;
  FocusNode get _effectiveFocusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _effectiveFocusNode.addListener(_onStateChange);
    widget.controller.addListener(_onStateChange);
  }

  void _onStateChange() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _effectiveFocusNode.removeListener(_onStateChange);
    widget.controller.removeListener(_onStateChange);
    _internalFocusNode?.dispose();
    super.dispose();
  }

  List<String> get _matchingKeywords {
    final query = widget.controller.text.trim().toLowerCase();
    if (query.isEmpty) {
      return TopCvSearchBar.suggestionKeywords;
    }
    return TopCvSearchBar.suggestionKeywords
        .where((k) => k.toLowerCase().contains(query))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final hasFocus = _effectiveFocusNode.hasFocus;
    final suggestions = _matchingKeywords;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.85),
            border: Border(
              bottom: BorderSide(
                color: Colors.white.withValues(alpha: 0.6),
                width: 1,
              ),
            ),
          ),
          padding: EdgeInsets.fromLTRB(16, 0, 16, hasFocus ? 12 : 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Input Row
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.8),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: hasFocus
                              ? AppColors.primary
                              : Colors.white.withValues(alpha: 0.95),
                          width: hasFocus ? 1.5 : 1.1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF003820)
                                .withValues(alpha: 0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: TextField(
                        controller: widget.controller,
                        focusNode: _effectiveFocusNode,
                        onChanged: widget.onChanged,
                        onSubmitted: (val) {
                          _effectiveFocusNode.unfocus();
                          widget.onSubmitted(val);
                        },
                        textInputAction: TextInputAction.search,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textPrimary,
                        ),
                        decoration: InputDecoration(
                          isDense: true,
                          filled: false,
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 13,
                          ),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: AppColors.primary,
                            size: 22,
                          ),
                          hintText: 'Search jobs, companies, skills...',
                          hintStyle: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 13.5,
                          ),
                          suffixIcon: widget.controller.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(
                                    Icons.cancel,
                                    size: 18,
                                    color: AppColors.textMuted,
                                  ),
                                  onPressed: () {
                                    widget.onClear();
                                    setState(() {});
                                  },
                                )
                              : null,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 10),

                  // Filter Button (Liquid Glass)
                  Container(
                    height: 48,
                    width: 48,
                    decoration: BoxDecoration(
                      gradient: widget.hasActiveFilters
                          ? const LinearGradient(
                              colors: [Color(0xFF00B14F), Color(0xFF10B981)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            )
                          : null,
                      color: widget.hasActiveFilters
                          ? null
                          : Colors.white.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.95),
                        width: 1.1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: widget.hasActiveFilters
                              ? AppColors.primary.withValues(alpha: 0.35)
                              : const Color(0xFF003820).withValues(alpha: 0.04),
                          blurRadius: widget.hasActiveFilters ? 10 : 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                      child: InkWell(
                        onTap: () {
                          _effectiveFocusNode.unfocus();
                          widget.onFilterTap();
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(
                              Icons.tune,
                              size: 20,
                              color: widget.hasActiveFilters
                                  ? Colors.white
                                  : AppColors.textSecondary,
                            ),
                            if (widget.hasActiveFilters)
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppColors.accentOrange,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              // Smart Suggestion Popup (Appears only when user focuses or types)
              if (hasFocus) ...[
                const SizedBox(height: 10),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.primary.withValues(alpha: 0.3),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.auto_awesome,
                                size: 15,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                widget.controller.text.trim().isEmpty
                                    ? 'Popular searches'
                                    : 'Matching keywords',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                          InkWell(
                            onTap: () => _effectiveFocusNode.unfocus(),
                            child: const Padding(
                              padding: EdgeInsets.all(2),
                              child: Icon(
                                Icons.close,
                                size: 16,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      if (suggestions.isEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Text(
                            'Press Enter to search "${widget.controller.text.trim()}"',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textMuted,
                            ),
                          ),
                        )
                      else
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: suggestions.map((keyword) {
                            return InkWell(
                              onTap: () {
                                widget.controller.text = keyword;
                                widget.onChanged(keyword);
                                widget.onSubmitted(keyword);
                                widget.onKeywordTap?.call(keyword);
                                _effectiveFocusNode.unfocus();
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 5,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.chipBackground,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.border),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.trending_up,
                                      size: 13,
                                      color: AppColors.primary,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      keyword,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
