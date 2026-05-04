// Study · Light check — 1–2 very soft comprehension questions. Non-punitive.
const { useState: useStateSC } = React;

const StudyCheck = ({ lesson, onClose, onContinue }) => {
  const q = lesson.comprehension_questions[0];
  const [picked, setPicked] = useStateSC(null);
  const [checked, setChecked] = useStateSC(false);
  const isRight = picked === q.correct;
  const handle = () => {
    if (picked == null) return;
    if (!checked) { setChecked(true); return; }
    onContinue && onContinue();
  };

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
        <CloseX onClick={onClose} />
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(66,162,1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Study · Quick check
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,1,1,1,1].map((v,i)=>(
            <div key={i} style={{ width: 24, height: 6, borderRadius: 3, background: 'rgb(84,206,1)' }} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, top: 108, right: 20, bottom: 180 }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'rgba(84,206,1,0.18)', fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(66,162,1)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          No pressure · Just 1 question
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: 'rgb(50,49,49)', marginTop: 14, lineHeight: 1.2 }}>
          {q.prompt}
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((o, i) => {
            const selected = picked === i;
            const showRight = checked && i === q.correct;
            const showWrong = checked && selected && !isRight;
            let border = 'rgb(229,229,229)', bg = 'rgba(255,255,255,0.42)', shadow = 'rgb(229,229,229)';
            if (selected && !checked) { border = 'rgb(84,206,1)'; bg = 'rgba(84,206,1,0.08)'; shadow = 'rgb(66,162,1)'; }
            if (showRight)  { border = 'rgb(84,206,1)';  bg = 'rgba(84,206,1,0.14)';  shadow = 'rgb(66,162,1)'; }
            if (showWrong)  { border = 'rgb(255,150,0)'; bg = 'rgba(255,150,0,0.12)'; shadow = 'rgb(200,110,0)'; }
            return (
              <button key={i} disabled={checked} onClick={() => setPicked(i)} style={{
                border: `2px solid ${border}`, background: bg, borderRadius: 14,
                padding: '16px 16px', textAlign: 'left', cursor: checked ? 'default' : 'pointer',
                fontFamily: 'Geist', fontWeight: 800, fontSize: 17, color: '#000',
                boxShadow: selected ? `0 3px 0 ${shadow}` : 'none',
              }}>{o}</button>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: checked ? 'rgba(84,206,1,0.10)' : 'transparent', padding: '16px 16px 22px', borderTop: checked ? '2px solid rgb(84,206,1)' : 'none' }}>
        {checked && (
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: isRight ? 'rgb(84,206,1)' : 'rgb(255,150,0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I name={isRight ? 'check' : 'book'} size={20} color="#fff" strokeWidth={3} />
            </div>
            <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 14, color: '#000', lineHeight: 1.4 }}>
              {isRight
                ? 'Yes — か at the end makes it a question.'
                : 'No worries — Study Mode is for noticing. It was: お元気ですか？'}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BigCTA label={checked ? 'Finish Study' : 'Check'} onClick={handle} color="rgb(84,206,1)" disabled={picked == null} />
        </div>
      </div>
    </Phone>
  );
};

window.StudyCheck = StudyCheck;
