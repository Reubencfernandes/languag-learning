class Env {
  // Defaults to the deployed Hugging Face Space.
  // For local dev against `next dev` on the host machine, override with:
  //   flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000   (Android emulator → host loopback)
  //   flutter run --dart-define=API_BASE_URL=http://localhost:3000  (iOS simulator)
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://reubencf-praxaling.hf.space',
  );

  static const oauthCallbackScheme = 'langlearn';
}


