import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../theme/app_theme.dart';
import '../../widgets/level_picker.dart';
import 'widgets/furi_text.dart';
import 'widgets/tts_button.dart';

const _phraseFill = Color(0xFFE8F7F6);
const _warningFill = Color(0xFFFEF3C7);
const _kanjiExampleFill = Color(0xFFE6FBFA);
const _examples = ['to find', 'I would like...', 'appointment', 'Can you help me?', 'because'];

String _value(Map<String, dynamic> json, String key) => (json[key] ?? '').toString();

class PhraseSentence {
  PhraseSentence({
    required this.target,
    required this.targetSegments,
    required this.translation,
    required this.note,
  });
  final String target;
  final List<FuriSegment>? targetSegments;
  final String translation;
  final String note;

  factory PhraseSentence.fromJson(Map<String, dynamic> json) => PhraseSentence(
        target: _value(json, 'target'),
        targetSegments: parseFuriSegments(json['targetSegments']),
        translation: _value(json, 'translation'),
        note: _value(json, 'note'),
      );
}

class PhraseBreakdown {
  PhraseBreakdown({required this.part, required this.explanation});
  final String part;
  final String explanation;

  factory PhraseBreakdown.fromJson(Map<String, dynamic> json) => PhraseBreakdown(
        part: _value(json, 'part'),
        explanation: _value(json, 'explanation'),
      );
}

class RelatedWord {
  RelatedWord({
    required this.word,
    required this.wordSegments,
    required this.translation,
    required this.partOfSpeech,
    required this.note,
  });
  final String word;
  final List<FuriSegment>? wordSegments;
  final String translation;
  final String partOfSpeech;
  final String note;

  factory RelatedWord.fromJson(Map<String, dynamic> json) => RelatedWord(
        word: _value(json, 'word'),
        wordSegments: parseFuriSegments(json['wordSegments']),
        translation: _value(json, 'translation'),
        partOfSpeech: _value(json, 'partOfSpeech'),
        note: _value(json, 'note'),
      );
}

class KanjiInfo {
  KanjiInfo({
    required this.kanji,
    required this.onyomi,
    required this.kunyomi,
    required this.meaning,
    required this.exampleWord,
    required this.exampleWordReading,
  });
  final String kanji;
  final List<String> onyomi;
  final List<String> kunyomi;
  final String meaning;
  final String exampleWord;
  final String exampleWordReading;

  factory KanjiInfo.fromJson(Map<String, dynamic> json) => KanjiInfo(
        kanji: _value(json, 'kanji'),
        onyomi: ((json['onyomi'] as List?) ?? [])
            .map((e) => e.toString())
            .where((e) => e.isNotEmpty)
            .toList(),
        kunyomi: ((json['kunyomi'] as List?) ?? [])
            .map((e) => e.toString())
            .where((e) => e.isNotEmpty)
            .toList(),
        meaning: _value(json, 'meaning'),
        exampleWord: _value(json, 'exampleWord'),
        exampleWordReading: _value(json, 'exampleWordReading'),
      );
}

class PhraseAnalysis {
  PhraseAnalysis({
    required this.input,
    required this.inputSegments,
    required this.translation,
    required this.partOfSpeech,
    required this.verbInfo,
    required this.breakdown,
    required this.sentences,
    required this.tips,
    required this.relatedWords,
    required this.kanjiInfo,
  });

  final String input;
  final List<FuriSegment>? inputSegments;
  final String translation;
  final String partOfSpeech;
  final String verbInfo;
  final List<PhraseBreakdown> breakdown;
  final List<PhraseSentence> sentences;
  final List<String> tips;
  final List<RelatedWord> relatedWords;
  final List<KanjiInfo> kanjiInfo;

