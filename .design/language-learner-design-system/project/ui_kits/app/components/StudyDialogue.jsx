// Study · Dialogue — chat-style short dialogue using the lesson's vocab + grammar
const StudyDialogue = ({ lesson, onClose, onContinue }) => (
  <Phone>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
      <CloseX onClick={onClose} />
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(66,162,1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Study · Dialogue
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,1,1,1,0].map((v,i)=>(
          <div key={i} style={{ width: 24, height: 6, borderRadius: 3, background: v ? 'rgba(84,206,1,0.85)' : 'rgba(120,100,160,0.25)' }} />
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', left: 20, top: 102, right: 20, bottom: 110, overflowY: 'auto' }}>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: 'rgb(50,49,49)', lineHeight: 1.2 }}>
        Listen to how it sounds
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 13, color: 'rgb(134,134,134)', marginTop: 4 }}>
        Tap ▶ to hear each line. No answering needed.
      </div>

      {/* Play all */}
      <button style={{
        marginTop: 14, height: 44, padding: '0 18px', borderRadius: 22, border: 'none',
        background: 'rgb(25,173,246)', color: '#fff', cursor: 'pointer',
        fontFamily: 'Geist', fontWeight: 900, fontSize: 14,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: '0 3px 0 rgb(18,138,200)',
      }}>
        <I name="play" size={16} color="#fff" fill="#fff" strokeWidth={0} />
        Play all lines
      </button>

      {/* Dialogue turns */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lesson.short_dialogue.map((line, i) => {
          const isA = line.speaker === 'A';
          return (
            <div key={i} style={{
              display: 'flex', gap: 10,
              flexDirection: isA ? 'row' : 'row-reverse',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flex: 'none',
                background: isA ? 'rgb(84,206,1)' : 'rgb(25,173,246)',
                color: '#fff', fontFamily: 'Geist', fontWeight: 900, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isA ? '0 3px 0 rgb(66,162,1)' : '0 3px 0 rgb(18,138,200)',
              }}>{line.speaker}</div>
              <div style={{
                maxWidth: 260, padding: '12px 14px', borderRadius: 16,
                borderTopLeftRadius: isA ? 4 : 16, borderTopRightRadius: isA ? 16 : 4,
                background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <button style={{
                    width: 26, height: 26, borderRadius: '50%', border: 'none',
                    background: 'rgba(25,173,246,0.15)', color: 'rgb(25,173,246)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><I name="play" size={12} color="rgb(25,173,246)" fill="rgb(25,173,246)" strokeWidth={0} /></button>
                  <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 16, color: '#000' }}>{line.jp}</div>
                </div>
                <div style={{ fontFamily: 'Geist', fontSize: 12, color: 'rgb(134,134,134)', fontStyle: 'italic' }}>{line.romaji}</div>
                <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(66,162,1)', marginTop: 3 }}>{line.en}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlight box — what to notice */}
      <div style={{
        marginTop: 18, padding: '12px 14px', borderRadius: 14,
        background: 'rgba(84,206,1,0.10)', border: '2px solid rgba(84,206,1,0.35)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgb(84,206,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <I name="star" size={14} color="#fff" fill="#fff" strokeWidth={0} />
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(50,100,20)', lineHeight: 1.45 }}>
          Notice how <b>です</b> + <b>か</b> turns "お元気" into a question. That's the pattern you just learned.
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
      <BigCTA label="One quick check" onClick={onContinue} color="rgb(84,206,1)" />
    </div>
  </Phone>
);

window.StudyDialogue = StudyDialogue;
