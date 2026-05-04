// Practice · Choose-the-correct-reply
const { useState: useStateRS } = React;

const PracticeReply = ({ lesson, onClose, onContinue }) => {
  const item = lesson.reply_selection_items[0];
  const [picked, setPicked] = useStateRS(null);
  const [checked, setChecked] = useStateRS(false);
  const isRight = picked === item.correct;

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
        <CloseX onClick={onClose} />
        <ProgressBar value={0.55} />
        <HeartBadge count={5} />
      </div>

      <div style={{ position: 'absolute', left: 20, top: 108, right: 20 }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'rgba(170,95,220,0.18)', fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(110,60,160)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Choose the reply
        </div>

        {/* "They said" speech bubble */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(84,206,1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(84,206,1,0.3), inset 0 1px 0 rgba(210,240,180,0.6)' }}>
            <I name="user" size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{
            flex: 1, padding: '14px 16px', borderRadius: 16, borderTopLeftRadius: 4,
            background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(25,173,246,0.15)', color: 'rgb(25,173,246)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I name="volume" size={14} color="rgb(25,173,246)" strokeWidth={3} />
              </button>
              <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 18, color: '#000' }}>{item.heard}</div>
            </div>
            <div style={{ fontFamily: 'Geist', fontSize: 12, color: 'rgb(134,134,134)', marginLeft: 36, fontStyle: 'italic' }}>Konnichiwa! O-genki desu ka?</div>
          </div>
        </div>

        <div style={{ marginTop: 22, fontFamily: 'Geist', fontWeight: 900, fontSize: 14, color: 'rgb(100,100,100)', letterSpacing: '0.06em' }}>
          What's the most natural reply?
        </div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {item.replies.map((r, i) => {
            const selected = picked === i;
            const showRight = checked && i === item.correct;
            const showWrong = checked && selected && !isRight;
            let border = 'rgb(229,229,229)', bg = 'rgba(255,255,255,0.42)', shadow = 'rgb(229,229,229)';
            if (selected && !checked) { border = 'rgb(170,95,220)'; bg = 'rgba(170,95,220,0.08)'; shadow = 'rgb(130,70,170)'; }
            if (showRight)  { border = 'rgb(84,206,1)';  bg = 'rgba(84,206,1,0.14)';  shadow = 'rgb(66,162,1)'; }
            if (showWrong)  { border = 'rgb(255,75,75)'; bg = 'rgba(255,75,75,0.10)'; shadow = 'rgb(200,50,50)'; }
            return (
              <button key={i} disabled={checked} onClick={() => setPicked(i)} style={{
                border: `2px solid ${border}`, background: bg, borderRadius: 14,
                padding: '14px 16px', textAlign: 'left', cursor: checked ? 'default' : 'pointer',
                fontFamily: 'Geist', fontWeight: 800, fontSize: 17, color: '#000',
                boxShadow: selected ? `0 3px 0 ${shadow}` : 'none',
              }}>{r}</button>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0,
           background: checked ? (isRight ? 'rgba(84,206,1,0.12)' : 'rgba(255,75,75,0.10)') : 'transparent',
           padding: '18px 16px 22px',
           borderTop: checked ? `2px solid ${isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)'}` : 'none' }}>
        {checked && (
          <div style={{ marginBottom: 14, fontFamily: 'Geist', fontWeight: 800, fontSize: 14, color: isRight ? 'rgb(66,162,1)' : 'rgb(200,50,50)' }}>
            {isRight ? 'Natural. はい、元気です = yes, I\'m well.' : `Correct reply: ${item.replies[item.correct]}`}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BigCTA label={checked ? 'Continue' : 'Check'} onClick={() => {
            if (picked == null) return;
            if (!checked) setChecked(true);
            else onContinue && onContinue();
          }} color={checked ? (isRight ? 'rgb(84,206,1)' : 'rgb(255,75,75)') : 'rgb(170,95,220)'} disabled={picked == null} />
        </div>
      </div>
    </Phone>
  );
};

window.PracticeReply = PracticeReply;
