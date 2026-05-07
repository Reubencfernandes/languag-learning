import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SessionStore {
  static const _tokenKey = 'll_session_jwt';
  static const _profileKey = 'll_profile_cache';
  final _storage = const FlutterSecureStorage();

  // ── JWT token ────────────────────────────────────────────────────────────────
  Future<String?> read() => _storage.read(key: _tokenKey);
  Future<void> write(String token) => _storage.write(key: _tokenKey, value: token);
  Future<void> clear() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _profileKey);
  }

  // ── Profile cache (nativeLang, targetLang, level) ────────────────────────────
  Future<Map<String, dynamic>?> readProfile() async {
    final raw = await _storage.read(key: _profileKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> writeProfile(Map<String, dynamic> profile) =>
      _storage.write(key: _profileKey, value: jsonEncode(profile));

  Future<void> clearProfile() => _storage.delete(key: _profileKey);
}


