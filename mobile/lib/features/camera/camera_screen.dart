import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../auth/auth_provider.dart';
import '../../core/api_client.dart';
import '../../theme/app_theme.dart';
import '../../widgets/furi_text.dart';
import '../../widgets/level_picker.dart';
import '../../widgets/tts_button.dart';

// â”€â”€ Data types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class VisionResult {
  VisionResult({
    required this.caption,
    required this.objects,
    required this.sentences,
    required this.imgW,
    required this.imgH,
  });
  final String caption;
  final List<VisionObject> objects;
  final List<VisionSentence> sentences;
  final int imgW;
  final int imgH;
}

class VisionObject {
  VisionObject({
    required this.labelNative,
    required this.labelTarget,
    this.labelTargetSegments,
    this.romanized,
    required this.box,
  });
  final String labelNative;
  final String labelTarget;
  final List<FuriSegment>? labelTargetSegments;
  final String? romanized;
  final List<double> box;
}

class VisionSentence {
  VisionSentence({
    required this.target,
    this.targetSegments,
    required this.gloss,
    this.romanized,
  });
  final String target;
  final List<FuriSegment>? targetSegments;
  final String gloss;
  final String? romanized;
}

// â”€â”€ Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class CameraScreen extends ConsumerStatefulWidget {
  const CameraScreen({super.key});
  @override
  ConsumerState<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends ConsumerState<CameraScreen>
    with TickerProviderStateMixin {
  File? _image;
  VisionResult? _result;
  bool _loading = false;
  String? _error;
  String? _level;

  // Pulsing animation for the center-point dots
  late final AnimationController _pulseCtrl;
  late final Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  Future<void> _pick(ImageSource source) async {
    final picker = ImagePicker();
    final x = await picker.pickImage(
        source: source, maxWidth: 1600, imageQuality: 88);
    if (x == null) return;
    setState(() {
      _image = File(x.path);
      _result = null;
      _error = null;
    });
    await _analyze(File(x.path));
  }

  Future<void> _analyze(File file) async {
    setState(() => _loading = true);
    try {
      final api = ref.read(apiClientProvider);
      final profile = ref.read(authControllerProvider).profile;
      final level = _level ?? profile?.level;
      final form = FormData.fromMap({
        'image': await MultipartFile.fromFile(file.path),
        if (level != null) 'level': level,
      });
      final res = await api.dio
          .post<Map<String, dynamic>>('/api/vision/analyze', data: form);

      if (res.statusCode == 200 && res.data != null) {
        final data = res.data!;
        final objs = ((data['objects'] as List?) ?? []).map((e) {
          final o = e as Map<String, dynamic>;
          final rawBox = (o['box'] as List)
              .map((x) => (x as num).toDouble())
              .toList();
          return VisionObject(
            labelNative: (o['label'] ?? '') as String,
            labelTarget: (o['translation'] ?? '') as String,
            labelTargetSegments: parseFuriSegments(o['translationSegments']),
            romanized: o['romanized'] as String?,
            box: rawBox,
          );
        }).toList();
        final sents = ((data['sentences'] as List?) ?? []).map((e) {
          final o = e as Map<String, dynamic>;
          return VisionSentence(
            target: (o['target'] ?? '') as String,
            targetSegments: parseFuriSegments(o['targetSegments']),
            gloss: (o['gloss'] ?? '') as String,
            romanized: o['romanized'] as String?,
          );
        }).toList();
        final dims = await _readDimensions(file);
        setState(() => _result = VisionResult(
              caption: (data['caption'] ?? '').toString(),
              objects: objs,
              sentences: sents,
              imgW: dims.width,
              imgH: dims.height,
            ));
      } else {
        final errMsg = (res.data?['message'] ?? res.data?['error'] ?? 'Analysis failed').toString();
        setState(() => _error = errMsg);
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<({int width, int height})> _readDimensions(File file) async {
    final decoded = await decodeImageFromList(await file.readAsBytes());
    return (width: decoded.width, height: decoded.height);
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(authControllerProvider).profile;

    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Image Practice'),
        actions: [
          if (profile != null)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: kPrimary.withAlpha(31),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: kPrimary.withAlpha(102)),
                  ),
                  child: Text(
                    '${profile.targetLang.toUpperCase()} Â· ${profile.level}',
                    style: GoogleFonts.almarai(
                        color: kPrimary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // â”€â”€ Upload buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          Row(children: [
            Expanded(
              child: FilledButton.icon(
                onPressed: _loading ? null : () => _pick(ImageSource.camera),
                icon: const Icon(Icons.camera_alt, size: 18),
                label: const Text('Camera'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _loading ? null : () => _pick(ImageSource.gallery),
                icon: const Icon(Icons.photo_library_outlined, size: 18),
                label: const Text('Gallery'),
              ),
            ),
          ]),

          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: kCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: kBorder, width: 2),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Sentences match level',
                    style: GoogleFonts.almarai(color: kForeground, fontSize: 12, fontWeight: FontWeight.w900),
                  ),
                ),
                LevelPicker(
                  value: _level ?? profile?.level ?? 'A1',
                  onChanged: (l) => setState(() => _level = l),
                ),
              ],
            ),
          ),

          if (_error != null) ...[
            const SizedBox(height: 12),
            _ErrorBanner(message: _error!),
          ],

          const SizedBox(height: 16),

          // â”€â”€ Image with overlays â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          if (_image != null)
            _loading && _result == null
                ? _LoadingOverlay()
                : _result != null
                    ? _AnnotatedImage(
                        image: _image!,
                        result: _result!,
                        pulseAnim: _pulseAnim,
                      )
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.file(_image!, fit: BoxFit.cover)),

          // â”€â”€ Caption (in native language) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          if (_result != null && _result!.caption.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: kCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: kBorder),
              ),
              child: Row(children: [
                const Icon(Icons.auto_awesome, size: 14, color: kPrimary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _result!.caption,
                    style: GoogleFonts.almarai(
                        color: kMuted,
                        fontSize: 13,
                        fontStyle: FontStyle.italic),
                  ),
                ),
              ]),
            ),
          ],

          if (_result != null) ...[
            const SizedBox(height: 20),
            _ResultsSection(result: _result!, lang: profile?.targetLang ?? 'en'),
          ],
        ],
      ),
    );
  }
}

