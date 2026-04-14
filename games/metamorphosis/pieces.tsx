'use client';

import React from 'react';

export type AnimalId = 'dog' | 'cat' | 'lion' | 'eagle' | 'owl';
export type FormLevel = 0 | 1 | 2;

export type AnimalInfo = {
  id: AnimalId;
  name: string;
  forms: [string, string, string]; // names for base, upgraded, final
  color: string; // primary hue for the picker card
};

export const ANIMALS: AnimalInfo[] = [
  { id: 'dog',   name: 'Dog',   forms: ['Puppy', 'Show Dog', 'Knight Dog'],     color: '#92400e' },
  { id: 'cat',   name: 'Cat',   forms: ['House Cat', 'Royal Cat', 'Winged Cat'], color: '#6d28d9' },
  { id: 'lion',  name: 'Lion',  forms: ['Lion Cub', 'Adult Lion', 'Celestial Lion'], color: '#b45309' },
  { id: 'eagle', name: 'Eagle', forms: ['Young Hawk', 'Golden Eagle', 'Phoenix'],    color: '#dc2626' },
  { id: 'owl',   name: 'Owl',   forms: ['Tiny Owl', 'Scholar Owl', 'Mystic Owl'],   color: '#1e40af' },
];

type PieceProps = { size?: number; className?: string };

/**
 * Get the SVG component for a given animal and form level.
 */
export function getPieceSVG(animal: AnimalId, form: FormLevel): React.FC<PieceProps> {
  const key = `${animal}_${form}` as keyof typeof PIECE_MAP;
  return PIECE_MAP[key] || FallbackPiece;
}

