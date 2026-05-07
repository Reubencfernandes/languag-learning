class Env {
  // Override at build time with:
  //   flutter run --dart-define=API_BASE_URL=https://my.api
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000', // Android emulator → host loopback
  );

  static const oauthCallbackScheme = 'langlearn';
}


