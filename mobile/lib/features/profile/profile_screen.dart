import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/languages.dart';
import '../../theme/app_theme.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(authControllerProvider);
    final user = state.user;
    final profile = state.profile;

    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Avatar + username
          Row(children: [
            CircleAvatar(
              radius: 32,
              backgroundColor: kPrimary,
              backgroundImage: user?.avatarUrl != null
                  ? NetworkImage(user!.avatarUrl!)
                  : null,
              child: user?.avatarUrl == null
                  ? Text(
                      user?.hfUsername.substring(0, 1).toUpperCase() ?? '?',
                      style: GoogleFonts.almarai(
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                          color: kBackground),
                    )
                  : null,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user?.hfUsername ?? '—',
                        style: GoogleFonts.almarai(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: kForeground)),
                    Text(user?.email ?? 'no email',
                        style: GoogleFonts.almarai(
                            color: kMuted, fontSize: 13)),
                  ]),
            ),
          ]),
          const SizedBox(height: 24),

          if (profile != null) ...[
            _StatCard(label: 'I speak', value: languageName(profile.nativeLang)),
            _StatCard(
                label: "I'm learning",
                value: languageName(profile.targetLang)),
            _StatCard(
                label: 'Level',
                value:
                    '${profile.level} — ${kLevelDescriptions[profile.level] ?? ''}'),
          ],

          const SizedBox(height: 24),

          OutlinedButton.icon(
            onPressed: () =>
                ref.read(authControllerProvider.notifier).signOut(),
            icon: const Icon(Icons.logout, size: 16),
            label: const Text('Sign out'),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: kCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: kBorder),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label.toUpperCase(),
              style: GoogleFonts.almarai(
                  fontSize: 10, letterSpacing: 1.5, color: kMuted)),
          const SizedBox(height: 6),
          Text(value,
              style: GoogleFonts.almarai(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: kForeground)),
        ]),
      ),
    );
  }
}
