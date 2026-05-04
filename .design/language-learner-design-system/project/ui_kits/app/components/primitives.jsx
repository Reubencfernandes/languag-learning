// Shared primitives. Re-used across every screen.
const { useState } = React;

// Lucide icon helper
const Icon = ({ name, size = 24, color = 'currentColor', strokeWidth = 2.25 }) => (
  <i style={{ display: 'inline-flex', width: size, height: size, color }}>
    <img src={`https://unpkg.com/lucide-static@0.469.0/icons/${name}.svg`} width={size} height={size}
         alt="" style={{ filter: color === 'currentColor' ? 'none' : undefined }} />
  </i>
);

// Inline SVG Lucide for when we need to recolor reliably
const LucideSvg = ({ path, size = 24, color = 'currentColor', strokeWidth = 2.25, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);

const Icons = {
  star:       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  play:       <polygon points="6 3 20 12 6 21 6 3"/>,
  lock:       <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  check:      <polyline points="20 6 9 17 4 12"/>,
  x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  chevR:      <polyline points="9 18 15 12 9 6"/>,
  home:       <><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></>,
  book:       <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  dumbbell:   <><path d="M14.4 14.4L9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="M21.5 21.5l-1.4-1.4"/><path d="M3.9 3.9L2.5 2.5"/><path d="M6.343 2.515a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829L7.404 10.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829z"/></>,
  user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  flame:      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>,
  trophy:     <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></>,
  settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  mic:        <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>,
  volume:     <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>,
  heart:      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  zap:        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  award:      <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
  globe:      <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
};

const I = ({ name, size, color, fill, strokeWidth }) => (
  <LucideSvg path={Icons[name]} size={size} color={color} fill={fill} strokeWidth={strokeWidth} />
);

// Chevron-right for buttons
const ChevronRight = ({ size = 16, color = '#fff' }) => <I name="chevR" size={size} color={color} />;

const PillCTA = ({ label, onClick, showArrow = true, color = '#131111', textColor = '#fff', width = 318 }) => {
  // Glass variant when color is dark/#131111 stays solid (hero CTA), otherwise frosted
  const isDark = color === '#131111' || color === '#000';
  return (
    <button onClick={onClick} style={{
      width, height: 52, borderRadius: 26,
      border: isDark ? 'none' : '1px solid rgba(255,255,255,0.5)',
      background: isDark
        ? 'linear-gradient(180deg, #2a2628 0%, #131111 100%)'
        : 'rgba(255,255,255,0.42)',
      backdropFilter: isDark ? 'none' : 'blur(18px) saturate(1.4)',
      WebkitBackdropFilter: isDark ? 'none' : 'blur(18px) saturate(1.4)',
      color: isDark ? textColor : '#2a1a3a',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      fontFamily: 'Geist', fontWeight: 700, fontSize: 16, padding: 0,
      boxShadow: isDark
        ? '0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
        : '0 4px 16px rgba(80,60,120,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(120,100,160,0.15)',
      letterSpacing: '0.01em',
    }}>
      <span>{label}</span>
      {showArrow && <ChevronRight color={isDark ? textColor : '#2a1a3a'} />}
    </button>
  );
};

// Full-width lesson CTA — glass variant: iridescent tinted glass, softer press
const BigCTA = ({ label, onClick, color = 'rgb(25,173,246)', textColor = '#fff', disabled = false }) => {
  const [pressed, setPressed] = useState(false);
  // Map brand color to a soft glass tint + edge color
  const tintMap = {
    'rgb(25,173,246)': { tint: 'rgba(25,173,246,0.78)',  glow: 'rgba(25,173,246,0.35)',  edge: 'rgba(120,200,255,0.9)' },
    'rgb(84,206,1)':   { tint: 'rgba(84,206,1,0.78)',    glow: 'rgba(84,206,1,0.35)',    edge: 'rgba(180,240,120,0.9)' },
    'rgb(253,226,73)': { tint: 'rgba(253,200,73,0.82)',  glow: 'rgba(253,200,73,0.4)',   edge: 'rgba(255,240,170,0.95)' },
  };
  const t = tintMap[color] || { tint: color, glow: 'rgba(0,0,0,0.15)', edge: 'rgba(255,255,255,0.6)' };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 335, height: 55, borderRadius: 18,
        border: disabled ? '1px solid rgba(180,175,190,0.5)' : `1px solid ${t.edge}`,
        background: disabled
          ? 'rgba(230,228,235,0.55)'
          : `linear-gradient(180deg, ${t.tint} 0%, ${t.tint.replace('0.78','0.92').replace('0.82','0.95')} 100%)`,
        backdropFilter: 'blur(12px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.5)',
        color: disabled ? 'rgb(150,145,160)' : textColor,
        fontFamily: 'Geist', fontWeight: 800, fontSize: 16, letterSpacing: '0.06em',
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: pressed
          ? `0 2px 8px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.4)`
          : `0 10px 28px ${t.glow}, 0 2px 0 rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -6px 12px rgba(0,0,0,0.08)`,
        transform: pressed ? 'translateY(2px)' : 'none',
        transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
        textTransform: 'uppercase',
        textShadow: disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.15)',
      }}>{label}</button>
  );
};

