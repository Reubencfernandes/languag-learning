import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../core/languages.dart';
import '../../theme/app_theme.dart';
import 'stories_list_screen.dart';

final _dialoguesProvider =
    FutureProvider.autoDispose<List<DialogueSummary>>((ref) async {
  final api = ref.watch(apiClientProvider);
  final res = await api.dio.get<List<dynamic>>('/api/dialogues');
  final list = res.data ?? [];
  return list
      .map((e) => DialogueSummary.fromJson(e as Map<String, dynamic>))
      .toList();
});

class DialogueSummary {
  DialogueSummary(
      {required this.id, required this.title, required this.scenario});
  final String id;
  final String title;
  final String scenario;
  factory DialogueSummary.fromJson(Map<String, dynamic> j) => DialogueSummary(
        id: j['id'] as String,
        title: j['title'] as String,
        scenario: (j['scenario'] ?? '') as String,
      );
}

class DialoguesListScreen extends ConsumerStatefulWidget {
  const DialoguesListScreen({super.key});
  @override
  ConsumerState<DialoguesListScreen> createState() =>
      _DialoguesListScreenState();
}

class _DialoguesListScreenState extends ConsumerState<DialoguesListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(authControllerProvider).profile;

    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text(
            profile == null ? 'Practice' : '${languageName(profile.targetLang)} · ${profile.level}'),
        bottom: TabBar(
          controller: _tabs,
          indicatorColor: kPrimary,
          labelColor: kPrimary,
          unselectedLabelColor: kMuted,
          labelStyle: GoogleFonts.almarai(fontWeight: FontWeight.w600),
          tabs: const [
            Tab(text: 'Dialogues'),
            Tab(text: 'Stories'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: const [
          _DialoguesTab(),
          StoriesTabContent(),
        ],
      ),
    );
  }
}

class _DialoguesTab extends ConsumerWidget {
  const _DialoguesTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(_dialoguesProvider);

    return async.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
      data: (dialogues) {
        return RefreshIndicator(
          onRefresh: () => ref.refresh(_dialoguesProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _GenerateDialogueButton(onCreated: (id) {
                ref.invalidate(_dialoguesProvider);
                context.push('/dialogue/$id');
              }),
              const SizedBox(height: 16),
              if (dialogues.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 40),
                    child: Text(
                      'No dialogues yet.\nTap "New dialogue" to get started.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.almarai(color: kMuted, height: 1.5),
                    ),
                  ),
                )
              else
                ...dialogues.map(
                  (d) => _DialogueCard(
                    dialogue: d,
                    onTap: () => context.push('/dialogue/${d.id}'),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _DialogueCard extends StatelessWidget {
  const _DialogueCard({required this.dialogue, required this.onTap});
  final DialogueSummary dialogue;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: kCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: kBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(dialogue.title,
                  style: GoogleFonts.almarai(
                      color: kForeground,
                      fontWeight: FontWeight.w600,
                      fontSize: 16)),
              const SizedBox(height: 6),
              Text(
                dialogue.scenario,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.almarai(color: kMuted, fontSize: 13),
              ),
              const SizedBox(height: 12),
              Text('Start →',
                  style: GoogleFonts.almarai(
                      color: kPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
            ],
          ),
        ),
      ),
    );
  }
}

class _GenerateDialogueButton extends ConsumerStatefulWidget {
  const _GenerateDialogueButton({required this.onCreated});
  final void Function(String id) onCreated;

  @override
  ConsumerState<_GenerateDialogueButton> createState() =>
      _GenerateDialogueButtonState();
}

class _GenerateDialogueButtonState
    extends ConsumerState<_GenerateDialogueButton> {
  bool _loading = false;

  Future<void> _generate(BuildContext context) async {
    final ctrl = TextEditingController();
    final scenario = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New dialogue'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(
              labelText: 'Scenario (optional)',
              hintText: 'e.g. at the airport'),
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
    if (scenario == null) return;
    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<Map<String, dynamic>>('/api/dialogues',
          data: {if (scenario.isNotEmpty) 'scenario': scenario});
      if (res.statusCode == 201 && res.data != null) {
        widget.onCreated(res.data!['id'] as String);
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
      icon: const Icon(Icons.add, size: 18),
      label: Text(_loading ? 'Generating…' : 'New dialogue'),
    );
  }
}
