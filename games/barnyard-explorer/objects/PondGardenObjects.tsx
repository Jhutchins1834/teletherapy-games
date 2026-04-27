'use client';

import type { ClickableObjectProps, ObjectState } from './shared';

function discovered(state: ObjectState) {
  return state === 'revealed' ? (
    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">✓</div>
  ) : null;
}

/* ─── 16. Frog on Lily Pad ───────────────────────────────── */
export function FrogOnLilyPad({ state, onDiscover }: ClickableObjectProps) {
  const leaping = state === 'animating';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="60" height="44" viewBox="0 0 60 44">
        {/* Lily pad */}
        <ellipse cx="32" cy="38" rx="24" ry="8" fill="#2ECC71" stroke="#27AE60" strokeWidth="1.5"/>
        <path d="M32 30 L32 38" fill="none" stroke="#27AE60" strokeWidth="1"/>
        {/* Ripples when leaping */}
        {(leaping || state === 'revealed') && (
          <>
            <ellipse cx="32" cy="40" rx="28" ry="6" fill="none" stroke="#3498DB" strokeWidth="1" opacity="0.5"
              style={{ animation: 'ripple-out 1s ease-out forwards' }}/>
            <ellipse cx="32" cy="40" rx="20" ry="4" fill="none" stroke="#3498DB" strokeWidth="1" opacity="0.4"
              style={{ animation: 'ripple-out 1s ease-out 0.2s forwards' }}/>
          </>
        )}
        {/* Frog */}
        <ellipse cx="32" cy={leaping ? '14' : '28'} rx="10" ry="8" fill="#27AE60"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        {/* Frog head */}
        <circle cx="32" cy={leaping ? '8' : '22'} r="7" fill="#2ECC71"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        {/* Eyes (bulge) */}
        <circle cx="28" cy={leaping ? '5' : '19'} r="3" fill="#2ECC71" stroke="#27AE60" strokeWidth="0.5"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="36" cy={leaping ? '5' : '19'} r="3" fill="#2ECC71" stroke="#27AE60" strokeWidth="0.5"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="28" cy={leaping ? '5' : '19'} r="1.5" fill="#1a1a1a"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="36" cy={leaping ? '5' : '19'} r="1.5" fill="#1a1a1a"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        {/* Hind legs */}
        <path d="M22 28 Q14 32 12 38" fill="none" stroke="#27AE60" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 28 Q50 32 52 38" fill="none" stroke="#27AE60" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 17. Duck ───────────────────────────────────────────── */
export function Duck({ state, onDiscover }: ClickableObjectProps) {
  const dunking = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="48" height="44" viewBox="0 0 48 44"
        style={state === 'animating' ? { animation: 'duck-dunk 0.8s ease-in-out forwards' } : undefined}
        className="origin-[24px_36px]">
        {/* Water surface */}
        <ellipse cx="24" cy="36" rx="20" ry="5" fill="#3498DB" opacity="0.4"/>
        {/* Body */}
        <ellipse cx="24" cy={dunking ? '30' : '26'} rx="14" ry="10" fill="#F5F5F0"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Tail - up when dunking */}
        <path d={dunking ? 'M12 26 Q6 16 10 10' : 'M12 22 Q6 18 8 14'} fill="none" stroke="#F5F5F0" strokeWidth="5"
          strokeLinecap="round" style={{ transition: 'd 0.4s ease-in-out' }}/>
        {/* Head - down when dunking */}
        <circle cx="36" cy={dunking ? '38' : '18'} r="8" fill="#FFD700"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Beak */}
        <path d={dunking ? 'M42 40 L48 38 L42 42' : 'M42 18 L48 16 L42 20'} fill="#FF8C00"
          style={{ transition: 'd 0.4s ease-in-out' }}/>
        {/* Eye */}
        <circle cx="38" cy={dunking ? '36' : '16'} r="2" fill="#1a1a1a"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Wing */}
        <path d="M20 24 Q24 20 30 24" fill="none" stroke="#D0D0C8" strokeWidth="2"/>
        {/* Water droplets when revealed */}
        {state === 'revealed' && (
          <>
            <circle cx="30" cy="10" r="2" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out forwards' }}/>
            <circle cx="38" cy="8" r="1.5" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out 0.1s forwards' }}/>
            <circle cx="24" cy="12" r="1.5" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out 0.2s forwards' }}/>
          </>
        )}
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 18. Watering Can ───────────────────────────────────── */
export function WateringCan({ state, onDiscover }: ClickableObjectProps) {
  const pouring = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="56" height="54" viewBox="0 0 56 54"
        style={state === 'animating' ? { animation: 'can-pour 0.7s ease-in-out forwards', transformOrigin: '28px 28px' } : undefined}>
        {/* Can body */}
        <ellipse cx="26" cy="28" rx="18" ry="14" fill="#4A90D9" stroke="#2980B9" strokeWidth="1.5"/>
        {/* Can top */}
        <ellipse cx="26" cy="16" rx="18" ry="5" fill="#5DADE2" stroke="#2980B9" strokeWidth="1"/>
        {/* Handle */}
        <path d="M8 16 Q-2 22 8 32" fill="none" stroke="#2980B9" strokeWidth="3" strokeLinecap="round"/>
        {/* Spout */}
        <path d={pouring ? 'M44 20 L54 8 L58 12' : 'M44 20 L52 14 L54 18'} fill="none" stroke="#2980B9" strokeWidth="4" strokeLinecap="round"/>
        {/* Spout head */}
        <ellipse cx={pouring ? '56' : '53'} cy={pouring ? '10' : '16'} rx="4" ry="3" fill="#1A5276"
          style={{ transition: 'cx 0.4s, cy 0.4s' }}/>
        {/* Water stream */}
        {pouring && (
          <>
            {[0,1,2,3,4].map((i) => (
              <line key={i} x1={56 + i*2} y1={10 + i*5} x2={58 + i*2} y2={14 + i*5}
                stroke="#3498DB" strokeWidth="1.5" opacity="0.7"
                style={{ animation: `water-drop 0.5s ease-in ${i*0.08}s infinite` }}/>
            ))}
          </>
        )}
      </svg>
      {/* Flower growth */}
      {state === 'revealed' && (
        <div className="absolute bottom-0 right-0 text-xl pointer-events-none"
          style={{ animation: 'flower-grow 0.6s ease-out forwards' }}>
          🌸
        </div>
      )}
      {discovered(state)}
    </div>
  );
}

