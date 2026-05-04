// Study · Grammar — main pattern + 1 support + example sentences with native-language explanation
const StudyGrammar = ({ lesson, onClose, onContinue }) => (
  <Phone>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 54, display: 'flex', alignItems: 'center', gap: 12 }}>
      <CloseX onClick={onClose} />
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 13, color: 'rgb(66,162,1)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Study · Grammar
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,1,1,0,0].map((v,i)=>(
          <div key={i} style={{ width: 24, height: 6, borderRadius: 3, background: v ? 'rgba(84,206,1,0.85)' : 'rgba(120,100,160,0.25)' }} />
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', left: 20, top: 102, right: 20, bottom: 110, overflowY: 'auto', paddingBottom: 12 }}>
      <div style={{ fontFamily: 'Geist', fontWeight: 800, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Main pattern
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 24, color: '#000', marginTop: 6, lineHeight: 1.2 }}>
        {lesson.main_grammar_pattern.name}
      </div>

      {/* Skeleton / formula chip */}
      <div style={{
        marginTop: 14, padding: '14px 16px', borderRadius: 14,
        background: 'rgb(25,173,246)', boxShadow: '0 4px 0 rgb(18,138,200)',
      }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Pattern</div>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 22, color: '#fff', marginTop: 4, letterSpacing: '0.01em' }}>
          {lesson.main_grammar_pattern.skeleton}
        </div>
      </div>

      {/* Native-language explanation — for beginner levels */}
      <div style={{
        marginTop: 14, padding: '14px 16px', borderRadius: 14,
        background: 'rgba(253,226,73,0.22)', border: '2px solid rgb(253,226,73)',
      }}>
        <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 11, color: 'rgb(170,93,0)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
          <I name="globe" size={12} color="rgb(170,93,0)" strokeWidth={3} />
          In plain English
        </div>
        <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 14, color: 'rgb(50,49,49)', lineHeight: 1.5, marginTop: 8 }}>
          {lesson.study_explanation}
        </div>
      </div>

      {/* Example sentences */}
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>
        Examples ({lesson.example_sentences.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lesson.example_sentences.map((ex, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.42)', backdropFilter: 'blur(18px) saturate(1.4)', WebkitBackdropFilter: 'blur(18px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <button style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none',
              background: 'rgb(84,206,1)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 0 rgb(66,162,1)', flex: 'none',
            }}><I name="volume" size={18} color="#fff" /></button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 17, color: '#000' }}>{ex.jp}</div>
              <div style={{ fontFamily: 'Geist', fontSize: 12, color: 'rgb(134,134,134)', marginTop: 2, fontStyle: 'italic' }}>{ex.romaji}</div>
              <div style={{ fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(66,162,1)', marginTop: 4 }}>{ex.en}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Support pattern (if any) */}
      {lesson.support_grammar_patterns.length > 0 && (
        <>
          <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 12, color: 'rgb(134,134,134)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 22, marginBottom: 8 }}>
            Bonus
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: 'rgba(170,95,220,0.10)', border: '2px solid rgba(170,95,220,0.35)' }}>
            <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 14, color: 'rgb(110,60,160)' }}>{lesson.support_grammar_patterns[0].name}</div>
            <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 13, color: 'rgb(80,80,80)', marginTop: 4, lineHeight: 1.45 }}>{lesson.support_grammar_patterns[0].meaning}</div>
          </div>
        </>
      )}
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
      <BigCTA label="See it in a dialogue" onClick={onContinue} color="rgb(84,206,1)" />
    </div>
  </Phone>
);

window.StudyGrammar = StudyGrammar;
