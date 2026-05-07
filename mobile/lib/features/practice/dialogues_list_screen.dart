import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../core/languages.dart';
import '../../theme/app_theme.dart';
import 'dialogue_screen.dart';

const _scenarioFill = Color(0xFFE8F7F6);

class _Scenario {
  const _Scenario({
    required this.title,
    required this.prompt,
    required this.description,
    required this.icon,
  });

  final String title;
  final String prompt;
  final String description;
  final IconData icon;
}

const _scenarios = [
  _Scenario(
    title: 'Airport Check-In',
    prompt: 'checking in at an airport counter, asking about baggage, seat choice, and boarding time',
    description: 'Baggage, seats, gates, and polite travel questions.',
    icon: Icons.flight_takeoff_rounded,
  ),
  _Scenario(
    title: 'Cafe Order',
    prompt: 'ordering coffee and food at a busy cafe, asking about ingredients and paying',
    description: 'Order naturally, ask follow-ups, and respond to staff.',
    icon: Icons.local_cafe_rounded,
  ),
  _Scenario(
    title: 'Doctor Visit',
    prompt: 'visiting a doctor, explaining symptoms, answering questions, and understanding advice',
    description: 'Describe how you feel and understand care instructions.',
    icon: Icons.medical_services_rounded,
  ),
  _Scenario(
    title: 'Hotel Reception',
    prompt: 'checking into a hotel, confirming a reservation, asking about breakfast and room problems',
    description: 'Reservations, requests, timings, and service issues.',
    icon: Icons.apartment_rounded,
  ),
  _Scenario(
    title: 'Job Interview',
    prompt: 'a job interview with questions about experience, strengths, schedule, and salary expectations',
    description: 'Professional answers with realistic follow-up questions.',
    icon: Icons.business_center_rounded,
  ),
  _Scenario(
    title: 'Apartment Viewing',
    prompt: 'viewing an apartment, asking about rent, utilities, neighborhood, and lease terms',
    description: 'Housing vocabulary and negotiation practice.',
    icon: Icons.home_work_rounded,
  ),
  _Scenario(
    title: 'Pharmacy',
    prompt: 'buying medicine at a pharmacy, explaining a minor illness and asking how to take it',
    description: 'Symptoms, dosage, warnings, and simple health questions.',
    icon: Icons.local_pharmacy_rounded,
  ),
  _Scenario(
    title: 'Train Station',
    prompt: 'buying a train ticket, asking about platforms, delays, and connections',
    description: 'Tickets, schedules, delays, and directions.',
    icon: Icons.train_rounded,
  ),
];

class DialoguesListScreen extends ConsumerStatefulWidget {
  const DialoguesListScreen({super.key});

  @override
  ConsumerState<DialoguesListScreen> createState() => _DialoguesListScreenState();
}

class _DialoguesListScreenState extends ConsumerState<DialoguesListScreen> {
  final _customController = TextEditingController();
  DialogueFull? _generatedDialogue;
  String? _busyKey;

  @override
  void dispose() {
    _customController.dispose();
    super.dispose();
  }

  Future<void> _generate(String scenario, String key) async {
    if (_busyKey != null) return;
    setState(() => _busyKey = key);

    try {
      final api = ref.read(apiClientProvider);
      final res = await api.dio.post<Map<String, dynamic>>(
        '/api/dialogues',
        data: {'scenario': scenario},
      );
      final data = res.data ?? const <String, dynamic>{};
      final ok = (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300;
      if (ok && data['id'] is String) {
        if (mounted) setState(() => _generatedDialogue = DialogueFull.fromJson(Map<String, dynamic>.from(data)));
      } else {
        _showError(_messageFrom(data, res.statusCode));
      }
    } catch (error) {
      _showError('Could not generate dialogue: $error');
    } finally {
      if (mounted) setState(() => _busyKey = null);
    }
  }

  void _generateCustom() {
    final topic = _customController.text.trim();
    if (topic.isEmpty) {
      _showError('Enter a situation first.');
      return;
    }
    _generate(topic, 'custom');
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  String _messageFrom(Map<String, dynamic> data, int? statusCode) {
    final message = data['message'] ?? data['error'];
    if (message is String && message.isNotEmpty) return message;
    return 'Request failed (${statusCode ?? 'unknown'}).';
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(authControllerProvider).profile;
    final generated = _generatedDialogue;

    if (generated != null) {
      return Scaffold(
        appBar: AppBar(
          title: Text(generated.title, maxLines: 1, overflow: TextOverflow.ellipsis),
          leading: BackButton(onPressed: () => setState(() => _generatedDialogue = null)),
        ),
        body: DialogueLessonView(
          dialogue: generated,
          onMoreDialogues: () => setState(() => _generatedDialogue = null),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 72,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Tiny Lesson'),
            if (profile != null)
              Text(
                '${languageName(profile.targetLang)} / ${profile.level}',
                style: GoogleFonts.nunito(color: kMuted, fontSize: 12, fontWeight: FontWeight.w900),
              ),
          ],
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 980),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 28),
              children: [
                _PracticeHeader(),
                const SizedBox(height: 28),
                _ModePills(),
                const SizedBox(height: 34),
                _SectionTitle(icon: Icons.dashboard_customize_rounded, title: 'Scenario Library'),
                const SizedBox(height: 14),
                _ScenarioGrid(
                  busyKey: _busyKey,
                  onGenerate: (scenario) => _generate(scenario.prompt, scenario.title),
                ),
                const SizedBox(height: 18),
                _CustomTopicPanel(
                  controller: _customController,
                  loading: _busyKey == 'custom',
                  onGenerate: _generateCustom,
                ),
                const SizedBox(height: 18),
                const _NoHistoryNotice(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PracticeHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: GoogleFonts.nunito(
          color: kForeground,
          fontSize: 34,
          fontWeight: FontWeight.w900,
          height: 0.98,
          letterSpacing: 0,
        ),
        children: const [
          TextSpan(text: 'Practice '),
          TextSpan(text: 'real dialogue', style: TextStyle(color: kPrimary)),
          TextSpan(text: ' for everyday situations'),
        ],
      ),
    );
  }
}

class _ModePills extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: const [
        _ModePill(label: 'Scenarios', active: true),
        _ModePill(label: 'Camera'),
        _ModePill(label: 'Phrases'),
      ],
    );
  }
}

