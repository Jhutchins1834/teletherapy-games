'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';

type Props = {
  words: string[];
  setup: SetupChoices;
};

/* ─── Snow Particle Config ────────────────────────────────── */
const SNOW_COUNT = 30;
const snowParticles = Array.from({ length: SNOW_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 2 + Math.random() * 3,
  opacity: 0.3 + Math.random() * 0.5,
}));

/* ─── Wind Gust Config ────────────────────────────────────── */
const WIND_GUSTS = [
  { top: 15, delay: 0, duration: 7 },
  { top: 40, delay: 3, duration: 9 },
  { top: 65, delay: 6, duration: 8 },
  { top: 85, delay: 1.5, duration: 10 },
];

export default function MountainClimber({ words, setup }: Props) {
  const totalSteps = Number(setup.wordCount);
  const [step, setStep] = useState(0); // climber position (0 = base, totalSteps = summit)
  const [wordIndex, setWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'summit' | 'partial'>('playing');
  const [celebrating, setCelebrating] = useState(false);

  const currentWord = words[wordIndex];
  const gameOver = wordIndex >= words.length;

  // Compute climber Y position: 0 steps = bottom (88%), totalSteps = summit (6%)
  const climberY = useMemo(() => {
    const bottom = 88;
    const top = 6;
    const range = bottom - top;
    return bottom - (step / totalSteps) * range;
  }, [step, totalSteps]);

  const handleCorrect = useCallback(() => {
    const newStep = step + 1;
    const newCorrect = correct + 1;
    const newWordIndex = wordIndex + 1;

    setStep(newStep);
    setCorrect(newCorrect);
    setWordIndex(newWordIndex);

    if (newWordIndex >= words.length) {
      if (newCorrect === words.length) {
        // Perfect run — summit!
        setCelebrating(true);
        setTimeout(() => setPhase('summit'), 600);
      } else {
        setTimeout(() => setPhase('partial'), 400);
      }
    }
  }, [step, correct, wordIndex, words.length]);

  const handleTryAgain = useCallback(() => {
    // Do nothing — same word stays, no state change
  }, []);

  const handleSkip = useCallback(() => {
    const newSkipped = skipped + 1;
    const newWordIndex = wordIndex + 1;

    setSkipped(newSkipped);
    setWordIndex(newWordIndex);

    if (newWordIndex >= words.length) {
      setTimeout(() => setPhase('partial'), 400);
    }
  }, [skipped, wordIndex, words.length]);

  // ─── SUMMIT CELEBRATION ──────────────────────────────────────
  if (phase === 'summit') {
    return (
      <div
        className="relative mx-auto select-none overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MountainScene />
        {/* Confetti burst */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: '-5%',
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'][i % 6],
                animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        {/* Climber at peak */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-5xl"
          style={{ top: '4%', animation: 'summit-bounce 0.6s ease-in-out infinite alternate' }}
        >
          🧗
        </div>
        {/* Flag */}
        <div className="absolute left-[53%] text-3xl" style={{ top: '2%' }}>
          🚩
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/90 px-10 py-8 text-center shadow-2xl backdrop-blur">
            <h2 className="text-4xl font-bold text-emerald-800">You made it to the top!</h2>
            <p className="mt-3 text-2xl text-emerald-700">
              {correct} out of {words.length} words ✨
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-sky-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-sky-700"
              >
                Play Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-emerald-700"
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        <GameStyles />
      </div>
    );
  }

  // ─── PARTIAL FINISH ──────────────────────────────────────────
  if (phase === 'partial') {
    const accuracy = words.length > 0 ? Math.round((correct / words.length) * 100) : 0;
    return (
      <div
        className="relative mx-auto select-none overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MountainScene />
        <SnowAndWind />

        {/* Climber frozen at final position */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-4xl sm:text-5xl"
          style={{ top: `${climberY}%`, transition: 'top 0.4s ease-out' }}
        >
          🧗
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/90 px-10 py-8 text-center shadow-2xl backdrop-blur max-w-md">
            <h2 className="text-3xl font-bold text-sky-800">Good effort!</h2>
            <p className="mt-3 text-xl text-sky-700">
              You got {correct} out of {words.length} words correct
            </p>
            <p className="mt-1 text-4xl font-bold text-sky-600">{accuracy}%</p>
            <p className="mt-2 text-sm text-sky-500">
              You made it {step} out of {totalSteps} steps up the mountain
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-sky-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-sky-700"
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        <GameStyles />
      </div>
    );
  }

  // ─── GAMEPLAY ────────────────────────────────────────────────
  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
    >
      <MountainScene />
      <SnowAndWind />

      {/* Summit flag */}
      <div className="absolute left-[53%] text-2xl sm:text-3xl" style={{ top: '2%' }}>
        🚩
      </div>

      {/* Step markers (small cairn dots along the path) */}
      {Array.from({ length: totalSteps + 1 }, (_, i) => {
        const y = 88 - (i / totalSteps) * 82;
        return (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: `${y}%`,
              width: i === totalSteps ? '0px' : '6px',
              height: i === totalSteps ? '0px' : '6px',
              backgroundColor: i < step ? '#22c55e' : 'rgba(255,255,255,0.35)',
              transition: 'background-color 0.3s',
            }}
          />
        );
      })}

      {/* Climber */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 text-4xl sm:text-5xl ${
          celebrating ? 'animate-bounce' : ''
        }`}
        style={{ top: `${climberY}%`, transition: 'top 0.5s ease-out' }}
      >
        🧗
      </div>

      {/* Word card + buttons — right side panel */}
      {!gameOver && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 sm:right-8">
          {/* Word card */}
          <div className="flex flex-col items-center rounded-2xl border-4 border-sky-300 bg-white/95 px-6 py-5 shadow-xl backdrop-blur sm:px-10 sm:py-7">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-sky-500">
              Say this word:
            </p>
            <p className="text-5xl font-bold text-sky-900 sm:text-6xl md:text-7xl">
              {currentWord}
            </p>
            <p className="mt-2 text-xs text-sky-400">
              Word {wordIndex + 1} of {words.length}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleCorrect}
              className="rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white shadow-md transition hover:bg-green-700 sm:px-6 sm:text-lg"
            >
              Correct ✓
            </button>
            <button
              onClick={handleTryAgain}
              className="rounded-xl bg-amber-500 px-4 py-3 text-base font-bold text-white shadow-md transition hover:bg-amber-600 sm:px-6 sm:text-lg"
            >
              Try again
            </button>
            <button
              onClick={handleSkip}
              className="rounded-xl bg-slate-400 px-4 py-3 text-base font-bold text-white shadow-md transition hover:bg-slate-500 sm:px-6 sm:text-lg"
            >
              Skip →
            </button>
          </div>

          {/* Progress indicator */}
          <p className="text-xs text-white/70">
            ✅ {correct} correct · ⏭ {skipped} skipped
          </p>
        </div>
      )}

      <GameStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components — extracted to keep the main component readable
   ═══════════════════════════════════════════════════════════════ */

/** Static mountain scene: sky gradient, mountain silhouettes, ground */
function MountainScene() {
  return (
    <>
      {/* Sky gradient — lighter blue at base, colder purple-blue at summit */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 via-sky-400 to-sky-300" />

      {/* Distant background peaks (low opacity, depth) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Far peak left */}
        <polygon points="0,450 80,180 200,320 280,200 380,450" fill="rgba(148,163,184,0.25)" />
        {/* Far peak right */}
        <polygon points="500,450 580,220 680,300 750,160 800,450" fill="rgba(148,163,184,0.2)" />
      </svg>

      {/* Main mountain */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        {/* Mountain body — craggy left & right edges, summit at center-top */}
        <polygon
          points="200,450 240,380 260,400 300,320 320,340 350,260 370,280 390,200 400,160 410,120 420,80 430,40 440,80 450,110 460,150 480,200 500,230 520,270 540,310 570,350 600,450"
          fill="url(#mountainGrad)"
        />
        <defs>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Snow cap */}
        <polygon
          points="400,160 410,120 420,80 430,40 440,80 450,110 460,150 470,180 390,200"
          fill="white"
          opacity="0.85"
        />
      </svg>

      {/* Ground / base */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-slate-600 to-slate-500" />
    </>
  );
}

/** Animated snow particles and diagonal wind gusts */
function SnowAndWind() {
  return (
    <>
      {/* Snow particles */}
      {snowParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: '-2%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `snow-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Wind gusts — faint diagonal streaks */}
      {WIND_GUSTS.map((g, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${g.top}%`,
            left: '-20%',
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            borderRadius: '1px',
            animation: `wind-gust ${g.duration}s linear ${g.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/** All CSS keyframe animations for the game */
function GameStyles() {
  return (
    <style jsx>{`
      @keyframes snow-fall {
        0% {
          transform: translate(0, 0);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.4;
        }
        100% {
          transform: translate(40px, 110vh);
          opacity: 0;
        }
      }
      @keyframes wind-gust {
        0% {
          left: -15%;
          opacity: 0;
        }
        15% {
          opacity: 0.5;
        }
        85% {
          opacity: 0.3;
        }
        100% {
          left: 115%;
          opacity: 0;
        }
      }
      @keyframes confetti-fall {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0.9;
        }
        100% {
          transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, 110vh) rotate(720deg);
          opacity: 0;
        }
      }
      @keyframes summit-bounce {
        0% {
          transform: translateX(-50%) translateY(0);
        }
        100% {
          transform: translateX(-50%) translateY(-12px);
        }
      }
    `}</style>
  );
}
