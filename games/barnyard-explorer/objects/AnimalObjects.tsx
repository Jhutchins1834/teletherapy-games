'use client';

import type { ClickableObjectProps, ObjectState } from './shared';

function discovered(state: ObjectState) {
  return state === 'revealed' ? (
    <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow border border-yellow-200 pointer-events-none z-10">✓</div>
  ) : null;
}

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
      {discovered(state)}
    </div>
  );
}

/* ─── 8. Hen on Nest ─────────────────────────────────────── */
export function HenOnNest({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      {/* Nest */}
      <svg width="56" height="52" viewBox="0 0 56 52">
        {/* straw nest base */}
        <ellipse cx="28" cy="44" rx="24" ry="8" fill="#C9950C" opacity="0.7"/>
        {/* nest straws */}
        {[-12,-6,0,6,12].map((dx,i) => (
          <path key={i} d={`M${28+dx} 36 Q${28+dx+4} 44 ${28+dx} 50`}
            fill="none" stroke="#8B6914" strokeWidth="2" opacity="0.8"/>
        ))}
        {/* eggs - visible when revealed */}
        {(state === 'revealed') && (
          <>
            <ellipse cx="20" cy="42" rx="5" ry="6" fill="#FAEBD7"/>
            <ellipse cx="28" cy="43" rx="5" ry="6" fill="#FAEBD7"/>
            <ellipse cx="36" cy="42" rx="5" ry="6" fill="#FAEBD7"/>
          </>
        )}
        {/* Hen body */}
        <ellipse cx="28" cy={state === 'animating' || state === 'revealed' ? '22' : '30'}
          rx="16" ry="12" fill="#c0392b"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Hen head */}
        <circle cx="40" cy={state === 'animating' || state === 'revealed' ? '16' : '24'}
          r="8" fill="#e74c3c"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Beak */}
        <polygon points="48,20 52,22 48,24" fill="#F39C12"/>
        {/* Eye */}
        <circle cx="42" cy="19" r="1.5" fill="white"/>
        <circle cx="42.5" cy="19" r="0.8" fill="#1a1a1a"/>
        {/* Comb */}
        <polygon points="38,10 40,14 42,10 44,14 46,10" fill="#e74c3c"/>
        {/* Wing detail */}
        <path d="M20 28 Q24 24 28 28" fill="none" stroke="#922B21" strokeWidth="1.5"/>
        {/* Feather ruffle when animating */}
        {state === 'animating' && (
          <>
            <circle cx="15" cy="24" r="3" fill="#e74c3c" style={{ animation: 'feather-fly 0.8s ease-out forwards' }}/>
            <circle cx="42" cy="18" r="2" fill="#e74c3c" style={{ animation: 'feather-fly 0.8s ease-out 0.1s forwards' }}/>
          </>
        )}
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 9. Cow ─────────────────────────────────────────────── */
export function Cow({ state, onDiscover }: ClickableObjectProps) {
  const moo = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-105' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}
      style={{ animation: state === 'animating' ? 'cow-moo 0.7s ease-in-out' : 'none' }}>
      <svg width="70" height="54" viewBox="0 0 70 54">
        {/* Body */}
        <ellipse cx="32" cy="36" rx="26" ry="16" fill="#F5F5DC" stroke="#A0A0A0" strokeWidth="1"/>
        {/* Spots */}
        <ellipse cx="22" cy="32" rx="8" ry="6" fill="#3d3d3d" opacity="0.4"/>
        <ellipse cx="38" cy="40" rx="6" ry="5" fill="#3d3d3d" opacity="0.35"/>
        {/* Head */}
        <ellipse cx="56" cy="28" rx="13" ry="11" fill="#F5F5DC" stroke="#A0A0A0" strokeWidth="1"/>
        {/* Muzzle */}
        <ellipse cx="63" cy="32" rx="7" ry="5" fill="#F4C2C2"/>
        <circle cx="61" cy="32" r="1.5" fill="#8B4513"/>
        <circle cx="65" cy="32" r="1.5" fill="#8B4513"/>
        {/* Eye */}
        <circle cx="54" cy="24" r="2.5" fill="#1a1a1a"/>
        <circle cx="53.5" cy="23.5" r="0.8" fill="white"/>
        {/* Ear */}
        <ellipse cx="46" cy="20" rx="4" ry="6" fill="#F4C2C2" transform="rotate(-20 46 20)"/>
        {/* Horns */}
        <path d="M47 16 Q44 8 40 10" fill="none" stroke="#D4AC0D" strokeWidth="3" strokeLinecap="round"/>
        {/* Mouth - open when mooing */}
        {moo ? (
          <path d="M60 34 Q64 38 68 34" fill="#c0392b" stroke="#922B21" strokeWidth="1"/>
        ) : (
          <path d="M60 34 Q64 36 68 34" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
        )}
        {/* Legs */}
        {[12,22,36,46].map((x,i) => (
          <rect key={i} x={x} y="48" width="6" height="14" rx="2" fill="#F5F5DC" stroke="#A0A0A0" strokeWidth="0.8"
            transform={`translate(0,-12)`}/>
        ))}
        {/* Tail */}
        <path d="M6 30 Q-2 22 4 14" fill="none" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="4" cy="13" r="3" fill="#8B6914"/>
        {/* Udder */}
        <ellipse cx="28" cy="50" rx="10" ry="5" fill="#F4C2C2"/>
      </svg>
      {/* Speech bubble moo */}
      {moo && (
        <div className="absolute -top-6 right-0 bg-white rounded-xl px-2 py-0.5 text-xs font-bold text-gray-700 shadow border border-gray-200"
          style={{ animation: 'bubble-pop 0.3s ease-out' }}>
          Moo!
        </div>
      )}
      {discovered(state)}
    </div>
  );
}

