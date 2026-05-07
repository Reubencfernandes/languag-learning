import type { FuriSegment } from "@/lib/types/dialogue";

// Renders a Japanese string with optional furigana annotations.
// - When `segments` is present, kanji portions are wrapped in <ruby> with the
//   hiragana reading shown above. Pure kana segments render as plain text.
// - When `segments` is missing/empty, falls back to the plain `text` prop.
//
// Use anywhere a model string may contain kanji and you want learner-friendly
// readings shown in-line (no parens, no clutter — proper ruby annotations).
export function Furi({
  text,
  segments,
  className,
}: {
  text: string;
  segments?: FuriSegment[];
  className?: string;
}) {
  if (!segments || segments.length === 0) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.reading ? (
          <ruby key={i} className="ruby">
            {seg.text}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
