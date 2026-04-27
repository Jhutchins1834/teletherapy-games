'use client';

import type { ClickableObjectProps, ObjectState } from './shared';

function discovered(state: ObjectState) {
  return state === 'revealed' ? (
    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">✓</div>
  ) : null;
}

/* ─── 22. Apple Tree ─────────────────────────────────────── */
export function AppleTree({ state, onDiscover }: ClickableObjectProps) {
  const falling = state === 'animating';
  const landed = state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="64" height="80" viewBox="0 0 64 80">
        {/* Trunk */}
        <rect x="26" y="52" width="12" height="28" rx="4" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1"/>
        {/* Foliage layers */}
        <circle cx="32" cy="36" r="24" fill="#27AE60"/>
        <circle cx="16" cy="42" r="16" fill="#2ECC71"/>
        <circle cx="48" cy="42" r="16" fill="#2ECC71"/>
        <circle cx="32" cy="22" r="18" fill="#2ECC71"/>
        {/* Apples hanging */}
        <circle cx="20" cy="32" r="5" fill="#e74c3c"/>
        <line x1="20" y1="27" x2="20" y2="24" stroke="#27AE60" strokeWidth="1.5"/>
        <circle cx="42" cy="28" r="5" fill="#e74c3c"/>
        <line x1="42" y1="23" x2="42" y2="20" stroke="#27AE60" strokeWidth="1.5"/>
        <circle cx="30" cy="44" r="5" fill="#e74c3c"/>
        <line x1="30" y1="39" x2="30" y2="36" stroke="#27AE60" strokeWidth="1.5"/>
        {/* Falling apple */}
        <circle
          cx="42"
          cy={falling ? '70' : landed ? '74' : '28'}
          r="5" fill="#c0392b"
          style={{
            transition: falling ? 'cy 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            animation: landed ? 'apple-bounce 0.4s ease-out' : 'none',
          }}
        />
        {/* Apple highlight */}
        <circle
          cx="44"
          cy={falling ? '68' : landed ? '72' : '26'}
          r="1.5" fill="rgba(255,255,255,0.5)"
          style={{ transition: falling ? 'cy 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none' }}
        />
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 23. Cloud ──────────────────────────────────────────── */
export function Cloud({ state, onDiscover }: ClickableObjectProps) {
  const drifted = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="100" height="54" viewBox="0 0 100 54">
        {/* Sun rays revealed when cloud drifts */}
        {drifted && (
          <g>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => (
              <line key={angle}
                x1={82 + Math.cos(angle*Math.PI/180)*20}
                y1={28 + Math.sin(angle*Math.PI/180)*20}
                x2={82 + Math.cos(angle*Math.PI/180)*30}
                y2={28 + Math.sin(angle*Math.PI/180)*30}
                stroke="#F39C12" strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: 'ray-grow 0.5s ease-out forwards' }}
              />
            ))}
            <circle cx="82" cy="28" r="18" fill="#F1C40F"
              style={{ animation: 'sun-reveal 0.5s ease-out forwards' }}/>
          </g>
        )}
        {/* Cloud */}
        <g style={state === 'animating' ? { animation: 'cloud-drift 0.8s ease-in-out forwards' } : drifted ? { transform: 'translateX(30px)' } : undefined}>
          <circle cx="30" cy="30" r="16" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
          <circle cx="46" cy="22" r="18" fill="white"/>
          <circle cx="62" cy="28" r="16" fill="white"/>
          <circle cx="22" cy="36" r="12" fill="white"/>
          <circle cx="68" cy="34" r="12" fill="white"/>
          {/* Cloud bottom flat */}
          <rect x="10" y="34" width="70" height="12" fill="white"/>
        </g>
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 24. Bird ───────────────────────────────────────────── */
export function Bird({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="36" height="30" viewBox="0 0 36 30"
        style={state === 'animating' ? { animation: 'bird-swoop 1s ease-in-out' } : undefined}>
        {/* Body */}
        <ellipse cx="18" cy="14" rx="10" ry="7" fill="#2C3E50"/>
        {/* Wing left - flapping */}
        <path d={state === 'animating' ? 'M8 12 Q0 4 4 14' : 'M8 12 Q2 8 6 16'}
          fill="#34495E" style={{ transition: 'd 0.2s' }}/>
        {/* Wing right - flapping */}
        <path d={state === 'animating' ? 'M28 12 Q36 4 32 14' : 'M28 12 Q34 8 30 16'}
          fill="#34495E" style={{ transition: 'd 0.2s' }}/>
        {/* Head */}
        <circle cx="26" cy="10" r="6" fill="#2C3E50"/>
        {/* Beak */}
        <path d="M30 10 L36 8 L30 12" fill="#F39C12"/>
        {/* Eye */}
        <circle cx="27" cy="9" r="1.5" fill="#F39C12"/>
        <circle cx="27" cy="9" r="0.8" fill="#1a1a1a"/>
        {/* Tail */}
        <path d="M8 14 Q2 16 0 20 Q4 18 6 22 Q10 18 8 14" fill="#2C3E50"/>
      </svg>
      {/* Flight trail */}
      {state === 'animating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[0,1,2].map((i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-sky-300 opacity-60"
              style={{ left: `${20 - i*8}%`, top: '40%', animation: `trail-fade 1s ease-out ${i*0.15}s forwards` }}/>
          ))}
        </div>
      )}
      {discovered(state)}
    </div>
  );
}

/* ─── 25. Windmill ───────────────────────────────────────── */
export function Windmill({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="54" height="80" viewBox="0 0 54 80">
        {/* Tower */}
        <path d="M18 36 L14 80 L40 80 L36 36 Z" fill="#D2B48C" stroke="#A08060" strokeWidth="1.5"/>
        {/* Tower stripes */}
        {[50, 60, 70].map((y) => (
          <line key={y} x1="15" y1={y} x2="39" y2={y} stroke="#A08060" strokeWidth="1" opacity="0.5"/>
        ))}
        {/* Door */}
        <rect x="22" y="66" width="10" height="14" rx="5 5 0 0" fill="#8B6914"/>
        {/* Hub */}
        <circle cx="27" cy="36" r="5" fill="#8B6914"/>
        {/* Blades - spinning fast when animating */}
        <g transform="translate(27,36)"
          style={state === 'animating' ? { animation: 'blade-spin-fast 1.2s ease-in-out' } : { animation: 'blade-spin-slow 6s linear infinite' }}
          className="origin-[0px_0px]">
          {[0,90,180,270].map((angle) => (
            <path key={angle}
              transform={`rotate(${angle})`}
              d="M0 0 L4 -30 L-4 -30 Z"
              fill="#F5F5F0" stroke="#D0D0C8" strokeWidth="1"/>
          ))}
        </g>
        {/* Cap */}
        <ellipse cx="27" cy="28" rx="14" ry="6" fill="#8B6914"/>
        <polygon points="13,28 27,14 41,28" fill="#A0522D"/>
      </svg>
      {discovered(state)}
    </div>
  );
}