  factory PhraseAnalysis.fromJson(Map<String, dynamic> json) => PhraseAnalysis(
        input: _value(json, 'input'),
        inputSegments: parseFuriSegments(json['inputSegments']),
        translation: _value(json, 'translation'),
        partOfSpeech: _value(json, 'partOfSpeech').isEmpty ? 'phrase' : _value(json, 'partOfSpeech'),
        verbInfo: _value(json, 'verbInfo'),
        breakdown: ((json['breakdown'] as List?) ?? [])
            .whereType<Map>()
            .map((item) => PhraseBreakdown.fromJson(Map<String, dynamic>.from(item)))
            .toList(),
        sentences: ((json['sentences'] as List?) ?? [])
            .whereType<Map>()
            .map((item) => PhraseSentence.fromJson(Map<String, dynamic>.from(item)))
            .toList(),
        tips: ((json['tips'] as List?) ?? []).map((tip) => tip.toString()).where((tip) => tip.isNotEmpty).toList(),
        relatedWords: ((json['relatedWords'] as List?) ?? [])
            .whereType<Map>()
            .map((item) => RelatedWord.fromJson(Map<String, dynamic>.from(item)))
            .where((w) => w.word.isNotEmpty)
            .toList(),
        kanjiInfo: ((json['kanjiInfo'] as List?) ?? [])
            .whereType<Map>()
            .map((item) => KanjiInfo.fromJson(Map<String, dynamic>.from(item)))
            .where((k) => k.kanji.isNotEmpty && (k.onyomi.isNotEmpty || k.kunyomi.isNotEmpty))
            .toList(),
      );
}

class PhrasesScreen extends ConsumerStatefulWidget {
  const PhrasesScreen({super.key});

  @override
  ConsumerState<PhrasesScreen> createState() => _PhrasesScreenState();
}

class _PhrasesScreenState extends ConsumerState<PhrasesScreen> {
  final _controller = TextEditingController();
  PhraseAnalysis? _analysis;
  String? _error;
  bool _loading = false;
  String? _level;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _analyze([String? override]) async {
    final phrase = (override ?? _controller.text).trim();
    if (phrase.isEmpty) {
      setState(() => _error = 'Enter a phrase first.');
      return;
    }
    if (override != null) _controller.text = override;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final profile = ref.read(authControllerProvider).profile;
      final api = ref.read(apiClientProvider);
      final level = _level ?? profile?.level;
      final res = await api.dio.post<Map<String, dynamic>>(
        '/api/phrases',
        data: {
          'text': phrase,
          if (level != null) 'level': level,
        },
      );
      final data = res.data ?? const <String, dynamic>{};
      final ok = (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300;
      if (!mounted) return;
      if (ok) {
        setState(() => _analysis = PhraseAnalysis.fromJson(Map<String, dynamic>.from(data)));
      } else {
        setState(() => _error = _messageFrom(data, res.statusCode));
      }
    } catch (error) {
      if (mounted) setState(() => _error = 'Could not analyze phrase: $error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _messageFrom(Map<String, dynamic> data, int? statusCode) {
    final message = data['message'] ?? data['error'];
    if (message is String && message.isNotEmpty) return message;
    return 'Request failed (${statusCode ?? 'unknown'}).';
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(authControllerProvider).profile;
    final lang = profile?.targetLang ?? 'en';
    final activeLevel = _level ?? profile?.level ?? 'A1';
    return Scaffold(
      appBar: AppBar(toolbarHeight: 72, title: const Text('Phrases')),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 980),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 28),
              children: [
                _Header(),
                const SizedBox(height: 28),
                _InputPanel(
                  controller: _controller,
                  loading: _loading,
                  error: _error,
                  level: activeLevel,
                  onLevelChange: (l) => setState(() => _level = l),
                  onAnalyze: () => _analyze(),
                  onExample: _analyze,
                ),
                const SizedBox(height: 30),
                if (_loading)
                  const _EmptyState(isPending: true)
                else if (_analysis == null)
                  const _EmptyState()
                else
                  _PhraseResult(analysis: _analysis!, lang: lang),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: GoogleFonts.almarai(
          color: kForeground,
          fontSize: 34,
          fontWeight: FontWeight.w900,
          height: 0.98,
          letterSpacing: 0,
        ),
        children: const [
          TextSpan(text: 'Break down '),
          TextSpan(text: 'phrases', style: TextStyle(color: kPrimary)),
          TextSpan(text: ' into sentences, grammar, and tips'),
        ],
      ),
    );
  }
}

