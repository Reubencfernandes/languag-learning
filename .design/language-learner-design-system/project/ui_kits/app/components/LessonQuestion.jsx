const { useState: useStateLQ } = React;

// Multiple-choice translation exercise (Duolingo-style)
const LessonQuestion = ({ onClose, onCheck, progress = 0.46 }) => {
  const options = [
    { id: 'a', jp: 'Hello, how are you?' },
    { id: 'b', jp: 'Good morning, friend.' },
    { id: 'c', jp: 'Goodbye, see you later.' },
    { id: 'd', jp: 'Nice to meet you.' },
  ];
  const correct = 'a';
  const [picked, setPicked] = useStateLQ(null);
  const [checked, setChecked] = useStateLQ(false);
  const isRight = picked === correct;

  const handleCheck = () => {
    if (!picked) return;
    if (!checked) { setChecked(true); return; }
    onCheck && onCheck(isRight);
  };

  return (
    <Phone>
      {/* progress row */}
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
        <CloseX onClick={onClose} />
        <ProgressBar value={progress} />
        <HeartBadge count={5} />
      </div>

      {/* prompt */}
      <div style={{ position: 'absolute', left: 20, top: 108, right: 20 }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: 'rgb(50,49,49)' }}>
          What does this sentence mean?
        </div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{
            width: 54, height: 54, borderRadius: '50%', border: 'none',
            background: 'rgb(25,173,246)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 0 rgb(18,138,200)',
          }}><I name="volume" size={26} color="#fff" /></button>
          <div>
            <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 26, color: '#000' }}>こんにちは、お元気ですか？</div>
            <div style={{ fontFamily: 'Geist', fontSize: 13, color: 'rgb(134,134,134)', marginTop: 2 }}>Konnichiwa, o-genki desu ka?</div>
          </div>
        </div>

        {/* options */}
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map(o => {
            const isPicked = picked === o.id;
            let border = 'rgb(229,229,229)', bg = 'rgba(255,255,255,0.42)', shadow = 'rgb(229,229,229)';
            if (isPicked && !checked) { border = 'rgb(25,173,246)'; bg = 'rgba(25,173,246,0.08)'; shadow = 'rgb(18,138,200)'; }
            if (checked && isPicked && isRight) { border = 'rgb(84,206,1)'; bg = 'rgba(84,206,1,0.12)'; shadow = 'rgb(66,162,1)'; }
            if (checked && isPicked && !isRight) { border = 'rgb(255,75,75)'; bg = 'rgba(255,75,75,0.10)'; shadow = 'rgb(200,50,50)'; }
            return (
              <button key={o.id} disabled={checked} onClick={() => setPicked(o.id)} style={{
                border: `2px solid ${border}`, background: bg, borderRadius: 14,
                padding: '14px 16px', textAlign: 'left', cursor: checked ? 'default' : 'pointer',
                fontFamily: 'Geist', fontWeight: 700, fontSize: 16, color: '#000',
                boxShadow: isPicked ? `0 3px 0 ${shadow}` : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, border: `2px solid ${isPicked ? border : 'rgb(211,211,211)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Geist', fontWeight: 900, fontSize: 13,
                  color: isPicked ? border : 'rgb(181,181,181)',
                }}>{o.id.toUpperCase()}</div>
                <span>{o.jp}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback strip + CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
           background: checked ? (isRight ? 'rgba(84,206,1,0.12)' : 'rgba(255,75,75,0.10)') : 'transparent',
           padding: '18px 16px 22px',
           borderTop: checked ? `2px solid ${isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)'}` : 'none' }}>
        {checked && (
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I name={isRight ? 'check' : 'x'} size={24} color="#fff" strokeWidth={3.5} />
            </div>
            <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 18, color: isRight ? 'rgb(66,162,1)' : 'rgb(200,50,50)' }}>
              {isRight ? 'Nice!' : 'Not quite — it means Hello, how are you?'}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BigCTA label={checked ? 'Continue' : 'Check'} onClick={handleCheck}
                  color={checked ? (isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)') : 'rgb(25,173,246)'}
                  disabled={!picked} />
        </div>
      </div>
    </Phone>
  );
};

window.LessonQuestion = LessonQuestion;
