import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/languages.dart';
import '../../theme/app_theme.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _savingLevel = false;
  bool _savingLangs = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(authControllerProvider.notifier).pingStreak();
    });
  }

  Future<void> _changeLevel(String level) async {
    setState(() => _savingLevel = true);
    try {
      await ref.read(authControllerProvider.notifier).updateLevel(level);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to update level: $e')));
      }
    } finally {
      if (mounted) setState(() => _savingLevel = false);
    }
  }

  Future<void> _updateLangs(List<String> langs) async {
    setState(() => _savingLangs = true);
    try {
      await ref.read(authControllerProvider.notifier).setLearningLanguages(langs);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to update languages: $e')));
      }
    } finally {
      if (mounted) setState(() => _savingLangs = false);
    }
  }

  Future<void> _pickLanguageToAdd(List<String> current, String nativeLang) async {
    final available = kLanguages.where((l) => l.code != nativeLang && !current.contains(l.code)).toList();
    if (available.isEmpty) return;
    final selected = await showModalBottomSheet<String>(
      context: context,
      builder: (ctx) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text('Add a language', style: GoogleFonts.almarai(color: kForeground, fontSize: 18, fontWeight: FontWeight.w900)),
            ),
            ...available.map((lang) => ListTile(
                  leading: SizedBox(width: 26, child: CountryFlag.fromCountryCode(lang.flagCode)),
                  title: Text(lang.name, style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900)),
                  onTap: () => Navigator.of(ctx).pop(lang.code),
                )),
          ],
        ),
      ),
    );
    if (selected != null) {
      await _updateLangs([...current, selected]);
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);
    final user = state.user;
    final profile = state.profile;
    final streak = state.streakCount;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Container(
                decoration: duoCardDecoration(color: kSecondary),
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: Colors.white,
                      backgroundImage: user?.avatarUrl != null ? NetworkImage(user!.avatarUrl!) : null,
                      child: user?.avatarUrl == null
                          ? Text(
                              user?.hfUsername.substring(0, 1).toUpperCase() ?? '?',
                              style: GoogleFonts.almarai(fontSize: 24, fontWeight: FontWeight.w900, color: kSecondary),
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.hfUsername ?? '-',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.almarai(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                          ),
                          Text(
                            user?.email ?? 'no email',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.almarai(color: Colors.white.withAlpha(215), fontSize: 13, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              if (profile != null) ...[
                LayoutBuilder(
                  builder: (context, constraints) {
                    final twoColumns = constraints.maxWidth >= 620;
                    return GridView.count(
                      crossAxisCount: twoColumns ? 4 : 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: twoColumns ? 1.55 : 2.1,
                      children: [
                        _StatCard(
                          icon: _flagWidget(profile.nativeLang, kSecondary),
                          label: 'I speak',
                          value: languageName(profile.nativeLang),
                          tone: kSecondary,
                        ),
                        _StatCard(
                          icon: _flagWidget(profile.targetLang, kPrimary),
                          label: 'Learning',
                          value: languageName(profile.targetLang),
                          tone: kPrimary,
                        ),
                        _StatCard(
                          icon: const Icon(Icons.emoji_events_rounded, color: kWarning),
                          label: 'Level',
                          value: profile.level,
                          tone: kWarning,
                        ),
                        _StatCard(
                          icon: const Icon(Icons.local_fire_department_rounded, color: Color(0xFFEF4444)),
                          label: 'Streak',
                          value: '$streak ${streak == 1 ? 'day' : 'days'}',
                          tone: const Color(0xFFEF4444),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: duoCardDecoration(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Languages I am learning', style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900, fontSize: 18)),
                      const SizedBox(height: 14),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          for (final lang in profile.targetLangs)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: kBrutalYellow,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: kBrutalBlack, width: 2),
                                boxShadow: const [BoxShadow(color: kBrutalBlack, offset: Offset(3, 3), blurRadius: 0)],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(
                                    width: 22,
                                    child: _flagWidget(lang, kSecondary),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(languageName(lang), style: GoogleFonts.almarai(color: kBrutalBlack, fontWeight: FontWeight.w900, fontSize: 13)),
                                  if (profile.targetLangs.length > 1) ...[
                                    const SizedBox(width: 6),
                                    InkWell(
                                      onTap: _savingLangs
                                          ? null
                                          : () => _updateLangs(profile.targetLangs.where((l) => l != lang).toList()),
                                      borderRadius: BorderRadius.circular(8),
                                      child: const Padding(
                                        padding: EdgeInsets.all(2),
                                        child: Icon(Icons.close_rounded, size: 16, color: kBrutalBlack),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          InkWell(
                            onTap: _savingLangs ? null : () => _pickLanguageToAdd(profile.targetLangs, profile.nativeLang),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: kCard,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: kBrutalBlack, width: 2),
                                boxShadow: const [BoxShadow(color: kBrutalBlack, offset: Offset(3, 3), blurRadius: 0)],
                              ),
                              child: const Icon(Icons.add_rounded, size: 22, color: kBrutalBlack),
                            ),
                          ),
                        ],
                      ),
                      if (_savingLangs) ...[
                        const SizedBox(height: 10),
                        Text('Updating languages...',
                            style: GoogleFonts.almarai(color: const Color(0xFF0EA5A4), fontWeight: FontWeight.w900, fontSize: 11)),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: duoCardDecoration(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('My level', style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900, fontSize: 18)),
                      const SizedBox(height: 14),
                      if (_savingLevel)
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: 12),
                            child: CircularProgressIndicator(color: kPrimary, strokeWidth: 2),
                          ),
                        )
                      else
                        Wrap(
                          spacing: 10,
                          runSpacing: 10,
                          children: kLevels.map((level) {
                            final selected = profile.level == level;
                            return InkWell(
                              borderRadius: BorderRadius.circular(16),
                              onTap: selected ? null : () => _changeLevel(level),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 180),
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: selected ? const Color(0xFFEDE9FE) : kCard,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: selected ? kSecondary : kBorder, width: 2),
                                  boxShadow: [BoxShadow(color: selected ? kSecondaryShadow : kBorder, offset: const Offset(0, 3), blurRadius: 0)],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(level, style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900, fontSize: 15)),
                                    Text(
                                      kLevelDescriptions[level] ?? '',
                                      style: GoogleFonts.almarai(color: kMuted, fontWeight: FontWeight.w800, fontSize: 11),
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
              const SizedBox(height: 20),
              OutlinedButton.icon(
                onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
                icon: const Icon(Icons.logout_rounded),
                label: const Text('Sign out'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _flagWidget(String langCode, Color tone) {
    final flag = languageFlagCode(langCode);
    if (flag == null || flag.isEmpty) return Icon(Icons.language, color: tone);
    return CountryFlag.fromCountryCode(
      flag,
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.tone,
  });

  final Widget icon;
  final String label;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: duoCardDecoration(),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: tone.withAlpha(34), borderRadius: BorderRadius.circular(15)),
            child: Center(child: icon),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: GoogleFonts.almarai(color: kMuted, fontSize: 11, fontWeight: FontWeight.w900)),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.almarai(color: kForeground, fontSize: 15, fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