class _InputPanel extends StatelessWidget {
  const _InputPanel({
    required this.controller,
    required this.loading,
    required this.error,
    required this.level,
    required this.onLevelChange,
    required this.onAnalyze,
    required this.onExample,
  });

  final TextEditingController controller;
  final bool loading;
  final String? error;
  final String level;
  final ValueChanged<String> onLevelChange;
  final VoidCallback onAnalyze;
  final void Function(String value) onExample;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: _phraseFill, borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Phrase or word', style: GoogleFonts.almarai(color: kPrimary, fontSize: 13, fontWeight: FontWeight.w900)),
          const SizedBox(height: 10),
          LevelPicker(value: level, onChanged: onLevelChange),
          const SizedBox(height: 12),
          TextField(
            controller: controller,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => onAnalyze(),
            decoration: const InputDecoration(hintText: 'Type a phrase, word, or verb...'),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: loading ? null : onAnalyze,
              icon: const Icon(Icons.auto_awesome_rounded),
              label: Text(loading ? 'Analyzing...' : 'Analyze'),
            ),
          ),
          if (error != null) ...[
            const SizedBox(height: 10),
            Text(error!, style: GoogleFonts.almarai(color: kDangerShadow, fontSize: 13, fontWeight: FontWeight.w900)),
          ],
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _examples
                .map(
                  (example) => ActionChip(
                    label: Text(example),
                    onPressed: loading ? null : () => onExample(example),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({this.isPending = false});
  final bool isPending;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: duoCardDecoration(),
      child: Column(
        children: [
          Container(
            width: 62,
            height: 62,
            decoration: BoxDecoration(
              color: kBrutalYellow,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: kBrutalBlack, width: 2),
              boxShadow: const [
                BoxShadow(color: kBrutalBlack, offset: Offset(3, 3), blurRadius: 0),
              ],
            ),
            child: const Icon(Icons.edit_note_rounded, color: kBrutalBlack, size: 34),
          ),
          const SizedBox(height: 20),
          if (isPending) ...[
            Text(
              'Building your mini lesson...',
              textAlign: TextAlign.center,
              style: GoogleFonts.almarai(color: kForeground, fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 14),
            const _BrutalProgressBar(),
          ] else
            Text(
              'Enter a phrase to build a mini lesson',
              textAlign: TextAlign.center,
              style: GoogleFonts.almarai(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900),
            ),
        ],
      ),
    );
  }
}

class _BrutalProgressBar extends StatefulWidget {
  const _BrutalProgressBar();

  @override
  State<_BrutalProgressBar> createState() => _BrutalProgressBarState();
}

