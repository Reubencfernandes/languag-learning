class LanguageOption {
  const LanguageOption(this.code, this.name);
  final String code;
  final String name;
}

const kLanguages = <LanguageOption>[
  LanguageOption('en',  'English'),
  LanguageOption('es',  'Spanish'),
  LanguageOption('fr',  'French'),
  LanguageOption('de',  'German'),
  LanguageOption('it',  'Italian'),
  LanguageOption('pt',  'Portuguese'),
  LanguageOption('ja',  'Japanese'),
  LanguageOption('ko',  'Korean'),
  LanguageOption('zh',  'Mandarin'),
  LanguageOption('yue', 'Cantonese'),
  LanguageOption('ar',  'Arabic'),
  LanguageOption('hi',  'Hindi'),
  LanguageOption('kn',  'Kannada'),
  LanguageOption('ml',  'Malayalam'),
  LanguageOption('vi',  'Vietnamese'),
  LanguageOption('ru',  'Russian'),
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
    kLanguages.firstWhere((l) => l.code == code, orElse: () => LanguageOption(code, code)).name;


