import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../core/languages.dart';
import '../theme/app_theme.dart';

class LevelPicker extends StatelessWidget {
  const LevelPicker({super.key, required this.value, required this.onChanged, this.label});

  final String value;
  final ValueChanged<String> onChanged;
  final String? label;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 8,
      runSpacing: 8,
      children: [
        if (label != null)
          Text(
            label!.toUpperCase(),
            style: GoogleFonts.almarai(color: kBrutalBlack, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.5),
          ),
        for (final level in kLevels) _LevelChip(level: level, active: level == value, onTap: () => onChanged(level)),
      ],
    );
  }
}

class _LevelChip extends StatefulWidget {
  const _LevelChip({required this.level, required this.active, required this.onTap});
  final String level;
  final bool active;
  final VoidCallback onTap;

  @override
  State<_LevelChip> createState() => _LevelChipState();
}

class _LevelChipState extends State<_LevelChip> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final offset = widget.active
        ? 2.0
        : _pressed
            ? 1.0
            : 3.0;
    final fill = widget.active ? kBrutalYellow : kBrutalWhite;
    final translate = widget.active
        ? const Offset(-1, -1)
        : _pressed
            ? const Offset(1, 1)
            : Offset.zero;
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 80),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        transform: Matrix4.translationValues(translate.dx, translate.dy, 0),
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: kBrutalBlack, width: 2),
          boxShadow: [BoxShadow(color: kBrutalBlack, offset: Offset(offset, offset), blurRadius: 0)],
        ),
        child: Text(
          widget.level,
          style: GoogleFonts.almarai(color: kBrutalBlack, fontWeight: FontWeight.w900, fontSize: 12),
        ),
      ),
    );
  }
}