class _BrutalProgressBarState extends State<_BrutalProgressBar> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 22,
      decoration: BoxDecoration(
        color: kBrutalWhite,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: kBrutalBlack, width: 2),
        boxShadow: const [
          BoxShadow(color: kBrutalBlack, offset: Offset(3, 3), blurRadius: 0),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(999),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;
            final segmentWidth = width * 0.33;
            return AnimatedBuilder(
              animation: _ctrl,
              builder: (context, _) {
                final t = _ctrl.value;
                final left = -segmentWidth + (width + segmentWidth) * t;
                return Stack(
                  children: [
                    Positioned(
                      left: left,
                      top: 0,
                      bottom: 0,
                      width: segmentWidth,
                      child: Container(color: const Color(0xFF0EA5A4)),
                    ),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class _PhraseResult extends StatelessWidget {
  const _PhraseResult({required this.analysis, required this.lang});
  final PhraseAnalysis analysis;
  final String lang;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(color: _phraseFill, borderRadius: BorderRadius.circular(24)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      analysis.partOfSpeech,
                      style: GoogleFonts.almarai(color: kPrimary, fontSize: 13, fontWeight: FontWeight.w900),
                    ),
                  ),
                  TtsButton(text: analysis.input, lang: lang, size: 40),
                ],
              ),
              const SizedBox(height: 10),
              FuriText(
                text: analysis.input,
                segments: analysis.inputSegments,
                fontSize: 30,
                fontWeight: FontWeight.w900,
              ),
              const SizedBox(height: 10),
              Text(
                analysis.translation,
                style: GoogleFonts.almarai(color: kMuted, fontSize: 17, fontWeight: FontWeight.w800, height: 1.3),
              ),
            ],
          ),
        ),
        const SizedBox(height: 28),
        _SectionHeader(icon: Icons.forum_rounded, title: 'Example sentences'),
        const SizedBox(height: 12),
        ...analysis.sentences.map((sentence) => _SentenceCard(sentence: sentence, lang: lang)),
        if (analysis.kanjiInfo.isNotEmpty) ...[
          const SizedBox(height: 28),
          _SectionHeader(icon: Icons.translate_rounded, title: 'Kanji breakdown'),
          const SizedBox(height: 12),
          _CardGrid(
            children: analysis.kanjiInfo.map((k) => _KanjiCard(kanji: k)).toList(),
          ),
        ],
        if (analysis.relatedWords.isNotEmpty) ...[
          const SizedBox(height: 28),
          _SectionHeader(icon: Icons.menu_book_rounded, title: 'Related words'),
          const SizedBox(height: 12),
          _CardGrid(
            children: analysis.relatedWords.map((w) => _RelatedWordCard(word: w, lang: lang)).toList(),
          ),
        ],
        const SizedBox(height: 28),
        _ResponsiveResultGrid(analysis: analysis),
      ],
    );
  }
}

class _SentenceCard extends StatelessWidget {
  const _SentenceCard({required this.sentence, required this.lang});
  final PhraseSentence sentence;
  final String lang;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: _phraseFill, borderRadius: BorderRadius.circular(22)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: FuriText(
                    text: sentence.target,
                    segments: sentence.targetSegments,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(width: 8),
                TtsButton(text: sentence.target, lang: lang),
              ],
            ),
            const SizedBox(height: 8),
            Text(sentence.translation, style: GoogleFonts.almarai(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800)),
            if (sentence.note.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(sentence.note, style: GoogleFonts.almarai(color: kPrimary, fontSize: 13, fontWeight: FontWeight.w900)),
            ],
          ],
        ),
      ),
    );
  }
}

class _CardGrid extends StatelessWidget {
  const _CardGrid({required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth >= 900
            ? 3
            : constraints.maxWidth >= 560
                ? 2
                : 1;
        const spacing = 12.0;
        final totalSpacing = spacing * (columns - 1);
        final colWidth = (constraints.maxWidth - totalSpacing) / columns;
        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: children
              .map((c) => SizedBox(width: colWidth, child: c))
              .toList(),
        );
      },
    );
  }
}

