// Study Mode — intro screen. Shows objective + what's inside this lesson.
// "see -> understand -> observe". No pressure, no test UI.
const StudyIntro = ({ lesson, onClose, onContinue }) => (
  <Phone>
    {/* Header — close + "Study" label + step pills */}
    <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
      <CloseX onClick={onClose} />
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(66,162,1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Study · Step 1 of 5
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,0,0,0,0].map((v,i)=>(
          <div key={i} style={{ width: 24, height: 6, borderRadius: 3, background: v ? 'rgba(84,206,1,0.85)' : 'rgba(120,100,160,0.25)' }} />
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', left: 20, top: 108, right: 20, bottom: 110, overflowY: 'auto' }}>
      <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'rgba(84,206,1,0.18)', fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(66,162,1)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Unit {lesson.unit} · {lesson.topic}
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 26, color: 'rgb(50,49,49)', lineHeight: 1.15, marginTop: 10 }}>
        {lesson.objective}
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 14, color: 'rgb(134,134,134)', marginTop: 6 }}>
        You'll see · understand · observe. No tests yet.
      </div>

      {/* What's inside */}
      <div style={{ marginTop: 22, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)' }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          In this lesson
        </div>
        {[
          { icon: 'book',   label: `${lesson.key_vocabulary.length} key words`, sub: lesson.key_vocabulary.slice(0,4).map(v=>v.jp).join(' · ') + ' …' },
          { icon: 'globe',  label: '1 main grammar pattern', sub: lesson.main_grammar_pattern.name },
          { icon: 'volume', label: `${lesson.example_sentences.length} example sentences`, sub: 'with audio + rōmaji' },
          { icon: 'mic',    label: 'Short dialogue', sub: `${lesson.short_dialogue.length} lines — natural greeting` },
          { icon: 'check',  label: '1 light check', sub: 'Just to help it stick' },
        ].map((row,i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid rgb(240,240,240)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(84,206,1,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <I name={row.icon} size={20} color="rgb(66,162,1)" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 14, color: '#000' }}>{row.label}</div>
              <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 12, color: 'rgb(134,134,134)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance chip — Practice unlocks after */}
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(25,173,246,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <I name="lock" size={16} color="rgb(25,173,246)" strokeWidth={2.5} />
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(18,138,200)' }}>
          Practice Mode unlocks once you finish Study.
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
      <BigCTA label="Begin Study" onClick={onContinue} color="rgb(84,206,1)" />
    </div>
  </Phone>
);

window.StudyIntro = StudyIntro;
