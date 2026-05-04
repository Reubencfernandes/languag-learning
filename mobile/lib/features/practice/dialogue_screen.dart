import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

// ── Data types ────────────────────────────────────────────────────────────────

class DialogueOption {
  DialogueOption(
      {required this.text,
      required this.isCorrect,
      required this.feedback});
  final String text;
  final bool isCorrect;
  final String feedback;

  factory DialogueOption.fromJson(Map<String, dynamic> j) => DialogueOption(
        text: (j['text'] ?? '') as String,
        isCorrect: (j['isCorrect'] ?? false) as bool,
        feedback: (j['feedback'] ?? '') as String,
      );
}

class DialogueTurn {
  DialogueTurn({
    required this.type,
    required this.text,
    this.translation,
    this.speakerName,
    this.options,
  });
  final String type; // 'narration' | 'character' | 'user_choice'
  final String text;
  final String? translation;
  final String? speakerName;
  final List<DialogueOption>? options;

  factory DialogueTurn.fromJson(Map<String, dynamic> j) => DialogueTurn(
        type: (j['type'] ?? 'narration') as String,
        text: (j['text'] ?? '') as String,
        translation: j['translation'] as String?,
        speakerName: j['speakerName'] as String?,
        options: j['options'] is List
            ? (j['options'] as List)
                .map((o) =>
                    DialogueOption.fromJson(o as Map<String, dynamic>))
                .toList()
            : null,
      );
}

class DialogueFull {
  DialogueFull({
    required this.id,
    required this.title,
    required this.scenario,
    required this.level,
    required this.turns,
  });
  final String id;
  final String title;
  final String scenario;
  final String level;
  final List<DialogueTurn> turns;

  factory DialogueFull.fromJson(Map<String, dynamic> j) => DialogueFull(
        id: (j['id'] ?? '') as String,
        title: (j['title'] ?? '') as String,
        scenario: (j['scenario'] ?? '') as String,
        level: (j['level'] ?? '') as String,
        turns: ((j['turns'] as List?) ?? [])
            .map((t) => DialogueTurn.fromJson(t as Map<String, dynamic>))
            .toList(),
      );
}

// ── Provider ──────────────────────────────────────────────────────────────────

final _dialogueProvider =
    FutureProvider.autoDispose.family<DialogueFull, String>((ref, id) async {
  final api = ref.watch(apiClientProvider);
  final res =
      await api.dio.get<Map<String, dynamic>>('/api/dialogues/$id');
  return DialogueFull.fromJson(res.data!);
});

// ── Screen ────────────────────────────────────────────────────────────────────

class DialogueScreen extends ConsumerWidget {
  const DialogueScreen({super.key, required this.dialogueId});
  final String dialogueId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(_dialogueProvider(dialogueId));
    return async.when(
      loading: () => const Scaffold(
          backgroundColor: kBackground,
          body: Center(child: CircularProgressIndicator())),
      error: (e, _) => Scaffold(
          backgroundColor: kBackground,
          body: Center(child: Text('Error: $e'))),
      data: (dialogue) => _DialogueView(dialogue: dialogue),
    );
  }
}

// ── Interactive dialogue view ─────────────────────────────────────────────────

class _DialogueView extends StatefulWidget {
  const _DialogueView({required this.dialogue});
  final DialogueFull dialogue;

  @override
  State<_DialogueView> createState() => _DialogueViewState();
}

class _DialogueViewState extends State<_DialogueView> {
  bool _started = false;
  int _turnIndex = 0;
  int _score = 0;
  final Map<int, int> _chosen = {};
  final Map<int, bool> _showTranslation = {};
  bool _completed = false;

  List<DialogueTurn> get _turns => widget.dialogue.turns;
  int get _totalChoices =>
      _turns.where((t) => t.type == 'user_choice').length;

  void _advance() {
    if (_turnIndex + 1 >= _turns.length) {
      setState(() => _completed = true);
    } else {
      setState(() => _turnIndex++);
    }
  }

  void _handleChoice(int turnIdx, int optIdx) {
    if (_chosen.containsKey(turnIdx)) return;
    final correct = _turns[turnIdx].options![optIdx].isCorrect;
    setState(() {
      _chosen[turnIdx] = optIdx;
      if (correct) _score++;
    });
    Future.delayed(const Duration(milliseconds: 1500), _advance);
  }

