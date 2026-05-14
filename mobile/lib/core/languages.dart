class LanguageOption {
  const LanguageOption(this.code, this.name, this.flagCode);
  final String code;
  final String name;
  final String flagCode;
}

const kLanguages = <LanguageOption>[
  LanguageOption('en',  'English',    'US'),
  LanguageOption('es',  'Spanish',    'ES'),
  LanguageOption('fr',  'French',     'FR'),
  LanguageOption('de',  'German',     'DE'),
  LanguageOption('it',  'Italian',    'IT'),
  LanguageOption('pt',  'Portuguese', 'BR'),
  LanguageOption('ja',  'Japanese',   'JP'),
  LanguageOption('ko',  'Korean',     'KR'),
  LanguageOption('zh',  'Mandarin',   'CN'),
  LanguageOption('yue', 'Cantonese',  'HK'),
  LanguageOption('ar',  'Arabic',     'SA'),
  LanguageOption('hi',  'Hindi',      'IN'),
  LanguageOption('kn',  'Kannada',    'IN'),
  LanguageOption('ml',  'Malayalam',  'IN'),
  LanguageOption('vi',  'Vietnamese', 'VN'),
  LanguageOption('ru',  'Russian',    'RU'),
];

const kLevels = <String>['A1', 'A2', 'B1', 'B2', 'C1'];

const kLevelDescriptions = <String, String>{
  'A1': 'Just starting',
  'A2': 'Everyday basics',
  'B1': 'Conversations',
  'B2': 'Most topics',
  'C1': 'Advanced',
};

String languageName(String code) =>
    kLanguages.firstWhere((l) => l.code == code, orElse: () => LanguageOption(code, code, '')).name;

String? languageFlagCode(String code) {
  final match = kLanguages.where((l) => l.code == code).toList();
  return match.isEmpty ? null : match.first.flagCode;
}
