// Practice · Solo Challenge — timed mini battle with a mix of items (50/30/20)
const { useState: useStateSolo, useEffect: useEffectSolo } = React;

const PracticeSolo = ({ lesson, onClose, onContinue }) => {
  const [t, setT] = useStateSolo(60);
  const [score, setScore] = useStateSolo(0);
  const [combo, setCombo] = useStateSolo(3);
  const [qIdx, setQIdx] = useStateSolo(0);
  const [picked, setPicked] = useStateSolo(null);

  useEffectSolo(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);

  // Mixed item pool: 50% current, 30% recent, 20% older weak
  const items = [
    { tag: 'CURRENT', prompt: 'お元気 ___ か？', options: ['です', 'だ', 'でした'], correct: 0 },
    { tag: 'RECENT',  prompt: '"hello" in Japanese', options: ['さようなら','こんにちは','ありがとう'], correct: 1 },
    { tag: 'WEAK',    prompt: 'Pick the question marker', options: ['よ', 'ね', 'か'], correct: 2 },
    { tag: 'CURRENT', prompt: '"Good evening"', options: ['こんばんは','おはよう','おやすみ'], correct: 0 },
    { tag: 'CURRENT', prompt: '"Yes, I am well."', options: ['はい、元気です。','いいえ。','ありがとう。'], correct: 0 },
    { tag: 'RECENT',  prompt: 'Polite copula', options: ['です','だ','である'], correct: 0 },
  ];
  const q = items[qIdx % items.length];

  const pickAnswer = (i) => {
    if (picked != null || t <= 0) return;
    setPicked(i);
    const right = i === q.correct;
    if (right) { setScore(score + 10 + combo * 2); setCombo(Math.min(combo + 1, 9)); }
    else       { setCombo(0); }
    setTimeout(() => { setPicked(null); setQIdx(qIdx + 1); }, 550);
  };

  const done = t <= 0;
  const tagColor = { CURRENT: 'rgb(84,206,1)', RECENT: 'rgb(25,173,246)', WEAK: 'rgb(255,75,75)' }[q.tag];

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseX onClick={onClose} />
        <div style={{ flex: 1 }} />
        <div style={{
          padding: '4px 14px', borderRadius: 999, background: '#000',
          color: t <= 10 ? 'rgb(255,75,75)' : '#fff',
          fontFamily: 'Geist', fontWeight: 900, fontSize: 20, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em',
        }}>
          {String(Math.floor(t/60)).padStart(2,'0')}:{String(t%60).padStart(2,'0')}
        </div>
      </div>

      {/* Score + combo */}
      <div style={{ position: 'absolute', left: 20, right: 20, top: 104, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)', border: '1px solid rgba(60,40,80,0.35)', boxShadow: '0 4px 14px rgba(30,20,50,0.25), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 10, color: 'rgb(134,134,134)', letterSpacing: '0.14em' }}>SCORE</div>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 24, color: '#000' }}>{score}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 14, background: 'rgba(255,180,60,0.25)', backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)', border: '1px solid rgba(255,180,60,0.7)', boxShadow: '0 4px 14px rgba(200,110,0,0.35), inset 0 1px 0 rgba(255,240,200,0.6)' }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 10, color: 'rgb(170,93,0)', letterSpacing: '0.14em' }}>COMBO x{combo}</div>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 24, color: 'rgb(200,110,0)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <I name="flame" size={20} color="rgb(200,110,0)" fill="rgb(200,110,0)" strokeWidth={0} /> {combo}
          </div>
        </div>
      </div>

      {/* Question card */}
      <div style={{ position: 'absolute', left: 20, right: 20, top: 194 }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: tagColor, color: '#fff', fontFamily: 'Geist', fontWeight: 900, fontSize: 10, letterSpacing: '0.2em' }}>
          {q.tag}
        </div>
        <div style={{
          marginTop: 10, padding: '24px 18px', borderRadius: 18, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          border: '2px solid #000', boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
          fontFamily: 'Geist', fontWeight: 900, fontSize: 26, color: '#000', textAlign: 'center', minHeight: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{q.prompt}</div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((o, i) => {
            const sel = picked === i;
            const right = sel && i === q.correct;
            const wrong = sel && i !== q.correct;
            let bg = 'rgba(255,255,255,0.42)', bd = '#000', sh = '#000';
            if (right) { bg = 'rgb(84,206,1)'; bd = 'rgb(66,162,1)'; sh = 'rgb(66,162,1)'; }
            if (wrong) { bg = 'rgb(255,75,75)'; bd = 'rgb(200,50,50)'; sh = 'rgb(200,50,50)'; }
            return (
              <button key={i} onClick={() => pickAnswer(i)} disabled={done} style={{
                border: `2px solid ${bd}`, background: bg, color: (right || wrong) ? '#fff' : '#000',
                borderRadius: 14, padding: '14px 16px', textAlign: 'left', cursor: done ? 'default' : 'pointer',
                fontFamily: 'Geist', fontWeight: 900, fontSize: 17,
                boxShadow: `0 3px 0 ${sh}`,
              }}>{o}</button>
            );
          })}
        </div>
      </div>

      {/* Done overlay */}
      {done && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28,
        }}>
          <div style={{ width: '100%', padding: '22px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(22px) saturate(1.5)', WebkitBackdropFilter: 'blur(22px) saturate(1.5)', textAlign: 'center' }}>
            <I name="trophy" size={54} color="rgb(200,110,0)" fill="rgb(253,226,73)" strokeWidth={0} />
            <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: '#000', marginTop: 6 }}>Time!</div>
            <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 40, color: 'rgb(200,110,0)', marginTop: 4 }}>{score}</div>
            <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(134,134,134)' }}>points this round</div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
              <BigCTA label="Done" onClick={onContinue} color="rgb(84,206,1)" />
            </div>
          </div>
        </div>
      )}
    </Phone>
  );
};

window.PracticeSolo = PracticeSolo;
