import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

final _storiesProvider = FutureProvider.autoDispose<List<StorySummary>>((ref) async {
  final api = ref.watch(apiClientProvider);
  final res = await api.dio.get<List<dynamic>>('/api/stories');
  final list = res.data ?? [];
  return list.map((e) => StorySummary.fromJson(e as Map<String, dynamic>)).toList();
});

class StorySummary {
  StorySummary({required this.id, required this.title, this.read = false});
  final String id;
  final String title;
  final bool read;

  factory StorySummary.fromJson(Map<String, dynamic> j) => StorySummary(
        id: (j['id'] ?? '') as String,
        title: (j['title'] ?? '') as String,
      );
}

class StoriesListScreen extends ConsumerWidget {
  const StoriesListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Stories')),
      body: const StoriesTabContent(),
    );
  }
}

class StoriesTabContent extends ConsumerWidget {
  const StoriesTabContent({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(_storiesProvider);

    return async.when(
      loading: () => const Center(child: CircularProgressIndicator(color: kPrimary)),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (stories) => RefreshIndicator(
        color: kPrimary,
        onRefresh: () => ref.refresh(_storiesProvider.future),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 760),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _GenerateStoryButton(onCreated: (id) {
                  ref.invalidate(_storiesProvider);
                  context.push('/practice/$id');
                }),
                const SizedBox(height: 18),
                if (stories.isEmpty)
                  const _EmptyStories()
                else
                  ...stories.map((story) => _StoryCard(story: story, onTap: () => context.push('/practice/${story.id}'))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StoryCard extends StatelessWidget {
  const _StoryCard({required this.story, required this.onTap});
  final StorySummary story;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: duoCardDecoration(),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.menu_book_rounded, color: Color(0xFF92400E)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  story.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900, fontSize: 16),
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: kMuted),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyStories extends StatelessWidget {
  const _EmptyStories();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: duoCardDecoration(),
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(18)),
            child: const Icon(Icons.menu_book_rounded, color: Color(0xFF92400E), size: 30),
          ),
          const SizedBox(height: 14),
          Text('No stories yet', style: GoogleFonts.almarai(color: kForeground, fontWeight: FontWeight.w900, fontSize: 18)),
          const SizedBox(height: 4),
          Text(
            'Generate a bite-size reading lesson.',
            textAlign: TextAlign.center,
            style: GoogleFonts.almarai(color: kMuted, fontWeight: FontWeight.w800, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _GenerateStoryButton extends ConsumerStatefulWidget {
  const _GenerateStoryButton({required this.onCreated});
  final void Function(String id) onCreated;

  @override
  ConsumerState<_GenerateStoryButton> createState() => _GenerateStoryButtonState();
}

class _GenerateStoryButtonState extends ConsumerState<_GenerateStoryButton> {
  bool _loading = false;

  Future<void> _generate(BuildContext context) async {
    final ctrl = TextEditingController();
    final topic = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New story'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(labelText: 'Topic', hintText: 'A rainy day'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, ctrl.text.trim()), child: const Text('Generate')),
        ],
      ),
    );
    ctrl.dispose();
    if (topic == null) return;
    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<Map<String, dynamic>>(
        '/api/stories',
        data: {if (topic.isNotEmpty) 'topic': topic},
      );
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data?['story'] != null) {
        final id = (res.data!['story'] as Map<String, dynamic>)['id'] as String;
        widget.onCreated(id);
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton.icon(
        onPressed: _loading ? null : () => _generate(context),
        icon: const Icon(Icons.auto_awesome_rounded),
        label: Text(_loading ? 'Generating...' : 'New story'),
      ),
    );
  }
}


