import 'package:flutter/material.dart';
import '../app_theme.dart';

/// Neo-brutal button. Black 2px border, hard 3px black offset shadow,
/// collapses to 1px shadow on press (mirrors the web's
/// `active:translate-x-[1px] translate-y-[1px]` behavior).
class BrutalButton extends StatefulWidget {
  const BrutalButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.color = kBrutalYellow,
    this.foregroundColor = kBrutalBlack,
    this.padding = const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
    this.radius = 14,
    this.expand = false,
    this.enabled = true,
  });

  final VoidCallback? onPressed;
  final Widget child;
  final Color color;
  final Color foregroundColor;
  final EdgeInsetsGeometry padding;
  final double radius;
  final bool expand;
  final bool enabled;

  @override
  State<BrutalButton> createState() => _BrutalButtonState();
}

class _BrutalButtonState extends State<BrutalButton> {
  bool _pressed = false;

  void _setPressed(bool v) {
    if (!widget.enabled) return;
    if (_pressed == v) return;
    setState(() => _pressed = v);
  }

  @override
  Widget build(BuildContext context) {
    final disabled = !widget.enabled || widget.onPressed == null;
    final offset = _pressed ? 1.0 : 3.0;

    final btn = AnimatedContainer(
      duration: const Duration(milliseconds: 80),
      curve: Curves.easeOut,
      padding: widget.padding,
      transform: Matrix4.translationValues(_pressed ? 2 : 0, _pressed ? 2 : 0, 0),
      decoration: BoxDecoration(
        color: disabled ? kBrutalWhite : widget.color,
        borderRadius: BorderRadius.circular(widget.radius),
        border: Border.all(color: kBrutalBlack, width: 2),
        boxShadow: [
          BoxShadow(
            color: kBrutalBlack,
            offset: Offset(offset, offset),
            blurRadius: 0,
          ),
        ],
      ),
      child: DefaultTextStyle.merge(
        style: brutalFont(
          color: disabled ? kBrutalMuted : widget.foregroundColor,
          fontWeight: FontWeight.w800,
          fontSize: 15,
        ),
        textAlign: TextAlign.center,
        child: IconTheme.merge(
          data: IconThemeData(color: disabled ? kBrutalMuted : widget.foregroundColor, size: 20),
          child: widget.child,
        ),
      ),
    );

    return GestureDetector(
      onTapDown: (_) => _setPressed(true),
      onTapUp: (_) => _setPressed(false),
      onTapCancel: () => _setPressed(false),
      onTap: disabled ? null : widget.onPressed,
      child: widget.expand
          ? SizedBox(width: double.infinity, child: btn)
          : btn,
    );
  }
}