/* ─── 10. Pig ────────────────────────────────────────────── */
export function Pig({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover,
    { animation: 'pig-flop 0.8s ease-in-out forwards' },
    (
      <svg width="56" height="42" viewBox="0 0 56 42">
        {/* Body */}
        <ellipse cx="28" cy="26" rx="22" ry="14" fill="#FFB6C1" stroke="#FF8FA0" strokeWidth="1"/>
        {/* Head */}
        <circle cx="46" cy="20" r="12" fill="#FFB6C1" stroke="#FF8FA0" strokeWidth="1"/>
        {/* Snout */}
        <ellipse cx="50" cy="24" rx="7" ry="5" fill="#FF9999"/>
        <circle cx="48" cy="24" r="1.5" fill="#8B4565"/>
        <circle cx="52" cy="24" r="1.5" fill="#8B4565"/>
        {/* Eye */}
        <circle cx="44" cy="17" r="2" fill="#1a1a1a"/>
        <circle cx="43.5" cy="16.5" r="0.7" fill="white"/>
        {/* Ear */}
        <polygon points="38,10 34,2 42,4" fill="#FF8FA0"/>
        {/* Legs */}
        {[8,18,32,42].map((x,i) => (
          <rect key={i} x={x} y="36" width="7" height="10" rx="3" fill="#FFB6C1" stroke="#FF8FA0" strokeWidth="0.8"
            transform="translate(0,-4)"/>
        ))}
        {/* Tail curl */}
        <path d="M6 24 Q0 18 4 14 Q8 10 6 6" fill="none" stroke="#FF8FA0" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Mud splatter when animating/revealed */}
        {(state === 'animating' || state === 'revealed') && (
          <>
            <circle cx="10" cy="38" r="4" fill="#8B6914" opacity="0.5"/>
            <circle cx="25" cy="40" r="5" fill="#8B6914" opacity="0.45"/>
            <circle cx="40" cy="39" r="3" fill="#8B6914" opacity="0.5"/>
          </>
        )}
      </svg>
    ),
    { transformOrigin: 'right center' }
  );
}

/* ─── 11. Horse ──────────────────────────────────────────── */
export function Horse({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover,
    { animation: 'horse-stomp 0.6s ease-in-out' },
    (
      <svg width="60" height="60" viewBox="0 0 60 60">
        {/* Stall wall */}
        <rect x="0" y="30" width="60" height="30" rx="2" fill="#8B6914" opacity="0.4"/>
        <line x1="0" y1="30" x2="60" y2="30" stroke="#5C4A1E" strokeWidth="3"/>
        {/* Head poking over */}
        <ellipse cx="30" cy="22" rx="16" ry="14" fill="#C8A882" stroke="#8B6914" strokeWidth="1.5"/>
        {/* Nose */}
        <ellipse cx="30" cy="30" rx="10" ry="6" fill="#B8956E"/>
        <circle cx="26" cy="30" r="1.5" fill="#5C3A1E"/>
        <circle cx="34" cy="30" r="1.5" fill="#5C3A1E"/>
        {/* Eyes */}
        <circle cx="20" cy="18" r="3" fill="#1a1a1a"/>
        <circle cx="19.5" cy="17.5" r="1" fill="white"/>
        {/* Ears */}
        <polygon points="22,6 18,0 26,2" fill="#C8A882" stroke="#8B6914" strokeWidth="0.8"/>
        <polygon points="38,6 34,0 42,2" fill="#C8A882" stroke="#8B6914" strokeWidth="0.8"/>
        {/* Mane */}
        <path d="M16 8 Q12 14 14 22" fill="none" stroke="#5C3A1E" strokeWidth="3" strokeLinecap="round"/>
        {/* Dust poof when stomping */}
        {state === 'animating' && (
          <g style={{ animation: 'dust-poof 0.6s ease-out forwards' }}>
            <circle cx="18" cy="52" r="6" fill="#D4C4A8" opacity="0.6"/>
            <circle cx="30" cy="54" r="5" fill="#D4C4A8" opacity="0.5"/>
            <circle cx="42" cy="52" r="6" fill="#D4C4A8" opacity="0.6"/>
          </g>
        )}
      </svg>
    )
  );
}

