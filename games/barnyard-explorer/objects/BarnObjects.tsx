'use client';

import type { ClickableObjectProps, ObjectState } from './shared';

/* ─── Shared helpers ─────────────────────────────────────── */

// Matches AnimalObjects wrap signature so animations work via inline style
function wrap(
  state: ObjectState,
  onDiscover: () => void,
  animStyle: React.CSSProperties | undefined,
  children: React.ReactNode,
  originStyle?: React.CSSProperties,
) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-100 ${state === 'idle' ? 'hover:scale-110' : ''}`}
      style={originStyle}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}
    >
      <div style={state === 'animating' ? animStyle : undefined}>
        {children}
      </div>
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
  return wrap(
    state, onDiscover,
    { animation: 'corn-spill 0.8s ease-out forwards', transformOrigin: 'bottom center' },
    (
      <div className="relative">
        <svg width="44" height="48" viewBox="0 0 44 48">
          {/* Rim */}
          <rect x="5" y="10" width="34" height="6" rx="3" fill="#D4A574"/>
          {/* Bucket body — trapezoid */}
          <path d="M8 16 L11 42 L33 42 L36 16 Z" fill="#784212"/>
          {/* Handle */}
          <path d="M10 13 Q22 3 34 13" fill="none" stroke="#D4A574" strokeWidth="3" strokeLinecap="round"/>
          {/* Corn kernels */}
          <circle cx="16" cy="26" r="3" fill="#F39C12"/>
          <circle cx="22" cy="23" r="3" fill="#F4D03F"/>
          <circle cx="28" cy="26" r="3" fill="#F39C12"/>
          <circle cx="19" cy="33" r="2.5" fill="#F4D03F"/>
          <circle cx="26" cy="33" r="2.5" fill="#F39C12"/>
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
    ),
    { transformOrigin: 'bottom center' }
  );
}

/* ─── 2. Barn Door ───────────────────────────────────────── */
export function BarnDoor({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-100 ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}
    >
      <svg width="52" height="68" viewBox="0 0 52 68">
        {/* Dark opening behind door */}
        <rect x="1" y="1" width="50" height="66" rx="3" fill="#1a0800"/>
        {/* Sliding door panel */}
        <rect
          x={state === 'animating' || state === 'revealed' ? '27' : '1'}
          y="1" width="24" height="66" rx="3"
          fill="#C0392B"
          style={{ transition: 'x 0.6s ease-in-out' }}
        />
        {/* X pattern on visible left panel */}
        <line x1="3" y1="3" x2="24" y2="35" stroke="#ECF0F1" strokeWidth="2.5" opacity="0.35"/>
        <line x1="24" y1="3" x2="3" y2="35" stroke="#ECF0F1" strokeWidth="2.5" opacity="0.35"/>
        {/* Handle dot */}
        <circle
          cx={state === 'animating' || state === 'revealed' ? '46' : '20'}
          cy="34" r="3.5" fill="#F4D03F"
          style={{ transition: 'cx 0.6s ease-in-out' }}
        />
      </svg>
      {state === 'revealed' && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">✓</div>
      )}
    </div>
  );
}

/* ─── 3. Hay Bale ────────────────────────────────────────── */
export function HayBale({ state, onDiscover }: ClickableObjectProps) {
  return wrap(
    state, onDiscover,
    { animation: 'hay-burst 0.7s ease-out' },
    (
      <div className="relative">
        <svg width="58" height="40" viewBox="0 0 58 40">
          {/* Main bale */}
          <rect x="2" y="6" width="54" height="30" rx="7" fill="#F4D03F"/>
          {/* Top highlight */}
          <rect x="2" y="6" width="54" height="10" rx="7" fill="#F9E79F"/>
          {/* Twine bands */}
          <rect x="17" y="6" width="5" height="30" rx="2.5" fill="#8B4513"/>
          <rect x="36" y="6" width="5" height="30" rx="2.5" fill="#8B4513"/>
        </svg>
        {state === 'animating' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-1 h-5 rounded bg-yellow-400"
                style={{
                  left: `${10 + i * 14}%`, top: '10%',
                  animation: `hay-piece 0.9s ease-out ${i * 0.07}s forwards`,
                  transform: `rotate(${i * 30}deg)`,
                }} />
            ))}
          </div>
        )}
      </div>
    )
  );
}

/* ─── 4. Pitchfork ───────────────────────────────────────── */
export function Pitchfork({ state, onDiscover }: ClickableObjectProps) {
  return wrap(
    state, onDiscover,
    { animation: 'pitchfork-fall 0.7s ease-in-out forwards', transformOrigin: 'bottom center' },
    (
      <svg width="30" height="74" viewBox="0 0 30 74" style={{ transformOrigin: 'bottom center' }}>
        {/* Wooden handle */}
        <rect x="12" y="18" width="6" height="56" rx="3" fill="#D4A574"/>
        {/* Tines */}
        <rect x="3" y="2" width="5" height="22" rx="2.5" fill="#85929E"/>
        <rect x="12" y="2" width="5" height="22" rx="2.5" fill="#85929E"/>
        <rect x="22" y="2" width="5" height="22" rx="2.5" fill="#85929E"/>
        {/* Crossbar */}
        <rect x="2" y="18" width="26" height="5" rx="2.5" fill="#85929E"/>
      </svg>
    ),
    { transformOrigin: 'bottom center' }
  );
}

/* ─── 5. Horseshoe ───────────────────────────────────────── */
export function Horseshoe({ state, onDiscover }: ClickableObjectProps) {
  return wrap(
    state, onDiscover,
    { animation: 'spin-fast 0.9s ease-in-out' },
    (
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ transformOrigin: 'center center' }}>
        {/* Horseshoe U — intentional stroke form */}
        <path
          d="M8 34 L8 17 Q8 4 20 4 Q32 4 32 17 L32 34"
          fill="none" stroke="#85929E" strokeWidth="8" strokeLinecap="round"
        />
        {/* Nail holes */}
        <circle cx="9"  cy="25" r="2.5" fill="#1A252F"/>
        <circle cx="31" cy="25" r="2.5" fill="#1A252F"/>
        <circle cx="10" cy="33" r="2.5" fill="#1A252F"/>
        <circle cx="30" cy="33" r="2.5" fill="#1A252F"/>
      </svg>
    ),
    { transformOrigin: 'center' }
  );
}

/* ─── 6. Saddle ──────────────────────────────────────────── */
export function Saddle({ state, onDiscover }: ClickableObjectProps) {
  return wrap(
    state, onDiscover,
    { animation: 'saddle-bounce 0.8s ease-in-out' },
    (
      <svg width="64" height="40" viewBox="0 0 64 40" style={{ transformOrigin: 'center bottom' }}>
        {/* Seat */}
        <path d="M4 24 Q16 10 32 14 Q48 10 60 24 Q54 34 32 32 Q10 34 4 24Z" fill="#784212"/>
        {/* Pommel */}
        <ellipse cx="22" cy="16" rx="9" ry="7" fill="#922B21"/>
        {/* Cantle */}
        <ellipse cx="42" cy="16" rx="9" ry="7" fill="#922B21"/>
        {/* Stirrup bars */}
        <rect x="10" y="28" width="4" height="12" rx="2" fill="#D4A574"/>
        <rect x="50" y="28" width="4" height="12" rx="2" fill="#D4A574"/>
        {/* Stirrup bottoms */}
        <rect x="6"  y="38" width="12" height="3" rx="1.5" fill="#D4A574"/>
        <rect x="46" y="38" width="12" height="3" rx="1.5" fill="#D4A574"/>
      </svg>
    )
  );
}

/* ─── 7. Weather Vane ────────────────────────────────────── */
export function WeatherVane({ state, onDiscover }: ClickableObjectProps) {
  return wrap(
    state, onDiscover,
    { animation: 'vane-spin 1s ease-in-out' },
    (
      <svg width="48" height="54" viewBox="0 0 48 54" style={{ transformOrigin: '24px 28px' }}>
        {/* Pole */}
        <rect x="22" y="28" width="4" height="26" rx="2" fill="#85929E"/>
        {/* Compass circle */}
        <circle cx="24" cy="28" r="7" fill="#F4D03F"/>
        {/* Arrow — north pointer */}
        <polygon points="24,6 30,26 24,21 18,26" fill="#C0392B"/>
        {/* Arrow — south tail */}
        <polygon points="24,50 30,30 24,35 18,30" fill="#85929E"/>
        {/* Rooster silhouette (flat geometric, no emoji) */}
        {/* Body */}
        <ellipse cx="24" cy="13" rx="5" ry="4" fill="#C0392B"/>
        {/* Head */}
        <circle cx="29" cy="10" r="3.5" fill="#C0392B"/>
        {/* Comb */}
        <polygon points="27,7 29,4 31,7" fill="#E74C3C"/>
        {/* Beak */}
        <polygon points="32,10 36,11 32,12" fill="#F39C12"/>
        {/* Tail feathers */}
        <path d="M19 14 Q14 10 15 5" fill="none" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M19 13 Q13 12 13 7" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    { transformOrigin: 'center' }
  );
}
