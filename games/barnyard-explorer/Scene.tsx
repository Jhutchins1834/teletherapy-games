'use client';

import type { ObjectState } from './objects/shared';
import {
  CornBucket, BarnDoor, HayBale, Pitchfork,
  Horseshoe, Saddle, WeatherVane,
} from './objects/BarnObjects';
import {
  HenOnNest, Cow, Pig, Horse, Goat,
  Sheep, Mouse, Rooster,
} from './objects/AnimalObjects';
import {
  FrogOnLilyPad, Duck, WateringCan,
  Sunflower, Scarecrow, Wheelbarrow,
} from './objects/PondGardenObjects';
import {
  AppleTree, Cloud, Bird, Windmill,
} from './objects/SkyObjects';

// All 25 objects in order (index 0–24)
// Each entry: [x%, y%] — center of the object in the scene container
export const OBJECT_POSITIONS: [number, number][] = [
  // BARN AREA (0-6)
  [35, 68],  // 0 corn bucket
  [16, 44],  // 1 barn door
  [42, 74],  // 2 hay bale
  [7,  55],  // 3 pitchfork
  [26, 36],  // 4 horseshoe
  [37, 62],  // 5 saddle
  [20, 6],   // 6 weather vane
  // ANIMALS (7-14)
  [52, 65],  // 7 hen on nest
  [60, 54],  // 8 cow
  [14, 76],  // 9 pig
  [30, 52],  // 10 horse
  [46, 62],  // 11 goat
  [64, 68],  // 12 sheep
  [24, 60],  // 13 mouse
  [44, 46],  // 14 rooster
  // POND & GARDEN (15-20)
  [74, 74],  // 15 frog
  [84, 64],  // 16 duck
  [54, 78],  // 17 watering can
  [66, 52],  // 18 sunflower
  [50, 50],  // 19 scarecrow
  [72, 76],  // 20 wheelbarrow
  // SKY & ENVIRONMENT (21-24)
  [82, 36],  // 21 apple tree
  [62, 9],   // 22 cloud
  [42, 5],   // 23 bird
  [76, 22],  // 24 windmill
];

type SceneProps = {
  objectStates: ObjectState[];
  words: string[];
  skipWords: boolean;
  onObjectClick: (id: number) => void;
};

export default function Scene({ objectStates, words, skipWords, onObjectClick }: SceneProps) {
  function makeProps(id: number) {
    return {
      word: words[id] ?? '',
      state: objectStates[id],
      skipWords,
      onDiscover: () => onObjectClick(id),
    };
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Background ──────────────────────────────────────── */}
      <SceneBackground />

      {/* ── Interactive Objects ──────────────────────────────── */}
      {OBJECT_POSITIONS.map(([x, y], id) => (
        <div
          key={id}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <ObjectById id={id} props={makeProps(id)} />
        </div>
      ))}
    </div>
  );
}

function ObjectById({ id, props }: { id: number; props: ReturnType<typeof makePropsShape> }) {
  switch (id) {
    case 0:  return <CornBucket {...props} />;
    case 1:  return <BarnDoor {...props} />;
    case 2:  return <HayBale {...props} />;
    case 3:  return <Pitchfork {...props} />;
    case 4:  return <Horseshoe {...props} />;
    case 5:  return <Saddle {...props} />;
    case 6:  return <WeatherVane {...props} />;
    case 7:  return <HenOnNest {...props} />;
    case 8:  return <Cow {...props} />;
    case 9:  return <Pig {...props} />;
    case 10: return <Horse {...props} />;
    case 11: return <Goat {...props} />;
    case 12: return <Sheep {...props} />;
    case 13: return <Mouse {...props} />;
    case 14: return <Rooster {...props} />;
    case 15: return <FrogOnLilyPad {...props} />;
    case 16: return <Duck {...props} />;
    case 17: return <WateringCan {...props} />;
    case 18: return <Sunflower {...props} />;
    case 19: return <Scarecrow {...props} />;
    case 20: return <Wheelbarrow {...props} />;
    case 21: return <AppleTree {...props} />;
    case 22: return <Cloud {...props} />;
    case 23: return <Bird {...props} />;
    case 24: return <Windmill {...props} />;
    default: return null;
  }
}

// Type helper only — not called at runtime
function makePropsShape() {
  return { word: '', state: 'idle' as ObjectState, skipWords: false, onDiscover: () => {} };
}