function FallbackPiece({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="#ccc" />
      <text x="24" y="28" textAnchor="middle" fontSize="14" fill="#666">?</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOG — 3 forms
   ═══════════════════════════════════════════════════════════════ */
function DogBase({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* Shadow */}
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="24" cy="30" rx="12" ry="10" fill="#d4a574" />
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#c4956a" />
      {/* Ears */}
      <ellipse cx="16" cy="12" rx="4" ry="6" fill="#a07050" transform="rotate(-15 16 12)" />
      <ellipse cx="32" cy="12" rx="4" ry="6" fill="#a07050" transform="rotate(15 32 12)" />
      {/* Eyes */}
      <circle cx="20" cy="17" r="2" fill="#333" />
      <circle cx="28" cy="17" r="2" fill="#333" />
      <circle cx="20.5" cy="16.5" r="0.7" fill="white" />
      <circle cx="28.5" cy="16.5" r="0.7" fill="white" />
      {/* Nose */}
      <ellipse cx="24" cy="21" rx="2.5" ry="2" fill="#333" />
      {/* Mouth */}
      <path d="M22 23 Q24 25 26 23" fill="none" stroke="#333" strokeWidth="0.8" />
      {/* Cheeks */}
      <circle cx="18" cy="20" r="2.5" fill="rgba(255,150,150,0.3)" />
      <circle cx="30" cy="20" r="2.5" fill="rgba(255,150,150,0.3)" />
      {/* Tail */}
      <path d="M36 28 Q42 22 38 18" fill="none" stroke="#c4956a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DogUpgraded({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body — sleeker */}
      <ellipse cx="24" cy="30" rx="11" ry="10" fill="#d4a574" />
      {/* Collar */}
      <rect x="16" y="25" width="16" height="3" rx="1.5" fill="#dc2626" />
      <circle cx="24" cy="26.5" r="2" fill="#fbbf24" />
      {/* Head */}
      <circle cx="24" cy="17" r="10" fill="#c4956a" />
      {/* Groomed ears */}
      <ellipse cx="15" cy="11" rx="4" ry="7" fill="#b8845c" transform="rotate(-10 15 11)" />
      <ellipse cx="33" cy="11" rx="4" ry="7" fill="#b8845c" transform="rotate(10 33 11)" />
      {/* Eyes */}
      <circle cx="20" cy="16" r="2.2" fill="#333" />
      <circle cx="28" cy="16" r="2.2" fill="#333" />
      <circle cx="20.6" cy="15.4" r="0.8" fill="white" />
      <circle cx="28.6" cy="15.4" r="0.8" fill="white" />
      {/* Nose */}
      <ellipse cx="24" cy="20" rx="2.5" ry="2" fill="#333" />
      {/* Smile */}
      <path d="M21 22 Q24 25 27 22" fill="none" stroke="#333" strokeWidth="0.8" />
      {/* Cheeks */}
      <circle cx="17" cy="19" r="2.5" fill="rgba(255,150,150,0.3)" />
      <circle cx="31" cy="19" r="2.5" fill="rgba(255,150,150,0.3)" />
      {/* Ribbon on head */}
      <path d="M22 8 L24 6 L26 8" fill="#3b82f6" stroke="#2563eb" strokeWidth="0.5" />
    </svg>
  );
}

function DogFinal({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Cape */}
      <path d="M18 26 L10 40 Q24 44 38 40 L30 26" fill="#7c3aed" opacity="0.8" />
      <path d="M18 26 L12 38 Q24 42 36 38 L30 26" fill="#8b5cf6" opacity="0.6" />
      {/* Armor body */}
      <ellipse cx="24" cy="30" rx="11" ry="10" fill="#94a3b8" />
      <ellipse cx="24" cy="30" rx="8" ry="7" fill="#cbd5e1" />
      {/* Shield emblem */}
      <path d="M22 28 L24 26 L26 28 L26 32 L24 33 L22 32Z" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
      {/* Helmet head */}
      <circle cx="24" cy="17" r="10" fill="#94a3b8" />
      <path d="M14 17 Q24 4 34 17" fill="#64748b" /> {/* visor */}
      {/* Eyes through visor */}
      <circle cx="20" cy="17" r="2" fill="#fbbf24" />
      <circle cx="28" cy="17" r="2" fill="#fbbf24" />
      <circle cx="20" cy="17" r="1" fill="#333" />
      <circle cx="28" cy="17" r="1" fill="#333" />
      {/* Nose */}
      <ellipse cx="24" cy="21" rx="2" ry="1.5" fill="#333" />
      {/* Smile */}
      <path d="M22 23 Q24 25 26 23" fill="none" stroke="#333" strokeWidth="0.8" />
      {/* Plume on helmet */}
      <path d="M24 7 Q20 2 24 0 Q28 2 24 7" fill="#dc2626" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAT — 3 forms
   ═══════════════════════════════════════════════════════════════ */
function CatBase({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="24" cy="31" rx="10" ry="9" fill="#a78bfa" />
      {/* Tail */}
      <path d="M34 30 Q40 26 42 20 Q44 16 40 18" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#c4b5fd" />
      {/* Ears */}
      <polygon points="16,12 14,4 20,10" fill="#c4b5fd" />
      <polygon points="32,12 34,4 28,10" fill="#c4b5fd" />
      <polygon points="16.5,11.5 15,6 19,10" fill="#f9a8d4" />
      <polygon points="31.5,11.5 33,6 29,10" fill="#f9a8d4" />
      {/* Eyes */}
      <ellipse cx="20" cy="17" rx="2.5" ry="2.8" fill="#10b981" />
      <ellipse cx="28" cy="17" rx="2.5" ry="2.8" fill="#10b981" />
      <ellipse cx="20" cy="17" rx="1" ry="2.5" fill="#333" />
      <ellipse cx="28" cy="17" rx="1" ry="2.5" fill="#333" />
      {/* Nose */}
      <polygon points="23,20 25,20 24,21.5" fill="#f472b6" />
      {/* Whiskers */}
      <line x1="10" y1="19" x2="18" y2="20" stroke="#888" strokeWidth="0.5" />
      <line x1="10" y1="21" x2="18" y2="21" stroke="#888" strokeWidth="0.5" />
      <line x1="30" y1="20" x2="38" y2="19" stroke="#888" strokeWidth="0.5" />
      <line x1="30" y1="21" x2="38" y2="21" stroke="#888" strokeWidth="0.5" />
      {/* Mouth */}
      <path d="M23 22 Q24 23 25 22" fill="none" stroke="#333" strokeWidth="0.5" />
    </svg>
  );
}

function CatUpgraded({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Cape */}
      <path d="M19 26 L14 38 Q24 42 34 38 L29 26" fill="#7c3aed" opacity="0.5" />
      {/* Body */}
      <ellipse cx="24" cy="31" rx="10" ry="9" fill="#8b5cf6" />
      {/* Tail — regal curl */}
      <path d="M34 30 Q42 24 40 16 Q38 12 36 16" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#a78bfa" />
      {/* Crown */}
      <path d="M17 11 L19 5 L22 9 L24 3 L26 9 L29 5 L31 11Z" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
      {/* Ears */}
      <polygon points="16,13 14,6 20,11" fill="#a78bfa" />
      <polygon points="32,13 34,6 28,11" fill="#a78bfa" />
      {/* Eyes */}
      <ellipse cx="20" cy="17" rx="2.5" ry="2.8" fill="#10b981" />
      <ellipse cx="28" cy="17" rx="2.5" ry="2.8" fill="#10b981" />
      <ellipse cx="20" cy="17" rx="1" ry="2.5" fill="#333" />
      <ellipse cx="28" cy="17" rx="1" ry="2.5" fill="#333" />
      {/* Nose */}
      <polygon points="23,20 25,20 24,21.5" fill="#f472b6" />
      {/* Whiskers */}
      <line x1="10" y1="19" x2="18" y2="20" stroke="#888" strokeWidth="0.5" />
      <line x1="30" y1="20" x2="38" y2="19" stroke="#888" strokeWidth="0.5" />
      {/* Smile */}
      <path d="M22 22 Q24 24 26 22" fill="none" stroke="#333" strokeWidth="0.6" />
    </svg>
  );
}

function CatFinal({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Wings */}
      <path d="M14 28 Q4 18 8 10 Q12 14 18 26" fill="#c4b5fd" opacity="0.7" />
      <path d="M34 28 Q44 18 40 10 Q36 14 30 26" fill="#c4b5fd" opacity="0.7" />
      <path d="M14 28 Q6 20 10 14 Q13 16 18 26" fill="#ddd6fe" opacity="0.5" />
      <path d="M34 28 Q42 20 38 14 Q35 16 30 26" fill="#ddd6fe" opacity="0.5" />
      {/* Body */}
      <ellipse cx="24" cy="31" rx="10" ry="9" fill="#7c3aed" />
      {/* Tail */}
      <path d="M34 30 Q42 22 38 14" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      {/* Head */}
      <circle cx="24" cy="18" r="10" fill="#8b5cf6" />
      {/* Crown with gems */}
      <path d="M17 11 L19 4 L22 9 L24 2 L26 9 L29 4 L31 11Z" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
      <circle cx="24" cy="5" r="1.5" fill="#dc2626" />
      {/* Ears */}
      <polygon points="16,13 14,6 20,11" fill="#8b5cf6" />
      <polygon points="32,13 34,6 28,11" fill="#8b5cf6" />
      {/* Glowing eyes */}
      <ellipse cx="20" cy="17" rx="2.5" ry="2.8" fill="#fbbf24" />
      <ellipse cx="28" cy="17" rx="2.5" ry="2.8" fill="#fbbf24" />
      <ellipse cx="20" cy="17" rx="1" ry="2.5" fill="#333" />
      <ellipse cx="28" cy="17" rx="1" ry="2.5" fill="#333" />
      {/* Nose */}
      <polygon points="23,20 25,20 24,21.5" fill="#f472b6" />
      {/* Smile */}
      <path d="M22 22 Q24 24 26 22" fill="none" stroke="#333" strokeWidth="0.6" />
      {/* Sparkles */}
      <circle cx="10" cy="20" r="1" fill="#fbbf24" opacity="0.8" />
      <circle cx="38" cy="20" r="1" fill="#fbbf24" opacity="0.8" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LION — 3 forms
   ═══════════════════════════════════════════════════════════════ */
function LionBase({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="24" cy="32" rx="10" ry="8" fill="#fbbf24" />
      {/* Tail */}
      <path d="M34 32 Q40 28 42 22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="21" r="2" fill="#92400e" />
      {/* Head — small cub */}
      <circle cx="24" cy="19" r="9" fill="#fcd34d" />
      {/* Small ears */}
      <circle cx="16" cy="13" r="3.5" fill="#fcd34d" />
      <circle cx="32" cy="13" r="3.5" fill="#fcd34d" />
      <circle cx="16" cy="13" r="2" fill="#f9a8d4" />
      <circle cx="32" cy="13" r="2" fill="#f9a8d4" />
      {/* Eyes */}
      <circle cx="20" cy="18" r="2.5" fill="#333" />
      <circle cx="28" cy="18" r="2.5" fill="#333" />
      <circle cx="20.7" cy="17.3" r="0.8" fill="white" />
      <circle cx="28.7" cy="17.3" r="0.8" fill="white" />
      {/* Nose */}
      <polygon points="23,21 25,21 24,22.5" fill="#333" />
      {/* Mouth */}
      <path d="M22 23 Q24 25 26 23" fill="none" stroke="#333" strokeWidth="0.6" />
      {/* Cheeks */}
      <circle cx="17" cy="21" r="2" fill="rgba(255,180,150,0.3)" />
      <circle cx="31" cy="21" r="2" fill="rgba(255,180,150,0.3)" />
    </svg>
  );
}

function LionUpgraded({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body — larger */}
      <ellipse cx="24" cy="32" rx="11" ry="9" fill="#f59e0b" />
      {/* Tail */}
      <path d="M35 32 Q42 26 44 20" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="19" r="2.5" fill="#92400e" />
      {/* Mane */}
      <circle cx="24" cy="18" r="14" fill="#b45309" />
      <circle cx="24" cy="18" r="12" fill="#d97706" />
      {/* Head */}
      <circle cx="24" cy="19" r="9" fill="#fbbf24" />
      {/* Ears */}
      <circle cx="15" cy="11" r="3" fill="#fbbf24" />
      <circle cx="33" cy="11" r="3" fill="#fbbf24" />
      {/* Eyes — more intense */}
      <ellipse cx="20" cy="18" rx="2.5" ry="2" fill="#333" />
      <ellipse cx="28" cy="18" rx="2.5" ry="2" fill="#333" />
      <circle cx="20.7" cy="17.5" r="0.8" fill="white" />
      <circle cx="28.7" cy="17.5" r="0.8" fill="white" />
      {/* Nose */}
      <polygon points="22.5,21 25.5,21 24,23" fill="#333" />
      {/* Mouth */}
      <path d="M22 24 Q24 26 26 24" fill="none" stroke="#333" strokeWidth="0.7" />
    </svg>
  );
}

function LionFinal({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Starry glow */}
      <circle cx="24" cy="18" r="18" fill="url(#lionGlow)" opacity="0.4" />
      <defs>
        <radialGradient id="lionGlow">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="24" cy="32" rx="11" ry="9" fill="#d97706" />
      {/* Celestial mane */}
      <circle cx="24" cy="17" r="15" fill="#92400e" />
      <circle cx="24" cy="17" r="13" fill="#b45309" />
      {/* Stars in mane */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const r = 13.5;
        const cx = 24 + r * Math.cos((angle * Math.PI) / 180);
        const cy = 17 + r * Math.sin((angle * Math.PI) / 180);
        return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#fef3c7" />;
      })}
      {/* Head */}
      <circle cx="24" cy="18" r="9" fill="#fbbf24" />
      {/* Ears */}
      <circle cx="15" cy="10" r="3" fill="#fbbf24" />
      <circle cx="33" cy="10" r="3" fill="#fbbf24" />
      {/* Glowing eyes */}
      <ellipse cx="20" cy="17" rx="2.5" ry="2.2" fill="#fef3c7" />
      <ellipse cx="28" cy="17" rx="2.5" ry="2.2" fill="#fef3c7" />
      <circle cx="20" cy="17" r="1.2" fill="#92400e" />
      <circle cx="28" cy="17" r="1.2" fill="#92400e" />
      {/* Nose */}
      <polygon points="22.5,20 25.5,20 24,22" fill="#333" />
      {/* Serene smile */}
      <path d="M22 23 Q24 25 26 23" fill="none" stroke="#333" strokeWidth="0.7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EAGLE — 3 forms
   ═══════════════════════════════════════════════════════════════ */
