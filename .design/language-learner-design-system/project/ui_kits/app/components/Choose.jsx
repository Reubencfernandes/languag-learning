const { useState: useStateChoose } = React;

const Choose = ({ onContinue }) => {
  const [level, setLevel] = useStateChoose('beginner');
  const [native, setNative] = useStateChoose('en');
  const [learning, setLearning] = useStateChoose('jp');

  const LevelCard = ({ id, title, sub, tag }) => {
    const selected = level === id;
    return (
      <div onClick={() => setLevel(id)} style={{
        borderRadius: 16,
        border: `2px solid ${selected ? 'rgb(25,173,246)' : 'rgb(229,229,229)'}`,
        background: selected ? 'rgba(25,173,246,0.08)' : '#fff',
        padding: '14px 16px', cursor: 'pointer', transition: 'all 120ms ease-out',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: selected ? '0 3px 0 rgb(18,138,200)' : 'none',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: selected ? 'rgb(25,173,246)' : 'rgb(243,243,243)',
          color: selected ? '#fff' : 'rgb(134,134,134)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Geist', fontWeight: 900, fontSize: 18, flex: 'none',
        }}>{tag}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 16, color: '#000' }}>{title}</div>
          <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 13, color: 'rgb(134,134,134)', marginTop: 2 }}>{sub}</div>
        </div>
      </div>
    );
  };
  return (
    <Phone>
      <div style={{ padding: '56px 24px 0' }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 30, color: '#000', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Let's set you up
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 15, color: 'rgb(134,134,134)', marginTop: 6 }}>
          Tell us where you're starting from.
        </div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="My language">
            <Flag src="../../assets/flag-uk.png" /><span>English</span>
            <div style={{ flex: 1 }}/><I name="chevR" size={18} color="rgb(181,181,181)" />
          </Input>
          <Input label="Learning">
            <Flag src="../../assets/flag-japan.png" /><span>Japanese</span>
            <div style={{ flex: 1 }}/><I name="chevR" size={18} color="rgb(181,181,181)" />
          </Input>
          <div>
            <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(50,49,49)', padding: '0 6px', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select level</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <LevelCard id="scratch"      title="From scratch"  sub="I've never learned this language" tag="A0" />
              <LevelCard id="beginner"     title="Beginner"      sub="I know a few words and phrases"   tag="A1" />
              <LevelCard id="intermediate" title="Intermediate"  sub="I can hold a basic conversation"  tag="B1" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 42, bottom: 36 }}>
        <PillCTA label="Let's go" onClick={onContinue} color="rgb(25,173,246)" />
      </div>
    </Phone>
  );
};

window.Choose = Choose;
