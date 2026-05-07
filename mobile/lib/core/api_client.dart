import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth/session_store.dart';
import 'env.dart';

class ApiClient {
  ApiClient(this._store) {
    dio = Dio(BaseOptions(
      baseUrl: Env.apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 90),
      validateStatus: (s) => s != null && s < 500,
    ));
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _store.read();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
    ));
  }

  final SessionStore _store;
  late final Dio dio;
}

final sessionStoreProvider = Provider<SessionStore>((_) => SessionStore());
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient(ref.read(sessionStoreProvider)));


