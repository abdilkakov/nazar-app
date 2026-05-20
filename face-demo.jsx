// ===== FaceDemo: animated camera mock with face landmarks + focus score =====
// Loops through a scripted scenario: focused -> drifting -> phone -> focused.

const { useEffect, useState, useRef } = React;

const SCENARIO = [
  // each: duration ms, state, gaze (eye target dx,dy), pose offsetX, blink prob, score target
  { dur: 4000, state: 'good',  gx: 0,    gy: 0,    px: 0,   py: 0,   score: 92 },
  { dur: 2500, state: 'good',  gx: 0.18, gy: 0.05, px: 6,   py: 0,   score: 86 },
  { dur: 2500, state: 'warn',  gx: 0.45, gy: 0.18, px: 18,  py: 4,   score: 58 },
  { dur: 3000, state: 'bad',   gx: 0.55, gy: 0.62, px: 26,  py: 22,  score: 22 },
  { dur: 2500, state: 'warn',  gx: 0.20, gy: 0.10, px: 12,  py: 8,   score: 64 },
  { dur: 4000, state: 'good',  gx: 0,    gy: 0,    px: 0,   py: 0,   score: 94 }
];

// total cycle length
const CYCLE = SCENARIO.reduce((s, k) => s + k.dur, 0);

function getScenarioState(t) {
  let elapsed = 0;
  for (let i = 0; i < SCENARIO.length; i++) {
    const cur = SCENARIO[i];
    if (t < elapsed + cur.dur) {
      const next = SCENARIO[(i + 1) % SCENARIO.length];
      const k = (t - elapsed) / cur.dur;
      // ease-in-out
      const e = k < 0.5 ? 2*k*k : 1 - Math.pow(-2*k+2, 2)/2;
      return {
        state: cur.state,
        gx: cur.gx + (next.gx - cur.gx) * e,
        gy: cur.gy + (next.gy - cur.gy) * e,
        px: cur.px + (next.px - cur.px) * e,
        py: cur.py + (next.py - cur.py) * e,
        score: cur.score + (next.score - cur.score) * e,
        idx: i
      };
    }
    elapsed += cur.dur;
  }
  return { state: 'good', gx:0, gy:0, px:0, py:0, score: 90, idx: 0 };
}

