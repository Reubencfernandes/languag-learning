// Learn — duolingo-style serpentine path with connector dots + unit banners
const Learn = ({ onStartLesson, onStartStudy, progress = [], onNav, mode = 'study', onChangeMode }) => {
  // Each unit: color + list of node types
  const units = [
    { eyebrow: 'UNIT 1', title: 'Sounds & Greetings', color: 'rgb(84,206,1)', nodes: ['star','book','star','trophy'] },
    { eyebrow: 'UNIT 2', title: 'Everyday phrases',   color: 'rgb(25,173,246)', nodes: ['star','mic','star','trophy'] },
  ];
  // Serpentine x positions for 4 nodes per unit (centered around ~155 mid)
  const xs = [155, 85, 155, 225];

  let globalIdx = 0;
  const nodeState = (i) => progress.includes(i) ? 'done' : (i === Math.max(-1, ...progress) + 1 ? 'current' : 'locked');

  return (
    <Phone>
      <StatsHeader flagSrc="../../assets/flag-japan.png" streak={7} hearts={5} gems={120} />

      {/* Mode toggle — chunky segmented */}
      <div style={{ position: 'absolute', top: 86, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <ModeToggle value={mode} onChange={onChangeMode} />
      </div>

      <div style={{ position: 'absolute', top: 166, bottom: 72, left: 0, right: 0, overflowY: 'auto', paddingBottom: 40 }}>
        {units.map((u, ui) => (
          <div key={ui} style={{ padding: '18px 34px 0' }}>
            <UnitBanner eyebrow={u.eyebrow} sub={u.title} color={u.color} />
            <div style={{ position: 'relative', height: u.nodes.length * 110 + 20, marginTop: 20 }}>
              {u.nodes.map((iconName, ni) => {
                const idx = globalIdx++;
                const st = nodeState(idx);
                const x = xs[ni];
                const y = ni * 110;
                return (
                  <React.Fragment key={ni}>
                    {/* connector dots to next */}
                    {ni < u.nodes.length - 1 && (() => {
                      const nx = xs[ni+1], ny = (ni+1)*110;
                      const dots = 4;
                      return Array.from({ length: dots }).map((_, di) => {
                        const t = (di+1) / (dots+1);
                        const dx = x + (nx - x) * t + 39;
                        const dy = y + (ny - y) * t + 39;
                        return <div key={di} style={{
                          position: 'absolute', left: dx - 4, top: dy - 4, width: 8, height: 8,
                          borderRadius: '50%', background: 'rgb(229,229,229)',
                        }} />;
                      });
                    })()}
                    <div style={{ position: 'absolute', left: x, top: y }}>
                      <LessonNode state={st} icon={iconName} onClick={() => {
                        if (st === 'locked') return;
                        if (mode === 'study') onStartStudy && onStartStudy(idx);
                        else onStartLesson && onStartLesson(idx);
                      }} />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="learn" onChange={onNav} />
    </Phone>
  );
};

window.Learn = Learn;
