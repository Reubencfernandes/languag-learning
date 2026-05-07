import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

const kPrimary = Color(0xFF0EA5A4);
const kPrimaryShadow = Color(0xFF0B7C7B);
const kSecondary = Color(0xFF7C3AED);
const kSecondaryShadow = Color(0xFF5B21B6);
const kWarning = Color(0xFFF59E0B);
const kDanger = Color(0xFFF43F5E);
const kDangerShadow = Color(0xFFBE123C);
const kForeground = Color(0xFF3C3C3C);
const kMuted = Color(0xFF777777);
const kBackground = Color(0xFFF8FBFF);
const kCard = Color(0xFFFFFFFF);
const kCardFeature = Color(0xFFF7F7F7);
const kBorder = Color(0xFFE5E5E5);

ThemeData buildTheme() {
  final textTheme = GoogleFonts.nunitoTextTheme(
    ThemeData.light().textTheme.apply(
          bodyColor: kForeground,
          displayColor: kForeground,
        ),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: kBackground,
    colorScheme: const ColorScheme.light(
      primary: kPrimary,
      onPrimary: Colors.white,
      secondary: kSecondary,
      onSecondary: Colors.white,
      surface: kCard,
      onSurface: kForeground,
      outline: kBorder,
      error: kDanger,
      onError: Colors.white,
    ),
    textTheme: textTheme,
    appBarTheme: AppBarTheme(
      backgroundColor: kCard,
      foregroundColor: kForeground,
      elevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent,
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      titleTextStyle: GoogleFonts.nunito(
        color: kForeground,
        fontWeight: FontWeight.w900,
        fontSize: 20,
      ),
      iconTheme: const IconThemeData(color: kMuted),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
        disabledBackgroundColor: kBorder,
        disabledForegroundColor: const Color(0xFFAFAFAF),
        minimumSize: const Size(0, 52),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: GoogleFonts.nunito(fontWeight: FontWeight.w900, fontSize: 15),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: kSecondary,
        minimumSize: const Size(0, 52),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        side: const BorderSide(color: kBorder, width: 2),
        textStyle: GoogleFonts.nunito(fontWeight: FontWeight.w900, fontSize: 15),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: kSecondary,
        textStyle: GoogleFonts.nunito(fontWeight: FontWeight.w900),
      ),
    ),
    cardTheme: CardThemeData(
      color: kCard,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: kBorder, width: 2),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 72,
      backgroundColor: kCard,
      indicatorColor: kPrimary.withAlpha(38),
      surfaceTintColor: Colors.transparent,
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const IconThemeData(color: kPrimary);
        }
        return const IconThemeData(color: kMuted);
      }),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return GoogleFonts.nunito(color: kPrimary, fontSize: 12, fontWeight: FontWeight.w900);
        }
        return GoogleFonts.nunito(color: kMuted, fontSize: 12, fontWeight: FontWeight.w800);
      }),
    ),
    tabBarTheme: TabBarThemeData(
      labelColor: Colors.white,
      unselectedLabelColor: kMuted,
      indicatorSize: TabBarIndicatorSize.tab,
      labelStyle: GoogleFonts.nunito(fontWeight: FontWeight.w900),
      unselectedLabelStyle: GoogleFonts.nunito(fontWeight: FontWeight.w900),
    ),
    dividerColor: kBorder,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kCard,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: kBorder, width: 2),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: kBorder, width: 2),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: kSecondary, width: 2),
      ),
      hintStyle: const TextStyle(color: kMuted, fontWeight: FontWeight.w700),
      labelStyle: const TextStyle(color: kMuted, fontWeight: FontWeight.w800),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: kCard,
      selectedColor: const Color(0xFFEDE9FE),
      disabledColor: kBorder,
      labelStyle: GoogleFonts.nunito(color: kForeground, fontWeight: FontWeight.w900),
      secondaryLabelStyle: GoogleFonts.nunito(color: kSecondary, fontWeight: FontWeight.w900),
      side: const BorderSide(color: kBorder, width: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: kForeground,
      contentTextStyle: GoogleFonts.nunito(color: Colors.white, fontWeight: FontWeight.w800),
      behavior: SnackBarBehavior.floating,
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: kCard,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      titleTextStyle: GoogleFonts.nunito(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900),
      contentTextStyle: GoogleFonts.nunito(color: kMuted, fontWeight: FontWeight.w700),
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: kCard,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
    ),
  );
}

BoxDecoration duoCardDecoration({Color color = kCard}) {
  return BoxDecoration(
    color: color,
    borderRadius: BorderRadius.circular(18),
    border: Border.all(color: kBorder, width: 2),
    boxShadow: const [
      BoxShadow(color: kBorder, offset: Offset(0, 4), blurRadius: 0),
    ],
  );
}


