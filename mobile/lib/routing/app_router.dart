import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../auth/auth_provider.dart';
import '../features/home/home_shell.dart';
import '../features/login/login_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/practice/dialogue_screen.dart';
import '../features/practice/story_screen.dart';

GoRouter buildRouter(WidgetRef ref) {
  return GoRouter(
    initialLocation: '/',
    redirect: (ctx, state) {
      final auth = ref.read(authControllerProvider);
      final here = state.matchedLocation;
      switch (auth.status) {
        case AuthStatus.unknown:
          return null;
        case AuthStatus.signedOut:
          return here == '/login' ? null : '/login';
        case AuthStatus.noProfile:
          return here == '/onboarding' ? null : '/onboarding';
        case AuthStatus.ready:
          if (here == '/login' || here == '/onboarding' || here == '/') {
            return '/home';
          }
          return null;
      }
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const _Splash()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/home', builder: (_, __) => const HomeShell()),
      GoRoute(
        path: '/practice/:id',
        builder: (_, s) => StoryScreen(storyId: s.pathParameters['id']!),
      ),
      GoRoute(
        path: '/dialogue/:id',
        builder: (_, s) => DialogueScreen(dialogueId: s.pathParameters['id']!),
      ),
    ],
  );
}

class _Splash extends StatelessWidget {
  const _Splash();
  @override
  Widget build(BuildContext context) =>
      const Scaffold(body: Center(child: CircularProgressIndicator()));
}
