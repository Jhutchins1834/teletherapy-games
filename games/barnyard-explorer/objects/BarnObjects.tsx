'use client';

import type { ClickableObjectProps, ObjectState } from './shared';

/* ─── Shared helpers ─────────────────────────────────────── */

function wrap(
  state: ObjectState,
  onDiscover: () => void,
  animClass: string,
  children: React.ReactNode,
  extraClass = '',
) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-100
        ${state === 'idle' ? 'hover:scale-110' : ''}
        ${state === 'animating' ? animClass : ''}
        ${extraClass}
      `}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}
    >
      {children}
      {state === 'revealed' && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">
          ✓
        </div>
      )}
    </div>
  );
}

/* ─── 1. Corn Bucket ─────────────────────────────────────── */
export function CornBucket({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-corn-spill', (
    <div className="relative">
      <svg width="44" height="44" viewBox="0 0 44 44">
        {/* bucket body */}
        <path d="M8 14 L10 38 L34 38 L36 14 Z" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5"/>
        <rect x="6" y="11" width="32" height="5" rx="2" fill="#A0793B" stroke="#5C4A1E" strokeWidth="1"/>
        {/* corn kernels */}
        <circle cx="15" cy="25" r="3" fill="#F5C518"/>
        <circle cx="22" cy="22" r="3" fill="#F5C518"/>
        <circle cx="29" cy="25" r="3" fill="#F5C518"/>
        <circle cx="18" cy="31" r="2.5" fill="#F5C518"/>
        <circle cx="26" cy="31" r="2.5" fill="#F5C518"/>
        {/* handle */}
        <path d="M10 13 Q22 4 34 13" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      {state === 'animating' && (
        <div className="absolute top-6 left-0 w-full pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-yellow-400"
              style={{ left: `${10 + i * 16}%`, animation: `corn-kernel 0.8s ease-out ${i * 0.08}s forwards` }} />
          ))}
        </div>
      )}
    </div>
  ));
}

/* ─── 2. Barn Door ───────────────────────────────────────── */
export function BarnDoor({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-100 ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}
    >
      {/* Door frame */}
      <svg width="52" height="70" viewBox="0 0 52 70">
        <rect x="1" y="1" width="50" height="68" rx="2" fill="#1a0a00" stroke="#5C3A1E" strokeWidth="2"/>
        {/* Sliding door panel */}
        <rect
          x={state === 'animating' || state === 'revealed' ? '28' : '2'}
          y="2" width="24" height="66" rx="1"
          fill="#c0392b"
          stroke="#922B21" strokeWidth="1"
          style={{ transition: 'x 0.6s ease-in-out' }}
        />
        {/* Door planks */}
        {[18, 30, 42, 54].map((y) => (
          <line key={y} x1="28" y1={y} x2="50" y2={y} stroke="#922B21" strokeWidth="0.8" opacity="0.6"/>
        ))}
        {/* Handle */}
        <circle cx={state === 'animating' || state === 'revealed' ? '48' : '22'} cy="35" r="3" fill="#d4ac0d"
          style={{ transition: 'cx 0.6s ease-in-out' }}/>
      </svg>
      {state === 'revealed' && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">✓</div>
      )}
    </div>
  );
}

/* ─── 3. Hay Bale ────────────────────────────────────────── */
export function HayBale({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-hay-burst', (
    <div className="relative">
      <svg width="54" height="38" viewBox="0 0 54 38">
        <rect x="2" y="8" width="50" height="28" rx="4" fill="#D4A017" stroke="#B8860B" strokeWidth="1.5"/>
        {/* twine bands */}
        <line x1="18" y1="8" x2="18" y2="36" stroke="#8B6914" strokeWidth="2"/>
        <line x1="36" y1="8" x2="36" y2="36" stroke="#8B6914" strokeWidth="2"/>
        {/* hay texture */}
        {[12, 24, 44].map((x) => (
          <path key={x} d={`M${x} 12 Q${x+3} 22 ${x} 32`} fill="none" stroke="#C9950C" strokeWidth="1" opacity="0.7"/>
        ))}
      </svg>
      {state === 'animating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-1 h-4 bg-yellow-500 rounded"
              style={{
                left: `${10 + i * 15}%`, top: '20%',
                animation: `hay-piece 0.9s ease-out ${i * 0.07}s forwards`,
                transform: `rotate(${i * 30}deg)`,
              }} />
          ))}
        </div>
      )}
    </div>
  ));
}

/* ─── 4. Pitchfork ───────────────────────────────────────── */
export function Pitchfork({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-pitchfork-fall', (
    <svg width="28" height="72" viewBox="0 0 28 72"
      style={{ transformOrigin: 'bottom center' }}>
      {/* handle */}
      <rect x="12" y="20" width="5" height="52" rx="2" fill="#8B6914"/>
      {/* tines */}
      <rect x="5" y="2" width="3" height="22" rx="1.5" fill="#71797E"/>
      <rect x="12" y="2" width="3" height="22" rx="1.5" fill="#71797E"/>
      <rect x="19" y="2" width="3" height="22" rx="1.5" fill="#71797E"/>
      {/* crossbar */}
      <rect x="4" y="20" width="21" height="4" rx="2" fill="#71797E"/>
    </svg>
  ));
}

/* ─── 5. Horseshoe ───────────────────────────────────────── */
export function Horseshoe({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-spin-fast', (
    <svg width="36" height="36" viewBox="0 0 36 36"
      style={{ transformOrigin: 'center center' }}>
      <path
        d="M6 30 L6 16 Q6 4 18 4 Q30 4 30 16 L30 30"
        fill="none" stroke="#71797E" strokeWidth="6" strokeLinecap="round"
      />
      {/* nail holes */}
      <circle cx="8" cy="22" r="2" fill="#2C3E50"/>
      <circle cx="28" cy="22" r="2" fill="#2C3E50"/>
      <circle cx="10" cy="30" r="2" fill="#2C3E50"/>
      <circle cx="26" cy="30" r="2" fill="#2C3E50"/>
    </svg>
  ));
}

/* ─── 6. Saddle ──────────────────────────────────────────── */
export function Saddle({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-saddle-bounce', (
    <svg width="60" height="36" viewBox="0 0 60 36"
      style={{ transformOrigin: 'center bottom' }}>
      {/* seat */}
      <path d="M5 20 Q15 8 30 12 Q45 8 55 20 Q50 30 30 28 Q10 30 5 20Z" fill="#8B4513" stroke="#5C2F0D" strokeWidth="1.5"/>
      {/* pommel */}
      <ellipse cx="22" cy="14" rx="7" ry="5" fill="#A0522D"/>
      {/* cantle */}
      <ellipse cx="38" cy="14" rx="7" ry="5" fill="#A0522D"/>
      {/* stirrup left */}
      <path d="M12 26 L8 34 L16 34 L14 26" fill="none" stroke="#8B6914" strokeWidth="2"/>
      {/* stirrup right */}
      <path d="M48 26 L44 34 L52 34 L50 26" fill="none" stroke="#8B6914" strokeWidth="2"/>
    </svg>
  ));
}

/* ─── 7. Weather Vane ────────────────────────────────────── */
export function WeatherVane({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover, 'anim-vane-spin', (
    <svg width="44" height="50" viewBox="0 0 44 50"
      style={{ transformOrigin: '22px 24px' }}>
      {/* pole */}
      <line x1="22" y1="24" x2="22" y2="50" stroke="#71797E" strokeWidth="3" strokeLinecap="round"/>
      {/* compass circle */}
      <circle cx="22" cy="24" r="5" fill="#D4AC0D" stroke="#B8860B" strokeWidth="1.5"/>
      {/* arrow */}
      <polygon points="22,4 28,22 22,18 16,22" fill="#c0392b"/>
      <polygon points="22,44 28,26 22,30 16,26" fill="#71797E"/>
      {/* rooster silhouette on top */}
      <text x="16" y="6" fontSize="10">🐓</text>
    </svg>
  ));
}
