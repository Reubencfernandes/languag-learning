import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../theme/app_theme.dart';
import '../../widgets/tts_button.dart';

class _StoryData {
  _StoryData({
    required this.title,
    required this.content,
    required this.targetLang,
    required this.vocab,
  });

  final String title;
  final String content;
  final String targetLang;
  final List<Map<String, String>> vocab;
}

final storyFuture = FutureProvider.family.autoDispose<_StoryData, String>((ref, id) async {
  final api = ref.watch(apiClientProvider);
  final res = await api.dio.get<Map<String, dynamic>>('/api/stories/$id');
  final s = res.data!['story'] as Map<String, dynamic>;
  final vocab = ((s['vocab'] as List?) ?? [])
      .cast<Map<String, dynamic>>()
      .map((v) => {'word': (v['word'] ?? '').toString(), 'gloss': (v['gloss'] ?? '').toString()})
      .toList();
  return _StoryData(
    title: s['title'] as String,
    content: s['content'] as String,
    targetLang: s['targetLang'] as String,
    vocab: vocab,
  );
});

class StoryQuestion {
  StoryQuestion({required this.question, required this.options, required this.correctIndex, required this.explanation});
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  factory StoryQuestion.fromJson(Map<String, dynamic> j) => StoryQuestion(
        question: (j['question'] ?? '').toString(),
        options: ((j['options'] as List?) ?? []).map((o) => o.toString()).toList(),
        correctIndex: (j['correctIndex'] is num) ? (j['correctIndex'] as num).toInt() : 0,
        explanation: (j['explanation'] ?? '').toString(),
      );
}

class StoryScreen extends ConsumerStatefulWidget {
  const StoryScreen({super.key, required this.storyId});
  final String storyId;

  @override
  ConsumerState<StoryScreen> createState() => _StoryScreenState();
}

class _StoryScreenState extends ConsumerState<StoryScreen> {
  bool _readMarked = false;
  bool _quizLoading = false;
  String? _quizError;
  List<StoryQuestion>? _questions;
  final Map<int, int> _answers = {};

  Future<void> _markRead() async {
    if (_readMarked) return;
    _readMarked = true;
    try {
      final api = ref.read(apiClientProvider);
      await api.dio.post<Map<String, dynamic>>('/api/stories/${widget.storyId}/read');
    } catch (_) {}
  }

  Future<void> _loadQuiz(String content) async {
    setState(() {
      _quizLoading = true;
      _quizError = null;
    });
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<dynamic>(
        '/api/stories/${widget.storyId}/questions',
        data: {'content': content},
      );
      final data = res.data;
      if ((res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300 && data is List) {
        final qs = data
            .whereType<Map>()
            .map((m) => StoryQuestion.fromJson(Map<String, dynamic>.from(m)))
            .where((q) => q.question.isNotEmpty && q.options.length >= 2)
            .toList();
        if (mounted) setState(() => _questions = qs);
      } else {
        if (mounted) setState(() => _quizError = 'Could not load questions. Try again.');
      }
    } catch (_) {
      if (mounted) setState(() => _quizError = 'Could not load questions. Try again.');
    } finally {
      if (mounted) setState(() => _quizLoading = false);
    }
  }

  void _answer(int qIdx, int oIdx) {
    if (_answers.containsKey(qIdx)) return;
    setState(() => _answers[qIdx] = oIdx);
  }

