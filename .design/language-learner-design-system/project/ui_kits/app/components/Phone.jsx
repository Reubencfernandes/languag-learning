// Phone frame — 402 × 874, matches Figma artboard
// GLASS THEME: aurora background + subtle iridescent tint visible behind translucent panels

const Phone = ({ children, background = 'aurora' }) => {
  const isAurora = background === 'aurora';
  return (
    <div style={{
      position: 'relative', width: 402, height: 874,
      background: isAurora ? 'linear-gradient(160deg, #efe4fb 0%, #dfe8fa 45%, #f9e8ee 100%)' : background,
      overflow: 'hidden', fontFamily: 'Geist',
      boxShadow: '0 30px 80px rgba(60,40,90,0.22), 0 0 0 1px rgba(255,255,255,0.6), inset 0 0 0 1px rgba(255,255,255,0.4)',
      borderRadius: 38,
    }}>
      {isAurora && (
        <>
          {/* aurora blobs — create color the glass refracts */}
          <div style={{
            position: 'absolute', width: 460, height: 460, left: -140, top: -120,
            background: 'radial-gradient(circle, rgba(168,130,255,0.85) 0%, rgba(168,130,255,0) 62%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 380, height: 380, right: -100, top: 80,
            background: 'radial-gradient(circle, rgba(255,150,200,0.75) 0%, rgba(255,150,200,0) 62%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 480, height: 480, left: -100, bottom: -160,
            background: 'radial-gradient(circle, rgba(110,190,255,0.85) 0%, rgba(110,190,255,0) 62%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 320, height: 320, right: -80, bottom: 40,
            background: 'radial-gradient(circle, rgba(255,220,120,0.7) 0%, rgba(255,220,120,0) 62%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', width: 280, height: 280, left: 120, top: 320,
            background: 'radial-gradient(circle, rgba(180,255,220,0.55) 0%, rgba(180,255,220,0) 62%)',
            pointerEvents: 'none',
          }} />
        </>
      )}
      {children}
    </div>
  );
};

window.Phone = Phone;
