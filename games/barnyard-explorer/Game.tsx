'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';
import type { ObjectState } from './objects/shared';
import Scene, { OBJECT_POSITIONS } from './Scene';

type Props = {
  words: string[];
  setup: SetupChoices;
};

const TOTAL_OBJECTS = 25;
const ANIM_DURATION_MS = 1200; // time before word card appears

export default function BarnyardExplorer({ words, setup }: Props) {
  const skipWords = setup.skipWords === true;

  // Shuffle word→object assignment once per mount
  const wordAssignment = useMemo(() => {
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Pad or trim to exactly TOTAL_OBJECTS
    while (shuffled.length < TOTAL_OBJECTS) shuffled.push(shuffled[shuffled.length - 1] ?? '');
    return shuffled.slice(0, TOTAL_OBJECTS);
  }, [words]);

  const [objectStates, setObjectStates] = useState<ObjectState[]>(
    () => Array(TOTAL_OBJECTS).fill('idle')
  );
  // activeWord: { id, x, y } — which object's word card is showing
  const [activeWord, setActiveWord] = useState<{ id: number; x: number; y: number } | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const discoveredCount = objectStates.filter((s) => s === 'revealed').length;
  const allFound = discoveredCount === TOTAL_OBJECTS && !celebrated;

  const handleObjectClick = useCallback((id: number) => {
    if (objectStates[id] !== 'idle') return;

    // Dismiss current word card immediately
    setActiveWord(null);

    // Set to animating
    setObjectStates((prev) => {
      const next = [...prev] as ObjectState[];
      next[id] = 'animating';
      return next;
    });

    // After animation, set to revealed + show word card
    const t = setTimeout(() => {
      setObjectStates((prev) => {
        const next = [...prev] as ObjectState[];
        next[id] = 'revealed';
        return next;
      });

      if (!skipWords) {
        const [x, y] = OBJECT_POSITIONS[id];
        setActiveWord({ id, x, y });
      }
    }, ANIM_DURATION_MS);
    animTimers.current.push(t);
  }, [objectStates, skipWords]);

  const handleDismissWord = useCallback(() => {
    setActiveWord(null);
  }, []);

  const handleSceneClick = useCallback(() => {
    if (activeWord) setActiveWord(null);
  }, [activeWord]);

  const handleExploreAgain = useCallback(() => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
    setObjectStates(Array(TOTAL_OBJECTS).fill('idle'));
    setActiveWord(null);
    setCelebrated(false);
  }, []);

  // All-found detection
  const handleCelebrationDone = useCallback(() => {
    setCelebrated(true);
  }, []);

  // Word card position clamped to scene bounds
  function wordCardStyle(x: number, y: number): React.CSSProperties {
    const cx = Math.min(Math.max(x, 18), 82);
    const cy = Math.min(Math.max(y - 18, 8), 70);
    return { left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%, -100%)' };
  }

  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '80vh', width: '100%' }}
      onClick={handleSceneClick}
    >
      <Scene
        objectStates={objectStates}
        words={wordAssignment}
        skipWords={skipWords}
        onObjectClick={handleObjectClick}
      />

      {/* ── Counter HUD ──────────────────────────────────────── */}
      <div className="absolute top-2 left-2 z-30 pointer-events-none">
        <div className="rounded-full bg-white/85 px-3 py-1 text-sm font-bold text-amber-800 shadow">
          {skipWords ? '🌟' : '🔍'} {skipWords ? 'Explored' : 'Found'}: {discoveredCount} / {TOTAL_OBJECTS}
        </div>
      </div>

      {/* ── Word Card ─────────────────────────────────────────── */}
      {activeWord && !skipWords && (
        <div
          className="absolute z-40 pointer-events-auto"
          style={wordCardStyle(activeWord.x, activeWord.y)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative rounded-2xl border-4 border-amber-400 bg-white/97 px-6 py-4 shadow-2xl text-center"
            style={{ animation: 'word-card-pop 0.2s ease-out' }}>
            <button
              onClick={handleDismissWord}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-500">
              Say this word:
            </p>
            <p className="text-4xl font-bold text-amber-900 leading-tight">
              {wordAssignment[activeWord.id]}
            </p>
          </div>
        </div>
      )}

      {/* ── All Found Celebration ─────────────────────────────── */}
      {allFound && (
        <AllFoundCelebration
          skipWords={skipWords}
          onExploreAgain={handleExploreAgain}
          onDone={handleCelebrationDone}
        />
      )}

      {/* ── After celebration, show play-again buttons ────────── */}
      {celebrated && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-2xl bg-white/95 px-10 py-8 text-center shadow-2xl backdrop-blur">
            <p className="text-3xl font-bold text-amber-900 mb-2">🌟 Amazing exploring! 🌟</p>
            <p className="text-amber-700 mb-6">You found everything on the farm!</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleExploreAgain}
                className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
              >
                Explore Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-amber-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-amber-700"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}

      <GameStyles />
    </div>
  );
}

