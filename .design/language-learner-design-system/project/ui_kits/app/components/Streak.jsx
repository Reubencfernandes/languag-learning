const Streak = ({ days = 7, goalXP = 30, todayXP = 18, onContinue }) => {
  const weekdays = ['M','T','W','T','F','S','S'];
  const todayIdx = 4; // Friday
  return (
    <Phone>
      <button style={{ position: 'absolute', top: 18, right: 18, width: 32, height: 32, border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I name="x" size={20} color="rgb(100,100,100)" strokeWidth={3} />
      </button>

      <div style={{ position: 'absolute', top: 58, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'linear-gradient(180deg, rgb(255,180,40), rgb(255,110,0))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 0 rgb(200,80,0)' }}>
          <I name="flame" size={82} color="#fff" fill="#fff" strokeWidth={0} />
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 64, color: 'rgb(200,80,0)', marginTop: 18, lineHeight: 1 }}>{days}</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: 'rgb(61,54,2)', marginTop: 4, letterSpacing: '-0.01em' }}>day streak!</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 14, color: 'rgb(100,80,20)', marginTop: 6, textAlign: 'center', padding: '0 40px' }}>
          Come back tomorrow to keep it alive.
        </div>
      </div>

      {/* Weekly grid */}
      <div style={{ position: 'absolute', top: 500, left: 20, right: 20, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 16, padding: 16 }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>This week</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          {weekdays.map((d, i) => {
            const done = i < todayIdx;
            const today = i === todayIdx;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 11, color: today ? 'rgb(255,110,0)' : 'rgb(134,134,134)' }}>{d}</div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: done ? 'rgb(255,150,0)' : today ? '#fff' : 'rgb(243,243,243)',
                  border: today ? '2px dashed rgb(255,110,0)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done && <I name="flame" size={18} color="#fff" fill="#fff" strokeWidth={0} />}
                  {today && <I name="flame" size={18} color="rgb(255,110,0)" fill="rgb(255,110,0)" strokeWidth={0} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily goal */}
      <div style={{ position: 'absolute', top: 640, left: 20, right: 20, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 14, color: '#000' }}>Daily goal</div>
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 13, color: 'rgb(100,100,100)' }}>{todayXP} / {goalXP} XP</div>
        </div>
        <div style={{ marginTop: 10, height: 14, borderRadius: 7, background: 'rgb(243,243,243)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, (todayXP/goalXP)*100)}%`, height: '100%', background: 'linear-gradient(rgb(253,226,73) 0%, rgb(212,116,0) 100%)', borderRadius: 7 }} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center' }}>
        <BigCTA label="Continue" color="rgb(255,150,0)" onClick={onContinue} />
      </div>
    </Phone>
  );
};

window.Streak = Streak;
