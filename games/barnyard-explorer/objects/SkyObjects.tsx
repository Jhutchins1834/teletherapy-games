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
      <svg width="70" height="84" viewBox="0 0 70 84">
        {/* Trunk — brown rect */}
        <rect x="28" y="54" width="14" height="30" rx="5" fill="#784212"/>
        {/* Canopy — overlapping green circles */}
        <circle cx="35" cy="38" r="26" fill="#27AE60"/>
        <circle cx="16" cy="44" r="18" fill="#2ECC71"/>
        <circle cx="54" cy="44" r="18" fill="#2ECC71"/>
        <circle cx="35" cy="22" r="20" fill="#2ECC71"/>
        {/* Top highlight */}
        <circle cx="35" cy="18" r="12" fill="#27AE60" opacity="0.6"/>
        {/* Static apples */}
        <circle cx="20" cy="32" r="5" fill="#C0392B"/>
        <circle cx="44" cy="26" r="5" fill="#E74C3C"/>
        <circle cx="30" cy="44" r="5" fill="#C0392B"/>
        {/* Apple stems */}
        <rect x="19" y="26" width="2" height="5" rx="1" fill="#27AE60"/>
        <rect x="43" y="20" width="2" height="5" rx="1" fill="#27AE60"/>
        <rect x="29" y="38" width="2" height="5" rx="1" fill="#27AE60"/>
        {/* Falling apple */}
        <circle
          cx="44"
          cy={falling ? '72' : landed ? '76' : '26'}
          r="6" fill="#E74C3C"
          style={{
            transition: falling ? 'cy 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            animation: landed ? 'apple-bounce 0.4s ease-out' : 'none',
          }}
        />
        {/* Falling apple stem */}
        <rect
          x="43" y={falling ? '65' : landed ? '69' : '19'}
          width="2" height="5" rx="1" fill="#27AE60"
          style={{ transition: falling ? 'y 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none' }}
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
      <svg width="110" height="58" viewBox="0 0 110 58">
        {/* Sun revealed when cloud drifts — flat yellow circle with ray lines */}
        {drifted && (
          <g>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => (
              <line key={angle}
                x1={88 + Math.cos(angle * Math.PI / 180) * 22}
                y1={30 + Math.sin(angle * Math.PI / 180) * 22}
                x2={88 + Math.cos(angle * Math.PI / 180) * 32}
                y2={30 + Math.sin(angle * Math.PI / 180) * 32}
                stroke="#F39C12" strokeWidth="3" strokeLinecap="round"
                style={{ animation: 'ray-grow 0.5s ease-out forwards' }}
              />
            ))}
            <circle cx="88" cy="30" r="20" fill="#F9E79F"
              style={{ animation: 'sun-reveal 0.5s ease-out forwards' }}/>
          </g>
        )}
        {/* Cloud — overlapping white rounded shapes */}
        <g style={state === 'animating' ? { animation: 'cloud-drift 0.8s ease-in-out forwards' } : drifted ? { transform: 'translateX(32px)' } : undefined}>
          {/* Base rectangle */}
          <rect x="8" y="32" width="74" height="18" rx="9" fill="#ECF0F1"/>
          {/* Bumps */}
          <circle cx="22" cy="32" r="16" fill="#ECF0F1"/>
          <circle cx="40" cy="24" r="20" fill="#ECF0F1"/>
          <circle cx="60" cy="28" r="16" fill="#ECF0F1"/>
          <circle cx="72" cy="34" r="12" fill="#ECF0F1"/>
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
      <svg width="38" height="28" viewBox="0 0 38 28"
        style={state === 'animating' ? { animation: 'bird-swoop 1s ease-in-out' } : undefined}>
        {/* Body — dark blue rounded rect */}
        <ellipse cx="19" cy="16" rx="11" ry="7" fill="#2C3E50"/>
        {/* Wing left — flapping */}
        <path d={state === 'animating' ? 'M9 14 Q1 5 5 14' : 'M9 14 Q2 10 6 18'}
          fill="#34495E"/>
        {/* Wing right — flapping */}
        <path d={state === 'animating' ? 'M29 14 Q37 5 33 14' : 'M29 14 Q36 10 32 18'}
          fill="#34495E"/>
        {/* Head */}
        <circle cx="28" cy="12" r="7" fill="#2C3E50"/>
        {/* Beak — orange triangle */}
        <polygon points="33,11 38,13 33,15" fill="#F39C12"/>
        {/* Eye */}
        <circle cx="30" cy="11" r="2" fill="#F4D03F"/>
        <circle cx="30" cy="11" r="1" fill="#1A252F"/>
        {/* Tail */}
        <path d="M8 16 Q2 18 0 22 Q4 20 6 24 Q10 20 8 16" fill="#2C3E50"/>
      </svg>
      {/* Flight trail */}
      {state === 'animating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[0,1,2].map((i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-sky-300 opacity-60"
              style={{ left: `${20 - i * 8}%`, top: '40%', animation: `trail-fade 1s ease-out ${i * 0.15}s forwards` }}/>
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
      <svg width="58" height="86" viewBox="0 0 58 86">
        {/* Tower — tapered trapezoid */}
        <path d="M20 38 L16 86 L42 86 L38 38 Z" fill="#D4A574"/>
        {/* Tower stripe details */}
        <line x1="17" y1="56" x2="41" y2="56" stroke="#C4956A" strokeWidth="1.5" opacity="0.5"/>
        <line x1="16" y1="68" x2="42" y2="68" stroke="#C4956A" strokeWidth="1.5" opacity="0.5"/>
        <line x1="15" y1="80" x2="43" y2="80" stroke="#C4956A" strokeWidth="1.5" opacity="0.5"/>
        {/* Door */}
        <rect x="23" y="70" width="12" height="16" rx="6 6 0 0" fill="#784212"/>
        {/* Cap */}
        <polygon points="14,38 29,20 44,38" fill="#784212"/>
        <ellipse cx="29" cy="38" rx="16" ry="5" fill="#8B4513"/>
        {/* Hub */}
        <circle cx="29" cy="38" r="5" fill="#D4A574"/>
        {/* Blades — 4 rectangular blades in X pattern */}
        <g transform="translate(29,38)"
          style={state === 'animating' ? { animation: 'blade-spin-fast 1.2s ease-in-out' } : { animation: 'blade-spin-slow 6s linear infinite' }}
          className="origin-[0px_0px]">
          {[0,90,180,270].map((angle) => (
            <rect key={angle}
              transform={`rotate(${angle})`}
              x="-4" y="-32" width="8" height="30" rx="3"
              fill="#ECF0F1"/>
          ))}
        </g>
      </svg>
      {discovered(state)}
    </div>
  );
}
