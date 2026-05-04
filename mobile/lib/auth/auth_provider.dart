import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

import '../core/api_client.dart';
import '../core/env.dart';
import 'session_store.dart';

class AuthState {
  const AuthState({required this.status, this.user, this.profile});

  final AuthStatus status;
  final User? user;
  final Profile? profile;

  AuthState copyWith({AuthStatus? status, User? user, Profile? profile}) =>
      AuthState(status: status ?? this.status, user: user ?? this.user, profile: profile ?? this.profile);
}

enum AuthStatus { unknown, signedOut, noProfile, ready }

class User {
  const User({required this.id, required this.hfUsername, this.email, this.avatarUrl});
  final String id;
  final String hfUsername;
  final String? email;
  final String? avatarUrl;

  factory User.fromJson(Map<String, dynamic> j) => User(
        id: j['id'] as String,
        hfUsername: j['hfUsername'] as String,
        email: j['email'] as String?,
        avatarUrl: j['avatarUrl'] as String?,
      );
}

class Profile {
  const Profile({required this.nativeLang, required this.targetLang, required this.level});
  final String nativeLang;
  final String targetLang;
  final String level;

  factory Profile.fromJson(Map<String, dynamic> j) => Profile(
        nativeLang: j['nativeLang'] as String,
        targetLang: j['targetLang'] as String,
        level: j['level'] as String,
      );
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._api, this._store) : super(const AuthState(status: AuthStatus.unknown)) {
    refresh();
  }

  final ApiClient _api;
  final SessionStore _store;

  Future<void> refresh() async {
    final token = await _store.read();
    if (token == null) {
      state = const AuthState(status: AuthStatus.signedOut);
      return;
    }
    try {
      final res = await _api.dio.get<Map<String, dynamic>>('/api/me');
      if (res.statusCode == 200 && res.data != null) {
        final user = User.fromJson(res.data!['user'] as Map<String, dynamic>);
        final pjson = res.data!['profile'] as Map<String, dynamic>?;
        final profile = pjson == null ? null : Profile.fromJson(pjson);
        state = AuthState(
          status: profile == null ? AuthStatus.noProfile : AuthStatus.ready,
          user: user,
          profile: profile,
        );
      } else {
        await _store.clear();
        state = const AuthState(status: AuthStatus.signedOut);
      }
    } catch (e) {
      debugPrint('auth refresh failed: $e');
      state = const AuthState(status: AuthStatus.signedOut);
    }
  }

  Future<void> signInWithHuggingFace() async {
    final loginUrl = '${Env.apiBaseUrl}/api/auth/login?client=mobile';
    try {
      final result = await FlutterWebAuth2.authenticate(
        url: loginUrl,
        callbackUrlScheme: Env.oauthCallbackScheme,
      );
      final token = Uri.parse(result).queryParameters['token'];
      if (token == null) throw Exception('no token in callback');
      await _store.write(token);
      await refresh();
    } on DioException catch (e) {
      debugPrint('auth dio error: $e');
      rethrow;
    }
  }

  Future<void> signOut() async {
    await _store.clear();
    state = const AuthState(status: AuthStatus.signedOut);
  }

  Future<void> saveProfile({required String nativeLang, required String targetLang, required String level}) async {
    final res = await _api.dio.put<Map<String, dynamic>>(
      '/api/me/profile',
      data: {'nativeLang': nativeLang, 'targetLang': targetLang, 'level': level},
    );
    if (res.statusCode == 200 && res.data != null) {
      final p = Profile.fromJson(res.data!['profile'] as Map<String, dynamic>);
      state = state.copyWith(status: AuthStatus.ready, profile: p);
    } else {
      throw Exception((res.data?['message'] ?? res.data?['error'] ?? 'save failed').toString());
    }
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  final api = ref.watch(apiClientProvider);
  final store = ref.watch(sessionStoreProvider);
  return AuthController(api, store);
});
