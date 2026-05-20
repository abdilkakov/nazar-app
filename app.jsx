// ===== Nazar landing — main App (Glass / iOS18 aesthetic) =====

const { useState, useEffect, useRef, useMemo } = React;
const t_ = window.I18N;

const MESH_THEMES = [
  { id: 'aurora', label: 'Aurora', swatch: ['#B3D2FF', '#D6C3FF', '#FFD2E1', '#C3F0E5'] },
  { id: 'ocean', label: 'Ocean', swatch: ['#A8D8FF', '#C0EFEA', '#B8E2FF', '#C9F5E5'] },
  { id: 'sunset', label: 'Sunset', swatch: ['#FFD2A4', '#FFC2D1', '#FFE2A6', '#FFB0CB'] },
  { id: 'plasma', label: 'Plasma', swatch: ['#E8B8FF', '#FFB8E6', '#C6BCFF', '#FFD2C2'] }
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "mesh": "aurora",
  "heroVariant": 0
}/*EDITMODE-END*/;

// ===== Util =====
function useTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0; let start = performance.now();
    const loop = (now) => { setT(now - start); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ===== Mesh background ===== 
function Mesh() {
  return (
    <div className="mesh">
      <div className="mesh-blob c"></div>
      <div className="mesh-blob d"></div>
    </div>
  );
}

// ===== Nav =====
function SunIcon() { return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8L3.4 3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function MoonIcon() { return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 9.3A5.5 5.5 0 1 1 6.7 3a4.5 4.5 0 0 0 6.3 6.3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }

function Nav({ L, lang, setLang, mode, setMode }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="nav-logo-mark"></span>
        Nazar
      </div>
      <div className="nav-links">
        <a href="#what">{L.nav.features}</a>
        <a href="#how">{L.nav.how}</a>
        <a href="#stats">{L.nav.stats}</a>
        <a href="#pricing">{L.nav.pricing}</a>
        <a href="#faq">{L.nav.faq}</a>
      </div>
      <div className="nav-right">
        <button className="mode-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="lang">
          {['en', 'ru', 'kk'].map(code => (
            <button key={code} className={lang === code ? 'on' : ''} onClick={() => setLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <a href="/focus/" className="btn btn-vibrant">{L.cta_primary} <span className="btn-arrow">→</span></a>
      </div>
    </nav>
  );
}

// ===== Hero =====
function HeroHeadline({ parts }) {
  return (
    <h1 className="h1">
      {parts[0]}{' '}<em>{parts[1]}</em>{' '}{parts[2]}
    </h1>
  );
}

function Hero({ L, t, variant }) {
  const copy = L.hero_copy[variant] || L.hero_copy[0];
  const s = window.getScenarioState(t % window.CYCLE);
  const score = Math.round(s.score);
  const phaseLabel = s.state === 'good' ? L.demo_label_focused
    : s.state === 'warn' ? L.demo_label_drifting
      : L.demo_label_phone;

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">
            <span className="dot"></span>{L.eyebrow_hero}
          </div>
          <HeroHeadline parts={copy.h} />
          <p className="lede">{copy.sub}</p>
          <div className="hero-ctas">
            <a href="/focus/" className="btn btn-vibrant">{L.cta_primary} <span className="btn-arrow">→</span></a>
            <a href="#what" className="btn btn-ghost">{L.cta_demo} ↓</a>
          </div>
          <div className="hero-fineprint">
            {L.fineprint.map((f, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep"></span>}
                <span>{f}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="demo-cluster">
          <div className="demo-cam-wrap">
            <div className="cam-card">
              <div className="cam">
                <div className="cam-grid"></div>
                <div className="cam-vignette"></div>
                <FaceDemo t={t} />
                <div className="cam-rec"><span className="pulse"></span>LIVE · ON-DEVICE</div>
                <div className="cam-ts">{new Date().toTimeString().slice(0, 8)}</div>
                <div className={`cam-label ${s.state === 'good' ? 'good' : s.state === 'warn' ? 'warn' : 'bad'}`}>
                  <span className="swatch"></span>
                  {phaseLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="demo-tile score-card">
            <div className="k">{L.demo_score.toUpperCase()}</div>
            <div className="score-ring-wrap"><ScoreRing score={score} label="LIVE" /></div>
          </div>
          <div className="demo-tile">
            <div className="k">{L.demo_drift.toUpperCase()}</div>
            <div className="v">7</div>
            <div className="k" style={{ marginTop: 14 }}>{L.demo_phone.toUpperCase()}</div>
            <div className="v">3<small>×</small></div>
          </div>
        </div>
      </div>

      {/* Vitals strip with running waveform */}
      <div className="wrap" style={{ marginTop: 12 }}>
        <div className="glass vitals">
          <div className="vital-stack">
            <span className="vital-label">ATTENTION · LIVE</span>
            <span className="vital-num">{score}<small>/100</small></span>
          </div>
          <div className="vital-wave">
            <AttentionWave t={t} height={56} />
          </div>
          <div className="vital-stack">
            <span className="vital-label">FOCUS · TODAY</span>
            <span className="vital-num">3.2<small>h</small></span>
          </div>
          <div className="vital-stack">
            <span className="vital-label">DRIFTS</span>
            <span className="vital-num">7</span>
          </div>
          <div className="vital-stack">
            <span className="vital-label">PHONE</span>
            <span className="vital-num">3<small>×</small></span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ===== Live demo "what it sees" =====
function Live({ L, t }) {
  return (
    <section id="what">
      <div className="wrap">
        <span className="section-eyebrow">{L.live_eyebrow}</span>
        <h2 className="section-h">Four signals.<br /><em>One honest score.</em></h2>
        <p className="section-sub">{L.live_sub}</p>

        <div className="live-grid">
          <div className="cam-card">
            <div className="cam" style={{ aspectRatio: '4 / 3' }}>
              <div className="cam-grid"></div>
              <div className="cam-vignette"></div>
              <FaceDemo t={t + 1500} />
              <div className="cam-rec"><span className="pulse"></span>LIVE</div>
              <div className="cam-ts">cam-0 · 30fps</div>
            </div>
          </div>
          <div className="feature-list">
            {L.features.map((f, i) => (
              <div className="feature" key={i}>
                <div className="feature-num">0{i + 1}</div>
                <div>
                  <div className="feature-t">{f.t}</div>
                  <div className="feature-d">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== How it works =====
function StepArt({ idx }) {
  if (idx === 0) {
    return (
      <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{
          background: 'var(--glass-strong)', backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)', borderRadius: 14, padding: '14px 16px',
          boxShadow: 'var(--glass-inset), 0 12px 30px -12px rgba(11,18,32,0.2)',
          fontSize: 12, color: 'var(--ink-2)', maxWidth: '92%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-mint)', boxShadow: '0 0 6px var(--c-mint)' }}></span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-3)' }}>NAZAR.APP</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>Allow Nazar to access your camera?</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 11, color: 'var(--ink-3)', background: 'transparent', fontWeight: 600 }}>Deny</button>
            <button style={{ padding: '5px 12px', borderRadius: 8, border: 0, fontSize: 11, background: 'linear-gradient(135deg, var(--c-blue), var(--c-violet))', color: 'white', fontWeight: 600, boxShadow: '0 4px 12px -4px var(--c-blue)' }}>Allow</button>
          </div>
        </div>
      </div>
    );
  }
  if (idx === 1) {
    return (
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>SESSION · 50:00</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginTop: 6, color: 'var(--ink)', letterSpacing: '-0.015em' }}>Writing the Q3 report</div>
        <div style={{ height: 8, background: 'rgba(11,18,32,0.08)', borderRadius: 999, marginTop: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '34%', background: 'linear-gradient(90deg, var(--c-blue), var(--c-violet))', borderRadius: 999, boxShadow: '0 0 8px rgba(45,108,250,0.4)' }}></div>
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-3)', marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
          <span>17:23 ELAPSED</span><span>32:37 LEFT</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', fontWeight: 500 }}>TODAY · 3h 41m FOCUSED</div>
      <div style={{ marginTop: 14 }}>
        <svg viewBox="0 0 200 28" preserveAspectRatio="none" style={{ width: '100%', height: 34 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const seed = Math.sin(i * 1.3 + 2) * 0.5 + 0.5;
            const v = Math.max(0.1, seed);
            const color = v > 0.7 ? 'var(--c-mint)' : v > 0.4 ? 'var(--c-amber)' : 'var(--c-pink)';
            return <rect key={i} x={i * 6.5} y={28 - v * 24} width="5" height={v * 24} rx="1.5" fill={color} opacity="0.9" />;
          })}
        </svg>
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-3)', marginTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
        <span>09:00</span><span>13:00</span><span>17:00</span><span>21:00</span>
      </div>
    </div>
  );
}

function How({ L }) {
  return (
    <section id="how">
      <div className="wrap">
        <span className="section-eyebrow">{L.how_eyebrow}</span>
        <h2 className="section-h">{L.how_h}</h2>
        <p className="section-sub">{L.how_sub}</p>
        <div className="steps">
          {L.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">STEP 0{i + 1}</div>
              <div className="step-t">{s.t}</div>
              <div className="step-d">{s.d}</div>
              <div className="step-art"><StepArt idx={i} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Calculator =====
function Calculator({ L, lang }) {
  const [hours, setHours] = useState(8);
  const switches = 4;
  const lostMinPerDay = hours * switches * 23;
  const lostHoursYear = Math.round((lostMinPerDay * 230) / 60);
  const fmt = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ru-RU');

  return (
    <section>
      <div className="wrap">
        <span className="section-eyebrow">{L.calc_eyebrow}</span>
        <h2 className="section-h">{L.calc_h}</h2>
        <div className="calc-card">
          <div>
            <div className="calc-slider-wrap">
              <div className="calc-slider-label">
                <span>{L.calc_label}</span>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>{hours}h</span>
              </div>
              <input type="range" min="2" max="14" step="1" value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="calc-slider" />
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 22, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.02em' }}>
              {L.calc_label_2}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 14, maxWidth: '40ch' }}>{L.calc_note}</p>
          </div>
          <div className="calc-result">
            <div className="calc-num">{fmt.format(lostHoursYear)}</div>
            <div className="calc-unit">{L.calc_unit}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== Stats =====
function Stats({ L }) {
  return (
    <section id="stats">
      <div className="wrap">
        <span className="section-eyebrow">{L.stats_eyebrow}</span>
        <h2 className="section-h">{L.stats_h}</h2>
        <p className="section-sub">{L.stats_sub}</p>
        <div className="stats-grid">
          {L.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-k">{s.k}</div>
              <div className="stat-v">{s.v}<small>{s.u}</small></div>
              <div className="stat-d">{s.d}</div>
            </div>
          ))}
        </div>
        <p className="note-asterisk">{L.stats_note}</p>
      </div>
    </section>
  );
}

// ===== Testimonials =====
function Testimonials({ L }) {
  return (
    <section>
      <div className="wrap">
        <span className="section-eyebrow">{L.testi_eyebrow}</span>
        <h2 className="section-h">{L.testi_h}</h2>
        <div className="testi-grid">
          {L.testimonials.map((tt, i) => (
            <div className="testi" key={i}>
              <div className="testi-q">"{tt.q}"</div>
              <div className="testi-meta">
                <div className="testi-avi">{tt.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div className="testi-who">
                  <b>{tt.name}</b><br />
                  <span className="role">{tt.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Pricing =====
function Check({ on }) {
  if (on) return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5 L6 10.5 L11 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 7 H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
function Pricing({ L }) {
  return (
    <section id="pricing">
      <div className="wrap">
        <span className="section-eyebrow">{L.pricing_eyebrow}</span>
        <h2 className="section-h">{L.pricing_h}</h2>
        <div className="pricing-grid">
          {L.plans.map((p, i) => (
            <div key={i} className={`plan ${p.featured ? 'featured' : ''}`}>
              {p.badge && <span className="plan-badge">{p.badge}</span>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">${p.price}<small>{p.unit}</small></div>
              <div className="plan-desc">{p.desc}</div>
              <ul className="plan-feats">
                {p.features.map((f, j) => (
                  <li className={`plan-feat ${f.on ? '' : 'off'}`} key={j}>
                    <Check on={f.on} />
                    <span>{f.t}</span>
                  </li>
                ))}
              </ul>
              <a className="plan-cta" href="/focus/">{p.cta} →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FAQ =====
function FAQ({ L }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq">
      <div className="wrap" style={{ maxWidth: 880 }}>
        <span className="section-eyebrow">{L.faq_eyebrow}</span>
        <h2 className="section-h">{L.faq_h}</h2>
        <div className="faq-list">
          {L.faqs.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="plus">+</span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Final CTA =====
function FinalCTA({ L }) {
  return (
    <section className="final-cta" id="cta">
      <div className="wrap">
        <div className="final-cta-card">
          <h2 className="section-h">{L.final_h}</h2>
          <p className="lede">{L.final_sub}</p>
          <a href="/focus/" className="btn btn-primary">{L.cta_primary} <span className="btn-arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

// ===== Footer =====
function Footer({ L }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-card">
          <div className="footer-grid">
            <div>
              <div className="nav-logo" style={{ marginBottom: 12, padding: 0 }}>
                <span className="nav-logo-mark"></span>
                Nazar
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: '30ch', textWrap: 'pretty', marginTop: 8 }}>{L.footer.tag}</p>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="kz-badge">
                  <span className="kz-flag"></span>
                  {L.footer.built}
                </span>
              </div>
            </div>
            <div>
              <div className="footer-h">{L.footer.h_product}</div>
              <a className="footer-link" href="#what">{L.footer.product[0]}</a>
              <a className="footer-link" href="#how">{L.footer.product[1]}</a>
              <a className="footer-link" href="#pricing">{L.footer.product[2]}</a>
            </div>
            <div>
              <div className="footer-h">{L.footer.h_company}</div>
              <a className="footer-link" href="about.html">{L.footer.company[0]}</a>
              <a className="footer-link" href="blog.html">{L.footer.company[1]}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{L.footer.copy}</span>
            <span>Zhassulan, Serik & Nurislam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== App =====
function App() {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('nazar.lang');
    if (stored && t_[stored]) return stored;
    const nav = (navigator.language || 'en').slice(0, 2);
    return t_[nav] ? nav : 'en';
  });
  useEffect(() => { localStorage.setItem('nazar.lang', lang); }, [lang]);
  const L = t_[lang];
  const t = useTick();

  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', tweaks.mode || 'light');
    document.documentElement.setAttribute('data-mesh', tweaks.mesh || 'aurora');
  }, [tweaks.mode, tweaks.mesh]);

  const setMode = (m) => setTweak('mode', m);
  const variant = (typeof tweaks.heroVariant === 'number') ? tweaks.heroVariant : 0;

  return (
    <>
      <Mesh />
      <Nav L={L} lang={lang} setLang={setLang} mode={tweaks.mode || 'light'} setMode={setMode} />
      <Hero L={L} t={t} variant={variant} />
      <Live L={L} t={t} />
      <How L={L} />
      <Calculator L={L} lang={lang} />
      <Stats L={L} />
      <Testimonials L={L} />
      <Pricing L={L} />
      <FAQ L={L} />
      <FinalCTA L={L} />
      <Footer L={L} />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Mode">
          <window.TweakRadio
            value={tweaks.mode || 'light'}
            options={['light', 'dark']}
            onChange={v => setTweak('mode', v)}
          />
        </window.TweakSection>
        <window.TweakSection label="Mesh palette">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MESH_THEMES.map(m => (
              <button key={m.id}
                onClick={() => setTweak('mesh', m.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: `1px solid ${tweaks.mesh === m.id ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
                  background: tweaks.mesh === m.id ? 'rgba(0,0,0,0.04)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left'
                }}>
                <span style={{
                  width: 28, height: 22, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${m.swatch[0]} 0%, ${m.swatch[1]} 50%, ${m.swatch[2]} 100%)`,
                  border: '1px solid rgba(0,0,0,0.08)'
                }}></span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </window.TweakSection>
        <window.TweakSection label="Hero copy variant">
          <window.TweakRadio
            value={String(variant)}
            options={['Attention', 'Phone count', 'vs Pomodoro']}
            onChange={v => {
              const labels = ['Attention', 'Phone count', 'vs Pomodoro'];
              setTweak('heroVariant', labels.indexOf(v));
            }}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
