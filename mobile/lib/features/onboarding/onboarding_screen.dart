import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/auth_provider.dart';
import '../../core/languages.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});
  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  String _native = 'en';
  String _target = 'es';
  String _level = 'A1';
  bool _saving = false;
  String? _error;

  Future<void> _save() async {
    if (_native == _target) {
      setState(() => _error = 'Native and target languages must differ.');
      return;
    }
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      await ref
          .read(authControllerProvider.notifier)
          .saveProfile(nativeLang: _native, targetLang: _target, level: _level);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Set up your profile')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            const Text('I speak', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            _langDropdown(_native, (v) => setState(() => _native = v)),
            const SizedBox(height: 20),
            const Text('I want to learn', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            _langDropdown(_target, (v) => setState(() => _target = v), exclude: _native),
            const SizedBox(height: 20),
            const Text('My current level', style: TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: kLevels.map((l) {
                final selected = _level == l;
                return ChoiceChip(
                  label: Text('$l — ${kLevelDescriptions[l]}'),
                  selected: selected,
                  onSelected: (_) => setState(() => _level = l),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _saving ? null : _save,
              child: Text(_saving ? 'Saving…' : 'Start learning'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _langDropdown(String value, ValueChanged<String> onChanged, {String? exclude}) {
    final items = kLanguages.where((l) => l.code != exclude).toList();
    return DropdownButtonFormField<String>(
      initialValue: value,
      decoration: const InputDecoration(border: OutlineInputBorder()),
      items: items
          .map((l) => DropdownMenuItem(value: l.code, child: Text(l.name)))
          .toList(),
      onChanged: (v) => v == null ? null : onChanged(v),
    );
  }
}