/* ─── 12. Goat ───────────────────────────────────────────── */
export function Goat({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover,
    { animation: 'goat-headbutt 0.7s ease-in-out' },
    (
      <svg width="62" height="46" viewBox="0 0 62 46">
        {/* Body */}
        <ellipse cx="24" cy="30" rx="18" ry="12" fill="#D2B48C" stroke="#A08060" strokeWidth="1"/>
        {/* Head */}
        <ellipse cx="44" cy="20" rx="12" ry="10" fill="#D2B48C" stroke="#A08060" strokeWidth="1"/>
        {/* Beard */}
        <path d="M44 28 Q42 34 44 38" fill="none" stroke="#E8D5B7" strokeWidth="3" strokeLinecap="round"/>
        {/* Snout */}
        <ellipse cx="50" cy="22" rx="6" ry="4" fill="#C4A882"/>
        <circle cx="48" cy="22" r="1.2" fill="#5C3A1E"/>
        <circle cx="52" cy="22" r="1.2" fill="#5C3A1E"/>
        {/* Eye */}
        <ellipse cx="42" cy="17" rx="2.5" ry="2" fill="#1a1a1a"/>
        <circle cx="41.5" cy="16.5" r="0.7" fill="white"/>
        {/* Horns */}
        <path d="M40 10 Q38 2 35 6" fill="none" stroke="#8B7355" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46 10 Q48 2 51 6" fill="none" stroke="#8B7355" strokeWidth="3" strokeLinecap="round"/>
        {/* Legs */}
        {[8,16,28,36].map((x,i) => (
          <rect key={i} x={x} y="38" width="5" height="10" rx="2" fill="#D2B48C" stroke="#A08060" strokeWidth="0.8"
            transform="translate(0,-4)"/>
        ))}
        {/* Fence post target */}
        <rect x="56" y="10" width="6" height="36" rx="2" fill="#8B6914"
          style={state === 'animating' ? { animation: 'post-wobble 0.7s ease-in-out' } : undefined}/>
      </svg>
    ),
    { transformOrigin: 'right center' }
  );
}

/* ─── 13. Sheep ──────────────────────────────────────────── */
export function Sheep({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover,
    { animation: 'sheep-shake 0.6s ease-in-out' },
    (
      <div className="relative">
        <svg width="58" height="44" viewBox="0 0 58 44">
          {/* Fluffy wool body - multiple circles */}
          {[[14,18,14],[22,14,16],[32,14,16],[42,18,14],[14,28,14],[22,26,16],[32,26,16],[42,28,14]].map(([cx,cy,r],i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#F5F5F0" stroke="#E0E0DC" strokeWidth="0.8"/>
          ))}
          {/* Head */}
          <ellipse cx="50" cy="22" rx="9" ry="8" fill="#D3D3D3" stroke="#B0B0B0" strokeWidth="1"/>
          {/* Face */}
          <circle cx="52" cy="22" r="1.5" fill="#1a1a1a"/>
          <path d="M48 26 Q50 28 52 26" fill="none" stroke="#8B8B8B" strokeWidth="1"/>
          {/* Ear */}
          <ellipse cx="44" cy="16" rx="4" ry="6" fill="#D3D3D3" transform="rotate(-20 44 16)"/>
          {/* Legs */}
          {[12,22,32,42].map((x,i) => (
            <rect key={i} x={x} y="38" width="5" height="10" rx="2" fill="#D3D3D3"
              transform="translate(0,-4)"/>
          ))}
        </svg>
        {/* Flying wool tuft */}
        {state === 'animating' && (
          <div className="absolute top-0 right-2 text-2xl pointer-events-none"
            style={{ animation: 'wool-fly 1s ease-out forwards' }}>
            🌫️
          </div>
        )}
      </div>
    )
  );
}