const Input = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 12, color: 'rgba(50,35,80,0.7)', padding: '0 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    <div style={{
      height: 56, borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.55)',
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(18px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14,
      fontFamily: 'Geist', fontSize: 16, fontWeight: 500, color: '#1a0f2e',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 12px rgba(80,60,120,0.08)',
    }}>{children}</div>
  </div>
);

const Flag = ({ src, size = 'md' }) => {
  const dim = size === 'lg' ? { w: 48, h: 34 } : { w: 36, h: 24 };
  return <div style={{
    width: dim.w, height: dim.h, borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.6)',
    backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: 'none',
    boxShadow: '0 2px 8px rgba(80,60,120,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
  }} />;
};

const UnitBanner = ({ eyebrow, sub, color = 'rgb(84,206,1)', onDark = true }) => {
  const tintMap = {
    'rgb(84,206,1)':   { tint: 'rgba(84,206,1,0.35)',   edge: 'rgba(180,240,120,0.85)', glow: 'rgba(84,206,1,0.25)' },
    'rgb(25,173,246)': { tint: 'rgba(25,173,246,0.35)', edge: 'rgba(140,210,255,0.85)', glow: 'rgba(25,173,246,0.25)' },
    'rgb(212,116,0)':  { tint: 'rgba(255,170,60,0.35)', edge: 'rgba(255,210,140,0.85)', glow: 'rgba(212,116,0,0.25)' },
  };
  const t = tintMap[color] || { tint: 'rgba(255,255,255,0.35)', edge: 'rgba(255,255,255,0.6)', glow: 'rgba(0,0,0,0.1)' };
  return (
    <div style={{
      width: 335, minHeight: 76, borderRadius: 20, padding: '14px 18px',
      background: `linear-gradient(135deg, ${t.tint} 0%, rgba(255,255,255,0.2) 100%)`,
      backdropFilter: 'blur(20px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
      border: `1px solid ${t.edge}`,
      boxShadow: `0 8px 24px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.3)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* specular highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 28,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
      <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 11, color: 'rgba(40,20,70,0.65)', letterSpacing: '0.16em', textTransform: 'uppercase', position: 'relative' }}>{eyebrow}</div>
      <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 18, color: '#1a0f2e', marginTop: 4, position: 'relative', letterSpacing: '-0.01em' }}>{sub}</div>
    </div>
  );
};

// Glass lesson node — refractive puck
const LessonNode = ({ state = 'locked', onClick, icon = 'star' }) => {
  const palette = {
    done:    { tint: 'rgba(84,206,1,0.7)',   edge: 'rgba(180,240,120,0.95)', glow: 'rgba(84,206,1,0.45)',   glyph: 'star',  gcolor: '#fff' },
    current: { tint: 'rgba(255,200,60,0.78)', edge: 'rgba(255,235,150,1)',    glow: 'rgba(255,180,40,0.55)', glyph: 'play',  gcolor: '#fff' },
    locked:  { tint: 'rgba(220,215,230,0.55)', edge: 'rgba(255,255,255,0.55)', glow: 'rgba(100,80,140,0.15)', glyph: 'lock', gcolor: 'rgba(100,90,130,0.7)' },
  };
  const p = palette[state];
  const [pressed, setPressed] = useState(false);
  const clickable = state !== 'locked';
  return (
    <div style={{ width: 78, height: 78, position: 'relative', cursor: clickable ? 'pointer' : 'default' }}
         onClick={clickable ? onClick : undefined}
         onPointerDown={() => clickable && setPressed(true)}
         onPointerUp={() => setPressed(false)}
         onPointerLeave={() => setPressed(false)}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, ${p.tint} 55%, ${p.tint} 100%)`,
        backdropFilter: 'blur(14px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.6)',
        border: `1px solid ${p.edge}`,
        boxShadow: pressed
          ? `0 4px 12px ${p.glow}, inset 0 2px 4px rgba(255,255,255,0.6)`
          : `0 12px 28px ${p.glow}, 0 2px 0 rgba(255,255,255,0.5), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -4px 10px rgba(0,0,0,0.08)`,
        transform: pressed ? 'translateY(3px) scale(0.98)' : 'none',
        transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I name={p.glyph} size={32} color={p.gcolor} fill={state === 'done' ? p.gcolor : 'none'} strokeWidth={2.5} />
      </div>
      {state === 'current' && (
        <div style={{
          position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(14px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 6px 14px rgba(80,60,120,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          borderRadius: 12, padding: '5px 12px', fontFamily: 'Geist', fontWeight: 800, fontSize: 10,
          color: 'rgb(180,90,0)', letterSpacing: '0.14em', whiteSpace: 'nowrap',
        }}>START</div>
      )}
    </div>
  );
};

const CloseX = ({ onClick }) => (
  <button onClick={onClick} style={{
    width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer',
    color: 'rgb(181,181,181)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}><I name="x" size={26} strokeWidth={3} /></button>
);

const ProgressBar = ({ value = 0.5 }) => (
  <div style={{
    flex: 1, height: 16, borderRadius: 8, overflow: 'hidden', position: 'relative',
    background: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: 'inset 0 1px 2px rgba(80,60,120,0.15), 0 1px 0 rgba(255,255,255,0.5)',
  }}>
    <div style={{
      width: `${Math.round(value * 100)}%`, height: '100%',
      background: 'linear-gradient(90deg, rgba(255,220,100,0.9) 0%, rgba(255,160,80,0.95) 100%)',
      borderRadius: 8, transition: 'width 500ms ease-out',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(180,80,0,0.2), 0 0 12px rgba(255,180,60,0.4)',
    }} />
  </div>
);

const HeartBadge = ({ count = 5 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'rgb(255,75,75)', fontFamily: 'Geist', fontWeight: 900, fontSize: 16 }}>
    <I name="heart" color="rgb(255,75,75)" fill="rgb(255,75,75)" size={22} strokeWidth={0} />
    <span>{count}</span>
  </div>
);

const FlameBadge = ({ count = 7 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Geist', fontWeight: 900, fontSize: 16, color: 'rgb(255,150,0)' }}>
    <I name="flame" color="rgb(255,150,0)" fill="rgb(255,150,0)" size={22} strokeWidth={0} />
    <span>{count}</span>
  </div>
);

const GemBadge = ({ count = 120 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Geist', fontWeight: 900, fontSize: 16, color: 'rgb(25,173,246)' }}>
    <I name="zap" color="rgb(25,173,246)" fill="rgb(25,173,246)" size={22} strokeWidth={0} />
    <span>{count}</span>
  </div>
);

const BottomNav = ({ active = 'learn', onChange }) => {
  const items = [
    { id: 'learn',    label: 'Learn',    icon: 'book' },
    { id: 'practice', label: 'Practice', icon: 'dumbbell' },
    { id: 'profile',  label: 'Profile',  icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14, height: 68,
      borderRadius: 28,
      border: '1px solid rgba(255,255,255,0.55)',
      background: 'rgba(255,255,255,0.35)',
      backdropFilter: 'blur(24px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
      boxShadow: '0 12px 32px rgba(80,60,120,0.18), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 6px',
    }}>
      {items.map(i => {
        const isActive = active === i.id;
        return (
          <button key={i.id} onClick={() => onChange && onChange(i.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            border: isActive ? '1px solid rgba(255,255,255,0.7)' : '1px solid transparent',
            background: isActive ? 'rgba(255,255,255,0.55)' : 'transparent',
            backdropFilter: isActive ? 'blur(10px)' : 'none',
            cursor: 'pointer',
            color: isActive ? '#2a1550' : 'rgba(60,45,90,0.5)',
            fontFamily: 'Geist', fontSize: 10, fontWeight: 700, padding: '6px 16px',
            borderRadius: 20,
            boxShadow: isActive ? '0 2px 8px rgba(80,60,120,0.1), inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
            transition: 'all 180ms ease-out',
          }}>
            <I name={i.icon} size={24} strokeWidth={isActive ? 2.4 : 2} />
            <span style={{ letterSpacing: '0.02em' }}>{i.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Top stats bar — glass surface
const StatsHeader = ({ flagSrc, streak = 7, hearts = 5, gems = 120 }) => (
  <div style={{
    padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14,
    background: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    borderBottom: '1px solid rgba(255,255,255,0.4)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
  }}>
    <Flag src={flagSrc} size="lg" />
    <div style={{ flex: 1 }} />
    <FlameBadge count={streak} />
    <GemBadge count={gems} />
    <HeartBadge count={hearts} />
  </div>
);

Object.assign(window, {
  PillCTA, BigCTA, Input, Flag, UnitBanner, LessonNode, CloseX, ProgressBar,
  BottomNav, ChevronRight, Icon, I, Icons, HeartBadge, FlameBadge, GemBadge, StatsHeader,
});
