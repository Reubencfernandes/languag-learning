import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../theme/app_theme.dart';

class DialogueOption {
  DialogueOption({required this.text, required this.isCorrect, required this.feedback});
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

  final String type;
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
            ? (j['options'] as List).map((o) => DialogueOption.fromJson(o as Map<String, dynamic>)).toList()
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
        turns: ((j['turns'] as List?) ?? []).map((t) => DialogueTurn.fromJson(t as Map<String, dynamic>)).toList(),
      );
}

class DialogueScreen extends StatelessWidget {
  const DialogueScreen({super.key, required this.dialogueId});
  final String dialogueId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dialogue')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: duoCardDecoration(),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Dialogue no longer available',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                Text(
                  'Generated dialogues are temporary and are not stored after you leave the practice screen.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35),
                ),
                const SizedBox(height: 18),
                OutlinedButton(onPressed: () => Navigator.of(context).maybePop(), child: const Text('Back')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class DialogueLessonView extends StatefulWidget {
  const DialogueLessonView({super.key, required this.dialogue, this.onMoreDialogues});
  final DialogueFull dialogue;
  final VoidCallback? onMoreDialogues;

  @override
  State<DialogueLessonView> createState() => _DialogueLessonViewState();
}

class _DialogueLessonViewState extends State<DialogueLessonView> {
  bool _started = false;
  int _turnIndex = 0;
  int _score = 0;
  final Map<int, int> _chosen = {};
  final Map<int, bool> _showTranslation = {};
  bool _completed = false;

  List<DialogueTurn> get _turns => widget.dialogue.turns;
  int get _totalChoices => _turns.where((turn) => turn.type == 'user_choice').length;

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
    Future.delayed(const Duration(milliseconds: 1200), _advance);
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
    return SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: !_started
                ? _buildStart()
                : _completed
                    ? _buildCompletion()
                    : _buildConversation(),
          ),
        ),
      ),
    );
  }

  Widget _buildStart() {
    return ListView(
      key: const ValueKey('start'),
      padding: const EdgeInsets.all(20),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: duoCardDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Eyebrow('SCENARIO', color: kSecondary),
              const SizedBox(height: 8),
              Text(
                widget.dialogue.scenario,
                style: GoogleFonts.nunito(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900, height: 1.35),
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _Chip('${_turns.length} turns'),
                  _Chip('$_totalChoices choices'),
                  _Chip(widget.dialogue.level),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        FilledButton.icon(
          onPressed: () => setState(() => _started = true),
          icon: const Icon(Icons.play_arrow_rounded),
          label: const Text('Start dialogue'),
        ),
      ],
    );
  }

  Widget _buildCompletion() {
    final pct = _totalChoices > 0 ? (_score / _totalChoices * 100).round() : 100;
    return ListView(
      key: const ValueKey('done'),
      padding: const EdgeInsets.all(24),
      children: [
        Container(
          padding: const EdgeInsets.all(28),
          decoration: duoCardDecoration(),
          child: Column(
            children: [
              Container(
                width: 78,
                height: 78,
                decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(24)),
                child: const Icon(Icons.emoji_events_rounded, color: Color(0xFF92400E), size: 44),
              ),
              const SizedBox(height: 18),
              Text('$pct%', style: GoogleFonts.nunito(color: kPrimary, fontSize: 48, fontWeight: FontWeight.w900)),
              Text('$_score of $_totalChoices correct', style: GoogleFonts.nunito(color: kMuted, fontWeight: FontWeight.w900)),
              const SizedBox(height: 24),
              FilledButton.icon(onPressed: _restart, icon: const Icon(Icons.refresh_rounded), label: const Text('Try again')),
              const SizedBox(height: 12),
              OutlinedButton(onPressed: widget.onMoreDialogues ?? () => Navigator.of(context).maybePop(), child: const Text('More dialogues')),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildConversation() {
    final progress = (_turnIndex + 1) / _turns.length;
    return Column(
      key: const ValueKey('chat'),
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: duoCardDecoration(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(99),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 12,
                    backgroundColor: kBorder,
                    color: kPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                _Eyebrow('STEP ${_turnIndex + 1} OF ${_turns.length}'),
              ],
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _turnIndex + 1,
            itemBuilder: (context, idx) {
              final turn = _turns[idx];
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
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
      final isCurrent = idx == _turnIndex;
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: duoCardDecoration(color: kCardFeature),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              turn.text,
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(color: kMuted, fontSize: 14, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
            ),
            if (isCurrent) ...[
              const SizedBox(height: 12),
              FilledButton(onPressed: _advance, child: const Text('Continue')),
            ],
          ],
        ),
      );
    }

    if (turn.type == 'character') {
      final isCurrent = idx == _turnIndex;
      final initial = (turn.speakerName?.isNotEmpty ?? false) ? turn.speakerName![0].toUpperCase() : '?';
      return Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: const Color(0xFFEDE9FE),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: kBorder, width: 2),
            ),
            child: Center(
              child: Text(initial, style: GoogleFonts.nunito(color: kSecondary, fontWeight: FontWeight.w900, fontSize: 22)),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: duoCardDecoration(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (turn.speakerName != null) _Eyebrow(turn.speakerName!.toUpperCase(), color: kSecondary),
                  if (turn.speakerName != null) const SizedBox(height: 8),
                  Text(turn.text, style: GoogleFonts.nunito(color: kForeground, fontSize: 17, fontWeight: FontWeight.w900, height: 1.35)),
                  if (turn.translation != null) ...[
                    const SizedBox(height: 12),
                    InkWell(
                      onTap: () => setState(() => _showTranslation[idx] = !(_showTranslation[idx] ?? false)),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon((_showTranslation[idx] ?? false) ? Icons.visibility_off : Icons.visibility, color: kSecondary, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            (_showTranslation[idx] ?? false) ? turn.translation! : 'Show translation',
                            style: GoogleFonts.nunito(color: kSecondary, fontWeight: FontWeight.w900, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ],
                  if (isCurrent && !_chosen.containsKey(idx)) ...[
                    const SizedBox(height: 14),
                    FilledButton(onPressed: _advance, child: const Text('Continue')),
                  ],
                ],
              ),
            ),
          ),
        ],
      );
    }

    if (turn.type == 'user_choice') {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: duoCardDecoration(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              turn.text.isNotEmpty ? turn.text : 'What do you say?',
              style: GoogleFonts.nunito(color: kForeground, fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 12),
            ...List.generate(turn.options?.length ?? 0, (optionIndex) {
              final option = turn.options![optionIndex];
              final made = _chosen[idx];
              final isChosen = made == optionIndex;
              final isCorrect = option.isCorrect;
              Color borderColor = kBorder;
              Color bg = kCard;
              Color textColor = kForeground;

              if (made != null) {
                if (isCorrect) {
                  borderColor = kPrimary;
                  bg = const Color(0xFFCCFBF1);
                  textColor = kPrimaryShadow;
                } else if (isChosen) {
                  borderColor = kDanger;
                  bg = const Color(0xFFFFE4E6);
                  textColor = kDangerShadow;
                } else {
                  textColor = const Color(0xFFAFAFAF);
                }
              }

              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: made == null ? () => _handleChoice(idx, optionIndex) : null,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: bg,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: borderColor, width: 2),
                      boxShadow: const [BoxShadow(color: kBorder, offset: Offset(0, 4), blurRadius: 0)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(option.text, style: GoogleFonts.nunito(color: textColor, fontSize: 15, fontWeight: FontWeight.w900)),
                        if (made != null && isChosen && option.feedback.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Text(option.feedback, style: GoogleFonts.nunito(color: textColor, fontSize: 12, fontWeight: FontWeight.w900)),
                        ],
                      ],
                    ),
                  ),
                ),
              );
            }),
          ],
        ),
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: kBorder, width: 2),
      ),
      child: Text(label, style: GoogleFonts.nunito(color: kMuted, fontSize: 12, fontWeight: FontWeight.w900)),
    );
  }
}

class _Eyebrow extends StatelessWidget {
  const _Eyebrow(this.text, {this.color = kMuted});
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.nunito(color: color, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0),
    );
  }
}