class _KanjiCard extends StatelessWidget {
  const _KanjiCard({required this.kanji});
  final KanjiInfo kanji;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: brutalCard(offset: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(kanji.kanji, style: GoogleFonts.almarai(color: kForeground, fontSize: 40, fontWeight: FontWeight.w900, height: 1.0)),
              const SizedBox(width: 12),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Text(
                    kanji.meaning,
                    style: GoogleFonts.almarai(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _readingRow(label: 'On', fill: kBrutalYellow, labelColor: kBrutalBlack, readings: kanji.onyomi),
          const SizedBox(height: 8),
          _readingRow(label: 'Kun', fill: const Color(0xFF0EA5A4), labelColor: kBrutalWhite, readings: kanji.kunyomi),
          if (kanji.exampleWord.isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _kanjiExampleFill,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: kBrutalBlack, width: 2),
                boxShadow: const [
                  BoxShadow(color: kBrutalBlack, offset: Offset(3, 3), blurRadius: 0),
                ],
              ),
              child: FuriText(
                text: kanji.exampleWord,
                segments: kanji.exampleWordReading.isNotEmpty
                    ? [FuriSegment(text: kanji.exampleWord, reading: kanji.exampleWordReading)]
                    : null,
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _readingRow({required String label, required Color fill, required Color labelColor, required List<String> readings}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 48,
          padding: const EdgeInsets.symmetric(vertical: 4),
          decoration: BoxDecoration(
            color: fill,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: kBrutalBlack, width: 2),
            boxShadow: const [
              BoxShadow(color: kBrutalBlack, offset: Offset(2, 2), blurRadius: 0),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: GoogleFonts.almarai(color: labelColor, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.5),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            readings.isEmpty ? '—' : readings.join('、'),
            style: GoogleFonts.almarai(
              color: readings.isEmpty ? const Color(0xFFD1D5DB) : kBrutalBlack,
              fontSize: 18,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
      ],
    );
  }
}

class _RelatedWordCard extends StatelessWidget {
  const _RelatedWordCard({required this.word, required this.lang});
  final RelatedWord word;
  final String lang;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: brutalCard(offset: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: FuriText(
                  text: word.word,
                  segments: word.wordSegments,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (word.partOfSpeech.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      margin: const EdgeInsets.only(bottom: 6),
                      decoration: BoxDecoration(
                        color: kBrutalYellow,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: kBrutalBlack, width: 1.5),
                        boxShadow: const [
                          BoxShadow(color: kBrutalBlack, offset: Offset(1, 1), blurRadius: 0),
                        ],
                      ),
                      child: Text(
                        word.partOfSpeech.toUpperCase(),
                        style: GoogleFonts.almarai(
                          color: kBrutalBlack,
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  TtsButton(text: word.word, lang: lang, size: 30),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(word.translation, style: GoogleFonts.almarai(color: const Color(0xFF374151), fontSize: 15, fontWeight: FontWeight.w800)),
          if (word.note.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(word.note, style: GoogleFonts.almarai(color: const Color(0xFF6B7280), fontSize: 13, fontWeight: FontWeight.w900)),
          ],
        ],
      ),
    );
  }
}

class _ResponsiveResultGrid extends StatelessWidget {
  const _ResponsiveResultGrid({required this.analysis});
  final PhraseAnalysis analysis;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final useGrid = constraints.maxWidth >= 720;
        final sections = [
          _BreakdownSection(items: analysis.breakdown),
          _TipsSection(tips: analysis.tips, verbInfo: analysis.verbInfo),
        ];

        if (!useGrid) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              sections[0],
              const SizedBox(height: 26),
              sections[1],
            ],
          );
        }

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: sections[0]),
            const SizedBox(width: 18),
            Expanded(child: sections[1]),
          ],
        );
      },
    );
  }
}

class _BreakdownSection extends StatelessWidget {
  const _BreakdownSection({required this.items});
  final List<PhraseBreakdown> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(icon: Icons.checklist_rounded, title: 'Breakdown'),
        const SizedBox(height: 12),
        ...items.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: duoCardDecoration(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.part, style: GoogleFonts.almarai(color: kForeground, fontSize: 17, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 6),
                  Text(
                    item.explanation,
                    style: GoogleFonts.almarai(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _TipsSection extends StatelessWidget {
  const _TipsSection({required this.tips, required this.verbInfo});
  final List<String> tips;
  final String verbInfo;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(icon: Icons.lightbulb_rounded, title: 'Tips and verb notes'),
        const SizedBox(height: 12),
        if (verbInfo.isNotEmpty)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(color: _warningFill, borderRadius: BorderRadius.circular(22)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Verb info', style: GoogleFonts.almarai(color: Color(0xFF92400E), fontSize: 13, fontWeight: FontWeight.w900)),
                const SizedBox(height: 6),
                Text(verbInfo, style: GoogleFonts.almarai(color: kForeground, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35)),
              ],
            ),
          ),
        ...tips.map(
          (tip) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: duoCardDecoration(),
              child: Text(tip, style: GoogleFonts.almarai(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35)),
            ),
          ),
        ),
      ],
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.icon, required this.title});
  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: kPrimary, size: 24),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            title,
            style: GoogleFonts.almarai(color: kForeground, fontSize: 24, fontWeight: FontWeight.w900),
          ),
        ),
      ],
    );
  }
}