/* ─── 19. Sunflower ──────────────────────────────────────── */
export function Sunflower({ state, onDiscover }: ClickableObjectProps) {
  const bloomed = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="40" height="64" viewBox="0 0 40 64">
        {/* Stem */}
        <path d="M20 64 Q18 48 20 40" fill="none" stroke="#27AE60" strokeWidth="4" strokeLinecap="round"/>
        {/* Leaves */}
        <path d="M20 52 Q10 46 8 40" fill="none" stroke="#27AE60" strokeWidth="3"/>
        <path d="M20 48 Q30 42 32 36" fill="none" stroke="#27AE60" strokeWidth="3"/>
        {/* Petals - scale from 0 when animating */}
        <g transform="translate(20,20)"
          style={state === 'animating' ? { animation: 'sunflower-bloom 0.9s ease-out forwards', transformOrigin: '0 0' } : undefined}>
          {[0,45,90,135,180,225,270,315].map((angle) => (
            <ellipse key={angle} cx={0} cy={bloomed ? -15 : 0} rx={bloomed ? 5 : 0} ry={bloomed ? 10 : 0}
              fill="#F1C40F" transform={`rotate(${angle})`}
              style={{ transition: 'all 0.6s ease-out', transitionDelay: `${angle/360 * 0.5}s` }}/>
          ))}
          {/* Center */}
          <circle r={bloomed ? 10 : 3} fill="#8B4513"
            style={{ transition: 'r 0.4s ease-out' }}/>
          <circle r={bloomed ? 7 : 2} fill="#5C2F0D"
            style={{ transition: 'r 0.4s ease-out' }}/>
          {/* Seeds pattern */}
          {bloomed && [0,45,90,135,180,225,270,315].map((angle) => (
            <circle key={angle} cx={Math.cos(angle*Math.PI/180)*5} cy={Math.sin(angle*Math.PI/180)*5}
              r="1.2" fill="#3d2200"/>
          ))}
        </g>
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 20. Scarecrow ──────────────────────────────────────── */
export function Scarecrow({ state, onDiscover }: ClickableObjectProps) {
  const hatFlown = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="44" height="72" viewBox="0 0 44 72">
        {/* Post */}
        <rect x="19" y="24" width="6" height="48" rx="2" fill="#8B6914"/>
        <rect x="8" y="28" width="28" height="5" rx="2" fill="#8B6914"/>
        {/* Body/clothes */}
        <rect x="12" y="30" width="20" height="22" rx="3" fill="#C0392B" opacity="0.8"/>
        {/* Straw peeking out */}
        {[10,16,26,32].map((x) => (
          <line key={x} x1={x} y1="52" x2={x-2} y2="62" stroke="#D4AC0D" strokeWidth="2"/>
        ))}
        {/* Pants */}
        <rect x="13" y="50" width="8" height="18" rx="2" fill="#2C3E50"/>
        <rect x="23" y="50" width="8" height="18" rx="2" fill="#2C3E50"/>
        {/* Head */}
        <circle cx="22" cy="18" r="10" fill="#F5DEB3"/>
        {/* Face - stitched */}
        <path d="M16 18 L20 16 L22 20 L24 16 L28 18" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
        <circle cx="18" cy="14" r="2" fill="#1a1a1a"/>
        <circle cx="26" cy="14" r="2" fill="#1a1a1a"/>
        {/* Hat */}
        <g style={hatFlown ? { animation: 'hat-fly 0.9s ease-out forwards', transformOrigin: '22px 6px' } : undefined}>
          <rect x="12" y="3" width="20" height="12" rx="2" fill="#2C3E50"/>
          <rect x="8" y="12" width="28" height="4" rx="1" fill="#2C3E50"/>
          <rect x="14" y="5" width="6" height="3" rx="1" fill="#e74c3c"/>
        </g>
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 21. Wheelbarrow ────────────────────────────────────── */
export function Wheelbarrow({ state, onDiscover }: ClickableObjectProps) {
  const tipped = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="64" height="52" viewBox="0 0 64 52"
        style={state === 'animating' ? { animation: 'barrow-tip 0.8s ease-in-out forwards', transformOrigin: '10px 44px' } : undefined}>
        {/* Wheel */}
        <circle cx={tipped ? '8' : '14'} cy="44" r="8" fill="none" stroke="#5C4A1E" strokeWidth="3"
          style={{ transition: 'cx 0.5s' }}/>
        <circle cx={tipped ? '8' : '14'} cy="44" r="3" fill="#8B6914"
          style={{ transition: 'cx 0.5s' }}/>
        {/* Handles */}
        <line x1="48" y1="44" x2="60" y2="36" stroke="#8B6914" strokeWidth="4" strokeLinecap="round"/>
        <line x1="52" y1="44" x2="62" y2="32" stroke="#8B6914" strokeWidth="4" strokeLinecap="round"/>
        {/* Tray */}
        <path d="M14 36 L48 36 L50 44 L16 44 Z" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5"/>
        {/* Pumpkins in tray - tumble when tipped */}
        {!tipped ? (
          <>
            <circle cx="22" cy="30" r="7" fill="#E67E22"/>
            <circle cx="33" cy="29" r="8" fill="#E67E22"/>
            <circle cx="44" cy="30" r="6" fill="#27AE60"/>
            <line x1="22" y1="23" x2="22" y2="20" stroke="#27AE60" strokeWidth="2"/>
            <line x1="33" y1="21" x2="33" y2="18" stroke="#27AE60" strokeWidth="2"/>
          </>
        ) : (
          <>
            <circle cx="6" cy="24" r="7" fill="#E67E22" style={{ animation: 'produce-tumble 0.8s ease-out forwards' }}/>
            <circle cx="16" cy="20" r="8" fill="#E67E22" style={{ animation: 'produce-tumble 0.8s ease-out 0.1s forwards' }}/>
            <circle cx="28" cy="18" r="6" fill="#27AE60" style={{ animation: 'produce-tumble 0.8s ease-out 0.2s forwards' }}/>
          </>
        )}
      </svg>
      {discovered(state)}
    </div>
  );
}
