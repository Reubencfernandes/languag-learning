import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

const _phraseFill = Color(0xFFE8F7F6);
const _warningFill = Color(0xFFFEF3C7);
const _examples = ['to find', 'I would like...', 'appointment', 'Can you help me?', 'because'];

String _value(Map<String, dynamic> json, String key) => (json[key] ?? '').toString();

class PhraseSentence {
  PhraseSentence({required this.target, required this.translation, required this.note});
  final String target;
  final String translation;
  final String note;

  factory PhraseSentence.fromJson(Map<String, dynamic> json) => PhraseSentence(
        target: _value(json, 'target'),
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

class PhraseAnalysis {
  PhraseAnalysis({
    required this.input,
    required this.translation,
    required this.partOfSpeech,
    required this.verbInfo,
    required this.breakdown,
    required this.sentences,
    required this.tips,
  });

  final String input;
  final String translation;
  final String partOfSpeech;
  final String verbInfo;
  final List<PhraseBreakdown> breakdown;
  final List<PhraseSentence> sentences;
  final List<String> tips;

  factory PhraseAnalysis.fromJson(Map<String, dynamic> json) => PhraseAnalysis(
        input: _value(json, 'input'),
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
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<Map<String, dynamic>>('/api/phrases', data: {'text': phrase});
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
                  onAnalyze: () => _analyze(),
                  onExample: _analyze,
                ),
                const SizedBox(height: 30),
                if (_analysis == null) const _EmptyState() else _PhraseResult(analysis: _analysis!),
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
    required this.onAnalyze,
    required this.onExample,
  });

  final TextEditingController controller;
  final bool loading;
  final String? error;
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
  const _EmptyState();

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
            decoration: BoxDecoration(color: const Color(0xFFEDE9FE), borderRadius: BorderRadius.circular(20)),
            child: const Icon(Icons.edit_note_rounded, color: kSecondary, size: 34),
          ),
          const SizedBox(height: 16),
          Text(
            'Enter a phrase to build a mini lesson',
            textAlign: TextAlign.center,
            style: GoogleFonts.almarai(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 6),
          Text(
            'You will get example sentences, practical tips, and verb notes when they matter.',
            textAlign: TextAlign.center,
            style: GoogleFonts.almarai(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35),
          ),
        ],
      ),
    );
  }
}

class _PhraseResult extends StatelessWidget {
  const _PhraseResult({required this.analysis});
  final PhraseAnalysis analysis;

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
              Text(
                analysis.partOfSpeech,
                style: GoogleFonts.almarai(color: kPrimary, fontSize: 13, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 8),
              Text(
                analysis.input,
                style: GoogleFonts.almarai(color: kForeground, fontSize: 30, fontWeight: FontWeight.w900, height: 1.05),
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
        ...analysis.sentences.map((sentence) => _SentenceCard(sentence: sentence)),
        const SizedBox(height: 28),
        _ResponsiveResultGrid(analysis: analysis),
      ],
    );
  }
}

class _SentenceCard extends StatelessWidget {
  const _SentenceCard({required this.sentence});
  final PhraseSentence sentence;

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
            Text(sentence.target, style: GoogleFonts.almarai(color: kForeground, fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 6),
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
