// Practice hub — expanded per spec. Groups drills into task types.
// "recall -> use -> respond -> strengthen"
const Practice = ({ onBack, onNav, onOpenDrill, unlocked = true }) => {
  const drills = [
    { id: 'dialogue',   title: 'Dialogue check',      sub: 'Understand the conversation',   icon: 'volume',   color: 'rgb(25,173,246)', shadow: 'rgb(18,138,200)' },
    { id: 'gapfill',    title: 'Fill the blanks',     sub: 'Particles, verb forms',         icon: 'book',     color: 'rgb(84,206,1)',   shadow: 'rgb(66,162,1)' },
    { id: 'reply',      title: 'Choose the reply',    sub: 'Pick the natural response',     icon: 'globe',    color: 'rgb(170,95,220)', shadow: 'rgb(130,70,170)' },
    { id: 'aichat',     title: 'Talk with AI',        sub: 'Free reply, typed or spoken',   icon: 'mic',      color: 'rgb(255,150,0)',  shadow: 'rgb(200,110,0)' },
    { id: 'listen',     title: 'Listening',           sub: 'Hear it · type what you heard', icon: 'volume',   color: 'rgb(18,138,200)', shadow: 'rgb(12,110,170)' },
  ];
  return (
    <Phone>
      <StatsHeader flagSrc="../../assets/flag-japan.png" streak={7} hearts={5} gems={120} />
      <div style={{ position: 'absolute', top: 82, left: 0, right: 0, bottom: 72, overflowY: 'auto', padding: '20px 22px 30px' }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 26, color: '#000', letterSpacing: '-0.01em' }}>Practice</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 14, color: 'rgb(134,134,134)', marginTop: 4 }}>
          Recall · use · respond · strengthen.
        </div>

        {!unlocked && (
          <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,150,0,0.15)', border: '2px solid rgb(255,150,0)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <I name="lock" size={18} color="rgb(200,110,0)" strokeWidth={2.5} />
            <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(170,93,0)' }}>
              Finish Study first — then Practice unlocks.
            </div>
          </div>
        )}

        {/* Solo Challenge — the timed mini battle, per spec */}
        <button onClick={() => unlocked && onOpenDrill && onOpenDrill('solo')} style={{
          width: '100%', marginTop: 18, padding: 16, borderRadius: 16,
          background: 'linear-gradient(135deg, rgb(253,226,73), rgb(255,150,0))',
          boxShadow: '0 4px 0 rgb(200,110,20)', border: 'none', cursor: unlocked ? 'pointer' : 'default',
          textAlign: 'left', opacity: unlocked ? 1 : 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I name="zap" size={28} color="rgb(170,93,0)" fill="rgb(170,93,0)" strokeWidth={0} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(170,93,0)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Solo Challenge</div>
              <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 18, color: 'rgb(61,54,2)', marginTop: 2 }}>60-second mini battle</div>
              <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(61,54,2)', opacity: 0.8, marginTop: 2 }}>
                Mixed items · 50% current · 30% recent · 20% weak
              </div>
            </div>
            <I name="chevR" size={22} color="rgb(61,54,2)" />
          </div>
        </button>

        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(134,134,134)', marginTop: 24, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Task types</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {drills.map(d => (
            <button key={d.id} onClick={() => unlocked && onOpenDrill && onOpenDrill(d.id)} style={{
              border: '1px solid rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', borderRadius: 16, padding: 14,
              display: 'flex', alignItems: 'center', gap: 14, cursor: unlocked ? 'pointer' : 'default',
              textAlign: 'left', opacity: unlocked ? 1 : 0.6,
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 0 ${d.shadow}`, flex: 'none' }}>
                <I name={d.icon} size={26} color="#fff" strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 16, color: '#000' }}>{d.title}</div>
                <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 13, color: 'rgb(134,134,134)', marginTop: 2 }}>{d.sub}</div>
              </div>
              <I name="chevR" size={20} color="rgb(181,181,181)" />
            </button>
          ))}
        </div>

        {/* Weak items — feed back per spec */}
        <div style={{ marginTop: 22, padding: 14, borderRadius: 14, background: 'rgba(255,75,75,0.08)', border: '2px solid rgba(255,75,75,0.35)' }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(200,50,50)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Review weak items
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['particle か','vocab: お元気','vocab: はい','verb form: です'].map(t => (
              <div key={t} style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,100,100,0.7)', fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(200,50,50)' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="practice" onChange={onNav} />
    </Phone>
  );
};

window.Practice = Practice;