  void _restart() {
    setState(() {
      _started = false;
      _turnIndex = 0;
      _score = 0;
      _chosen.clear();
      _showTranslation.clear();
      _completed = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: Text(widget.dialogue.title,
            style: GoogleFonts.almarai(fontSize: 16, fontWeight: FontWeight.w600)),
        leading: BackButton(
            onPressed: () => Navigator.of(context).maybePop(),
            color: kMuted),
      ),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          child: !_started
              ? _buildStart(context)
              : _completed
                  ? _buildCompletion(context)
                  : _buildConversation(),
        ),
      ),
    );
  }

  Widget _buildStart(BuildContext context) {
    return Padding(
      key: const ValueKey('start'),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: kCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: kBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Scenario',
                    style: GoogleFonts.almarai(
                        color: kMuted, fontSize: 11, letterSpacing: 1.5)),
                const SizedBox(height: 8),
                Text(widget.dialogue.scenario,
                    style: GoogleFonts.almarai(
                        color: kForeground, fontSize: 15, height: 1.5)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _Chip('${_turns.length} turns'),
              const SizedBox(width: 8),
              _Chip('$_totalChoices choices'),
              const SizedBox(width: 8),
              _Chip(widget.dialogue.level),
            ],
          ),
          const Spacer(),
          FilledButton.icon(
            onPressed: () => setState(() => _started = true),
            icon: const Icon(Icons.play_arrow),
            label: const Text('Start dialogue'),
          ),
        ],
      ),
    );
  }

  Widget _buildCompletion(BuildContext context) {
    final pct = _totalChoices > 0
        ? (_score / _totalChoices * 100).round()
        : 100;
    return Padding(
      key: const ValueKey('done'),
      padding: const EdgeInsets.all(28),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.emoji_events, color: kPrimary, size: 52),
          const SizedBox(height: 16),
          Text('$pct%',
              style: GoogleFonts.almarai(
                  color: kForeground, fontSize: 48, fontWeight: FontWeight.w700)),
          Text('$_score of $_totalChoices correct',
              style: GoogleFonts.almarai(color: kMuted, fontSize: 14)),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: _restart,
            icon: const Icon(Icons.refresh),
            label: const Text('Try again'),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () => Navigator.of(context).maybePop(),
            child: const Text('More dialogues'),
          ),
        ],
      ),
    );
  }

  Widget _buildConversation() {
    final progress = (_turnIndex + 1) / _turns.length;
    return Column(
      key: const ValueKey('chat'),
      children: [
        // Progress bar
        LinearProgressIndicator(
          value: progress,
          backgroundColor: kBorder,
          color: kPrimary,
          minHeight: 3,
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _turnIndex + 1,
            itemBuilder: (ctx, idx) {
              final turn = _turns[idx];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _buildTurn(idx, turn),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTurn(int idx, DialogueTurn turn) {
    if (turn.type == 'narration') {
      return Text(
        turn.text,
        style: GoogleFonts.almarai(
            color: kMuted, fontSize: 13, fontStyle: FontStyle.italic),
      );
    }

    if (turn.type == 'character') {
      return Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: kCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: kBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (turn.speakerName != null) ...[
              Text(turn.speakerName!.toUpperCase(),
                  style: GoogleFonts.almarai(
                      color: kMuted, fontSize: 10, letterSpacing: 1.5)),
              const SizedBox(height: 6),
            ],
            Text(turn.text,
                style: GoogleFonts.almarai(color: kForeground, fontSize: 15)),
            if (turn.translation != null) ...[
              const SizedBox(height: 8),
              GestureDetector(
                onTap: () => setState(
                    () => _showTranslation[idx] = !(_showTranslation[idx] ?? false)),
                child: Text(
                  (_showTranslation[idx] ?? false)
                      ? turn.translation!
                      : 'Show translation',
                  style: GoogleFonts.almarai(
                      color: kPrimary.withAlpha(180), fontSize: 12),
                ),
              ),
            ],
            if (idx == _turnIndex && !_chosen.containsKey(idx)) ...[
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: _advance,
                  child: Text('Continue →',
                      style: GoogleFonts.almarai(
                          color: kPrimary, fontSize: 13)),
                ),
              ),
            ],
          ],
        ),
      );
    }

    if (turn.type == 'user_choice') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            turn.text.isNotEmpty ? turn.text : 'What do you say?',
            style: GoogleFonts.almarai(
                color: kMuted, fontSize: 11, letterSpacing: 1.5),
          ),
          const SizedBox(height: 8),
          ...List.generate(turn.options?.length ?? 0, (oi) {
            final opt = turn.options![oi];
            final made = _chosen[idx];
            final isChosen = made == oi;
            final isCorrect = opt.isCorrect;

            Color borderColor = kBorder;
            Color bg = kCard;
            Color textColor = kForeground;

            if (made != null) {
              if (isCorrect) {
                borderColor = Colors.green.withAlpha(128);
                bg = Colors.green.withAlpha(20);
                textColor = Colors.greenAccent;
              } else if (isChosen) {
                borderColor = Colors.redAccent.withAlpha(128);
                bg = Colors.redAccent.withAlpha(20);
                textColor = Colors.redAccent;
              } else {
                textColor = kMuted.withAlpha(100);
              }
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: made == null ? () => _handleChoice(idx, oi) : null,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: bg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(opt.text,
                            style: GoogleFonts.almarai(
                                color: textColor, fontSize: 14)),
                      ),
                      if (made != null && isChosen)
                        Padding(
                          padding: const EdgeInsets.only(left: 8),
                          child: Text(opt.feedback,
                              style: GoogleFonts.almarai(
                                  color: textColor.withAlpha(160),
                                  fontSize: 11)),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      );
    }

    return const SizedBox.shrink();
  }
}

class _Chip extends StatelessWidget {
  const _Chip(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: kBorder),
      ),
      child: Text(label,
          style: GoogleFonts.almarai(color: kMuted, fontSize: 11)),
    );
  }
}
