const Homepage = ({ onStart }) => (
  <Phone>
    <div style={{ position: 'absolute', left: 24, top: 72, width: 354 }}>
      <div style={{ fontFamily: 'Geist', fontWeight: 900, fontSize: 36, color: '#000', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
        Master Any Language with Ease
      </div>
      <div style={{ fontFamily: 'Geist', fontWeight: 600, fontSize: 17, color: 'rgb(61,54,2)', lineHeight: 1.4, marginTop: 18 }}>
        Build your vocabulary, practice speaking with confidence, and learn naturally through personalized lessons — whenever you want, wherever you are.
      </div>
    </div>
    <img src="../../assets/peep-sitting.png" alt=""
         style={{ position: 'absolute', left: 73, top: 346, width: 287, height: 400, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 42, bottom: 58 }}>
      <PillCTA label="Get started" onClick={onStart} />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: 'Geist', fontWeight: 700, fontSize: 13, color: 'rgb(61,54,2)', opacity: 0.75 }}>
      Login with 🤗 Hugging Face
    </div>
  </Phone>
);

window.Homepage = Homepage;
