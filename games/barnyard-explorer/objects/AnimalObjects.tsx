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
  const lifted = state === 'animating' || state === 'revealed';
  return (
    <div className={`relative cursor-pointer select-none ${state === 'idle' ? 'hover:scale-110' : ''}`}
      onClick={(e) => { e.stopPropagation(); if (state === 'idle') onDiscover(); }}>
      <svg width="58" height="54" viewBox="0 0 58 54">
        {/* Nest — brown rounded rect */}
        <rect x="6" y="40" width="46" height="12" rx="6" fill="#784212"/>
        {/* Straw lines */}
        <line x1="12" y1="40" x2="10" y2="52" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="20" y1="40" x2="18" y2="52" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="29" y1="40" x2="29" y2="52" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="38" y1="40" x2="40" y2="52" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="46" y1="40" x2="48" y2="52" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round"/>
        {/* Eggs when revealed */}
        {lifted && (
          <>
            <ellipse cx="20" cy="42" rx="5" ry="6" fill="#FDEBD0"/>
            <ellipse cx="29" cy="41" rx="5" ry="6" fill="#FDEBD0"/>
            <ellipse cx="38" cy="42" rx="5" ry="6" fill="#FDEBD0"/>
          </>
        )}
        {/* Hen body — white oval */}
        <ellipse cx="28" cy={lifted ? '24' : '32'} rx="16" ry="12" fill="#ECF0F1"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Wing */}
        <ellipse cx="22" cy={lifted ? '26' : '34'} rx="8" ry="5" fill="#BDC3C7"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Head — white circle */}
        <circle cx="40" cy={lifted ? '18' : '26'} r="9" fill="#ECF0F1"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Comb — 3 red bumps */}
        <circle cx="37" cy={lifted ? '10' : '18'} r="3" fill="#E74C3C"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        <circle cx="41" cy={lifted ? '9' : '17'} r="3" fill="#C0392B"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        <circle cx="45" cy={lifted ? '10' : '18'} r="2.5" fill="#E74C3C"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Beak — orange triangle */}
        <polygon
          points={lifted ? '48,18 54,20 48,22' : '48,26 54,28 48,30'}
          fill="#F39C12"
          style={{ transition: 'points 0.5s ease-out' }}
        />
        {/* Eye dot */}
        <circle cx="42" cy={lifted ? '18' : '26'} r="1.8" fill="#1A252F"
          style={{ transition: 'cy 0.5s ease-out' }}/>
        {/* Legs — orange rects */}
        <rect x="24" y="43" width="4" height="8" rx="2" fill="#F39C12"/>
        <rect x="30" y="43" width="4" height="8" rx="2" fill="#F39C12"/>
        {/* Feather ruffle */}
        {state === 'animating' && (
          <>
            <circle cx="14" cy="26" r="4" fill="#ECF0F1" style={{ animation: 'feather-fly 0.8s ease-out forwards' }}/>
            <circle cx="42" cy="14" r="3" fill="#BDC3C7" style={{ animation: 'feather-fly 0.8s ease-out 0.1s forwards' }}/>
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
      <svg width="72" height="56" viewBox="0 0 72 56">
        {/* Body — white rounded rect */}
        <rect x="4" y="22" width="48" height="28" rx="10" fill="#ECF0F1"/>
        {/* Brown patches */}
        <ellipse cx="18" cy="28" rx="10" ry="8" fill="#784212" opacity="0.5"/>
        <ellipse cx="38" cy="36" rx="8" ry="6" fill="#784212" opacity="0.45"/>
        {/* Legs — four short rects */}
        <rect x="10" y="46" width="7" height="12" rx="3.5" fill="#ECF0F1"/>
        <rect x="20" y="46" width="7" height="12" rx="3.5" fill="#ECF0F1"/>
        <rect x="32" y="46" width="7" height="12" rx="3.5" fill="#ECF0F1"/>
        <rect x="42" y="46" width="7" height="12" rx="3.5" fill="#ECF0F1"/>
        {/* Udder */}
        <ellipse cx="28" cy="50" rx="12" ry="5" fill="#F5B7B1"/>
        {/* Tail */}
        <path d="M4 28 Q-4 20 2 12" fill="none" stroke="#BDC3C7" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="2" cy="11" r="4" fill="#784212"/>
        {/* Head — white rounded rect */}
        <rect x="50" y="16" width="20" height="28" rx="8" fill="#ECF0F1"/>
        {/* Muzzle — pink oval */}
        <ellipse cx="64" cy="34" rx="8" ry="6" fill="#F5B7B1"/>
        {/* Nostrils */}
        <circle cx="61" cy="34" r="1.8" fill="#C0392B"/>
        <circle cx="67" cy="34" r="1.8" fill="#C0392B"/>
        {/* Eye */}
        <circle cx="56" cy="22" r="3" fill="#1A252F"/>
        <circle cx="55" cy="21" r="1" fill="#ECF0F1"/>
        {/* Ear */}
        <ellipse cx="52" cy="18" rx="5" ry="7" fill="#F5B7B1" transform="rotate(-15 52 18)"/>
        {/* Horns */}
        <path d="M54 16 Q50 8 46 10" fill="none" stroke="#F4D03F" strokeWidth="4" strokeLinecap="round"/>
        {/* Mouth */}
        {moo ? (
          <path d="M60 38 Q64 42 68 38" fill="#C0392B"/>
        ) : (
          <path d="M60 38 Q64 40 68 38" fill="none" stroke="#784212" strokeWidth="2" strokeLinecap="round"/>
        )}
      </svg>
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
      <svg width="60" height="48" viewBox="0 0 60 48">
        {/* Body — pink rounded rect */}
        <rect x="4" y="16" width="40" height="26" rx="10" fill="#F5B7B1"/>
        {/* Legs */}
        <rect x="8"  y="36" width="7" height="12" rx="3.5" fill="#F5B7B1"/>
        <rect x="17" y="36" width="7" height="12" rx="3.5" fill="#F5B7B1"/>
        <rect x="28" y="36" width="7" height="12" rx="3.5" fill="#F5B7B1"/>
        <rect x="37" y="36" width="7" height="12" rx="3.5" fill="#F5B7B1"/>
        {/* Tail — curly */}
        <path d="M4 24 Q-4 20 0 14 Q4 8 2 4" fill="none" stroke="#F5B7B1" strokeWidth="3" strokeLinecap="round"/>
        {/* Head — circle */}
        <circle cx="48" cy="24" r="13" fill="#F5B7B1"/>
        {/* Snout — darker pink circle */}
        <ellipse cx="52" cy="28" rx="8" ry="6" fill="#E8A0B0"/>
        {/* Nostrils */}
        <circle cx="49" cy="28" r="1.8" fill="#922B21"/>
        <circle cx="55" cy="28" r="1.8" fill="#922B21"/>
        {/* Eye */}
        <circle cx="44" cy="20" r="2.5" fill="#1A252F"/>
        <circle cx="43" cy="19" r="0.8" fill="#ECF0F1"/>
        {/* Ear — triangle */}
        <polygon points="40,12 36,4 44,6" fill="#E8A0B0"/>
        {/* Mud when animating/revealed */}
        {(state === 'animating' || state === 'revealed') && (
          <>
            <circle cx="10" cy="44" r="5" fill="#784212" opacity="0.4"/>
            <circle cx="26" cy="46" r="6" fill="#784212" opacity="0.35"/>
            <circle cx="42" cy="44" r="4" fill="#784212" opacity="0.4"/>
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
      <svg width="64" height="62" viewBox="0 0 64 62">
        {/* Fence rail — horse pokes head over */}
        <rect x="0" y="34" width="64" height="5" rx="2.5" fill="#D4A574"/>
        <rect x="0" y="42" width="64" height="5" rx="2.5" fill="#D4A574"/>
        {/* Fence post */}
        <rect x="28" y="32" width="8" height="30" rx="3" fill="#8B4513"/>
        {/* Head — brown rounded rect */}
        <rect x="16" y="10" width="24" height="30" rx="8" fill="#784212"/>
        {/* Mane — dark jagged strip */}
        <rect x="14" y="8" width="8" height="28" rx="4" fill="#2C1A0E"/>
        {/* Ears */}
        <polygon points="18,10 14,2 22,4" fill="#784212"/>
        <polygon points="36,10 32,2 40,4" fill="#784212"/>
        {/* Nose area */}
        <ellipse cx="28" cy="34" rx="9" ry="6" fill="#5D3A1A"/>
        {/* Nostrils */}
        <circle cx="25" cy="34" r="1.8" fill="#2C1A0E"/>
        <circle cx="31" cy="34" r="1.8" fill="#2C1A0E"/>
        {/* Eye */}
        <circle cx="22" cy="20" r="3.5" fill="#1A252F"/>
        <circle cx="21" cy="19" r="1.2" fill="#ECF0F1"/>
        {/* Dust when stomping */}
        {state === 'animating' && (
          <g style={{ animation: 'dust-poof 0.6s ease-out forwards' }}>
            <circle cx="16" cy="54" r="6" fill="#D4A574" opacity="0.5"/>
            <circle cx="32" cy="56" r="5" fill="#D4A574" opacity="0.45"/>
            <circle cx="48" cy="54" r="6" fill="#D4A574" opacity="0.5"/>
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
      <svg width="66" height="50" viewBox="0 0 66 50">
        {/* Body — tan rounded rect */}
        <rect x="2" y="18" width="38" height="24" rx="9" fill="#FDEBD0"/>
        {/* Legs */}
        <rect x="6"  y="36" width="6" height="14" rx="3" fill="#FDEBD0"/>
        <rect x="14" y="36" width="6" height="14" rx="3" fill="#FDEBD0"/>
        <rect x="24" y="36" width="6" height="14" rx="3" fill="#FDEBD0"/>
        <rect x="32" y="36" width="6" height="14" rx="3" fill="#FDEBD0"/>
        {/* Tail */}
        <ellipse cx="4" cy="22" rx="4" ry="6" fill="#E8DACC" transform="rotate(-20 4 22)"/>
        {/* Neck */}
        <rect x="34" y="12" width="14" height="20" rx="5" fill="#FDEBD0"/>
        {/* Head */}
        <ellipse cx="50" cy="16" rx="14" ry="12" fill="#FDEBD0"/>
        {/* Beard */}
        <rect x="47" y="26" width="6" height="10" rx="3" fill="#E8DACC"/>
        {/* Snout */}
        <ellipse cx="56" cy="18" rx="7" ry="5" fill="#E8DACC"/>
        <circle cx="54" cy="18" r="1.5" fill="#2C1A0E"/>
        <circle cx="58" cy="18" r="1.5" fill="#2C1A0E"/>
        {/* Eye */}
        <ellipse cx="48" cy="13" rx="3" ry="2.5" fill="#1A252F"/>
        <circle cx="47" cy="12" r="0.8" fill="#ECF0F1"/>
        {/* Horns */}
        <path d="M42 6 Q38 0 35 4" fill="none" stroke="#A08060" strokeWidth="3" strokeLinecap="round"/>
        <path d="M48 6 Q50 0 54 3" fill="none" stroke="#A08060" strokeWidth="3" strokeLinecap="round"/>
        {/* Fence post */}
        <rect x="59" y="8" width="7" height="42" rx="3" fill="#8B4513"
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
        <svg width="62" height="48" viewBox="0 0 62 48">
          {/* Fluffy wool — overlapping white circles */}
          <circle cx="14" cy="22" r="13" fill="#ECF0F1"/>
          <circle cx="26" cy="16" r="14" fill="#ECF0F1"/>
          <circle cx="38" cy="16" r="14" fill="#ECF0F1"/>
          <circle cx="48" cy="22" r="12" fill="#ECF0F1"/>
          <circle cx="14" cy="30" r="12" fill="#ECF0F1"/>
          <circle cx="26" cy="32" r="13" fill="#ECF0F1"/>
          <circle cx="38" cy="32" r="13" fill="#ECF0F1"/>
          <circle cx="48" cy="30" r="11" fill="#ECF0F1"/>
          {/* Head — dark rounded rect */}
          <rect x="46" y="18" width="16" height="18" rx="6" fill="#85929E"/>
          {/* Face */}
          <circle cx="57" cy="24" r="2" fill="#1A252F"/>
          <path d="M52 30 Q55 32 58 30" fill="none" stroke="#5D6D7E" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Ear */}
          <ellipse cx="48" cy="20" rx="4" ry="6" fill="#717D7E" transform="rotate(-15 48 20)"/>
          {/* Legs — thin dark */}
          <rect x="13" y="38" width="5" height="12" rx="2.5" fill="#717D7E"/>
          <rect x="22" y="38" width="5" height="12" rx="2.5" fill="#717D7E"/>
          <rect x="34" y="38" width="5" height="12" rx="2.5" fill="#717D7E"/>
          <rect x="43" y="38" width="5" height="12" rx="2.5" fill="#717D7E"/>
        </svg>
        {state === 'animating' && (
          <div className="absolute top-0 right-2 pointer-events-none"
            style={{ animation: 'wool-fly 1s ease-out forwards', fontSize: '20px', color: '#ECF0F1' }}>
            ✦
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
      <svg width="56" height="38" viewBox="0 0 56 38">
        {/* Cheese wheel — yellow cylinder */}
        <ellipse cx="28" cy="28" rx="24" ry="10" fill="#F4D03F"/>
        <ellipse cx="28" cy="22" rx="24" ry="10" fill="#F9E79F"/>
        {/* Cheese holes */}
        <ellipse cx="18" cy="20" rx="4" ry="3" fill="#F4D03F"/>
        <ellipse cx="30" cy="18" rx="3" ry="2.5" fill="#F4D03F"/>
        <ellipse cx="40" cy="22" rx="4" ry="2.5" fill="#F4D03F"/>
        {/* Mouse body */}
        <ellipse
          cx={state === 'animating' || state === 'revealed' ? '40' : '14'} cy="14"
          rx="8" ry="6" fill="#85929E"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        {/* Mouse head */}
        <circle
          cx={state === 'animating' || state === 'revealed' ? '47' : '21'} cy="11"
          r="6" fill="#717D7E"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        {/* Ears — two circles */}
        <circle
          cx={state === 'animating' || state === 'revealed' ? '43' : '17'} cy="7"
          r="4" fill="#85929E"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        <circle
          cx={state === 'animating' || state === 'revealed' ? '50' : '24'} cy="7"
          r="4" fill="#85929E"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        {/* Eye */}
        <circle
          cx={state === 'animating' || state === 'revealed' ? '50' : '24'} cy="10"
          r="1.8" fill="#1A252F"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        {/* Nose */}
        <circle
          cx={state === 'animating' || state === 'revealed' ? '53' : '27'} cy="12"
          r="1.2" fill="#E74C3C"
          style={{ transition: 'cx 0.7s ease-in-out' }}
        />
        {/* Tail */}
        <path
          d={state === 'animating' || state === 'revealed' ? 'M32 15 Q22 18 14 14' : 'M6 14 Q2 10 4 6'}
          fill="none" stroke="#85929E" strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'd 0.7s ease-in-out' }}
        />
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
        <svg width="46" height="62" viewBox="0 0 46 62">
          {/* Fence post base */}
          <rect x="18" y="42" width="10" height="20" rx="3" fill="#8B4513"/>
          {/* Body — dark red oval */}
          <ellipse cx="22" cy="38" rx="13" ry="11" fill="#922B21"/>
          {/* Colorful tail feathers — arcs */}
          <path d="M10 34 Q4 24 8 14" fill="none" stroke="#E74C3C" strokeWidth="5" strokeLinecap="round"/>
          <path d="M10 36 Q0 28 2 18" fill="none" stroke="#2ECC71" strokeWidth="4" strokeLinecap="round"/>
          <path d="M12 38 Q6 32 10 22" fill="none" stroke="#3498DB" strokeWidth="4" strokeLinecap="round"/>
          {/* Wing */}
          <ellipse cx="16" cy="36" rx="8" ry="5" fill="#7B241C" transform="rotate(10 16 36)"/>
          {/* Head */}
          <circle cx="32" cy="24" r="10" fill="#922B21"/>
          {/* Comb */}
          <circle cx="30" cy="14" r="4" fill="#E74C3C"/>
          <circle cx="35" cy="13" r="4" fill="#C0392B"/>
          <circle cx="39" cy="15" r="3.5" fill="#E74C3C"/>
          {/* Wattle */}
          <ellipse cx="36" cy="30" rx="4" ry="5" fill="#E74C3C"/>
          {/* Beak */}
          {state === 'animating' ? (
            <>
              <polygon points="40,22 46,20 40,24" fill="#F39C12"/>
              <polygon points="40,24 46,24 40,26" fill="#E67E22"/>
            </>
          ) : (
            <polygon points="40,22 46,24 40,26" fill="#F39C12"/>
          )}
          {/* Eye */}
          <circle cx="30" cy="22" r="3" fill="#F4D03F"/>
          <circle cx="30" cy="22" r="1.8" fill="#1A252F"/>
        </svg>
        {state === 'animating' && (
          <div className="absolute -top-4 -right-2 pointer-events-none"
            style={{ animation: 'crow-burst 0.8s ease-out forwards', fontSize: '18px' }}>
            ✦
          </div>
        )}
      </div>
    )
  );
}