  int? get _quizScore {
    if (_questions == null) return null;
    if (_answers.length != _questions!.length) return null;
    var correct = 0;
    for (var i = 0; i < _questions!.length; i++) {
      if (_answers[i] == _questions![i].correctIndex) correct++;
    }
    return correct;
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(storyFuture(widget.storyId));
    final profile = ref.watch(authControllerProvider).profile;

    return Scaffold(
      appBar: AppBar(title: const Text('Story')),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator(color: kPrimary)),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (story) {
          WidgetsBinding.instance.addPostFrameCallback((_) => _markRead());
          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Container(
                    decoration: duoCardDecoration(color: kWarning),
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
                          child: const Icon(Icons.menu_book_rounded, color: Color(0xFF92400E)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            story.title,
                            style: GoogleFonts.almarai(color: kForeground, fontSize: 26, fontWeight: FontWeight.w900, height: 1.1),
                          ),
                        ),
                        const SizedBox(width: 8),
                        TtsButton(text: story.content, lang: story.targetLang, size: 38),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: duoCardDecoration(),
                    child: _TappableText(
                      text: story.content,
                      fromLang: story.targetLang,
                      toLang: profile?.nativeLang ?? 'en',
                      preGlossed: {for (final v in story.vocab) v['word']!.toLowerCase(): v['gloss']!},
                      ref: ref,
                    ),
                  ),
                  if (story.vocab.isNotEmpty) ...[
                    const SizedBox(height: 18),
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: duoCardDecoration(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Key vocabulary', style: GoogleFonts.almarai(color: kMuted, fontWeight: FontWeight.w900, fontSize: 12)),
                          const SizedBox(height: 12),
                          ...story.vocab.map(
                            (v) => Container(
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: kCardFeature,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: kBorder, width: 2),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(v['word'] ?? '', style: GoogleFonts.almarai(fontWeight: FontWeight.w900, color: kForeground)),
                                  ),
                                  const SizedBox(width: 10),
                                  Flexible(
                                    child: Text(
                                      v['gloss'] ?? '',
                                      textAlign: TextAlign.right,
                                      style: GoogleFonts.almarai(fontWeight: FontWeight.w800, color: kMuted),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 18),
                  _QuizSection(
                    questions: _questions,
                    loading: _quizLoading,
                    error: _quizError,
                    answers: _answers,
                    score: _quizScore,
                    onGenerate: () => _loadQuiz(story.content),
                    onAnswer: _answer,
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _QuizSection extends StatelessWidget {
  const _QuizSection({
    required this.questions,
    required this.loading,
    required this.error,
    required this.answers,
    required this.score,
    required this.onGenerate,
    required this.onAnswer,
  });

  final List<StoryQuestion>? questions;
  final bool loading;
  final String? error;
  final Map<int, int> answers;
  final int? score;
  final VoidCallback onGenerate;
  final void Function(int qIdx, int oIdx) onAnswer;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: duoCardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(14)),
                child: const Icon(Icons.menu_book_rounded, color: kSecondary, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Test yourself', style: GoogleFonts.almarai(color: kForeground, fontSize: 18, fontWeight: FontWeight.w900)),
                    Text('Answer every question to finish the lesson.',
                        style: GoogleFonts.almarai(color: kMuted, fontSize: 12, fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (questions == null && !loading && error == null)
            FilledButton(onPressed: onGenerate, child: const Text('Generate questions')),
          if (loading)
            Text('Generating questions...', style: GoogleFonts.almarai(color: kMuted, fontWeight: FontWeight.w800)),
          if (error != null) ...[
            Text(error!, style: GoogleFonts.almarai(color: kDanger, fontWeight: FontWeight.w900, fontSize: 13)),
            const SizedBox(height: 8),
            OutlinedButton(onPressed: onGenerate, child: const Text('Retry')),
          ],
          if (questions != null && questions!.isEmpty)
            Text('No questions were generated for this story.',
                style: GoogleFonts.almarai(color: kMuted, fontWeight: FontWeight.w800)),
          if (questions != null && questions!.isNotEmpty) ...[
            for (var qIdx = 0; qIdx < questions!.length; qIdx++) ...[
              const SizedBox(height: 18),
              Text('${qIdx + 1}. ${questions![qIdx].question}',
                  style: GoogleFonts.almarai(color: kForeground, fontSize: 15, fontWeight: FontWeight.w900)),
              const SizedBox(height: 10),
              ...List.generate(questions![qIdx].options.length, (oIdx) {
                final option = questions![qIdx].options[oIdx];
                final made = answers.containsKey(qIdx);
                final chosen = answers[qIdx] == oIdx;
                final correct = oIdx == questions![qIdx].correctIndex;
                Color bg = kCard;
                Color border = kBorder;
                Color textColor = kForeground;
                if (made && correct) {
                  bg = const Color(0xFFCCFBF1);
                  border = const Color(0xFF0EA5A4);
                  textColor = const Color(0xFF0B7C7B);
                } else if (made && chosen && !correct) {
                  bg = const Color(0xFFFFE4E6);
                  border = kDanger;
                  textColor = kDangerShadow;
                } else if (made) {
                  textColor = const Color(0xFFAFAFAF);
                }
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(14),
                    onTap: made ? null : () => onAnswer(qIdx, oIdx),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: border, width: 2),
                      ),
                      child: Text(option,
                          style: GoogleFonts.almarai(color: textColor, fontSize: 14, fontWeight: FontWeight.w900)),
                    ),
                  ),
                );
              }),
              if (answers.containsKey(qIdx))
                Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(questions![qIdx].explanation,
                      style: GoogleFonts.almarai(color: kMuted, fontSize: 12, fontWeight: FontWeight.w800)),
                ),
            ],
            if (score != null) ...[
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFCCFBF1),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFF0EA5A4), width: 2),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: Color(0xFF0B7C7B), size: 36),
                    const SizedBox(height: 6),
                    Text('$score / ${questions!.length}',
                        style: GoogleFonts.almarai(color: const Color(0xFF0B7C7B), fontSize: 28, fontWeight: FontWeight.w900)),
                    Text(score == questions!.length ? 'Perfect score!' : 'Keep reading to improve!',
                        style: GoogleFonts.almarai(color: const Color(0xFF0B7C7B), fontWeight: FontWeight.w900, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }
}

class _TappableText extends StatelessWidget {
  const _TappableText({
    required this.text,
    required this.fromLang,
    required this.toLang,
    required this.preGlossed,
    required this.ref,
  });

