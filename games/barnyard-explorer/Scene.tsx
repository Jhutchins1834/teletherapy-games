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
  // BARN AREA (0-6) — left third
  [36, 72],  // 0 corn bucket — right of barn door, on ground
  [16, 50],  // 1 barn door — on barn face
  [44, 76],  // 2 hay bale — right of barn, on ground
  [7,  62],  // 3 pitchfork — leaning left barn wall
  [19, 30],  // 4 horseshoe — on barn wall above door
  [30, 58],  // 5 saddle — draped on fence near barn
  [18, 7],   // 6 weather vane — on barn roof peak
  // ANIMALS (7-14) — middle third
  [52, 72],  // 7 hen on nest — ground right of barn
  [40, 52],  // 8 cow — behind fence center-left
  [26, 66],  // 9 pig — in front of fence, left of center
  [50, 46],  // 10 horse — behind fence, head over rail center
  [58, 62],  // 11 goat — near fence post center-right
  [64, 72],  // 12 sheep — in front of fence right of center
  [8,  78],  // 13 mouse — base of barn wall, small
  [44, 41],  // 14 rooster — perched on fence post
  // POND & GARDEN (15-20) — right third
  [80, 74],  // 15 frog — on lily pad in pond
  [88, 64],  // 16 duck — floating on pond
  [56, 76],  // 17 watering can — near garden
  [66, 58],  // 18 sunflower — in garden
  [60, 52],  // 19 scarecrow — standing in garden
  [74, 68],  // 20 wheelbarrow — garden edge
  // SKY & ENVIRONMENT (21-24)
  [82, 42],  // 21 apple tree — right of center
  [52, 10],  // 22 cloud — upper center
  [36, 6],   // 23 bird — upper sky small
  [82, 18],  // 24 windmill — background right
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
      <SceneBackground />
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

function makePropsShape() {
  return { word: '', state: 'idle' as ObjectState, skipWords: false, onDiscover: () => {} };
}

