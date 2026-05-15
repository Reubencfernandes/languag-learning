import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../theme/app_theme.dart';

class FuriSegment {
  const FuriSegment({required this.text, this.reading});
  final String text;
  final String? reading;

  factory FuriSegment.fromJson(Map<String, dynamic> json) => FuriSegment(
        text: (json['text'] ?? '').toString(),
        reading: (json['reading'] is String && (json['reading'] as String).isNotEmpty)
            ? json['reading'] as String
            : null,
      );
}

List<FuriSegment>? parseFuriSegments(dynamic raw) {
  if (raw is! List) return null;
  final segments = <FuriSegment>[];
  for (final item in raw) {
    if (item is Map) {
      final seg = FuriSegment.fromJson(Map<String, dynamic>.from(item));
      if (seg.text.isNotEmpty) segments.add(seg);
    }
  }
  return segments.isEmpty ? null : segments;
}

class FuriText extends StatelessWidget {
  const FuriText({
    super.key,
    required this.text,
    this.segments,
    required this.fontSize,
    this.color = kBrutalBlack,
    this.fontWeight = FontWeight.w900,
    this.readingColor = kBrutalMuted,
  });

  final String text;
  final List<FuriSegment>? segments;
  final double fontSize;
  final Color color;
  final FontWeight fontWeight;
  final Color readingColor;

  @override
  Widget build(BuildContext context) {
    final segs = segments;
    final mainStyle = GoogleFonts.almarai(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: 1.0,
    );

    if (segs == null || segs.isEmpty) {
      return Text(text, style: mainStyle);
    }

    final readingSize = (fontSize * 0.45).clamp(9.0, 18.0);
    final readingStyle = GoogleFonts.almarai(
      fontSize: readingSize,
      fontWeight: FontWeight.w800,
      color: readingColor,
      height: 1.0,
    );
    final readingSlotHeight = readingSize + 2;

    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.end,
      children: segs
          .map(
            (seg) => Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  height: readingSlotHeight,
                  child: seg.reading != null
                      ? Center(child: Text(seg.reading!, style: readingStyle))
                      : null,
                ),
                Text(seg.text, style: mainStyle),
              ],
            ),
          )
          .toList(),
    );
  }
}
