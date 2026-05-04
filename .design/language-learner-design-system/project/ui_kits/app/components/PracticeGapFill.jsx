// Practice · Gap fill — tap-to-insert particle / verb form
const { useState: useStateGF } = React;

const PracticeGapFill = ({ lesson, onClose, onContinue }) => {
  const item = lesson.gap_fill_items[0];
  const [picked, setPicked] = useStateGF(null);
  const [checked, setChecked] = useStateGF(false);
  const isRight = picked === item.correct;

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
        <CloseX onClick={onClose} />
        <ProgressBar value={0.35} />
        <HeartBadge count={5} />
      </div>

      <div style={{ position: 'absolute', left: 20, top: 108, right: 20 }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'rgba(84,206,1,0.18)', fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(66,162,1)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Fill the blank
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 20, color: 'rgb(50,49,49)', marginTop: 10, lineHeight: 1.3 }}>
          {item.prompt}
        </div>

        {/* Sentence with slot */}
        <div style={{
          marginTop: 26, padding: '22px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 6px 20px rgba(80,60,120,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
          fontFamily: 'Geist', fontWeight: 900, fontSize: 26, color: '#000',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, justifyContent: 'center',
        }}>
          <span>{item.before}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 84, height: 46, borderRadius: 12,
            background: picked == null ? 'rgb(245,245,245)' : (checked ? (isRight ? 'rgba(84,206,1,0.18)' : 'rgba(255,75,75,0.14)') : 'rgba(25,173,246,0.14)'),
            border: `2px dashed ${picked == null ? 'rgb(211,211,211)' : (checked ? (isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)') : 'rgb(25,173,246)')}`,
            color: picked == null ? 'rgb(181,181,181)' : '#000',
            padding: '0 10px',
          }}>{picked != null ? item.choices[picked] : '____'}</span>
          <span>{item.after}</span>
        </div>

        {/* Romaji helper */}
        <div style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Geist', fontSize: 13, color: 'rgb(134,134,134)', fontStyle: 'italic' }}>
          O-genki {picked != null ? item.choices[picked] : '____'} ka?
        </div>

        {/* Word bank */}
        <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {item.choices.map((c, i) => {
            const selected = picked === i;
            return (
              <button key={i} disabled={checked} onClick={() => setPicked(i)} style={{
                minWidth: 80, height: 48, borderRadius: 12,
                border: `2px solid ${selected ? 'rgb(25,173,246)' : 'rgb(229,229,229)'}`,
                background: selected ? 'rgba(25,173,246,0.10)' : '#fff',
                fontFamily: 'Geist', fontWeight: 900, fontSize: 18, color: '#000',
                cursor: checked ? 'default' : 'pointer', padding: '0 14px',
                boxShadow: selected ? '0 3px 0 rgb(18,138,200)' : '0 3px 0 rgb(229,229,229)',
              }}>{c}</button>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
           background: checked ? (isRight ? 'rgba(84,206,1,0.12)' : 'rgba(255,75,75,0.10)') : 'transparent',
           padding: '18px 16px 22px',
           borderTop: checked ? `2px solid ${isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)'}` : 'none' }}>
        {checked && (
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I name={isRight ? 'check' : 'x'} size={22} color="#fff" strokeWidth={3.5} />
            </div>
            <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 15, color: isRight ? 'rgb(66,162,1)' : 'rgb(200,50,50)' }}>
              {isRight ? 'Spot on — polite form です.' : `Not quite — correct: ${item.choices[item.correct]}`}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BigCTA label={checked ? 'Continue' : 'Check'} onClick={() => {
            if (picked == null) return;
            if (!checked) setChecked(true);
            else onContinue && onContinue();
          }} color={checked ? (isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)') : 'rgb(25,173,246)'} disabled={picked == null} />
        </div>
      </div>
    </Phone>
  );
};

window.PracticeGapFill = PracticeGapFill;
