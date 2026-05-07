import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../theme/app_theme.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  bool _loading = false;
  String? _error;
  late final AnimationController _ctrl;
  late final Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 650));
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic);
    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref.read(authControllerProvider.notifier).signInWithHuggingFace();
    } catch (_) {
      setState(() => _error = 'Sign in failed. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: FadeTransition(
              opacity: _fade,
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                children: [
                  const SizedBox(height: 24),
                  const Center(child: _BrandMark()),
                  const SizedBox(height: 28),
                  Text(
                    'DialogueDock',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.nunito(
                      color: kForeground,
                      fontSize: 46,
                      fontWeight: FontWeight.w900,
                      height: 1,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Quick dialogues, phrase breakdowns, and photo vocabulary in one daily lesson flow.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.nunito(
                      color: kMuted,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      height: 1.35,
                    ),
                  ),
                  const SizedBox(height: 40),
                  FilledButton.icon(
                    onPressed: _loading ? null : _signIn,
                    icon: _loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.play_arrow_rounded),
                    label: Text(_loading ? 'Opening browser...' : 'Start learning'),
                  ),
                  const SizedBox(height: 14),
                  OutlinedButton(
                    onPressed: _loading ? null : _signIn,
                    child: const Text('I already have an account'),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFE4E6),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFECDD3), width: 2),
                      ),
                      child: Text(
                        _error!,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.nunito(color: kDangerShadow, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ],
                  const SizedBox(height: 18),
                  Text(
                    'We use your Hugging Face account for sign in.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.nunito(color: kMuted, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _BrandMark extends StatelessWidget {
  const _BrandMark();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 112,
      height: 112,
      decoration: BoxDecoration(
        color: kPrimary,
        borderRadius: BorderRadius.circular(30),
        boxShadow: const [BoxShadow(color: kPrimaryShadow, offset: Offset(0, 6), blurRadius: 0)],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: 68,
            height: 68,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
            ),
            child: const Icon(Icons.explore_rounded, color: kSecondary, size: 42),
          ),
          Positioned(
            right: 19,
            top: 21,
            child: Container(
              width: 14,
              height: 14,
              decoration: const BoxDecoration(
                color: kWarning,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      ),
    );
  }
}



