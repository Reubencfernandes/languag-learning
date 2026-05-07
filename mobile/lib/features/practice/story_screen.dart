import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

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

class StoryScreen extends ConsumerWidget {
  const StoryScreen({super.key, required this.storyId});
  final String storyId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(storyFuture(storyId));
    final profile = ref.watch(authControllerProvider).profile;

    return Scaffold(
      appBar: AppBar(title: const Text('Story')),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator(color: kPrimary)),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (story) => Center(
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
                          style: GoogleFonts.nunito(color: kForeground, fontSize: 26, fontWeight: FontWeight.w900, height: 1.1),
                        ),
                      ),
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
                        Text('Key vocabulary', style: GoogleFonts.nunito(color: kMuted, fontWeight: FontWeight.w900, fontSize: 12)),
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
                                  child: Text(v['word'] ?? '', style: GoogleFonts.nunito(fontWeight: FontWeight.w900, color: kForeground)),
                                ),
                                const SizedBox(width: 10),
                                Flexible(
                                  child: Text(
                                    v['gloss'] ?? '',
                                    textAlign: TextAlign.right,
                                    style: GoogleFonts.nunito(fontWeight: FontWeight.w800, color: kMuted),
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
              ],
            ),
          ),
        ),
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
        style: GoogleFonts.nunito(color: kForeground, fontSize: 18, fontWeight: FontWeight.w800, height: 1.6),
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
              Text(word, style: GoogleFonts.nunito(color: kForeground, fontSize: 24, fontWeight: FontWeight.w900)),
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
                  style: GoogleFonts.nunito(color: kSecondary, fontSize: 18, fontWeight: FontWeight.w900),
                ),
            ],
          );
        },
      ),
    );
  }
}