  final String text;
  final String fromLang;
  final String toLang;
  final Map<String, String> preGlossed;
  final WidgetRef ref;

  @override
  Widget build(BuildContext context) {
    final re = RegExp(r"[\p{L}\p{M}][\p{L}\p{M}\p{N}\-']*", unicode: true);
    final children = <InlineSpan>[];
    var last = 0;

    for (final match in re.allMatches(text)) {
      if (match.start > last) {
        children.add(TextSpan(text: text.substring(last, match.start)));
      }
      final word = match.group(0)!;
      children.add(
        TextSpan(
          text: word,
          style: const TextStyle(
            decoration: TextDecoration.underline,
            decorationColor: kPrimary,
            decorationThickness: 2,
          ),
          recognizer: TapGestureRecognizer()..onTap = () => _showTranslation(context, word),
        ),
      );
      last = match.end;
    }
    if (last < text.length) children.add(TextSpan(text: text.substring(last)));

    return RichText(
      text: TextSpan(
        style: GoogleFonts.almarai(color: kForeground, fontSize: 18, fontWeight: FontWeight.w800, height: 1.6),
        children: children,
      ),
    );
  }

  void _showTranslation(BuildContext context, String word) {
    final clean = word.toLowerCase();
    final preGloss = preGlossed[clean];
    final api = ref.read(apiClientProvider);

    showModalBottomSheet<void>(
      context: context,
      builder: (_) => _TranslationSheet(
        word: word,
        preGloss: preGloss,
        load: () async {
          if (preGloss != null) return preGloss;
          try {
            final res = await api.dio.post<Map<String, dynamic>>(
              '/api/translate',
              data: {'text': word, 'from': fromLang, 'to': toLang},
            );
            return res.statusCode == 200 ? (res.data?['translation'] ?? '-').toString() : '-';
          } catch (_) {
            return '-';
          }
        },
      ),
    );
  }
}

class _TranslationSheet extends StatelessWidget {
  const _TranslationSheet({
    required this.word,
    required this.preGloss,
    required this.load,
  });

  final String word;
  final String? preGloss;
  final Future<String> Function() load;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 20, 20, 20 + MediaQuery.of(context).padding.bottom),
      child: FutureBuilder<String>(
        future: load(),
        initialData: preGloss,
        builder: (context, snapshot) {
          final loading = !snapshot.hasData;
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(word, style: GoogleFonts.almarai(color: kForeground, fontSize: 24, fontWeight: FontWeight.w900)),
              const SizedBox(height: 10),
              if (loading)
                const Row(
                  children: [
                    SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: kPrimary, strokeWidth: 2)),
                    SizedBox(width: 10),
                    Text('Translating...'),
                  ],
                )
              else
                Text(
                  snapshot.data ?? '-',
                  style: GoogleFonts.almarai(color: kSecondary, fontSize: 18, fontWeight: FontWeight.w900),
                ),
            ],
          );
        },
      ),
    );
  }
}