// â”€â”€ Loading overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class _LoadingOverlay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 240,
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: kBorder),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: kPrimary, strokeWidth: 2),
          const SizedBox(height: 16),
          Text('Gemma is analysing…',
              style: GoogleFonts.almarai(color: kMuted, fontSize: 13)),
          const SizedBox(height: 4),
          Text('This may take a moment',
              style: GoogleFonts.almarai(color: kMuted.withAlpha(128), fontSize: 11)),
        ],
      ),
    );
  }
}

// â”€â”€ Error banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.withAlpha(20),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.red.withAlpha(77)),
      ),
      child: Row(children: [
        const Icon(Icons.error_outline, color: Colors.redAccent, size: 16),
        const SizedBox(width: 8),
        Expanded(
          child: Text(message,
              style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
        ),
      ]),
    );
  }
}

// â”€â”€ Annotated image with pulsing center-point dots â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class _AnnotatedImage extends StatelessWidget {
  const _AnnotatedImage({
    required this.image,
    required this.result,
    required this.pulseAnim,
  });
  final File image;
  final VisionResult result;
  final Animation<double> pulseAnim;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (ctx, constraints) {
      final aspect = result.imgW / result.imgH;
      final dw = constraints.maxWidth;
      final dh = dw / aspect;

      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: SizedBox(
          width: dw,
          height: dh,
          child: Stack(children: [
            Positioned.fill(child: Image.file(image, fit: BoxFit.cover)),
            ...result.objects.map((o) {
              final isNorm = o.box.every((v) => v <= 1.0);
              final x1 = isNorm ? o.box[0] * dw : (o.box[0] / result.imgW) * dw;
              final y1 = isNorm ? o.box[1] * dh : (o.box[1] / result.imgH) * dh;
              final x2 = isNorm ? o.box[2] * dw : (o.box[2] / result.imgW) * dw;
              final y2 = isNorm ? o.box[3] * dh : (o.box[3] / result.imgH) * dh;
              final cx = (x1 + x2) / 2;
              final cy = (y1 + y2) / 2;

              return Positioned(
                left: cx - 60, // center the label
                top: cy - 10,
                child: _PulsingLabel(object: o, pulseAnim: pulseAnim),
              );
            }),
          ]),
        ),
      );
    });
  }
}

