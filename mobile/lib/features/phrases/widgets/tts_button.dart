import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../../../theme/app_theme.dart';

const _ttsLangMap = <String, String>{
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT',
  'pt': 'pt-BR',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'zh': 'zh-CN',
  'yue': 'zh-HK',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN',
  'vi': 'vi-VN',
  'ru': 'ru-RU',
};

String ttsLang(String code) => _ttsLangMap[code] ?? code;

class TtsButton extends StatefulWidget {
  const TtsButton({super.key, required this.text, required this.lang, this.size = 36});

  final String text;
  final String lang;
  final double size;

  @override
  State<TtsButton> createState() => _TtsButtonState();
}

class _TtsButtonState extends State<TtsButton> {
  late final FlutterTts _tts;
  bool _speaking = false;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _tts = FlutterTts();
    _tts.setCompletionHandler(() {
      if (mounted) setState(() => _speaking = false);
    });
    _tts.setCancelHandler(() {
      if (mounted) setState(() => _speaking = false);
    });
    _tts.setErrorHandler((_) {
      if (mounted) setState(() => _speaking = false);
    });
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  Future<void> _toggle() async {
    if (_speaking) {
      await _tts.stop();
      if (mounted) setState(() => _speaking = false);
      return;
    }
    await _tts.stop();
    await _tts.setLanguage(ttsLang(widget.lang));
    await _tts.setSpeechRate(0.45);
    setState(() => _speaking = true);
    final result = await _tts.speak(widget.text);
    if (result != 1 && mounted) setState(() => _speaking = false);
  }

  @override
  Widget build(BuildContext context) {
    final offset = _pressed ? 1.0 : 2.0;
    final fill = _speaking ? const Color(0xFFFF8080) : kBrutalYellow;
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: _toggle,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 80),
        width: widget.size,
        height: widget.size,
        transform: Matrix4.translationValues(_pressed ? 1 : 0, _pressed ? 1 : 0, 0),
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: kBrutalBlack, width: 2),
          boxShadow: [
            BoxShadow(color: kBrutalBlack, offset: Offset(offset, offset), blurRadius: 0),
          ],
        ),
        child: Icon(
          _speaking ? Icons.stop_rounded : Icons.volume_up_rounded,
          color: kBrutalBlack,
          size: widget.size * 0.55,
        ),
      ),
    );
  }
}
