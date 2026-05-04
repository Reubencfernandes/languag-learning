const Profile = ({ onNav }) => {
  const stats = [
    { icon: 'flame',  label: 'Day streak', value: '7',   color: 'rgb(255,150,0)' },
    { icon: 'zap',    label: 'Total XP',   value: '1,240', color: 'rgb(25,173,246)' },
    { icon: 'trophy', label: 'League',     value: 'Silver', color: 'rgb(200,180,100)' },
    { icon: 'award',  label: 'Top 3 finish', value: '2',   color: 'rgb(170,95,220)' },
  ];
  const achievements = [
    { icon: 'flame',  title: 'Wildfire',     sub: '7-day streak',  color: 'rgb(255,150,0)',  done: true },
    { icon: 'book',   title: 'Scholar',      sub: '10 lessons',    color: 'rgb(25,173,246)', done: true },
    { icon: 'star',   title: 'Sharpshooter', sub: '20 perfect',    color: 'rgb(255,214,0)',  done: false },
    { icon: 'globe',  title: 'Polyglot',     sub: '2nd language',  color: 'rgb(84,206,1)',   done: false },
  ];
  return (
    <Phone>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(180deg, rgba(255,220,80,0.55), rgba(255,170,50,0.4))', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
      <div style={{ position: 'absolute', top: 18, right: 18 }}>
        <button style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I name="settings" size={20} color="rgb(61,54,2)" />
        </button>
      </div>

      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 108, height: 108, borderRadius: '50%', border: '5px solid #fff', background: 'rgb(25,173,246)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 42, color: '#fff' }}>R</div>
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: '#000', marginTop: 14 }}>Reuben F.</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(61,54,2)', opacity: 0.7, marginTop: 2 }}>Joined April 2026 · 🇯🇵 Japanese learner</div>
      </div>

      <div style={{ position: 'absolute', top: 260, left: 20, right: 20, bottom: 84, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <I name={s.icon} size={22} color={s.color} fill={s.color} strokeWidth={0} />
                <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 20, color: '#000' }}>{s.value}</div>
              </div>
              <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgb(134,134,134)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(134,134,134)', marginTop: 22, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Achievements</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {achievements.map((a, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', gap: 12, opacity: a.done ? 1 : 0.55 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <I name={a.icon} size={24} color="#fff" fill="#fff" strokeWidth={0} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 15, color: '#000' }}>{a.title}</div>
                <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 12, color: 'rgb(134,134,134)' }}>{a.sub}</div>
              </div>
              {a.done && <I name="check" size={20} color="rgb(84,206,1)" strokeWidth={3.5} />}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" onChange={onNav} />
    </Phone>
  );
};

window.Profile = Profile;
