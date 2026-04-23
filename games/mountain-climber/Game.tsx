'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';
import { generatePaths } from './path-generator';
import Climber from './Climber';

type Props = {
  words: string[];
  setup: SetupChoices;
};

type Phase = 'playing' | 'moving' | 'won';

// Fixed game constants — not driven by setup choices
const TOTAL_STEPS = 15;

/* ─── Snow Particle Config ────────────────────────────────── */
const SNOW_COUNT = 20;
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
];

// Paths are fixed — 15 steps, generated once at module level
const PATHS = generatePaths(TOTAL_STEPS);

export default function MountainClimber({ words }: Props) {
  // Player state: index 0 = child (red/left), index 1 = therapist (blue/right)
  const [steps, setSteps] = useState([0, 0]);
  const [correct, setCorrect] = useState([0, 0]);
  const [skipped, setSkipped] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [winner, setWinner] = useState<0 | 1 | null>(null);

  // Words cycle indefinitely — game only ends at summit
  const currentWord = words[wordIndex % words.length];

  // Climber positions on their respective paths
  const redPos = PATHS.left[steps[0]];
  const bluePos = PATHS.right[steps[1]];

  // ─── Correct: advance climber, consume word, pass turn ────
  const handleCorrect = useCallback(() => {
    const cp = currentPlayer;
    const newStep = steps[cp] + 1;

    setCorrect((prev) => { const n = [...prev]; n[cp]++; return n; });
    setSteps((prev) => { const n = [...prev]; n[cp] = newStep; return n; });
    setWordIndex((i) => i + 1);
    setPhase('moving');

    setTimeout(() => {
      if (newStep >= TOTAL_STEPS) {
        setWinner(cp);
        setPhase('won');
        return;
      }
      setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
      setPhase('playing');
    }, 500);
  }, [currentPlayer, steps]);

  // ─── Try again: no-op, same word, same player ─────────────
  const handleTryAgain = useCallback(() => {
    // Intentional no-op
  }, []);

  // ─── Skip: consume word, don't advance, pass turn ─────────
  const handleSkip = useCallback(() => {
    const cp = currentPlayer;
    setSkipped((prev) => { const n = [...prev]; n[cp]++; return n; });
    setWordIndex((i) => i + 1);
    setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
  }, [currentPlayer]);

  // ─── Play Again: reset state, same words ──────────────────
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
  if (phase === 'won' && winner !== null) {
    const winnerColor = winner === 0 ? 'Red' : 'Blue';
    const loser = winner === 0 ? 1 : 0;
    const loserPos = loser === 0 ? PATHS.left[steps[loser]] : PATHS.right[steps[loser]];

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
        <SummitFlag />

        {/* Winner at summit */}
        <div
          className="absolute z-10"
          style={{
            left: `${winner === 0 ? 49 : 57}%`,
            top: '3%',
            transform: 'translateX(-50%)',
          }}
        >
          <Climber color={winner === 0 ? 'red' : 'blue'} size={48} celebrating />
        </div>

        {/* Loser at their final position */}
        <div
          className="absolute z-10 opacity-70"
          style={{
            left: `${loserPos.x}%`,
            top: `${loserPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div style={{ transform: loser === 1 ? 'scaleX(-1)' : undefined }}>
            <Climber color={loser === 0 ? 'red' : 'blue'} size={36} />
          </div>
        </div>

        {/* Result overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/92 px-10 py-7 text-center shadow-2xl backdrop-blur max-w-md">
            <div className="flex justify-center mb-3">
              <Climber color={winner === 0 ? 'red' : 'blue'} size={52} celebrating />
            </div>
            <h2 className="text-3xl font-bold text-sky-900">{winnerColor} climber wins!</h2>
            <p className="mt-1 text-base text-sky-600">Reached the summit in {correct[winner]} correct answers</p>
            <div className="mt-2 flex justify-center gap-6 text-sm text-sky-500">
              <span>Red: {correct[0]} ✓ · {skipped[0]} skipped</span>
              <span>Blue: {correct[1]} ✓ · {skipped[1]} skipped</span>
            </div>
            <div className="mt-5 flex justify-center gap-4">
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
      className="mx-auto select-none rounded-2xl overflow-hidden flex flex-col"
      style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
    >
      {/* ── Mountain zone (top ~65%) ─────────────────────────── */}
      <div className="relative overflow-hidden" style={{ flex: 2 }}>
        <MountainScene />
        <SnowAndWind />

        {/* Summit flag */}
        <SummitFlag />

        {/* Path dots — red (left face) */}
        {PATHS.left.map((pt, i) => (
          <div
            key={`l${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: i === 0 || i === TOTAL_STEPS ? '0' : '5px',
              height: i === 0 || i === TOTAL_STEPS ? '0' : '5px',
              transform: 'translate(-50%, -50%)',
              backgroundColor: i < steps[0] ? 'rgba(239,68,68,0.55)' : 'rgba(239,68,68,0.2)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}

        {/* Path dots — blue (right face) */}
        {PATHS.right.map((pt, i) => (
          <div
            key={`r${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: i === 0 || i === TOTAL_STEPS ? '0' : '5px',
              height: i === 0 || i === TOTAL_STEPS ? '0' : '5px',
              transform: 'translate(-50%, -50%)',
              backgroundColor: i < steps[1] ? 'rgba(37,99,235,0.55)' : 'rgba(37,99,235,0.2)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}

        {/* Dashed path line — red */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            points={PATHS.left.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(239,68,68,0.18)"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Dashed path line — blue */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            points={PATHS.right.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(37,99,235,0.18)"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Red climber */}
        <div
          className="absolute z-10"
          style={{
            left: `${redPos.x}%`,
            top: `${redPos.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.4s ease-in-out, top 0.4s ease-in-out',
          }}
        >
          <Climber color="red" size={36} />
        </div>

        {/* Blue climber (faces left — toward summit) */}
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

        {/* HUD: turn indicator + progress */}
        <div className="absolute top-1.5 left-0 right-0 z-20 flex justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-1 shadow text-xs">
            <div className="flex items-center gap-1">
              <Climber color="red" size={16} />
              <span className="font-bold text-red-700">{steps[0]}/{TOTAL_STEPS}</span>
            </div>
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${
              currentPlayer === 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              <Climber color={currentPlayer === 0 ? 'red' : 'blue'} size={14} />
              <span>{playerColor}&apos;s turn</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-blue-700">{steps[1]}/{TOTAL_STEPS}</span>
              <Climber color="blue" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Control panel (bottom ~35%) ──────────────────────── */}
      <div
        className="relative flex items-center justify-center gap-5 px-6"
        style={{ flex: 1.4, background: 'linear-gradient(to bottom, #1e3a5f, #0f2a4a)' }}
      >
        {/* Word card */}
        <div className="flex flex-col items-center rounded-2xl border-4 border-sky-400 bg-white/95 px-7 py-2.5 shadow-xl">
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-sky-500">
            Say this word:
          </p>
          <p className="text-4xl font-bold text-sky-900 sm:text-5xl leading-tight">
            {currentWord}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCorrect}
            disabled={buttonsDisabled}
            className="rounded-xl bg-green-500 px-6 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Correct ✓
          </button>
          <button
            onClick={handleTryAgain}
            disabled={buttonsDisabled}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Try again
          </button>
          <button
            onClick={handleSkip}
            disabled={buttonsDisabled}
            className="rounded-xl bg-slate-500 px-6 py-2.5 text-base font-bold text-white shadow-md transition hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Skip →
          </button>
        </div>
      </div>

      <GameStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════ */

function SummitFlag() {
  return (
    <div
      className="absolute z-10 text-2xl"
      style={{ left: '53%', top: '1%', transform: 'translateX(-50%)' }}
    >
      🚩
    </div>
  );
}

function MountainScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-sky-400 to-sky-300" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <polygon points="0,450 80,180 200,320 280,200 380,450" fill="rgba(148,163,184,0.25)" />
        <polygon points="500,450 580,220 680,300 750,160 800,450" fill="rgba(148,163,184,0.2)" />
      </svg>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <polygon
          points="200,450 240,380 260,400 300,320 320,340 350,260 370,280 390,200 400,160 410,120 420,80 430,40 440,80 450,110 460,150 480,200 500,230 520,270 540,310 570,350 600,450"
          fill="url(#mountainGrad)"
        />
        <polygon
          points="400,160 410,120 420,80 430,40 440,80 450,110 460,150 470,180 390,200"
          fill="white"
          opacity="0.85"
        />
      </svg>

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
