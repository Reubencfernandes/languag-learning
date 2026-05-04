// Mode toggle used on Learn — chunky Duolingo-style segmented control
const ModeToggle = ({ value = 'study', onChange }) => {
  const segs = [
    { id: 'study',    label: 'Study',    icon: 'book',     note: 'Learn new' },
    { id: 'practice', label: 'Practice', icon: 'dumbbell', note: 'Use it' },
  ];
  return (
    <div style={{
      width: 335, borderRadius: 16, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', padding: 4,
      display: 'flex', gap: 4, boxShadow: '0 4px 14px rgba(80,60,120,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
    }}>
      {segs.map(s => {
        const active = value === s.id;
        return (
          <button key={s.id} onClick={() => onChange && onChange(s.id)} style={{
            flex: 1, border: 'none', borderRadius: 12,
            background: active ? (s.id === 'study' ? 'rgb(84,206,1)' : 'rgb(25,173,246)') : 'transparent',
            boxShadow: active ? (s.id === 'study' ? '0 3px 0 rgb(66,162,1)' : '0 3px 0 rgb(18,138,200)') : 'none',
            color: active ? '#fff' : 'rgb(100,100,100)',
            padding: '10px 6px 8px', cursor: 'pointer',
            fontFamily: 'Geist', fontWeight: 900, fontSize: 14, letterSpacing: '0.02em',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <I name={s.icon} size={18} color={active ? '#fff' : 'rgb(100,100,100)'} strokeWidth={2.5} />
              <span>{s.label}</span>
            </div>
            <div style={{
              fontFamily: 'Geist', fontWeight: 700, fontSize: 11,
              color: active ? 'rgba(255,255,255,0.85)' : 'rgb(150,150,150)',
              letterSpacing: '0.04em',
            }}>{s.note}</div>
          </button>
        );
      })}
    </div>
  );
};

window.ModeToggle = ModeToggle;