/* ─── 14. Mouse ──────────────────────────────────────────── */
export function Mouse({ state, onDiscover }: ClickableObjectProps) {
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="54" height="36" viewBox="0 0 54 36">
        {/* Cheese wheel */}
        <ellipse cx="28" cy="26" rx="22" ry="10" fill="#F5C518" stroke="#D4AC0D" strokeWidth="1.5"/>
        <ellipse cx="28" cy="22" rx="22" ry="10" fill="#FFD700" stroke="#D4AC0D" strokeWidth="1.5"/>
        {/* Cheese holes */}
        <ellipse cx="18" cy="20" rx="3" ry="2.5" fill="#E6B800" opacity="0.6"/>
        <ellipse cx="30" cy="18" rx="2.5" ry="2" fill="#E6B800" opacity="0.6"/>
        <ellipse cx="38" cy="22" rx="3" ry="2" fill="#E6B800" opacity="0.6"/>
        {/* Mouse */}
        <ellipse cx={state === 'animating' || state === 'revealed' ? '40' : '14'} cy="14"
          rx="8" ry="5" fill="#8B8B8B"
          style={{ transition: 'cx 0.7s ease-in-out' }}/>
        <circle cx={state === 'animating' || state === 'revealed' ? '46' : '20'} cy="11"
          r="5" fill="#8B8B8B"
          style={{ transition: 'cx 0.7s ease-in-out' }}/>
        {/* Ears */}
        <circle cx={state === 'animating' || state === 'revealed' ? '43' : '17'} cy="8"
          r="3" fill="#8B8B8B"
          style={{ transition: 'cx 0.7s ease-in-out' }}/>
        <circle cx={state === 'animating' || state === 'revealed' ? '49' : '23'} cy="8"
          r="3" fill="#8B8B8B"
          style={{ transition: 'cx 0.7s ease-in-out' }}/>
        {/* Eye */}
        <circle cx={state === 'animating' || state === 'revealed' ? '49' : '23'} cy="10"
          r="1.5" fill="#1a1a1a"
          style={{ transition: 'cx 0.7s ease-in-out' }}/>
        {/* Tail */}
        <path d={state === 'animating' || state === 'revealed'
          ? 'M32 15 Q22 18 14 14'
          : 'M6 14 Q2 10 4 6'}
          fill="none" stroke="#8B8B8B" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: 'd 0.7s ease-in-out' }}/>
      </svg>
      {discovered(state)}
    </div>
  );
}

/* ─── 15. Rooster ────────────────────────────────────────── */
export function Rooster({ state, onDiscover }: ClickableObjectProps) {
  return wrap(state, onDiscover,
    { animation: 'rooster-crow 0.9s ease-out' },
    (
      <div className="relative">
        <svg width="44" height="56" viewBox="0 0 44 56">
          {/* Fence post base */}
          <rect x="17" y="38" width="10" height="18" rx="2" fill="#8B6914"/>
          {/* Body */}
          <ellipse cx="22" cy="36" rx="12" ry="10" fill="#8B0000"/>
          {/* Tail feathers */}
          <path d="M10 32 Q4 22 8 14" fill="none" stroke="#c0392b" strokeWidth="4" strokeLinecap="round"/>
          <path d="M10 34 Q0 26 2 18" fill="none" stroke="#922B21" strokeWidth="3" strokeLinecap="round"/>
          <path d="M12 36 Q6 30 10 22" fill="none" stroke="#F39C12" strokeWidth="3" strokeLinecap="round"/>
          {/* Head */}
          <circle cx="32" cy="22" r="9" fill="#8B0000"/>
          {/* Comb */}
          <path d="M28 14 Q30 10 32 14 Q34 10 36 14" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.5"/>
          {/* Wattle */}
          <ellipse cx="35" cy="26" rx="4" ry="5" fill="#e74c3c"/>
          {/* Beak - open when crowing */}
          {state === 'animating' ? (
            <>
              <polygon points="38,20 44,18 38,22" fill="#F39C12"/>
              <polygon points="38,22 44,22 38,24" fill="#E67E22"/>
            </>
          ) : (
            <polygon points="38,20 44,22 38,24" fill="#F39C12"/>
          )}
          {/* Eye */}
          <circle cx="30" cy="20" r="2.5" fill="#F39C12"/>
          <circle cx="30" cy="20" r="1.5" fill="#1a1a1a"/>
          {/* Wing */}
          <path d="M14 32 Q16 26 24 28" fill="#922B21"/>
        </svg>
        {/* Crow burst */}
        {state === 'animating' && (
          <div className="absolute -top-4 -right-4 text-lg pointer-events-none"
            style={{ animation: 'crow-burst 0.8s ease-out forwards' }}>
            💥
          </div>
        )}
      </div>
    )
  );
}
