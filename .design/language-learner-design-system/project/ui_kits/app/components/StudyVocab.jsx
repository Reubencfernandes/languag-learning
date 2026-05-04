// Study · Vocabulary carousel — 5–8 words, one per screen with jp/kana/romaji/en + audio
const { useState: useStateSV } = React;

const StudyVocab = ({ lesson, onClose, onContinue }) => {
  const words = lesson.key_vocabulary;
  const [i, setI] = useStateSV(0);
  const w = words[i];
  const prev = () => setI(Math.max(0, i - 1));
  const next = () => {
    if (i < words.length - 1) setI(i + 1);
    else onContinue && onContinue();
  };

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseX onClick={onClose} />
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(66,162,1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Study · Vocabulary
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,1,0,0,0].map((v,j)=>(
            <div key={j} style={{ width: 24, height: 6, borderRadius: 3, background: v ? 'rgba(84,206,1,0.85)' : 'rgba(120,100,160,0.25)' }} />
          ))}
        </div>
      </div>

      {/* word counter */}
      <div style={{ position: 'absolute', left: 20, right: 20, top: 102 }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Word {i + 1} of {words.length}
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
          {words.map((_, j) => (
            <div key={j} style={{ flex: 1, height: 4, borderRadius: 2, background: j <= i ? 'rgba(84,206,1,0.85)' : 'rgba(120,100,160,0.25)' }} />
          ))}
        </div>
      </div>

      {/* Vocabulary card — big kana, romaji small below, english meaning */}
      <div style={{ position: 'absolute', left: 20, right: 20, top: 160 }}>
        <div style={{
          borderRadius: 22, padding: '34px 24px 26px', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(22px) saturate(1.5)', WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
          border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 28px rgba(80,60,120,0.14), inset 0 1px 0 rgba(255,255,255,0.7)',
          minHeight: 290, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14,
        }}>
          {/* Audio button */}
          <button style={{
            width: 58, height: 58, borderRadius: '50%', border: 'none',
            background: 'rgb(25,173,246)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 0 rgb(18,138,200)', marginBottom: 6,
          }}><I name="volume" size={28} color="#fff" /></button>

          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 52, color: '#000', lineHeight: 1.0, letterSpacing: '-0.01em' }}>
            {w.jp}
          </div>
          <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 15, color: 'rgb(120,120,120)', fontStyle: 'italic' }}>
            {w.romaji}
          </div>
          <div style={{ height: 1, background: 'rgb(229,229,229)', width: 80, margin: '2px 0' }} />
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 20, color: 'rgb(50,49,49)' }}>
            {w.en}
          </div>
        </div>

        {/* Tap to see a sentence with this word */}
        <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 14, background: 'rgba(253,226,73,0.22)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgb(255,214,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <I name="book" size={14} color="rgb(170,93,0)" strokeWidth={3} />
          </div>
          <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(100,74,0)', lineHeight: 1.45 }}>
            Seen in: <b style={{ fontWeight: 900, color: '#000' }}>{lesson.example_sentences[i % lesson.example_sentences.length].jp}</b>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button onClick={prev} disabled={i === 0} style={{
          width: 60, height: 55, borderRadius: 14, border: '1px solid rgba(255,255,255,0.55)',
          background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(14px) saturate(1.4)', WebkitBackdropFilter: 'blur(14px) saturate(1.4)', color: i === 0 ? 'rgba(120,100,160,0.5)' : '#2a1a3a',
          fontFamily: 'Geist', fontWeight: 900, fontSize: 20, cursor: i === 0 ? 'default' : 'pointer',
          boxShadow: '0 4px 14px rgba(80,60,120,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}>←</button>
        <BigCTA label={i === words.length - 1 ? 'Continue' : 'Next word'} onClick={next} color="rgb(84,206,1)" />
      </div>
    </Phone>
  );
};

window.StudyVocab = StudyVocab;
