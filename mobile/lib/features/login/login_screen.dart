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

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  bool _loading = false;
  bool _hovered = false;
  String? _error;
  late AnimationController _ctrl;
  late Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
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
    } catch (e) {
      setState(() => _error = 'Sign in failed. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: FadeTransition(
          opacity: _fade,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Spacer(flex: 2),
                Builder(builder: (context) {
                  final w = MediaQuery.of(context).size.width;
                  final titleSize = w >= 900 ? 40.0 : w >= 600 ? 48.0 : 56.0;
                  return Text(
                    'DialogueDock',
                    style: GoogleFonts.almarai(
                      color: kForeground,
                      fontSize: titleSize,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -2,
                      height: 1.0,
                    ),
                  );
                }),
                const SizedBox(height: 20),
                Text(
                  'Learn a new language through natural dialogues. Start thinking like a native speaker and stop translating.',
                  style: GoogleFonts.almarai(
                    color: kMuted,
                    fontSize: 15,
                    height: 1.4,
                  ),
                ),
                const Spacer(flex: 2),
                // Pill button with arrow circle
                MouseRegion(
                  onEnter: (_) => setState(() => _hovered = true),
                  onExit: (_) => setState(() => _hovered = false),
                  child: GestureDetector(
                  onTap: _loading ? null : _signIn,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    height: 56,
                    decoration: BoxDecoration(
                      color: _hovered ? const Color(0xFFFB923C) : kPrimary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    padding: const EdgeInsets.only(left: 24, right: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            _loading ? 'Opening browser…' : 'Start with HuggingFace',
                            style: GoogleFonts.almarai(
                              color: _hovered ? Colors.white : kBackground,
                              fontWeight: FontWeight.w500,
                              fontSize: 15,
                            ),
                          ),
                        ),
                        Container(
                          width: 40,
                          height: 40,
                          decoration: const BoxDecoration(
                            color: kBackground,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.arrow_forward,
                              color: kPrimary, size: 18),
                        ),
                      ],
                    ),
                  ),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    _error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.redAccent, fontSize: 13),
                  ),
                ],
                const SizedBox(height: 16),
                Text(
                  'We use your HuggingFace account for identity and inference. No password stored.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.almarai(
                    color: kMuted.withAlpha(100),
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