/* ─── Scene Background ───────────────────────────────────── */
function SceneBackground() {
  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100" />

      {/* Sun */}
      <div className="absolute" style={{ right: '8%', top: '6%' }}>
        <div className="w-14 h-14 rounded-full bg-yellow-300 shadow-[0_0_30px_10px_rgba(253,224,71,0.5)]" />
      </div>

      {/* Distant hills */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <ellipse cx="120" cy="320" rx="160" ry="80" fill="#A8D5A2" opacity="0.5"/>
        <ellipse cx="680" cy="300" rx="180" ry="90" fill="#A8D5A2" opacity="0.45"/>
        <ellipse cx="400" cy="340" rx="200" ry="70" fill="#8FBC8F" opacity="0.4"/>
      </svg>

      {/* Main ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '38%',
        background: 'linear-gradient(to bottom, #7EC850 0%, #5A9E32 40%, #4A8628 100%)' }} />

      {/* Barn structure (decorative, non-interactive) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Barn body */}
        <rect x="40" y="140" width="220" height="170" fill="#B22222"/>
        {/* Barn roof */}
        <polygon points="20,140 150,60 280,140" fill="#8B0000"/>
        {/* Roof peak accent */}
        <polygon points="140,60 150,52 160,60" fill="#D4AC0D"/>
        {/* Barn window */}
        <rect x="100" y="160" width="40" height="40" rx="3" fill="#1a0a00"/>
        <line x1="120" y1="160" x2="120" y2="200" stroke="#5C3A1E" strokeWidth="2"/>
        <line x1="100" y1="180" x2="140" y2="180" stroke="#5C3A1E" strokeWidth="2"/>
        {/* Barn side wall */}
        <polygon points="260,140 300,160 300,310 260,310" fill="#922B21"/>
        {/* Ground shadow */}
        <ellipse cx="160" cy="312" rx="120" ry="10" fill="rgba(0,0,0,0.12)"/>
      </svg>

      {/* Fence line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <line x1="0" y1="295" x2="800" y2="295" stroke="#8B6914" strokeWidth="4"/>
        <line x1="0" y1="278" x2="800" y2="278" stroke="#8B6914" strokeWidth="3"/>
        {[40,120,200,280,360,440,520,600,680,760].map((x) => (
          <rect key={x} x={x-5} y="265" width="10" height="40" rx="2" fill="#A07832"/>
        ))}
      </svg>

      {/* Pond */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <ellipse cx="640" cy="370" rx="110" ry="45" fill="#5DADE2" opacity="0.75"/>
        <ellipse cx="640" cy="360" rx="100" ry="35" fill="#7EC8E3" opacity="0.5"/>
        {/* Lily pads decoration */}
        <ellipse cx="590" cy="368" rx="14" ry="7" fill="#27AE60" opacity="0.6"/>
        <ellipse cx="680" cy="374" rx="12" ry="6" fill="#27AE60" opacity="0.6"/>
        <ellipse cx="630" cy="380" rx="10" ry="5" fill="#27AE60" opacity="0.5"/>
      </svg>

      {/* Garden patch */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <rect x="350" y="300" width="200" height="80" rx="4" fill="#8B4513" opacity="0.5"/>
        {/* Row lines */}
        {[315, 330, 345, 360].map((y) => (
          <line key={y} x1="355" y1={y} x2="545" y2={y} stroke="#5C2F0D" strokeWidth="1.5" opacity="0.3"/>
        ))}
      </svg>

      {/* Grass tufts foreground */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        {[60,160,310,430,550,660,740].map((x) => (
          <g key={x}>
            <path d={`M${x} 310 Q${x-4} 296 ${x} 290`} fill="none" stroke="#4A8628" strokeWidth="3" strokeLinecap="round"/>
            <path d={`M${x+6} 310 Q${x+8} 295 ${x+6} 288`} fill="none" stroke="#4A8628" strokeWidth="2.5" strokeLinecap="round"/>
            <path d={`M${x+12} 310 Q${x+14} 297 ${x+10} 292`} fill="none" stroke="#5A9E32" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        ))}
      </svg>

      {/* Ambient cloud animation */}
      <div className="absolute pointer-events-none"
        style={{ left: '15%', top: '8%', animation: 'ambient-cloud 20s linear infinite' }}>
        <svg width="80" height="36" viewBox="0 0 80 36">
          <circle cx="20" cy="24" r="12" fill="white" opacity="0.7"/>
          <circle cx="35" cy="16" r="14" fill="white" opacity="0.7"/>
          <circle cx="52" cy="22" r="12" fill="white" opacity="0.7"/>
          <circle cx="62" cy="28" r="9" fill="white" opacity="0.7"/>
          <rect x="8" y="26" width="58" height="10" fill="white" opacity="0.7"/>
        </svg>
      </div>

      {/* Swaying grass */}
      <svg className="absolute bottom-0 left-0 right-0 pointer-events-none" viewBox="0 0 800 80" preserveAspectRatio="none"
        style={{ height: '12%' }}>
        {[...Array(30)].map((_, i) => (
          <path key={i}
            d={`M${i*28} 80 Q${i*28-6} 50 ${i*28} 30`}
            fill="none" stroke="#4A8628" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
            style={{ animation: `grass-sway ${2 + (i%3)*0.4}s ease-in-out ${(i%5)*0.3}s infinite alternate` }}
          />
        ))}
      </svg>
    </>
  );
}