function EagleBase({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Wings folded */}
      <path d="M14 26 Q10 22 12 18 Q16 22 18 28" fill="#78716c" />
      <path d="M34 26 Q38 22 36 18 Q32 22 30 28" fill="#78716c" />
      {/* Body */}
      <ellipse cx="24" cy="30" rx="8" ry="9" fill="#a8a29e" />
      {/* Chest */}
      <ellipse cx="24" cy="32" rx="5" ry="6" fill="#d6d3d1" />
      {/* Head */}
      <circle cx="24" cy="17" r="8" fill="#78716c" />
      {/* Eyes */}
      <circle cx="20" cy="16" r="2.5" fill="#fbbf24" />
      <circle cx="28" cy="16" r="2.5" fill="#fbbf24" />
      <circle cx="20" cy="16" r="1.2" fill="#333" />
      <circle cx="28" cy="16" r="1.2" fill="#333" />
      {/* Beak */}
      <polygon points="22,20 24,24 26,20" fill="#f59e0b" />
      {/* Cheeks */}
      <circle cx="17" cy="18" r="2" fill="rgba(255,180,150,0.2)" />
      <circle cx="31" cy="18" r="2" fill="rgba(255,180,150,0.2)" />
    </svg>
  );
}

function EagleUpgraded({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Wings spread */}
      <path d="M14 26 Q4 16 6 8 Q12 14 18 26" fill="#b45309" />
      <path d="M34 26 Q44 16 42 8 Q36 14 30 26" fill="#b45309" />
      <path d="M14 26 Q6 18 8 12 Q13 16 18 26" fill="#d97706" opacity="0.6" />
      <path d="M34 26 Q42 18 40 12 Q35 16 30 26" fill="#d97706" opacity="0.6" />
      {/* Armor body */}
      <ellipse cx="24" cy="30" rx="8" ry="9" fill="#94a3b8" />
      <ellipse cx="24" cy="32" rx="5" ry="5" fill="#cbd5e1" />
      {/* Shield */}
      <path d="M22 30 L24 28 L26 30 L26 34 L24 35 L22 34Z" fill="#dc2626" stroke="#991b1b" strokeWidth="0.5" />
      {/* Head — golden */}
      <circle cx="24" cy="16" r="8" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="20" cy="15" r="2.5" fill="#fef3c7" />
      <circle cx="28" cy="15" r="2.5" fill="#fef3c7" />
      <circle cx="20" cy="15" r="1.2" fill="#333" />
      <circle cx="28" cy="15" r="1.2" fill="#333" />
      {/* Beak */}
      <polygon points="22,19 24,24 26,19" fill="#f59e0b" />
    </svg>
  );
}

