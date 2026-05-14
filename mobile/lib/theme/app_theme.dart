import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

// --- Neo-brutalism palette (mirrors web app/globals.css + Tailwind usage) ---
const kBrutalBlack  = Color(0xFF000000); // borders, shadows, body text
const kBrutalYellow = Color(0xFFFFD21E); // active state — matches web #FFD21E
const kBrutalWhite  = Color(0xFFFFFFFF); // card / unselected button
const kBrutalCream  = Color(0xFFFFFBEF); // page background
const kBrutalRed    = Color(0xFFEF4444); // error / wrong answer
const kBrutalGreen  = Color(0xFF22C55E); // correct answer
const kBrutalBlue   = Color(0xFF3B82F6); // secondary accent (web blue)
const kBrutalMuted  = Color(0xFF6B7280); // secondary text

// --- Back-compat aliases ---
// The rest of the app references these names. By repointing them at the
// neo-brutal palette, every existing screen flips style without edits.
const kPrimary        = kBrutalYellow;
const kPrimaryShadow  = kBrutalBlack;
const kSecondary      = kBrutalBlue;
const kSecondaryShadow = kBrutalBlack;
const kWarning        = kBrutalYellow;
const kDanger         = kBrutalRed;
const kDangerShadow   = kBrutalBlack;
const kForeground     = kBrutalBlack;
const kMuted          = kBrutalMuted;
const kBackground     = kBrutalCream;
const kCard           = kBrutalWhite;
const kCardFeature    = kBrutalWhite;
const kBorder         = kBrutalBlack;

// Single source of truth for the heavy display face used everywhere.
TextStyle brutalFont({
  double? fontSize,
  FontWeight fontWeight = FontWeight.w800,
  Color? color,
  double? height,
  double? letterSpacing,
  TextDecoration? decoration,
  FontStyle? fontStyle,
}) {
  return GoogleFonts.almarai(
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
    decoration: decoration,
    fontStyle: fontStyle,
  );
}

ThemeData buildTheme() {
  final textTheme = GoogleFonts.almaraiTextTheme(
    ThemeData.light().textTheme.apply(
          bodyColor: kBrutalBlack,
          displayColor: kBrutalBlack,
        ),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: kBrutalCream,
    colorScheme: const ColorScheme.light(
      primary: kBrutalYellow,
      onPrimary: kBrutalBlack,
      secondary: kBrutalBlue,
      onSecondary: kBrutalWhite,
      surface: kBrutalWhite,
      onSurface: kBrutalBlack,
      outline: kBrutalBlack,
      error: kBrutalRed,
      onError: kBrutalWhite,
    ),
    textTheme: textTheme,
    appBarTheme: AppBarTheme(
      backgroundColor: kBrutalCream,
      foregroundColor: kBrutalBlack,
      elevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent,
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      titleTextStyle: GoogleFonts.almarai(
        color: kBrutalBlack,
        fontWeight: FontWeight.w800,
        fontSize: 20,
      ),
      iconTheme: const IconThemeData(color: kBrutalBlack),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: kBrutalYellow,
        foregroundColor: kBrutalBlack,
        disabledBackgroundColor: kBrutalWhite,
        disabledForegroundColor: kBrutalMuted,
        minimumSize: const Size(0, 52),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: kBrutalBlack, width: 2),
        ),
        textStyle: GoogleFonts.almarai(fontWeight: FontWeight.w800, fontSize: 15),
        elevation: 0,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: kBrutalBlack,
        backgroundColor: kBrutalWhite,
        minimumSize: const Size(0, 52),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: kBrutalBlack, width: 2),
        ),
        textStyle: GoogleFonts.almarai(fontWeight: FontWeight.w800, fontSize: 15),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: kBrutalBlack,
        textStyle: GoogleFonts.almarai(fontWeight: FontWeight.w800),
      ),
    ),
    cardTheme: CardThemeData(
      color: kBrutalWhite,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: kBrutalBlack, width: 2),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 72,
      backgroundColor: kBrutalWhite,
      indicatorColor: kBrutalYellow,
      surfaceTintColor: Colors.transparent,
      indicatorShape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: kBrutalBlack, width: 2),
      ),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        return const IconThemeData(color: kBrutalBlack);
      }),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return GoogleFonts.almarai(color: kBrutalBlack, fontSize: 12, fontWeight: FontWeight.w800);
        }
        return GoogleFonts.almarai(color: kBrutalMuted, fontSize: 12, fontWeight: FontWeight.w700);
      }),
    ),
    tabBarTheme: TabBarThemeData(
      labelColor: kBrutalBlack,
      unselectedLabelColor: kBrutalMuted,
      indicatorSize: TabBarIndicatorSize.tab,
      labelStyle: GoogleFonts.almarai(fontWeight: FontWeight.w800),
      unselectedLabelStyle: GoogleFonts.almarai(fontWeight: FontWeight.w700),
    ),
    dividerColor: kBrutalBlack,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kBrutalWhite,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: kBrutalBlack, width: 2),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: kBrutalBlack, width: 2),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: kBrutalBlack, width: 2),
      ),
      hintStyle: GoogleFonts.almarai(color: kBrutalMuted, fontWeight: FontWeight.w700),
      labelStyle: GoogleFonts.almarai(color: kBrutalMuted, fontWeight: FontWeight.w800),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: kBrutalWhite,
      selectedColor: kBrutalYellow,
      disabledColor: kBrutalWhite,
      labelStyle: GoogleFonts.almarai(color: kBrutalBlack, fontWeight: FontWeight.w800),
      secondaryLabelStyle: GoogleFonts.almarai(color: kBrutalBlack, fontWeight: FontWeight.w800),
      side: const BorderSide(color: kBrutalBlack, width: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: kBrutalBlack,
      contentTextStyle: GoogleFonts.almarai(color: kBrutalWhite, fontWeight: FontWeight.w800),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: kBrutalBlack, width: 2),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: kBrutalWhite,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: kBrutalBlack, width: 2),
      ),
      titleTextStyle: GoogleFonts.almarai(color: kBrutalBlack, fontSize: 20, fontWeight: FontWeight.w800),
      contentTextStyle: GoogleFonts.almarai(color: kBrutalBlack, fontWeight: FontWeight.w700),
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: kBrutalWhite,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        side: BorderSide(color: kBrutalBlack, width: 2),
      ),
    ),
  );
}

// --- Decorations ---

/// Neo-brutal card: 2px black border + hard black offset shadow.
/// [offset] shrinks to indicate a pressed state (web: translate-1).
BoxDecoration brutalCard({
  Color color = kBrutalWhite,
  double offset = 3,
  double radius = 14,
}) {
  return BoxDecoration(
    color: color,
    borderRadius: BorderRadius.circular(radius),
    border: Border.all(color: kBrutalBlack, width: 2),
    boxShadow: [
      BoxShadow(color: kBrutalBlack, offset: Offset(offset, offset), blurRadius: 0),
    ],
  );
}

/// Pressed/active variant — collapses to a 1px shadow, yellow fill by default.
BoxDecoration brutalCardPressed({
  Color color = kBrutalYellow,
  double radius = 14,
}) =>
    brutalCard(color: color, offset: 1, radius: radius);

/// Back-compat alias — existing screens call this. Maps to the brutal version.
BoxDecoration duoCardDecoration({Color color = kBrutalWhite}) =>
    brutalCard(color: color);
