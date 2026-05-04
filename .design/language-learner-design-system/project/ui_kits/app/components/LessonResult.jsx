const LessonResult = ({ success = true, xp = 18, accuracy = 92, time = '3:24', onContinue }) => {
  const color = success ? 'rgb(84,206,1)' : 'rgb(255,75,75)';
  const shadow = success ? 'rgb(66,162,1)' : 'rgb(200,50,50)';
  return (
    <Phone>
      {/* Confetti dots */}
      {success && Array.from({ length: 14 }).map((_, i) => {
        const palette = ['rgb(253,226,73)', 'rgb(84,206,1)', 'rgb(25,173,246)', 'rgb(255,150,0)', 'rgb(170,95,220)'];
        const left = (i * 31) % 380;
        const top = 60 + (i * 47) % 220;
        const size = 8 + (i % 4) * 3;
        return <div key={i} style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: (i % 2) ? '50%' : '2px', background: palette[i % palette.length], transform: `rotate(${i*30}deg)`, opacity: 0.85 }} />;
      })}

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 130, height: 130, borderRadius: '50%', background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 0 ${shadow}`,
        }}>
          <I name={success ? 'trophy' : 'x'} size={64} color="#fff" fill={success ? '#fff' : 'none'} strokeWidth={success ? 0 : 3.5} />
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 34, color: '#000', marginTop: 28, letterSpacing: '-0.02em' }}>
          {success ? 'Lesson Complete!' : 'So close!'}
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 15, color: 'rgb(100,100,100)', marginTop: 6, textAlign: 'center', padding: '0 40px' }}>
          {success ? 'You nailed it. One step closer to fluency.' : "Don't stress — review and try again."}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 470, left: 20, right: 20, display: 'flex', gap: 10 }}>
        <ResultStat color="rgb(255,150,0)" icon="zap" value={`${xp}`}   label="TOTAL XP" />
        <ResultStat color="rgb(25,173,246)" icon="award" value={`${accuracy}%`} label="ACCURACY" />
        <ResultStat color="rgb(84,206,1)"  icon="flame" value={time}      label="TIME" />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <BigCTA label={success ? 'Continue' : 'Try again'} color={color} onClick={onContinue} />
      </div>
    </Phone>
  );
};

const ResultStat = ({ icon, value, label, color }) => (
  <div style={{ flex: 1, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 14, padding: 12, textAlign: 'center' }}>
    <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color, letterSpacing: '0.1em' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '6px 4px', border: `2px solid ${color}`, borderRadius: 10 }}>
      <I name={icon} size={18} color={color} fill={color} strokeWidth={0} />
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 18, color }}>{value}</div>
    </div>
  </div>
);

window.LessonResult = LessonResult;
