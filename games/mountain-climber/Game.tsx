'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';
import { generatePaths, type PathPoint } from './path-generator';
import Climber from './Climber';

type Props = {
  words: string[];
  setup: SetupChoices;
};

type Phase = 'playing' | 'moving' | 'won' | 'fallback' | 'draw';

/* ─── Snow Particle Config ────────────────────────────────── */
const SNOW_COUNT = 20; // reduced from 30 to avoid obscuring climbers
const snowParticles = Array.from({ length: SNOW_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 2 + Math.random() * 3,
  opacity: 0.25 + Math.random() * 0.35,
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

  // Generate paths once based on step count
  const paths = useMemo(() => generatePaths(totalSteps), [totalSteps]);

  // Player state: [child (red/left), therapist (blue/right)]
  const [steps, setSteps] = useState([0, 0]);          // current step index per player
  const [correct, setCorrect] = useState([0, 0]);       // correct count per player
  const [skipped, setSkipped] = useState([0, 0]);        // skipped count per player
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [winner, setWinner] = useState<0 | 1 | null>(null);

  const currentWord = wordIndex < words.length ? words[wordIndex] : null;

  // Get the current position of each climber
  const redPos = paths.left[steps[0]];
  const bluePos = paths.right[steps[1]];

  // ─── Correct: advance climber, consume word, pass turn ────
  const handleCorrect = useCallback(() => {
    const cp = currentPlayer;
    const newStep = steps[cp] + 1;

    // Update correct count
    setCorrect((prev) => {
      const next = [...prev];
      next[cp]++;
      return next;
    });

    // Advance climber
    setSteps((prev) => {
      const next = [...prev];
      next[cp] = newStep;
      return next;
    });

    // Consume word
    setWordIndex((i) => i + 1);

    // Enter moving phase (disables buttons during animation)
    setPhase('moving');

    // After animation settles, check win or continue
    setTimeout(() => {
      // Check if this player summited
      if (newStep >= totalSteps) {
        setWinner(cp);
        setPhase('won');
        return;
      }

      // Check if words are exhausted
      const nextWordIdx = wordIndex + 1;
      if (nextWordIdx >= words.length) {
        resolveFallback(cp, newStep);
        return;
      }

      // Pass turn
      setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
      setPhase('playing');
    }, 500);
  }, [currentPlayer, steps, wordIndex, words.length, totalSteps]);

  // ─── Try again: no-op, same word, same player ─────────────
  const handleTryAgain = useCallback(() => {
    // Intentional no-op
  }, []);

  // ─── Skip: consume word, don't advance, pass turn ─────────
  const handleSkip = useCallback(() => {
    const cp = currentPlayer;

    // Update skipped count
    setSkipped((prev) => {
      const next = [...prev];
      next[cp]++;
      return next;
    });

    // Consume word (no step advance)
    setWordIndex((i) => i + 1);

    // Check if words are exhausted
    const nextWordIdx = wordIndex + 1;
    if (nextWordIdx >= words.length) {
      resolveFallback(cp, steps[cp]);
      return;
    }

    // Pass turn
    setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
  }, [currentPlayer, wordIndex, words.length, steps]);

  // ─── Fallback resolution ──────────────────────────────────
  const resolveFallback = (cp: 0 | 1, cpStep: number) => {
    const s0 = cp === 0 ? cpStep : steps[0];
    const s1 = cp === 1 ? cpStep : steps[1];

    if (s0 !== s1) {
      setWinner((s0 > s1 ? 0 : 1) as 0 | 1);
      setPhase('fallback');
    } else {
      setPhase('draw');
    }
  };

  // ─── Play Again (reshuffle same words) ────────────────────
  const handlePlayAgain = useCallback(() => {
    setSteps([0, 0]);
    setCorrect([0, 0]);
    setSkipped([0, 0]);
    setCurrentPlayer(0);
    setWordIndex(0);
    setWinner(null);
    setPhase('playing');
  }, []);

  // ─── WIN SCREEN ─────────────────────────────────────────────
  if ((phase === 'won' || phase === 'fallback') && winner !== null) {
    const isSummit = phase === 'won';
    const winnerColor = winner === 0 ? 'Red' : 'Blue';
    const headline = isSummit
      ? `${winnerColor} climber wins!`
      : `${winnerColor} climber made it higher!`;
    const subtitle = isSummit
      ? `${steps[winner]} steps to the top!`
      : `Red: ${steps[0]} steps · Blue: ${steps[1]} steps`;

    return (
      <div
        className="relative mx-auto select-none overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MountainScene />

        {/* Confetti */}
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
              }}
            />
          ))}
        </div>

        {/* Summit flag */}
        <div className="absolute text-2xl sm:text-3xl" style={{ left: '53%', top: '2%', transform: 'translateX(-50%)' }}>
          🚩
        </div>

        {/* Winner climber at summit celebrating */}
        <div
          className="absolute"
          style={{
            left: `${winner === 0 ? 50 : 56}%`,
            top: '3%',
            transform: 'translateX(-50%)',
          }}
        >
          <Climber color={winner === 0 ? 'red' : 'blue'} size={48} celebrating />
        </div>

        {/* Loser climber at their final position */}
        {(() => {
          const loser = winner === 0 ? 1 : 0;
          const loserPath = loser === 0 ? paths.left : paths.right;
          const loserPos = loserPath[steps[loser]];
          return (
            <div
              className="absolute"
              style={{
                left: `${loserPos.x}%`,
                top: `${loserPos.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 0.7,
              }}
            >
              <Climber color={loser === 0 ? 'red' : 'blue'} size={36} />
            </div>
          );
        })()}

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/90 px-10 py-8 text-center shadow-2xl backdrop-blur max-w-md">
            <div className="flex justify-center gap-4 mb-4">
              <Climber color={winner === 0 ? 'red' : 'blue'} size={56} celebrating />
            </div>
            <h2 className="text-3xl font-bold text-sky-900">{headline}</h2>
            <p className="mt-2 text-lg text-sky-700">{subtitle}</p>
            <div className="mt-2 flex justify-center gap-6 text-sm text-sky-600">
              <span>Red: {correct[0]} correct, {skipped[0]} skipped</span>
              <span>Blue: {correct[1]} correct, {skipped[1]} skipped</span>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
              >
                Play Again
              </button>
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

  // ─── DRAW SCREEN ────────────────────────────────────────────
  if (phase === 'draw') {
    return (
      <div
        className="relative mx-auto select-none overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MountainScene />
        <SnowAndWind />

        {/* Both climbers at their final positions */}
        <div
          className="absolute"
          style={{ left: `${redPos.x}%`, top: `${redPos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <Climber color="red" size={36} />
        </div>
        <div
          className="absolute"
          style={{ left: `${bluePos.x}%`, top: `${bluePos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <Climber color="blue" size={36} />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/90 px-10 py-8 text-center shadow-2xl backdrop-blur max-w-md">
            <div className="flex justify-center gap-4 mb-4">
              <Climber color="red" size={48} />
              <span className="text-3xl self-center">🤝</span>
              <Climber color="blue" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-sky-900">It&apos;s a tie!</h2>
            <p className="mt-2 text-lg text-sky-700">
              Both climbers reached step {steps[0]}!
            </p>
            <div className="mt-2 flex justify-center gap-6 text-sm text-sky-600">
              <span>Red: {correct[0]} correct</span>
              <span>Blue: {correct[1]} correct</span>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
              >
                Play Again
              </button>
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
  const buttonsDisabled = phase === 'moving';
  const playerColor = currentPlayer === 0 ? 'Red' : 'Blue';

  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
    >
      <MountainScene />
      <SnowAndWind />

      {/* Summit flag */}
      <div className="absolute text-2xl sm:text-3xl" style={{ left: '53%', top: '2%', transform: 'translateX(-50%)' }}>
        🚩
      </div>

      {/* Path dots — left (red) */}
      {paths.left.map((pt, i) => (
        <div
          key={`l${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: i === 0 || i === totalSteps ? '0px' : '5px',
            height: i === 0 || i === totalSteps ? '0px' : '5px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: i < steps[0] ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.18)',
            border: '1px solid rgba(239,68,68,0.12)',
            transition: 'background-color 0.3s',
          }}
        />
      ))}

      {/* Path dots — right (blue) */}
      {paths.right.map((pt, i) => (
        <div
          key={`r${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: i === 0 || i === totalSteps ? '0px' : '5px',
            height: i === 0 || i === totalSteps ? '0px' : '5px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: i < steps[1] ? 'rgba(37,99,235,0.5)' : 'rgba(37,99,235,0.18)',
            border: '1px solid rgba(37,99,235,0.12)',
            transition: 'background-color 0.3s',
          }}
        />
      ))}

      {/* Dashed path lines — left (red) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <polyline
          points={paths.left.map((p) => `${p.x * 8},${p.y * 4.5}`).join(' ')}
          fill="none"
          stroke="rgba(239,68,68,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Dashed path lines — right (blue) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <polyline
          points={paths.right.map((p) => `${p.x * 8},${p.y * 4.5}`).join(' ')}
          fill="none"
          stroke="rgba(37,99,235,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Red climber (child — left face) */}
      <div
        className="absolute z-10"
        style={{
          left: `${redPos.x}%`,
          top: `${redPos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.4s ease-in-out, top 0.4s ease-in-out',
        }}
      >
        <div style={{ transform: 'scaleX(1)' }}>
          <Climber color="red" size={36} />
        </div>
      </div>

      {/* Blue climber (therapist — right face) */}
      <div
        className="absolute z-10"
        style={{
          left: `${bluePos.x}%`,
          top: `${bluePos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.4s ease-in-out, top 0.4s ease-in-out',
        }}
      >
        <div style={{ transform: 'scaleX(-1)' }}>
          <Climber color="blue" size={36} />
        </div>
      </div>

      {/* HUD: turn indicator + scores */}
      <div className="absolute top-2 left-0 right-0 z-20 flex justify-center">
        <div className="flex items-center gap-4 rounded-full bg-white/90 px-5 py-1.5 shadow">
          {/* Red score */}
          <div className="flex items-center gap-1.5 text-xs">
            <Climber color="red" size={18} />
            <span className="font-semibold text-red-700">{correct[0]}/{steps[0]}</span>
          </div>

          {/* Turn indicator */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-0.5 text-sm font-bold ${
            currentPlayer === 0
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            <Climber color={currentPlayer === 0 ? 'red' : 'blue'} size={16} />
            <span>{playerColor}&apos;s turn</span>
          </div>

          {/* Blue score */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-blue-700">{correct[1]}/{steps[1]}</span>
            <Climber color="blue" size={18} />
          </div>
        </div>
      </div>

      {/* Word card + buttons — centered bottom area */}
      {currentWord && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          {/* Word card */}
          <div className="flex flex-col items-center rounded-2xl border-4 border-sky-300 bg-white/95 px-8 py-3 shadow-xl backdrop-blur">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-sky-500">
              Say this word:
            </p>
            <p className="text-4xl font-bold text-sky-900 sm:text-5xl">
              {currentWord}
            </p>
            <p className="mt-1 text-xs text-sky-400">
              Word {wordIndex + 1} of {words.length}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCorrect}
              disabled={buttonsDisabled}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Correct ✓
            </button>
            <button
              onClick={handleTryAgain}
              disabled={buttonsDisabled}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try again
            </button>
            <button
              onClick={handleSkip}
              disabled={buttonsDisabled}
              className="rounded-xl bg-slate-400 px-5 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip →
            </button>
          </div>
        </div>
      )}

      {/* Words exhausted mid-play */}
      {!currentWord && phase === 'playing' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-xl bg-white/90 p-4 shadow-lg text-center">
          <p className="text-sky-800 font-semibold">Great practice!</p>
          <p className="text-sm text-sky-600">Determining winner…</p>
        </div>
      )}

      <GameStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════ */

function MountainScene() {
  return (
    <>
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 via-sky-400 to-sky-300" />

      {/* Distant background peaks */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <polygon points="0,450 80,180 200,320 280,200 380,450" fill="rgba(148,163,184,0.25)" />
        <polygon points="500,450 580,220 680,300 750,160 800,450" fill="rgba(148,163,184,0.2)" />
      </svg>

      {/* Main mountain */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
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

function SnowAndWind() {
  return (
    <>
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

function GameStyles() {
  return (
    <style jsx>{`
      @keyframes snow-fall {
        0% { transform: translate(0, 0); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.3; }
        100% { transform: translate(40px, 110vh); opacity: 0; }
      }
      @keyframes wind-gust {
        0% { left: -15%; opacity: 0; }
        15% { opacity: 0.5; }
        85% { opacity: 0.3; }
        100% { left: 115%; opacity: 0; }
      }
      @keyframes confetti-fall {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0.9; }
        100% { transform: translate(20px, 110vh) rotate(720deg); opacity: 0; }
      }
      @keyframes climber-celebrate {
        0% { transform: translateY(0); }
        100% { transform: translateY(-8px); }
      }
    `}</style>
  );
}
