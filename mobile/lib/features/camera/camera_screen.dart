import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/api_client.dart';
import '../../theme/app_theme.dart';

// ── Data types ─────────────────────────────────────────────────────────────────

class VisionResult {
  VisionResult(
      {required this.caption,
      required this.objects,
      required this.sentences,
      required this.imgW,
      required this.imgH});
  final String caption;
  final List<VisionObject> objects;
  final List<VisionSentence> sentences;
  final int imgW;
  final int imgH;
}

class VisionObject {
  VisionObject(
      {required this.label,
      required this.translation,
      required this.box});
  final String label;
  final String translation;
  final List<double> box; // [x1,y1,x2,y2] — may be 0-1 normalized OR pixel
}

class VisionSentence {
  VisionSentence({required this.target, required this.gloss});
  final String target;
  final String gloss;
}

// ── Screen ─────────────────────────────────────────────────────────────────────

class CameraScreen extends ConsumerStatefulWidget {
  const CameraScreen({super.key});
  @override
  ConsumerState<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends ConsumerState<CameraScreen> {
  File? _image;
  VisionResult? _result;
  bool _loading = false;
  String? _error;

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
      final form = FormData.fromMap(
          {'image': await MultipartFile.fromFile(file.path)});
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
            label: (o['label'] ?? '') as String,
            translation: (o['translation'] ?? '') as String,
            box: rawBox,
          );
        }).toList();
        final sents = ((data['sentences'] as List?) ?? []).map((e) {
          final o = e as Map<String, dynamic>;
          return VisionSentence(
            target: (o['target'] ?? '') as String,
            gloss: (o['gloss'] ?? '') as String,
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
        setState(() => _error = 'Analysis failed (${res.statusCode}).');
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
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(title: const Text('Image Practice')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Upload buttons
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

          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.redAccent)),
          ],

          const SizedBox(height: 16),

          // Image with overlays
          if (_image != null)
            _loading && _result == null
                ? const AspectRatio(
                    aspectRatio: 4 / 3,
                    child: Center(
                        child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircularProgressIndicator(color: kPrimary),
                        SizedBox(height: 12),
                        Text('Gemma is analysing…',
                            style: TextStyle(color: kMuted)),
                      ],
                    )))
                : _result != null
                    ? _AnnotatedImage(
                        image: _image!, result: _result!)
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.file(_image!, fit: BoxFit.cover)),

          if (_result != null) ...[
            const SizedBox(height: 8),
            if (_result!.caption.isNotEmpty)
              Text(
                _result!.caption,
                style: GoogleFonts.almarai(
                    color: kMuted,
                    fontSize: 13,
                    fontStyle: FontStyle.italic),
              ),
            const SizedBox(height: 20),
            _ResultsSection(result: _result!),
          ],
        ],
      ),
    );
  }
}

// ── Annotated image with boxes ─────────────────────────────────────────────────

class _AnnotatedImage extends StatelessWidget {
  const _AnnotatedImage({required this.image, required this.result});
  final File image;
  final VisionResult result;

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
              // Support both normalized (0-1) and pixel-space boxes
              final isNorm = o.box[0] <= 1 &&
                  o.box[1] <= 1 &&
                  o.box[2] <= 1 &&
                  o.box[3] <= 1;
              final left = isNorm ? o.box[0] * dw : (o.box[0] / result.imgW) * dw;
              final top = isNorm ? o.box[1] * dh : (o.box[1] / result.imgH) * dh;
              final w = isNorm
                  ? (o.box[2] - o.box[0]) * dw
                  : ((o.box[2] - o.box[0]) / result.imgW) * dw;
              final h = isNorm
                  ? (o.box[3] - o.box[1]) * dh
                  : ((o.box[3] - o.box[1]) / result.imgH) * dh;

              return Positioned(
                left: left,
                top: top,
                width: w,
                height: h,
                child: Stack(clipBehavior: Clip.none, children: [
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: kPrimary, width: 2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    top: -22,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: const BoxDecoration(color: kPrimary),
                      child: Text(
                        o.translation,
                        style: GoogleFonts.almarai(
                            color: kBackground,
                            fontSize: 11,
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ]),
              );
            }),
          ]),
        ),
      );
    });
  }
}

// ── Results section ───────────────────────────────────────────────────────────

class _ResultsSection extends StatelessWidget {
  const _ResultsSection({required this.result});
  final VisionResult result;

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text('OBJECTS DETECTED',
          style: GoogleFonts.almarai(
              color: kMuted, fontSize: 11, letterSpacing: 1.5)),
      const SizedBox(height: 10),
      if (result.objects.isEmpty)
        Text('No objects detected.',
            style: GoogleFonts.almarai(color: kMuted))
      else
        ...result.objects.map(
          (o) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
                      Text(o.translation,
                          style: GoogleFonts.almarai(
                              color: kForeground,
                              fontWeight: FontWeight.w600,
                              fontSize: 15)),
                      Text(o.label,
                          style: GoogleFonts.almarai(
                              color: kMuted, fontSize: 12)),
                    ],
                  ),
                ),
              ]),
            ),
          ),
        ),
      const SizedBox(height: 20),
      Text('PRACTICE SENTENCES',
          style: GoogleFonts.almarai(
              color: kMuted, fontSize: 11, letterSpacing: 1.5)),
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
                  Text(s.target,
                      style: GoogleFonts.almarai(
                          color: kForeground, fontSize: 15)),
                  const SizedBox(height: 4),
                  Text(s.gloss,
                      style:
                          GoogleFonts.almarai(color: kMuted, fontSize: 12)),
                ],
              ),
            ),
          ),
        ),
      const SizedBox(height: 20),
    ]);
  }
}
