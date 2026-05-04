// Study · Done — celebrates completion + unlocks Practice Mode
const StudyDone = ({ lesson, onGoPractice, onClose }) => (
  <Phone>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(66,162,1)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        Study complete
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 32, color: '#000', marginTop: 6, letterSpacing: '-0.015em' }}>
        You've seen it.
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 15, color: 'rgb(100,100,100)', marginTop: 6, padding: '0 30px' }}>
        Now let's make it stick in Practice.
      </div>
    </div>

    {/* Big trophy chip */}
    <div style={{
      position: 'absolute', left: '50%', top: 220, transform: 'translateX(-50%)',
      width: 180, height: 180, borderRadius: '50%',
      background: 'linear-gradient(180deg, rgb(253,226,73), rgb(255,180,40))',
      boxShadow: '0 8px 0 rgb(200,130,20), 0 0 0 12px rgba(253,226,73,0.28)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <I name="trophy" size={96} color="rgb(170,93,0)" fill="rgb(170,93,0)" strokeWidth={0} />
    </div>

    {/* What you picked up */}
    <div style={{ position: 'absolute', left: 22, right: 22, top: 430 }}>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        You picked up
      </div>
      <div style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(84,206,1,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="book" size={14} color="rgb(66,162,1)" strokeWidth={3} />
          </div>
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 14 }}>{lesson.key_vocabulary.length} new words</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(25,173,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="globe" size={14} color="rgb(18,138,200)" strokeWidth={3} />
          </div>
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 14 }}>Pattern: {lesson.main_grammar_pattern.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(170,95,220,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="mic" size={14} color="rgb(110,60,160)" strokeWidth={3} />
          </div>
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 14 }}>1 dialogue observed</div>
        </div>
      </div>

      {/* Unlock banner */}
      <div style={{
        marginTop: 14, padding: '12px 14px', borderRadius: 14,
        background: 'rgba(25,173,246,0.14)', border: '2px solid rgb(25,173,246)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgb(25,173,246)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgb(18,138,200)' }}>
          <I name="dumbbell" size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(18,138,200)' }}>Practice Mode unlocked</div>
          <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(50,100,130)' }}>Recall · use · respond · strengthen</div>
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <BigCTA label="Start Practice" onClick={onGoPractice} color="rgb(25,173,246)" />
      <button onClick={onClose} style={{
        border: 'none', background: 'transparent', cursor: 'pointer',
        fontFamily: 'Geist', fontWeight: 800, fontSize: 13, color: 'rgb(134,134,134)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>Back to map</button>
    </div>
  </Phone>
);

window.StudyDone = StudyDone;