class _PulsingLabel extends StatelessWidget {
  const _PulsingLabel({required this.object, required this.pulseAnim});
  final VisionObject object;
  final Animation<double> pulseAnim;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        // Pulsing dot
        AnimatedBuilder(
          animation: pulseAnim,
          builder: (_, __) => Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: kPrimary.withAlpha((pulseAnim.value * 255).round()),
              boxShadow: [
                BoxShadow(
                  color: kPrimary.withAlpha((pulseAnim.value * 153).round()),
                  blurRadius: 8 * pulseAnim.value,
                  spreadRadius: 2 * pulseAnim.value,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 6),
        // Glassmorphic label chip
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.black.withAlpha(140),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                  color: kPrimary.withAlpha(128), width: 0.8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  object.labelTarget,
                  style: GoogleFonts.almarai(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (object.romanized != null && object.romanized!.isNotEmpty)
                  Text(
                    object.romanized!,
                    style: GoogleFonts.almarai(
                      color: kPrimary.withAlpha(217),
                      fontSize: 9,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// â”€â”€ Results section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class _ResultsSection extends StatelessWidget {
  const _ResultsSection({required this.result, required this.lang});
  final VisionResult result;
  final String lang;

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      // â”€â”€ Objects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      Text('OBJECTS DETECTED',
          style: GoogleFonts.almarai(
              color: kMuted, fontSize: 11, letterSpacing: 0)),
      const SizedBox(height: 10),
      if (result.objects.isEmpty)
        Text('No objects detected.',
            style: GoogleFonts.almarai(color: kMuted))
      else
        ...result.objects.map(
          (o) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: kCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: kBorder),
              ),
              child: Row(children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      FuriText(
                        text: o.labelTarget,
                        segments: o.labelTargetSegments,
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                      if (o.romanized != null && o.romanized!.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(o.romanized!,
                              style: GoogleFonts.almarai(
                                  color: kPrimary.withAlpha(204),
                                  fontSize: 12)),
                        ),
                      const SizedBox(height: 4),
                      Text(o.labelNative,
                          style: GoogleFonts.almarai(
                              color: kMuted, fontSize: 12, fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                TtsButton(text: o.labelTarget, lang: lang, size: 34),
              ]),
            ),
          ),
        ),

      const SizedBox(height: 20),

      // â”€â”€ Sentences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      Text('PRACTICE SENTENCES',
          style: GoogleFonts.almarai(
              color: kMuted, fontSize: 11, letterSpacing: 0)),
      const SizedBox(height: 10),
      if (result.sentences.isEmpty)
        Text('No sentences generated.',
            style: GoogleFonts.almarai(color: kMuted))
      else
        ...result.sentences.map(
          (s) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: kCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: kBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: FuriText(
                          text: s.target,
                          segments: s.targetSegments,
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(width: 8),
                      TtsButton(text: s.target, lang: lang, size: 32),
                    ],
                  ),
                  if (s.romanized != null && s.romanized!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(s.romanized!,
                        style: GoogleFonts.almarai(
                            color: kPrimary.withAlpha(204),
                            fontSize: 12,
                            fontStyle: FontStyle.italic)),
                  ],
                  const SizedBox(height: 8),
                  Text(s.gloss,
                      style: GoogleFonts.almarai(
                          color: kMuted, fontSize: 12, fontWeight: FontWeight.w800)),
                ],
              ),
            ),
          ),
        ),
      const SizedBox(height: 20),
    ]);
  }
}




