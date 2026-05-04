import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

const kPrimary = Color(0xFFDEDBC8);
const kForeground = Color(0xFFE1E0CC);
const kBackground = Color(0xFF000000);
const kCard = Color(0xFF101010);
const kCardFeature = Color(0xFF212121);
const kBorder = Color(0x1FE1E0CC);
const kMuted = Color(0xB3E1E0CC);

ThemeData buildTheme() {
  final almarai = GoogleFonts.almaraiTextTheme(
    ThemeData.dark().textTheme.apply(
          bodyColor: kForeground,
          displayColor: kForeground,
        ),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: kBackground,
    colorScheme: const ColorScheme.dark(
      primary: kPrimary,
      onPrimary: kBackground,
      secondary: kPrimary,
      onSecondary: kBackground,
      surface: kCard,
      onSurface: kForeground,
      outline: kBorder,
    ),
    textTheme: almarai,
    appBarTheme: AppBarTheme(
      backgroundColor: kBackground,
      foregroundColor: kForeground,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      systemOverlayStyle: SystemUiOverlayStyle.light,
      titleTextStyle: GoogleFonts.almarai(
        color: kForeground,
        fontWeight: FontWeight.w600,
        fontSize: 17,
      ),
      iconTheme: const IconThemeData(color: kMuted),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: kPrimary,
        foregroundColor: kBackground,
        minimumSize: const Size(0, 48),
        shape: const StadiumBorder(),
        textStyle: GoogleFonts.almarai(fontWeight: FontWeight.w500, fontSize: 15),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: kMuted,
        minimumSize: const Size(0, 48),
        shape: const StadiumBorder(),
        side: const BorderSide(color: kBorder),
      ),
    ),
    cardTheme: const CardThemeData(
      color: kCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
        side: BorderSide(color: kBorder),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: kBackground,
      indicatorColor: kPrimary.withAlpha(40),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const IconThemeData(color: kPrimary);
        }
        return const IconThemeData(color: kMuted);
      }),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return GoogleFonts.almarai(color: kPrimary, fontSize: 12, fontWeight: FontWeight.w600);
        }
        return GoogleFonts.almarai(color: kMuted, fontSize: 12);
      }),
      surfaceTintColor: Colors.transparent,
    ),
    dividerColor: kBorder,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: kCard,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: kPrimary, width: 1.5),
      ),
      hintStyle: const TextStyle(color: kMuted),
      labelStyle: const TextStyle(color: kMuted),
    ),
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: kCard,
      contentTextStyle: TextStyle(color: kForeground),
    ),
    dialogTheme: const DialogThemeData(
      backgroundColor: kCard,
      titleTextStyle: TextStyle(color: kForeground, fontSize: 18, fontWeight: FontWeight.w600),
      contentTextStyle: TextStyle(color: kMuted),
    ),
  );
}