function EagleFinal({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Flame wings */}
      <path d="M14 26 Q2 14 6 4 Q12 12 18 26" fill="#ef4444" opacity="0.8" />
      <path d="M34 26 Q46 14 42 4 Q36 12 30 26" fill="#ef4444" opacity="0.8" />
      <path d="M14 26 Q4 16 8 8 Q13 14 18 26" fill="#f97316" opacity="0.6" />
      <path d="M34 26 Q44 16 40 8 Q35 14 30 26" fill="#f97316" opacity="0.6" />
      <path d="M15 26 Q8 18 10 12 Q14 16 18 26" fill="#fbbf24" opacity="0.4" />
      <path d="M33 26 Q40 18 38 12 Q34 16 30 26" fill="#fbbf24" opacity="0.4" />
      {/* Body */}
      <ellipse cx="24" cy="30" rx="8" ry="9" fill="#dc2626" />
      <ellipse cx="24" cy="32" rx="5" ry="5" fill="#fbbf24" />
      {/* Head — flame */}
      <circle cx="24" cy="16" r="8" fill="#f97316" />
      {/* Flame crest */}
      <path d="M20 10 Q22 2 24 8 Q26 2 28 10" fill="#ef4444" />
      {/* Glowing eyes */}
      <circle cx="20" cy="15" r="2.5" fill="#fef3c7" />
      <circle cx="28" cy="15" r="2.5" fill="#fef3c7" />
      <circle cx="20" cy="15" r="1" fill="#dc2626" />
      <circle cx="28" cy="15" r="1" fill="#dc2626" />
      {/* Beak */}
      <polygon points="22,19 24,24 26,19" fill="#fbbf24" />
      {/* Sparkles */}
      <circle cx="8" cy="8" r="1" fill="#fbbf24" opacity="0.7" />
      <circle cx="40" cy="8" r="1" fill="#fbbf24" opacity="0.7" />
      <circle cx="6" cy="20" r="0.8" fill="#fef3c7" opacity="0.6" />
      <circle cx="42" cy="20" r="0.8" fill="#fef3c7" opacity="0.6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OWL — 3 forms
   ═══════════════════════════════════════════════════════════════ */
function OwlBase({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="24" cy="32" rx="9" ry="10" fill="#6366f1" />
      {/* Chest */}
      <ellipse cx="24" cy="34" rx="6" ry="7" fill="#a5b4fc" />
      {/* Chest dots */}
      <circle cx="22" cy="32" r="1" fill="#6366f1" opacity="0.4" />
      <circle cx="26" cy="32" r="1" fill="#6366f1" opacity="0.4" />
      <circle cx="24" cy="35" r="1" fill="#6366f1" opacity="0.4" />
      {/* Wings */}
      <path d="M15 30 Q10 28 12 24 Q14 28 16 32" fill="#4f46e5" />
      <path d="M33 30 Q38 28 36 24 Q34 28 32 32" fill="#4f46e5" />
      {/* Head */}
      <circle cx="24" cy="17" r="9" fill="#818cf8" />
      {/* Ear tufts */}
      <polygon points="16,12 14,5 19,10" fill="#818cf8" />
      <polygon points="32,12 34,5 29,10" fill="#818cf8" />
      {/* Big eyes */}
      <circle cx="20" cy="16" r="4" fill="white" />
      <circle cx="28" cy="16" r="4" fill="white" />
      <circle cx="20" cy="16" r="2.5" fill="#fbbf24" />
      <circle cx="28" cy="16" r="2.5" fill="#fbbf24" />
      <circle cx="20" cy="16" r="1.2" fill="#333" />
      <circle cx="28" cy="16" r="1.2" fill="#333" />
      {/* Beak */}
      <polygon points="23,20 24,22 25,20" fill="#f59e0b" />
      {/* Feet */}
      <path d="M20 42 L18 44 M20 42 L20 44 M20 42 L22 44" stroke="#f59e0b" strokeWidth="1" fill="none" />
      <path d="M28 42 L26 44 M28 42 L28 44 M28 42 L30 44" stroke="#f59e0b" strokeWidth="1" fill="none" />
    </svg>
  );
}

function OwlUpgraded({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <ellipse cx="24" cy="32" rx="9" ry="10" fill="#4f46e5" />
      <ellipse cx="24" cy="34" rx="6" ry="7" fill="#a5b4fc" />
      {/* Wings */}
      <path d="M15 30 Q8 26 10 20 Q14 26 16 32" fill="#3730a3" />
      <path d="M33 30 Q40 26 38 20 Q34 26 32 32" fill="#3730a3" />
      {/* Head */}
      <circle cx="24" cy="17" r="9" fill="#6366f1" />
      {/* Ear tufts */}
      <polygon points="16,12 13,4 19,10" fill="#6366f1" />
      <polygon points="32,12 35,4 29,10" fill="#6366f1" />
      {/* Glasses */}
      <circle cx="20" cy="16" r="4.5" fill="none" stroke="#92400e" strokeWidth="1.2" />
      <circle cx="28" cy="16" r="4.5" fill="none" stroke="#92400e" strokeWidth="1.2" />
      <line x1="24.5" y1="15" x2="23.5" y2="15" stroke="#92400e" strokeWidth="1" />
      {/* Eyes behind glasses */}
      <circle cx="20" cy="16" r="3.5" fill="white" />
      <circle cx="28" cy="16" r="3.5" fill="white" />
      <circle cx="20" cy="16" r="2.2" fill="#fbbf24" />
      <circle cx="28" cy="16" r="2.2" fill="#fbbf24" />
      <circle cx="20" cy="16" r="1" fill="#333" />
      <circle cx="28" cy="16" r="1" fill="#333" />
      {/* Beak */}
      <polygon points="23,20 24,22.5 25,20" fill="#f59e0b" />
      {/* Graduation cap */}
      <rect x="17" y="8" width="14" height="2" rx="0.5" fill="#333" />
      <polygon points="24,8 20,6 24,4 28,6" fill="#333" />
      {/* Tassel */}
      <line x1="20" y1="6" x2="17" y2="8" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="17" cy="9" r="1" fill="#fbbf24" />
    </svg>
  );
}

function OwlFinal({ size = 48 }: PieceProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* Mystical glow */}
      <circle cx="24" cy="24" r="20" fill="url(#owlGlow)" opacity="0.3" />
      <defs>
        <radialGradient id="owlGlow">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="24" cy="32" rx="9" ry="10" fill="#3730a3" />
      <ellipse cx="24" cy="34" rx="6" ry="7" fill="#6366f1" />
      {/* Rune markings on chest */}
      <path d="M22 30 L24 28 L26 30 M22 33 L26 33 M24 33 L24 36" stroke="#a5b4fc" strokeWidth="0.8" fill="none" opacity="0.8" />
      {/* Wings spread */}
      <path d="M15 30 Q4 22 8 12 Q14 22 16 32" fill="#4338ca" />
      <path d="M33 30 Q44 22 40 12 Q34 22 32 32" fill="#4338ca" />
      {/* Rune dots on wings */}
      <circle cx="10" cy="20" r="1" fill="#a5b4fc" opacity="0.7" />
      <circle cx="38" cy="20" r="1" fill="#a5b4fc" opacity="0.7" />
      <circle cx="12" cy="24" r="0.8" fill="#c4b5fd" opacity="0.6" />
      <circle cx="36" cy="24" r="0.8" fill="#c4b5fd" opacity="0.6" />
      {/* Head */}
      <circle cx="24" cy="17" r="9" fill="#4f46e5" />
      {/* Ear tufts — longer, mystical */}
      <polygon points="16,12 12,2 19,10" fill="#4f46e5" />
      <polygon points="32,12 36,2 29,10" fill="#4f46e5" />
      <circle cx="13" cy="4" r="1" fill="#a5b4fc" opacity="0.7" />
      <circle cx="35" cy="4" r="1" fill="#a5b4fc" opacity="0.7" />
      {/* Glowing eyes */}
      <circle cx="20" cy="16" r="4" fill="white" />
      <circle cx="28" cy="16" r="4" fill="white" />
      <circle cx="20" cy="16" r="2.8" fill="#a5b4fc" />
      <circle cx="28" cy="16" r="2.8" fill="#a5b4fc" />
      <circle cx="20" cy="16" r="1.2" fill="#1e1b4b" />
      <circle cx="28" cy="16" r="1.2" fill="#1e1b4b" />
      {/* Rune on forehead */}
      <path d="M23 11 L24 9 L25 11 M23.5 10 L24.5 10" stroke="#fbbf24" strokeWidth="0.6" fill="none" />
      {/* Beak */}
      <polygon points="23,20 24,22.5 25,20" fill="#f59e0b" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Piece Map
   ═══════════════════════════════════════════════════════════════ */
const PIECE_MAP = {
  dog_0: DogBase,
  dog_1: DogUpgraded,
  dog_2: DogFinal,
  cat_0: CatBase,
  cat_1: CatUpgraded,
  cat_2: CatFinal,
  lion_0: LionBase,
  lion_1: LionUpgraded,
  lion_2: LionFinal,
  eagle_0: EagleBase,
  eagle_1: EagleUpgraded,
  eagle_2: EagleFinal,
  owl_0: OwlBase,
  owl_1: OwlUpgraded,
  owl_2: OwlFinal,
};
