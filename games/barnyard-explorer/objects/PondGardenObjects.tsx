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
      <svg width="62" height="48" viewBox="0 0 62 48">
        {/* Lily pad — green circle */}
        <ellipse cx="32" cy="40" rx="26" ry="9" fill="#27AE60"/>
        {/* Pad notch */}
        <polygon points="32,32 38,40 26,40" fill="#1E8449"/>
        {/* Ripples */}
        {(leaping || state === 'revealed') && (
          <>
            <ellipse cx="32" cy="42" rx="30" ry="7" fill="none" stroke="#5DADE2" strokeWidth="1.5" opacity="0.5"
              style={{ animation: 'ripple-out 1s ease-out forwards' }}/>
            <ellipse cx="32" cy="42" rx="20" ry="5" fill="none" stroke="#5DADE2" strokeWidth="1" opacity="0.4"
              style={{ animation: 'ripple-out 1s ease-out 0.2s forwards' }}/>
          </>
        )}
        {/* Frog body — green rounded rect */}
        <rect
          x="22" y={leaping ? '12' : '24'} width="20" height="16" rx="8"
          fill="#27AE60"
          style={{ transition: 'y 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}
        />
        {/* Frog head — green circle */}
        <circle
          cx="32" cy={leaping ? '10' : '22'} r="10"
          fill="#2ECC71"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}
        />
        {/* Eye bulges — two circles on top */}
        <circle cx="27" cy={leaping ? '4' : '16'} r="4" fill="#2ECC71"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="37" cy={leaping ? '4' : '16'} r="4" fill="#2ECC71"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="27" cy={leaping ? '4' : '16'} r="2" fill="#1A252F"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        <circle cx="37" cy={leaping ? '4' : '16'} r="2" fill="#1A252F"
          style={{ transition: 'cy 0.4s cubic-bezier(0.2,0.8,0.4,1)' }}/>
        {/* Smile */}
        <path d={leaping ? 'M28 14 Q32 17 36 14' : 'M28 26 Q32 29 36 26'}
          fill="none" stroke="#1E8449" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: 'd 0.4s' }}/>
        {/* Hind legs */}
        <path d="M22 34 Q14 36 10 42" fill="none" stroke="#27AE60" strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 34 Q48 36 52 42" fill="none" stroke="#27AE60" strokeWidth="4" strokeLinecap="round"/>
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
      <svg width="52" height="48" viewBox="0 0 52 48"
        style={state === 'animating' ? { animation: 'duck-dunk 0.8s ease-in-out forwards', transformOrigin: '26px 38px' } : undefined}
        className="origin-[26px_38px]">
        {/* Water surface */}
        <ellipse cx="26" cy="38" rx="22" ry="6" fill="#2980B9" opacity="0.4"/>
        {/* Body — yellow oval */}
        <ellipse cx="24" cy={dunking ? '32' : '28'} rx="14" ry="10" fill="#F4D03F"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Wing detail */}
        <ellipse cx="20" cy={dunking ? '31' : '27'} rx="7" ry="5" fill="#F9E79F"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Tail — up when dunking */}
        <path d={dunking ? 'M12 28 Q6 18 10 10' : 'M12 24 Q6 20 8 14'}
          fill="none" stroke="#F4D03F" strokeWidth="6" strokeLinecap="round"
          style={{ transition: 'd 0.4s ease-in-out' }}/>
        {/* Head — yellow circle, dips when dunking */}
        <circle cx="38" cy={dunking ? '40' : '20'} r="9" fill="#F4D03F"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Beak — orange triangle */}
        <polygon
          points={dunking ? '44,43 52,41 44,47' : '44,20 52,18 44,22'}
          fill="#F39C12"
          style={{ transition: 'points 0.4s ease-in-out' }}
        />
        {/* Eye */}
        <circle cx="40" cy={dunking ? '37' : '17'} r="2.5" fill="#1A252F"
          style={{ transition: 'cy 0.4s ease-in-out' }}/>
        {/* Water droplets when revealed */}
        {state === 'revealed' && (
          <>
            <circle cx="30" cy="12" r="2.5" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out forwards' }}/>
            <circle cx="38" cy="10" r="2" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out 0.1s forwards' }}/>
            <circle cx="24" cy="14" r="2" fill="#3498DB" opacity="0.7" style={{ animation: 'droplet-fall 0.6s ease-out 0.2s forwards' }}/>
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
      <svg width="58" height="58" viewBox="0 0 58 58"
        style={state === 'animating' ? { animation: 'can-pour 0.7s ease-in-out forwards', transformOrigin: '29px 29px' } : undefined}>
        {/* Can body — blue rounded rect */}
        <rect x="4" y="16" width="36" height="28" rx="8" fill="#2980B9"/>
        {/* Can top cap */}
        <rect x="8" y="12" width="28" height="8" rx="4" fill="#3498DB"/>
        {/* Handle — arc */}
        <path d="M4 18 Q-6 26 4 36" fill="none" stroke="#2471A3" strokeWidth="5" strokeLinecap="round"/>
        {/* Spout */}
        <rect
          x={pouring ? '36' : '36'} y={pouring ? '12' : '16'}
          width="18" height="6" rx="3"
          fill="#2471A3"
          transform={pouring ? 'rotate(-25 36 16)' : undefined}
          style={{ transition: 'transform 0.4s, y 0.4s' }}
        />
        {/* Spout rose */}
        <circle cx={pouring ? '51' : '52'} cy={pouring ? '8' : '16'} r="5" fill="#1A5276"
          style={{ transition: 'cx 0.4s, cy 0.4s' }}/>
        {/* Water holes on rose */}
        {pouring && (
          <>
            <circle cx="49" cy="7" r="1" fill="#5DADE2"/>
            <circle cx="52" cy="6" r="1" fill="#5DADE2"/>
            <circle cx="54" cy="8" r="1" fill="#5DADE2"/>
          </>
        )}
        {/* Water stream */}
        {pouring && (
          [0,1,2,3,4].map((i) => (
            <line key={i} x1={50 + i*1.5} y1={12 + i*6} x2={52 + i*1.5} y2={16 + i*6}
              stroke="#3498DB" strokeWidth="2" opacity="0.7"
              style={{ animation: `water-drop 0.5s ease-in ${i * 0.08}s infinite` }}/>
          ))
        )}
      </svg>
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
      <svg width="42" height="66" viewBox="0 0 42 66">
        {/* Stem */}
        <rect x="18" y="36" width="6" height="30" rx="3" fill="#27AE60"/>
        {/* Leaves */}
        <ellipse cx="10" cy="50" rx="10" ry="5" fill="#2ECC71" transform="rotate(-30 10 50)"/>
        <ellipse cx="32" cy="44" rx="10" ry="5" fill="#2ECC71" transform="rotate(30 32 44)"/>
        {/* Petals */}
        <g transform="translate(21,20)"
          style={state === 'animating' ? { animation: 'sunflower-bloom 0.9s ease-out forwards', transformOrigin: '0 0' } : undefined}>
          {[0,45,90,135,180,225,270,315].map((angle) => (
            <ellipse key={angle}
              cx={0} cy={bloomed ? -14 : 0}
              rx={bloomed ? 5 : 0} ry={bloomed ? 11 : 0}
              fill="#F4D03F"
              transform={`rotate(${angle})`}
              style={{ transition: 'all 0.5s ease-out', transitionDelay: `${angle / 360 * 0.4}s` }}
            />
          ))}
          {/* Petal layer 2 — offset */}
          {[22,67,112,157,202,247,292,337].map((angle) => (
            <ellipse key={angle}
              cx={0} cy={bloomed ? -12 : 0}
              rx={bloomed ? 4 : 0} ry={bloomed ? 9 : 0}
              fill="#F39C12"
              transform={`rotate(${angle})`}
              style={{ transition: 'all 0.5s ease-out', transitionDelay: `${angle / 360 * 0.4 + 0.1}s` }}
            />
          ))}
          {/* Center disc — dark brown */}
          <circle r={bloomed ? 11 : 4} fill="#784212"
            style={{ transition: 'r 0.4s ease-out' }}/>
          <circle r={bloomed ? 8 : 2} fill="#2C1A0E"
            style={{ transition: 'r 0.4s ease-out' }}/>
          {/* Seed dots */}
          {bloomed && [0,45,90,135,180,225,270,315].map((angle) => (
            <circle key={angle}
              cx={Math.cos(angle * Math.PI / 180) * 5}
              cy={Math.sin(angle * Math.PI / 180) * 5}
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
      <svg width="46" height="78" viewBox="0 0 46 78">
        {/* Vertical post */}
        <rect x="20" y="20" width="6" height="58" rx="3" fill="#8B4513"/>
        {/* Horizontal crossbar */}
        <rect x="6" y="30" width="34" height="5" rx="2.5" fill="#8B4513"/>
        {/* Shirt — colored rect on cross */}
        <rect x="10" y="32" width="26" height="20" rx="4" fill="#C0392B"/>
        {/* Shirt patches */}
        <rect x="11" y="33" width="8" height="6" rx="2" fill="#E74C3C" opacity="0.7"/>
        <rect x="27" y="38" width="7" height="5" rx="2" fill="#E74C3C" opacity="0.7"/>
        {/* Pants legs */}
        <rect x="12" y="52" width="9" height="22" rx="4" fill="#2C3E50"/>
        <rect x="25" y="52" width="9" height="22" rx="4" fill="#2C3E50"/>
        {/* Straw peeking from sleeves/pants */}
        <line x1="8"  y1="34" x2="4"  y2="44" stroke="#F4D03F" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="38" y1="34" x2="42" y2="44" stroke="#F4D03F" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="13" y1="72" x2="10" y2="78" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="33" y1="72" x2="36" y2="78" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        {/* Head — tan circle */}
        <circle cx="23" cy="16" r="12" fill="#FDEBD0"/>
        {/* Stitched face */}
        <circle cx="18" cy="12" r="2.5" fill="#2C1A0E"/>
        <circle cx="28" cy="12" r="2.5" fill="#2C1A0E"/>
        <path d="M17 20 Q20 17 23 20 Q26 17 29 20" fill="none" stroke="#2C1A0E" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Hat */}
        <g style={hatFlown ? { animation: 'hat-fly 0.9s ease-out forwards', transformOrigin: '23px 4px' } : undefined}>
          <rect x="14" y="1" width="18" height="10" rx="2" fill="#2C3E50"/>
          <rect x="8"  y="9" width="30" height="5" rx="2" fill="#2C3E50"/>
          <rect x="16" y="2" width="7" height="3" rx="1.5" fill="#C0392B"/>
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
      <svg width="66" height="54" viewBox="0 0 66 54"
        style={state === 'animating' ? { animation: 'barrow-tip 0.8s ease-in-out forwards', transformOrigin: '10px 46px' } : undefined}>
        {/* Wheel */}
        <circle cx={tipped ? '8' : '14'} cy="46" r="9" fill="#8B4513"
          style={{ transition: 'cx 0.5s' }}/>
        <circle cx={tipped ? '8' : '14'} cy="46" r="4" fill="#D4A574"
          style={{ transition: 'cx 0.5s' }}/>
        {/* Tray body */}
        <path d="M14 38 L50 38 L52 46 L16 46 Z" fill="#8B4513"/>
        {/* Tray rim highlight */}
        <rect x="14" y="34" width="36" height="6" rx="3" fill="#D4A574"/>
        {/* Handles */}
        <rect x="48" y="38" width="5" height="18" rx="2.5" fill="#D4A574" transform="rotate(10 48 38)"/>
        <rect x="54" y="38" width="5" height="18" rx="2.5" fill="#D4A574" transform="rotate(10 54 38)"/>
        {/* Produce in tray */}
        {!tipped ? (
          <>
            <circle cx="24" cy="32" r="7" fill="#E67E22"/>
            <circle cx="34" cy="30" r="8" fill="#E67E22"/>
            <circle cx="44" cy="32" r="6" fill="#27AE60"/>
            <rect x="23" y="23" width="3" height="6" rx="1.5" fill="#27AE60"/>
            <rect x="33" y="21" width="3" height="7" rx="1.5" fill="#27AE60"/>
          </>
        ) : (
          <>
            <circle cx="8"  cy="24" r="7" fill="#E67E22" style={{ animation: 'produce-tumble 0.8s ease-out forwards' }}/>
            <circle cx="18" cy="20" r="8" fill="#E67E22" style={{ animation: 'produce-tumble 0.8s ease-out 0.1s forwards' }}/>
            <circle cx="30" cy="16" r="6" fill="#27AE60" style={{ animation: 'produce-tumble 0.8s ease-out 0.2s forwards' }}/>
          </>
        )}
      </svg>
      {discovered(state)}
    </div>
  );
}