/* ─── Scene Background — flat geometric minimalist ──────── */
function SceneBackground() {
  return (
    <>
      {/* Sky — flat light blue */}
      <div className="absolute inset-0" style={{ background: '#85C1E9', height: '62%' }} />
      {/* Sky fill rest with ground color */}
      <div className="absolute inset-0" style={{ background: '#85C1E9' }} />

      {/* Sun — flat yellow circle, upper right */}
      <div className="absolute" style={{ right: '6%', top: '5%' }}>
        <div className="rounded-full" style={{ width: '60px', height: '60px', background: '#F9E79F' }} />
      </div>

      {/* Clouds — flat white shapes (decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Ambient cloud 1 */}
        <g opacity="0.9">
          <rect x="60" y="40" width="100" height="28" rx="14" fill="#ECF0F1"/>
          <circle cx="80" cy="42" r="18" fill="#ECF0F1"/>
          <circle cx="110" cy="36" r="22" fill="#ECF0F1"/>
          <circle cx="140" cy="40" r="18" fill="#ECF0F1"/>
        </g>
        {/* Ambient cloud 2 — smaller */}
        <g opacity="0.85">
          <rect x="320" y="25" width="70" height="20" rx="10" fill="#ECF0F1"/>
          <circle cx="336" cy="28" r="14" fill="#ECF0F1"/>
          <circle cx="358" cy="22" r="16" fill="#ECF0F1"/>
          <circle cx="378" cy="26" r="13" fill="#ECF0F1"/>
        </g>
      </svg>

      {/* Distant hills — flat muted green shapes at horizon */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        <ellipse cx="160" cy="285" rx="180" ry="60" fill="#A8D5A2"/>
        <ellipse cx="650" cy="275" rx="200" ry="70" fill="#A8D5A2"/>
        <ellipse cx="400" cy="295" rx="220" ry="55" fill="#8FBC8F"/>
      </svg>

      {/* Main ground — flat green rect */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '40%', background: '#27AE60' }} />
      {/* Ground top stripe — slightly lighter */}
      <div className="absolute left-0 right-0" style={{ height: '4%', bottom: '38%', background: '#2ECC71' }} />

      {/* Barn structure — flat geometric */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Barn body */}
        <rect x="30" y="145" width="230" height="175" fill="#C0392B"/>
        {/* Barn side wall — darker */}
        <polygon points="260,145 310,165 310,320 260,320" fill="#922B21"/>
        {/* Barn roof */}
        <polygon points="10,145 145,55 280,145" fill="#922B21"/>
        {/* Roof peak accent */}
        <polygon points="135,55 145,47 155,55" fill="#F4D03F"/>
        {/* Window — small yellow square */}
        <rect x="90" y="165" width="46" height="36" rx="4" fill="#F4D03F"/>
        <rect x="111" y="165" width="4" height="36" fill="#E67E22"/>
        <rect x="90" y="182" width="46" height="4" fill="#E67E22"/>
        {/* Door frame area — dark opening */}
        <rect x="155" y="205" width="60" height="115" rx="4" fill="#1a0800"/>
        {/* X on door */}
        <line x1="157" y1="207" x2="213" y2="318" stroke="#ECF0F1" strokeWidth="3" opacity="0.3"/>
        <line x1="213" y1="207" x2="157" y2="318" stroke="#ECF0F1" strokeWidth="3" opacity="0.3"/>
        {/* Ground shadow */}
        <ellipse cx="160" cy="322" rx="130" ry="8" fill="rgba(0,0,0,0.08)"/>
      </svg>

      {/* Fence — flat brown horizontal bars + posts */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Rails */}
        <rect x="0" y="284" width="800" height="7" rx="3" fill="#8B4513"/>
        <rect x="0" y="268" width="800" height="6" rx="3" fill="#8B4513"/>
        {/* Posts */}
        {[30,110,190,270,350,430,510,590,670,750].map((x) => (
          <rect key={x} x={x - 5} y="258" width="10" height="42" rx="3" fill="#D4A574"/>
        ))}
      </svg>

      {/* Pond — flat blue ellipse, lower right */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        <ellipse cx="650" cy="375" rx="120" ry="46" fill="#2980B9"/>
        <ellipse cx="650" cy="368" rx="110" ry="36" fill="#3498DB"/>
        {/* Lily pads */}
        <ellipse cx="596" cy="372" rx="16" ry="8" fill="#1E8449"/>
        <ellipse cx="688" cy="378" rx="14" ry="7" fill="#1E8449"/>
        <ellipse cx="638" cy="382" rx="12" ry="6" fill="#27AE60"/>
      </svg>

      {/* Garden patch — flat brown rect, center-right */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450" preserveAspectRatio="none">
        <rect x="370" y="305" width="210" height="72" rx="6" fill="#784212" opacity="0.45"/>
        {/* Row lines */}
        {[318, 332, 346, 360].map((y) => (
          <line key={y} x1="376" y1={y} x2="574" y2={y} stroke="#5C2F0D" strokeWidth="2" opacity="0.25"/>
        ))}
      </svg>

      {/* Ambient drifting cloud */}
      <div className="absolute pointer-events-none"
        style={{ left: '10%', top: '6%', animation: 'ambient-cloud 28s linear infinite' }}>
        <svg width="90" height="40" viewBox="0 0 90 40">
          <rect x="8" y="22" width="74" height="18" rx="9" fill="white" opacity="0.75"/>
          <circle cx="22" cy="24" r="16" fill="white" opacity="0.75"/>
          <circle cx="42" cy="16" r="20" fill="white" opacity="0.75"/>
          <circle cx="64" cy="20" r="16" fill="white" opacity="0.75"/>
          <circle cx="76" cy="26" r="12" fill="white" opacity="0.75"/>
        </svg>
      </div>
    </>
  );
}
