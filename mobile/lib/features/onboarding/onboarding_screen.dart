import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/languages.dart';
import '../../theme/app_theme.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  String _native = 'en';
  String _target = 'es';
  String _level = 'A1';
  bool _saving = false;
  String? _error;

  Future<void> _save() async {
    if (_native == _target) {
      setState(() => _error = 'Native and target languages must differ.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      await ref.read(authControllerProvider.notifier).saveProfile(
            nativeLang: _native,
            targetLang: _target,
            level: _level,
          );
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 720),
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Container(
                  decoration: duoCardDecoration(),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        color: kPrimary,
                        padding: const EdgeInsets.all(22),
                        child: Row(
                          children: [
                            Container(
                              width: 54,
                              height: 54,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                boxShadow: const [
                                  BoxShadow(color: kPrimaryShadow, offset: Offset(0, 4), blurRadius: 0),
                                ],
                              ),
                              child: const Icon(Icons.auto_awesome, color: kPrimaryShadow),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'SET UP YOUR COURSE',
                                    style: GoogleFonts.nunito(
                                      color: Colors.white.withAlpha(210),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 0,
                                    ),
                                  ),
                                  Text(
                                    'Pick your path',
                                    style: GoogleFonts.nunito(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w900,
                                      height: 1.1,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _SectionLabel('I speak'),
                            const SizedBox(height: 8),
                            _langDropdown(_native, (v) => setState(() => _native = v)),
                            const SizedBox(height: 18),
                            _SectionLabel('I want to learn'),
                            const SizedBox(height: 8),
                            _langDropdown(_target, (v) => setState(() => _target = v), exclude: _native),
                            const SizedBox(height: 22),
                            _SectionLabel('My current level'),
                            const SizedBox(height: 10),
                            LayoutBuilder(
                              builder: (context, constraints) {
                                final twoColumns = constraints.maxWidth >= 520;
                                return GridView.count(
                                  crossAxisCount: twoColumns ? 5 : 2,
                                  shrinkWrap: true,
                                  mainAxisSpacing: 10,
                                  crossAxisSpacing: 10,
                                  physics: const NeverScrollableScrollPhysics(),
                                  childAspectRatio: twoColumns ? 1.05 : 2.1,
                                  children: kLevels.map((level) {
                                    final selected = _level == level;
                                    return _LevelTile(
                                      level: level,
                                      description: kLevelDescriptions[level] ?? '',
                                      selected: selected,
                                      onTap: () => setState(() => _level = level),
                                    );
                                  }).toList(),
                                );
                              },
                            ),
                            if (_error != null) ...[
                              const SizedBox(height: 18),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFFE4E6),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFFFECDD3), width: 2),
                                ),
                                child: Text(
                                  _error!,
                                  style: GoogleFonts.nunito(color: kDangerShadow, fontWeight: FontWeight.w900),
                                ),
                              ),
                            ],
                            const SizedBox(height: 22),
                            FilledButton(
                              onPressed: _saving ? null : _save,
                              child: Text(_saving ? 'Saving...' : 'Start learning'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _langDropdown(String value, ValueChanged<String> onChanged, {String? exclude}) {
    final items = kLanguages.where((language) => language.code != exclude).toList();
    return DropdownButtonFormField<String>(
      initialValue: value,
      icon: const Icon(Icons.keyboard_arrow_down_rounded, color: kMuted),
      decoration: const InputDecoration(),
      items: items.map((language) {
        return DropdownMenuItem(value: language.code, child: Text(language.name));
      }).toList(),
      onChanged: (v) => v == null ? null : onChanged(v),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.nunito(color: kForeground, fontWeight: FontWeight.w900, fontSize: 15),
    );
  }
}

class _LevelTile extends StatelessWidget {
  const _LevelTile({
    required this.level,
    required this.description,
    required this.selected,
    required this.onTap,
  });

  final String level;
  final String description;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFFEDE9FE) : kCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: selected ? kSecondary : kBorder, width: 2),
          boxShadow: [BoxShadow(color: selected ? kSecondaryShadow : kBorder, offset: const Offset(0, 4), blurRadius: 0)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(level, style: GoogleFonts.nunito(color: kForeground, fontWeight: FontWeight.w900, fontSize: 18)),
            const SizedBox(height: 3),
            Flexible(
              child: Text(
                description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.nunito(color: kMuted, fontWeight: FontWeight.w800, fontSize: 11, height: 1.15),
              ),
            ),
          ],
        ),
      ),
    );
  }
}


