import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';

class _StoryData {
  _StoryData({required this.title, required this.content, required this.targetLang, required this.vocab});
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
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (s) => ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(s.title, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w600)),
            const SizedBox(height: 18),
            _TappableText(
              text: s.content,
              fromLang: s.targetLang,
              toLang: profile?.nativeLang ?? 'en',
              preGlossed: {for (final v in s.vocab) v['word']!.toLowerCase(): v['gloss']!},
              ref: ref,
            ),
            if (s.vocab.isNotEmpty) ...[
              const SizedBox(height: 32),
              const Text('KEY VOCABULARY',
                  style: TextStyle(fontSize: 12, letterSpacing: 1.5, color: Color(0xFF71717A))),
              const SizedBox(height: 8),
              ...s.vocab.map((v) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: RichText(
                      text: TextSpan(style: DefaultTextStyle.of(context).style, children: [
                        TextSpan(text: '${v['word']}  ', style: const TextStyle(fontWeight: FontWeight.w600)),
                        TextSpan(text: v['gloss'] ?? '', style: const TextStyle(color: Color(0xFF71717A))),
                      ]),
                    ),
                  )),
            ],
          ],
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
    for (final m in re.allMatches(text)) {
      if (m.start > last) {
        children.add(TextSpan(text: text.substring(last, m.start)));
      }
      final word = m.group(0)!;
      children.add(
        TextSpan(
          text: word,
          style: const TextStyle(decoration: TextDecoration.underline, decorationStyle: TextDecorationStyle.dotted),
          recognizer: TapGestureRecognizer()..onTap = () => _showTranslation(context, word),
        ),
      );
      last = m.end;
    }
    if (last < text.length) children.add(TextSpan(text: text.substring(last)));

    return RichText(
      text: TextSpan(style: const TextStyle(fontSize: 18, height: 1.55, color: Color(0xFF0A0A0A)), children: children),
    );
  }

  Future<void> _showTranslation(BuildContext context, String word) async {
    final clean = word.toLowerCase();
    String? translation = preGlossed[clean];
    final api = ref.read(apiClientProvider);

    showModalBottomSheet<void>(
      context: context,
      builder: (ctx) => StatefulBuilder(builder: (ctx, set) {
        if (translation == null) {
          () async {
            try {
              final res = await api.dio.post<Map<String, dynamic>>(
                '/api/translate',
                data: {'text': word, 'from': fromLang, 'to': toLang},
              );
              final v = res.statusCode == 200
                  ? (res.data?['translation'] ?? '—').toString()
                  : '—';
              set(() => translation = v);
            } catch (_) {
              set(() => translation = '—');
            }
          }();
        }
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(word, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            translation == null
                ? const Row(children: [
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                    SizedBox(width: 10),
                    Text('Translating…'),
                  ])
                : Text(translation!, style: const TextStyle(fontSize: 16, color: Color(0xFF52525B))),
          ]),
        );
      }),
    );
  }
}