function FaceDemo({ t, size = 'lg', showPhone = true }) {
  // t: tick timestamp from parent
  const s = getScenarioState(t % CYCLE);
  const score = Math.round(s.score);

  // Eye positions — base around center
  const eyeY = 100;
  const leftEyeX = 92;
  const rightEyeX = 128;
  const irisDX = s.gx * 4;  // max iris shift
  const irisDY = s.gy * 3;
  // pose offset (head turn)
  const headX = s.px;
  const headY = s.py;

  // blink every ~3s
  const blinkPhase = (t % 3200) / 3200;
  const blinkOpen = blinkPhase > 0.94 ? Math.max(0, 1 - (blinkPhase - 0.94) / 0.04) :
                    blinkPhase > 0.98 ? (blinkPhase - 0.98) / 0.02 : 1;

  // Phone visible during bad state
  const phoneVisible = showPhone && s.state === 'bad';
  const phoneOpacity = phoneVisible ? Math.min(1, (t % CYCLE - 9000) / 400) : 0;

  return (
    <svg viewBox="0 0 220 165" preserveAspectRatio="xMidYMid meet" style={{width:'100%', height:'100%', display:'block'}}>
      <defs>
        <radialGradient id="faceG" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#E8C9A4" />
          <stop offset="70%" stopColor="#9C7654" />
          <stop offset="100%" stopColor="#3B2A1B" />
        </radialGradient>
        <radialGradient id="bgVignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="rgba(255,235,205,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect width="220" height="165" fill="url(#bgVignette)" />

      {/* Head silhouette */}
      <g transform={`translate(${headX} ${headY})`}>
        {/* shoulders */}
        <path d="M 30 165 Q 60 130 110 130 Q 160 130 190 165 Z" fill="rgba(45,33,24,0.85)" />
        {/* neck */}
        <rect x="98" y="120" width="24" height="22" fill="rgba(120,86,58,0.75)" />
        {/* head */}
        <ellipse cx="110" cy="92" rx="38" ry="44" fill="url(#faceG)" opacity="0.9" />
        {/* hair top */}
        <path d="M 75 78 Q 78 50 110 48 Q 142 50 145 80 Q 142 70 110 64 Q 80 70 75 78 Z" fill="rgba(35,24,16,0.95)" />

        {/* face landmarks (the model's view): subtle dotted mesh */}
        <g opacity="0.55">
          {/* face outline */}
          <ellipse cx="110" cy="92" rx="38" ry="44" fill="none" stroke="#9BC487" strokeWidth="0.5" strokeDasharray="1 2" />
          {/* mid lines */}
          <path d="M 110 50 L 110 134" stroke="#9BC487" strokeWidth="0.4" strokeDasharray="1 2" />
          <path d="M 75 92 Q 110 96 145 92" stroke="#9BC487" strokeWidth="0.4" strokeDasharray="1 2" fill="none" />
        </g>

        {/* Eyes */}
        <g>
          {/* left eye */}
          <ellipse cx={leftEyeX} cy={eyeY} rx="6.5" ry={5.2 * blinkOpen} fill="#F5EDDC" stroke="#3a2415" strokeWidth="0.5" />
          <circle cx={leftEyeX + irisDX} cy={eyeY + irisDY} r={2.8 * (blinkOpen > 0.4 ? 1 : 0)} fill="#3a2615" />
          <circle cx={leftEyeX + irisDX - 0.6} cy={eyeY + irisDY - 0.6} r="0.7" fill="#F5EDDC" opacity={blinkOpen} />
          {/* right eye */}
          <ellipse cx={rightEyeX} cy={eyeY} rx="6.5" ry={5.2 * blinkOpen} fill="#F5EDDC" stroke="#3a2415" strokeWidth="0.5" />
          <circle cx={rightEyeX + irisDX} cy={eyeY + irisDY} r={2.8 * (blinkOpen > 0.4 ? 1 : 0)} fill="#3a2615" />
          <circle cx={rightEyeX + irisDX - 0.6} cy={eyeY + irisDY - 0.6} r="0.7" fill="#F5EDDC" opacity={blinkOpen} />
        </g>

        {/* eyebrows */}
        <path d={`M 84 88 Q 92 ${85 + s.py * 0.1} 100 88`} stroke="#2a1810" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d={`M 120 88 Q 128 ${85 + s.py * 0.1} 136 88`} stroke="#2a1810" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* nose */}
        <path d="M 110 102 L 108 114 Q 110 116 112 114 Z" fill="rgba(70,48,32,0.5)" />

        {/* mouth */}
        <path d={`M 102 124 Q 110 ${s.state === 'good' ? 127 : 125} 118 124`} stroke="#2a1810" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* face bounding box */}
        <rect x="68" y="48" width="84" height="92" fill="none"
              stroke={s.state === 'good' ? '#9BC487' : s.state === 'warn' ? '#E5A04A' : '#E5614A'}
              strokeWidth="1" strokeDasharray="3 2" opacity="0.85" />
        {/* corner brackets */}
        {[[68,48,1,1],[152,48,-1,1],[68,140,1,-1],[152,140,-1,-1]].map(([x,y,dx,dy],i)=> (
          <g key={i} stroke={s.state === 'good' ? '#9BC487' : s.state === 'warn' ? '#E5A04A' : '#E5614A'} strokeWidth="1.4" fill="none">
            <path d={`M ${x} ${y + 6*dy} L ${x} ${y} L ${x + 6*dx} ${y}`} />
          </g>
        ))}

        {/* gaze direction line */}
        <g opacity="0.85">
          <line x1={leftEyeX} y1={eyeY} x2={leftEyeX + irisDX * 22} y2={eyeY + irisDY * 22}
                stroke="#9BC487" strokeWidth="0.6" strokeDasharray="2 2" />
          <line x1={rightEyeX} y1={eyeY} x2={rightEyeX + irisDX * 22} y2={eyeY + irisDY * 22}
                stroke="#9BC487" strokeWidth="0.6" strokeDasharray="2 2" />
        </g>
      </g>

      {/* Phone (appears when distracted) */}
      {phoneOpacity > 0 && (
        <g opacity={phoneOpacity}>
          <g transform="translate(150 110) rotate(18)">
            <rect x="0" y="0" width="28" height="44" rx="4" fill="#1a1814" stroke="#E5614A" strokeWidth="1.2" />
            <rect x="2" y="3" width="24" height="38" rx="2" fill="#5a8fd6" opacity="0.85" />
            <rect x="6" y="8" width="16" height="2.5" rx="1" fill="rgba(255,255,255,0.7)" />
            <rect x="6" y="13" width="12" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
            <rect x="6" y="18" width="14" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
            <rect x="6" y="23" width="10" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
            <text x="14" y="40" fontFamily="JetBrains Mono, monospace" fontSize="3" fill="rgba(255,255,255,0.7)" textAnchor="middle">PHONE</text>
          </g>
          {/* corner brackets on phone */}
          {[[145,110,1,1],[183,110,-1,1],[145,158,1,-1],[183,158,-1,-1]].map(([x,y,dx,dy],i)=> (
            <g key={i} stroke="#E5614A" strokeWidth="1.2" fill="none">
              <path d={`M ${x} ${y + 4*dy} L ${x} ${y} L ${x + 4*dx} ${y}`} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

// Big focus score gauge ring
function ScoreRing({ score, label }) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const dash = (score / 100) * C;
  // smooth blend through accents
  const color = score >= 70 ? 'var(--c-mint)' : score >= 40 ? 'var(--c-amber)' : 'var(--c-pink)';
  return (
    <svg viewBox="0 0 120 120" style={{width:'100%', height:'100%'}}>
      <defs>
        <linearGradient id="ringG" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--c-blue)"/>
          <stop offset="50%" stopColor="var(--c-violet)"/>
          <stop offset="100%" stopColor={color}/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle cx="60" cy="60" r={R} fill="none" stroke="url(#ringG)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              transform="rotate(-90 60 60)"
              style={{transition: 'stroke-dasharray 0.3s ease'}} />
      <text x="60" y="58" textAnchor="middle" dominantBaseline="central"
            fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="34" fill="var(--ink)" letterSpacing="-1.5">
        {score}
      </text>
      <text x="60" y="82" textAnchor="middle"
            fontFamily="JetBrains Mono, monospace" fontSize="8" fill="var(--ink-3)" letterSpacing="1.2" fontWeight="500">
        {label}
      </text>
    </svg>
  );
}

// Mini timeline strip of scores for today
function TimelineStrip({ t }) {
  // Generate 14 hour-blocks with stable but varying values
  const bars = [];
  for (let i = 0; i < 14; i++) {
    const seed = Math.sin(i * 1.9 + 1) * 0.5 + 0.5;
    const noise = Math.sin((t / 2000) + i * 0.3) * 0.06;
    const v = Math.max(0.08, Math.min(1, seed * 0.85 + 0.1 + noise));
    bars.push(v);
  }
  return (
    <svg viewBox="0 0 200 36" preserveAspectRatio="none" style={{width:'100%', height:'42px', display:'block'}}>
      {bars.map((v, i) => {
        const x = (i / bars.length) * 200;
        const w = (200 / bars.length) - 2;
        const h = v * 32;
        const color = v > 0.7 ? 'var(--c-mint)' : v > 0.4 ? 'var(--c-amber)' : 'var(--c-pink)';
        return <rect key={i} x={x} y={34 - h} width={w} height={h} rx="2" fill={color} opacity="0.85" />;
      })}
    </svg>
  );
}

window.FaceDemo = FaceDemo;
window.ScoreRing = ScoreRing;
window.TimelineStrip = TimelineStrip;
window.SCENARIO = SCENARIO;
window.CYCLE = CYCLE;
window.getScenarioState = getScenarioState;

// ===== Running attention waveform =====
// Shows the last ~12 seconds of attention as a smoothed line.
function AttentionWave({ t, height = 60 }) {
  const W = 360, H = height;
  const SAMPLES = 90;
  // sample backwards from t
  const points = [];
  for (let i = 0; i < SAMPLES; i++) {
    const tt = t - (SAMPLES - 1 - i) * 120; // 120ms steps
    const s = getScenarioState(((tt % CYCLE) + CYCLE) % CYCLE);
    const noise = Math.sin(tt / 60) * 2 + Math.cos(tt / 41) * 1.5;
    const v = Math.max(0, Math.min(100, s.score + noise));
    points.push(v);
  }
  // build smoothed path
  let d = '';
  for (let i = 0; i < points.length; i++) {
    const x = (i / (points.length - 1)) * W;
    const y = H - 6 - (points[i] / 100) * (H - 14);
    d += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const last = points[points.length - 1];
  const cur = getScenarioState(t % CYCLE);
  const curColor = cur.state === 'good' ? 'var(--c-mint)' : cur.state === 'warn' ? 'var(--c-amber)' : 'var(--c-pink)';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="wave-svg" style={{height}}>
      <defs>
        <linearGradient id="waveStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--c-blue)" stopOpacity="0.6" />
          <stop offset="60%" stopColor="var(--c-violet)" stopOpacity="0.9" />
          <stop offset="100%" stopColor={curColor} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--c-violet)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--c-violet)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal guide lines */}
      <line x1="0" y1={H - 6 - 0.5*(H-14)} x2={W} y2={H - 6 - 0.5*(H-14)} stroke="var(--ink-4)" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.4"/>
      {/* fill */}
      <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill="url(#waveFill)" />
      {/* line */}
      <path d={d} fill="none" stroke="url(#waveStroke)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* current point */}
      <circle cx={W} cy={H - 6 - (last/100)*(H-14)} r="4" fill={curColor}>
        <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={W} cy={H - 6 - (last/100)*(H-14)} r="2" fill="white" />
    </svg>
  );
}

window.AttentionWave = AttentionWave;
