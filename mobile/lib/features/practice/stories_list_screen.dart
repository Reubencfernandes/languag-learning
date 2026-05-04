import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

final _storiesProvider =
    FutureProvider.autoDispose<List<StorySummary>>((ref) async {
  final api = ref.watch(apiClientProvider);
  final res = await api.dio.get<List<dynamic>>('/api/stories');
  final list = res.data ?? [];
  return list
      .map((e) => StorySummary.fromJson(e as Map<String, dynamic>))
      .toList();
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

/// Standalone screen kept for backward compat — delegates to StoriesTabContent
class StoriesListScreen extends ConsumerWidget {
  const StoriesListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(title: const Text('Stories')),
      body: const StoriesTabContent(),
    );
  }
}

/// Tab widget embedded inside DialoguesListScreen
class StoriesTabContent extends ConsumerWidget {
  const StoriesTabContent({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(_storiesProvider);

    return async.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (stories) => RefreshIndicator(
        onRefresh: () => ref.refresh(_storiesProvider.future),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _GenerateStoryButton(onCreated: (id) {
              ref.invalidate(_storiesProvider);
              context.push('/practice/$id');
            }),
            const SizedBox(height: 16),
            if (stories.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 40),
                  child: Text(
                    'No stories yet.\nTap "New story" to get started.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.almarai(color: kMuted, height: 1.5),
                  ),
                ),
              )
            else
              ...stories.map(
                (s) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GestureDetector(
                    onTap: () => context.push('/practice/${s.id}'),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: kCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: kBorder),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(s.title,
                                style: GoogleFonts.almarai(
                                    color: kForeground,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 15)),
                          ),
                          const Icon(Icons.chevron_right, color: kMuted, size: 18),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _GenerateStoryButton extends ConsumerStatefulWidget {
  const _GenerateStoryButton({required this.onCreated});
  final void Function(String id) onCreated;

  @override
  ConsumerState<_GenerateStoryButton> createState() =>
      _GenerateStoryButtonState();
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
          decoration: const InputDecoration(
              labelText: 'Topic (optional)', hintText: 'e.g. a rainy day'),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          FilledButton(
              onPressed: () => Navigator.pop(ctx, ctrl.text.trim()),
              child: const Text('Generate')),
        ],
      ),
    );
    if (topic == null) return;
    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<Map<String, dynamic>>('/api/stories',
          data: {if (topic.isNotEmpty) 'topic': topic});
      if ((res.statusCode == 200 || res.statusCode == 201) &&
          res.data?['story'] != null) {
        final id = (res.data!['story'] as Map<String, dynamic>)['id'] as String;
        widget.onCreated(id);
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FilledButton.icon(
      onPressed: _loading ? null : () => _generate(context),
      icon: const Icon(Icons.auto_awesome, size: 18),
      label: Text(_loading ? 'Generating…' : 'New story'),
    );
  }
}