/* ─── All Found Celebration overlay ─────────────────────── */
function AllFoundCelebration({
  skipWords,
  onExploreAgain,
  onDone,
}: { skipWords: boolean; onExploreAgain: () => void; onDone: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Confetti */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: '-5%',
            width: `${5 + Math.random() * 5}px`,
            height: `${5 + Math.random() * 5}px`,
            backgroundColor: ['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899'][i % 6],
            animation: `confetti-fall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s forwards`,
          }}
        />
      ))}

      {/* Banner */}
      <div
        className="relative pointer-events-auto rounded-3xl border-4 border-amber-400 bg-white/95 px-10 py-6 text-center shadow-2xl"
        style={{ animation: 'banner-pop 0.4s ease-out' }}
      >
        <p className="text-4xl font-bold text-amber-900">🎉 You explored the whole farm! 🎉</p>
        <p className="mt-2 text-lg text-amber-700">
          {skipWords ? 'Every corner discovered!' : 'Every word found!'}
        </p>
        <div className="mt-5 flex justify-center gap-4">
          <button
            onClick={onExploreAgain}
            className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
          >
            Explore Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-amber-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-amber-700"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── All CSS keyframe animations ────────────────────────── */
function GameStyles() {
  return (
    <style jsx global>{`
      /* Barn objects */
      @keyframes corn-spill {
        0% { transform: rotate(0deg); }
        40% { transform: rotate(-38deg); }
        100% { transform: rotate(-38deg); }
      }
      @keyframes corn-kernel {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(calc(var(--i,0)*8px - 16px), 20px) scale(0.7); opacity: 0; }
      }
      @keyframes hay-burst {
        0% { transform: scale(1) rotate(0deg); }
        30% { transform: scale(1.25) rotate(-5deg); }
        60% { transform: scale(0.9) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      @keyframes hay-piece {
        0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
        100% { transform: translate(calc((var(--i,0) - 3) * 20px), -30px) rotate(180deg); opacity: 0; }
      }
      @keyframes anim-pitchfork-fall {
        0% { transform: rotate(-20deg); }
        60% { transform: rotate(90deg) translateX(10px); }
        100% { transform: rotate(88deg) translateX(10px); }
      }
      @keyframes anim-spin-fast {
        0% { transform: rotate(0deg); }
        70% { transform: rotate(720deg); }
        100% { transform: rotate(700deg); }
      }
      @keyframes anim-saddle-bounce {
        0% { transform: translateY(0) scaleY(1); }
        30% { transform: translateY(-18px) scaleY(1.05); }
        55% { transform: translateY(4px) scaleY(0.95); }
        75% { transform: translateY(-6px) scaleY(1.02); }
        100% { transform: translateY(0) scaleY(1); }
      }
      @keyframes anim-vane-spin {
        0% { transform: rotate(0deg); }
        60% { transform: rotate(540deg); }
        85% { transform: rotate(500deg); }
        100% { transform: rotate(510deg); }
      }

      /* Animal objects */
      @keyframes feather-fly {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(-20px, -30px) scale(0.5); opacity: 0; }
      }
      @keyframes cow-moo {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.08) translateX(3px); }
        50% { transform: scale(1.05) translateX(-2px); }
        75% { transform: scale(1.07) translateX(2px); }
      }
      @keyframes bubble-pop {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pig-flop {
        0% { transform: rotate(0deg) translateY(0); }
        50% { transform: rotate(25deg) translateY(5px); }
        100% { transform: rotate(20deg) translateY(8px); }
      }
      @keyframes horse-stomp {
        0% { transform: translateY(0); }
        20% { transform: translateY(-10px); }
        40% { transform: translateY(4px); }
        60% { transform: translateY(-5px); }
        80% { transform: translateY(2px); }
        100% { transform: translateY(0); }
      }
      @keyframes dust-poof {
        0% { transform: scale(0); opacity: 0.8; }
        60% { transform: scale(1.3); opacity: 0.5; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes goat-headbutt {
        0% { transform: translateX(0); }
        35% { transform: translateX(14px); }
        55% { transform: translateX(-4px); }
        75% { transform: translateX(6px); }
        100% { transform: translateX(0); }
      }
      @keyframes post-wobble {
        0%, 100% { transform: rotate(0deg); }
        20% { transform: rotate(8deg); }
        40% { transform: rotate(-5deg); }
        60% { transform: rotate(4deg); }
        80% { transform: rotate(-2deg); }
      }
      @keyframes sheep-shake {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-12deg); }
        30% { transform: rotate(12deg); }
        45% { transform: rotate(-10deg); }
        60% { transform: rotate(10deg); }
        75% { transform: rotate(-6deg); }
        90% { transform: rotate(6deg); }
      }
      @keyframes wool-fly {
        0% { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(25px, -40px) scale(1.5); opacity: 0; }
      }
      @keyframes crow-burst {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        50% { transform: scale(1.4) rotate(10deg); opacity: 1; }
        100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
      }
      @keyframes rooster-crow {
        0% { transform: scale(1) rotate(0deg); }
        20% { transform: scale(1.15) rotate(-8deg); }
        40% { transform: scale(1.1) rotate(5deg); }
        60% { transform: scale(1.12) rotate(-4deg); }
        80% { transform: scale(1.05) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); }
      }

      /* Pond/garden objects */
      @keyframes ripple-out {
        0% { transform: scale(0.6); opacity: 0.7; }
        100% { transform: scale(1.4); opacity: 0; }
      }
      @keyframes duck-dunk {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(35deg); }
        100% { transform: rotate(30deg); }
      }
      @keyframes droplet-fall {
        0% { transform: translateY(0); opacity: 0.8; }
        100% { transform: translateY(20px); opacity: 0; }
      }
      @keyframes can-pour {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(-40deg); }
        100% { transform: rotate(-38deg); }
      }
      @keyframes water-drop {
        0% { transform: translateY(0); opacity: 0.8; }
        100% { transform: translateY(12px); opacity: 0; }
      }
      @keyframes flower-grow {
        0% { transform: scale(0) translateY(10px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes sunflower-bloom {
        0% { transform: scale(0.1) rotate(-180deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      @keyframes hat-fly {
        0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
        100% { transform: translate(30px, -60px) rotate(45deg); opacity: 0.8; }
      }
      @keyframes barrow-tip {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(35deg); }
        100% { transform: rotate(32deg); }
      }
      @keyframes produce-tumble {
        0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-30px, 20px) rotate(-90deg); opacity: 0.8; }
      }

      /* Sky/environment objects */
      @keyframes apple-bounce {
        0% { transform: translateY(0) scaleY(1); }
        30% { transform: translateY(-8px) scaleY(1.05); }
        55% { transform: translateY(3px) scaleY(0.92); }
        75% { transform: translateY(-3px) scaleY(1.02); }
        100% { transform: translateY(0) scaleY(1); }
      }
      @keyframes cloud-drift {
        0% { transform: translateX(0); }
        100% { transform: translateX(32px); }
      }
      @keyframes ray-grow {
        0% { transform: scaleX(0); opacity: 0; }
        100% { transform: scaleX(1); opacity: 1; }
      }
      @keyframes sun-reveal {
        0% { transform: scale(0.3); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bird-swoop {
        0% { transform: translate(0,0); }
        30% { transform: translate(20px, 30px); }
        60% { transform: translate(40px, 50px); }
        80% { transform: translate(20px, 20px); }
        100% { transform: translate(0,0); }
      }
      @keyframes trail-fade {
        0% { opacity: 0.7; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.3); }
      }
      @keyframes blade-spin-fast {
        0% { transform: rotate(0deg); }
        70% { transform: rotate(1080deg); }
        100% { transform: rotate(1060deg); }
      }
      @keyframes blade-spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Scene ambient */
      @keyframes ambient-cloud {
        0% { transform: translateX(-120px); }
        100% { transform: translateX(calc(100vw + 120px)); }
      }
      @keyframes grass-sway {
        0% { transform: rotate(-4deg); }
        100% { transform: rotate(4deg); }
      }

      /* UI */
      @keyframes word-card-pop {
        0% { transform: translate(-50%, -100%) scale(0.85); opacity: 0; }
        100% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
      }
      @keyframes banner-pop {
        0% { transform: scale(0.7); opacity: 0; }
        70% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes confetti-fall {
        0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
        100% { transform: translate(20px, 110vh) rotate(720deg); opacity: 0; }
      }

      /* Hover glow for all clickable objects */
      .barnyard-object:hover {
        filter: drop-shadow(0 0 6px rgba(251,191,36,0.65));
      }
    `}</style>
  );
}
