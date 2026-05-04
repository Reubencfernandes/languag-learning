// Practice · AI chat — free interaction using what you learned
const { useState: useStateAI } = React;

const PracticeAIChat = ({ lesson, onClose, onContinue }) => {
  const [msgs, setMsgs] = useStateAI([
    { from: 'ai',   jp: 'こんにちは！お元気ですか？', romaji: 'Konnichiwa! O-genki desu ka?', en: 'Hi! How are you?' },
  ]);
  const [text, setText] = useStateAI('');

  const send = () => {
    if (!text.trim()) return;
    const you = { from: 'you', jp: text, romaji: '', en: '' };
    // Simulated coach reply
    const reply = { from: 'ai', jp: 'いいですね！もう一度言ってみてください。', romaji: 'Ii desu ne! Mō ichido itte mite kudasai.', en: 'Nice! Try saying it one more time.',
                    coach: { good: ['Used です politely', 'Ended with natural rhythm'], tip: 'Add お元気 at the front for extra warmth.' } };
    setMsgs([...msgs, you, reply]);
    setText('');
  };

  return (
    <Phone>
      <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
        <CloseX onClick={onClose} />
        <div style={{ flex: 1, fontFamily: 'Geist', fontWeight: 900, fontSize: 15, color: '#000', textAlign: 'center' }}>
          AI Coach <span style={{ fontSize: 11, color: 'rgb(66,162,1)', marginLeft: 6, letterSpacing: '0.14em' }}>LIVE</span>
        </div>
        <button onClick={onContinue} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>End</button>
      </div>

      {/* Prompt banner */}
      <div style={{ position: 'absolute', left: 16, right: 16, top: 96, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,150,0,0.14)', border: '2px solid rgb(255,150,0)' }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(170,93,0)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Task</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(100,74,0)', marginTop: 2 }}>{lesson.interaction_prompt}</div>
      </div>

      {/* Messages */}
      <div style={{ position: 'absolute', left: 14, right: 14, top: 168, bottom: 108, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
        {msgs.map((m, i) => {
          const isAI = m.from === 'ai';
          return (
            <div key={i} style={{ display: 'flex', flexDirection: isAI ? 'row' : 'row-reverse', alignItems: 'flex-start', gap: 8 }}>
              {isAI && <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgb(255,150,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: '#fff', fontFamily: 'Geist', fontWeight: 900, fontSize: 12, boxShadow: '0 2px 0 rgb(200,110,0)' }}>AI</div>}
              <div style={{
                maxWidth: 260,
                padding: '10px 14px', borderRadius: 16,
                borderTopLeftRadius: isAI ? 4 : 16, borderTopRightRadius: isAI ? 16 : 4,
                background: isAI ? '#fff' : 'rgb(25,173,246)',
                color: isAI ? '#000' : '#fff',
                border: isAI ? '2px solid rgb(229,229,229)' : 'none',
                boxShadow: isAI ? 'none' : '0 3px 0 rgb(18,138,200)',
              }}>
                <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 15 }}>{m.jp}</div>
                {m.romaji && <div style={{ fontFamily: 'Geist', fontSize: 11, marginTop: 2, fontStyle: 'italic', color: isAI ? 'rgb(134,134,134)' : 'rgba(255,255,255,0.8)' }}>{m.romaji}</div>}
                {m.en && <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 11, marginTop: 2, color: isAI ? 'rgb(66,162,1)' : 'rgba(255,255,255,0.9)' }}>{m.en}</div>}
                {m.coach && (
                  <div style={{ marginTop: 8, padding: 8, borderRadius: 10, background: 'rgba(84,206,1,0.12)', border: '1.5px solid rgba(84,206,1,0.35)' }}>
                    <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 10, color: 'rgb(66,162,1)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Coach</div>
                    {m.coach.good.map((g, j) => (
                      <div key={j} style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 11, color: '#000', marginTop: 2, display: 'flex', gap: 6 }}>
                        <I name="check" size={12} color="rgb(66,162,1)" strokeWidth={3.5} /> {g}
                      </div>
                    ))}
                    <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 11, color: 'rgb(170,93,0)', marginTop: 4 }}>💡 {m.coach.tip}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 14px 18px', borderTop: '1px solid rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'rgb(255,150,0)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(200,110,0,0.35), inset 0 1px 0 rgba(255,240,200,0.6)', flex: 'none' }}>
          <I name="mic" size={20} color="#fff" strokeWidth={2.5} />
        </button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a reply…" style={{
          flex: 1, height: 44, borderRadius: 22, border: '1px solid rgba(255,255,255,0.5)', padding: '0 16px',
          fontFamily: 'Geist', fontWeight: 600, fontSize: 14, outline: 'none',
        }} />
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'rgb(25,173,246)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(25,173,246,0.35), inset 0 1px 0 rgba(200,230,255,0.6)', flex: 'none', fontFamily: 'Geist', fontWeight: 900, fontSize: 18 }}>→</button>
      </div>
    </Phone>
  );
};

window.PracticeAIChat = PracticeAIChat;
