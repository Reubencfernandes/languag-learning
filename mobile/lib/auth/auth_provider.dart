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

  Map<String, dynamic> toJson() => {
        'nativeLang': nativeLang,
        'targetLang': targetLang,
        'level': level,
      };
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._api, this._store) : super(const AuthState(status: AuthStatus.unknown)) {
    _initFromCache();
  }

  final ApiClient _api;
  final SessionStore _store;

  /// On startup: immediately restore any cached profile so the UI is not blank,
  /// then kick off a background refresh from the server.
  Future<void> _initFromCache() async {
    final token = await _store.read();
    if (token == null) {
      state = const AuthState(status: AuthStatus.signedOut);
      return;
    }
    // Try to restore profile from local cache for instant UI.
    final cached = await _store.readProfile();
    if (cached != null) {
      final profile = Profile.fromJson(cached);
      state = AuthState(status: AuthStatus.ready, profile: profile);
    }
    // Always refresh from server in the background.
    await refresh();
  }

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
        // Persist locally.
        if (profile != null) {
          await _store.writeProfile(profile.toJson());
        } else {
          await _store.clearProfile();
        }
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
      // Keep the cached state if we already have one; only fall back to signedOut
      // if there is nothing cached.
      if (state.status == AuthStatus.unknown) {
        state = const AuthState(status: AuthStatus.signedOut);
      }
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
    await _store.clear(); // clears JWT + profile cache
    state = const AuthState(status: AuthStatus.signedOut);
  }

  Future<void> saveProfile({required String nativeLang, required String targetLang, required String level}) async {
    final res = await _api.dio.put<Map<String, dynamic>>(
      '/api/me/profile',
      data: {'nativeLang': nativeLang, 'targetLang': targetLang, 'level': level},
    );
    if (res.statusCode == 200 && res.data != null) {
      final p = Profile.fromJson(res.data!['profile'] as Map<String, dynamic>);
      // Persist locally immediately.
      await _store.writeProfile(p.toJson());
      state = state.copyWith(status: AuthStatus.ready, profile: p);
    } else {
      throw Exception((res.data?['message'] ?? res.data?['error'] ?? 'save failed').toString());
    }
  }

  /// Change only the CEFR level without a full profile re-save form.
  Future<void> updateLevel(String level) async {
    final current = state.profile;
    if (current == null) return;
    await saveProfile(
      nativeLang: current.nativeLang,
      targetLang: current.targetLang,
      level: level,
    );
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  final api = ref.watch(apiClientProvider);
  final store = ref.watch(sessionStoreProvider);
  return AuthController(api, store);
});


