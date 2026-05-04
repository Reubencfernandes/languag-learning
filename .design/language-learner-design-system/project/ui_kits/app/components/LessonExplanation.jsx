const LessonExplanation = ({ onContinue, onClose, progress = 0.37 }) => (
  <Phone>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
      <CloseX onClick={onClose} />
      <ProgressBar value={progress} />
      <HeartBadge count={5} />
    </div>

    <div style={{ position: 'absolute', left: 20, top: 108, right: 20, bottom: 110, overflowY: 'auto' }}>
      <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'rgba(253,226,73,0.35)', fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(170,93,0)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Concept
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 24, color: 'rgb(50,49,49)', lineHeight: 1.2, marginTop: 10 }}>
        What Japanese actually sounds like
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 16, color: 'rgb(80,80,80)', lineHeight: 1.55, marginTop: 18 }}>
        Japanese sounds rhythmic, crisp, and staccato. Here's the breakdown:
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          ['Rhythm', 'A "machine-gun" pace where every syllable has equal length — unlike English.'],
          ['Vowels', 'Only five "pure" vowels (A, I, U, E, O), similar to Spanish or Italian.'],
          ['Structure', 'Simple consonant-vowel pairs (e.g. ka-ta-na) — almost no consonant clumps.'],
          ['The "R"', 'A quick flap of the tongue — a cross between D, L, and R.'],
          ['Melody', 'Driven by pitch accent (high vs. low tones) rather than volume.'],
        ].map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', background: 'rgb(84,206,1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2,
            }}><I name="check" size={16} color="#fff" strokeWidth={3.5} /></div>
            <div style={{ fontFamily: 'Geist', fontSize: 15, lineHeight: 1.45, color: 'rgb(50,49,49)' }}>
              <b style={{ fontWeight: 900, color: '#000' }}>{k}: </b>{v}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
      <BigCTA label="Got it" onClick={onContinue} color="rgb(84,206,1)" />
    </div>
  </Phone>
);

window.LessonExplanation = LessonExplanation;