class _ModePill extends StatelessWidget {
  const _ModePill({required this.label, this.active = false});
  final String label;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
      decoration: BoxDecoration(
        color: active ? _scenarioFill : Colors.transparent,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        label,
        style: GoogleFonts.nunito(
          color: active ? kForeground : kMuted,
          fontSize: 13,
          fontWeight: FontWeight.w900,
          letterSpacing: 0,
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.icon, required this.title});
  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: kPrimary, size: 26),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            title,
            style: GoogleFonts.nunito(color: kForeground, fontSize: 26, fontWeight: FontWeight.w900),
          ),
        ),
      ],
    );
  }
}

class _ScenarioGrid extends StatelessWidget {
  const _ScenarioGrid({required this.busyKey, required this.onGenerate});
  final String? busyKey;
  final void Function(_Scenario scenario) onGenerate;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth >= 680 ? 2 : 1;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _scenarios.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columns,
            mainAxisExtent: 192,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
          ),
          itemBuilder: (context, index) {
            final scenario = _scenarios[index];
            return _ScenarioCard(
              scenario: scenario,
              loading: busyKey == scenario.title,
              disabled: busyKey != null,
              onTap: () => onGenerate(scenario),
            );
          },
        );
      },
    );
  }
}

class _ScenarioCard extends StatelessWidget {
  const _ScenarioCard({
    required this.scenario,
    required this.loading,
    required this.disabled,
    required this.onTap,
  });

  final _Scenario scenario;
  final bool loading;
  final bool disabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: disabled ? null : onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: _scenarioFill,
          borderRadius: BorderRadius.circular(22),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(color: kCard, borderRadius: BorderRadius.circular(16)),
                  child: Icon(scenario.icon, color: kPrimary),
                ),
                const Spacer(),
                Icon(Icons.arrow_forward_rounded, color: loading ? kMuted : kPrimary),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              scenario.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.nunito(color: kForeground, fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: Text(
                scenario.description,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.nunito(color: kMuted, fontSize: 13, fontWeight: FontWeight.w800, height: 1.35),
              ),
            ),
            Text(
              loading ? 'Generating new dialogue...' : 'Generate fresh dialogue',
              style: GoogleFonts.nunito(color: kPrimary, fontSize: 12, fontWeight: FontWeight.w900),
            ),
          ],
        ),
      ),
    );
  }
}

class _CustomTopicPanel extends StatelessWidget {
  const _CustomTopicPanel({
    required this.controller,
    required this.loading,
    required this.onGenerate,
  });

  final TextEditingController controller;
  final bool loading;
  final VoidCallback onGenerate;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: duoCardDecoration(color: kCard),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Build your own', style: GoogleFonts.nunito(color: kPrimary, fontSize: 13, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Text(
            'What do you want to practice?',
            style: GoogleFonts.nunito(color: kForeground, fontSize: 24, fontWeight: FontWeight.w900, height: 1.1),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: controller,
            minLines: 3,
            maxLines: 5,
            textInputAction: TextInputAction.newline,
            decoration: const InputDecoration(
              hintText: 'Example: returning a damaged phone at a shop',
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: loading ? null : onGenerate,
              icon: const Icon(Icons.arrow_forward_rounded),
              label: Text(loading ? 'Generating...' : 'Generate dialogue'),
            ),
          ),
        ],
      ),
    );
  }
}

class _NoHistoryNotice extends StatelessWidget {
  const _NoHistoryNotice();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: duoCardDecoration(),
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(color: _scenarioFill, borderRadius: BorderRadius.circular(18)),
            child: const Icon(Icons.lock_clock_rounded, color: kPrimary, size: 30),
          ),
          const SizedBox(height: 14),
          Text(
            'No saved dialogue history',
            textAlign: TextAlign.center,
            style: GoogleFonts.nunito(color: kForeground, fontWeight: FontWeight.w900, fontSize: 18),
          ),
          const SizedBox(height: 6),
          Text(
            'Generated lessons are shown once and discarded when you leave this screen.',
            textAlign: TextAlign.center,
            style: GoogleFonts.nunito(color: kMuted, fontWeight: FontWeight.w800, fontSize: 13, height: 1.35),
          ),
        ],
      ),
    );
  }
}
