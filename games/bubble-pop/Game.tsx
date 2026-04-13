'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';

type Props = {
  words: string[];
  setup: SetupChoices;
};

type Bubble = {
  id: number;
  word: string;
  x: number; // percentage (10-90)
  createdAt: number; // timestamp
  popped: boolean;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  angle: number;
};

// Speed in seconds bottom-to-top
const SPEED_MAP: Record<string, number> = {
  Slow: 12,
  Medium: 8,
  Fast: 5,
};

const MAX_BUBBLES: Record<string, number> = {
  Easy: 1,
  Medium: 3,
  Hard: 3,
};

// Decorative fish that swim across the background
const FISH = [
  { emoji: '🐟', y: 25, duration: 18, delay: 0, direction: 'right' },
  { emoji: '🐠', y: 55, duration: 22, delay: 7, direction: 'left' },
  { emoji: '🐡', y: 75, duration: 25, delay: 12, direction: 'right' },
];

export default function BubblePop({ words, setup }: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popped, setPopped] = useState(0);
  const [missed, setMissed] = useState(0);
  const wordQueueRef = useRef<string[]>([]);
  const nextIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  const difficulty = String(setup.difficulty || 'Easy');
  const speedLabel = String(setup.speed || 'Medium');
  const baseDuration = SPEED_MAP[speedLabel] || 8;
  const riseDuration = difficulty === 'Hard' ? baseDuration / 1.25 : baseDuration;
  const maxOnScreen = MAX_BUBBLES[difficulty] || 1;

  // Shuffle words into a queue on mount / replay
  const initQueue = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    wordQueueRef.current = shuffled;
  }, [words]);

  // Spawn a bubble from the queue
  const spawnBubble = useCallback(() => {
    if (wordQueueRef.current.length === 0) return null;
    const word = wordQueueRef.current.shift()!;
    const id = nextIdRef.current++;
    // Random x between 15% and 85%, avoid edges
    const x = 15 + Math.random() * 70;
    const bubble: Bubble = { id, word, x, createdAt: Date.now(), popped: false };
    return bubble;
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    initQueue();
    setBubbles([]);
    setParticles([]);
    setPopped(0);
    setMissed(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    setPhase('playing');
  }, [initQueue]);

  // Play again (reshuffle same words)
  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;

    let running = true;

    const tick = () => {
      if (!running) return;

      const now = Date.now();

      setBubbles((prev) => {
        let updated = prev;

        // Check for missed bubbles (risen past the top)
        const stillAlive: Bubble[] = [];
        let newMisses = 0;
        for (const b of updated) {
          const elapsed = (now - b.createdAt) / 1000;
          if (!b.popped && elapsed >= riseDuration) {
            newMisses++;
          } else {
            stillAlive.push(b);
          }
        }
        if (newMisses > 0) {
          setMissed((m) => m + newMisses);
        }
        updated = stillAlive;

        // Spawn new bubbles if needed
        const activeCount = updated.filter((b) => !b.popped).length;
        const wordsLeft = wordQueueRef.current.length;
        // Throttle spawning — at least 600ms between spawns for staggering
        const canSpawn =
          activeCount < maxOnScreen &&
          wordsLeft > 0 &&
          now - lastSpawnRef.current > 600;

        if (canSpawn) {
          const newBubble = spawnBubble();
          if (newBubble) {
            updated = [...updated, newBubble];
            lastSpawnRef.current = now;
          }
        }

        // Check end condition
        const activeAfter = updated.filter((b) => !b.popped).length;
        if (wordsLeft === 0 && activeAfter === 0) {
          // Use setTimeout to avoid setState during render
          setTimeout(() => setPhase('done'), 100);
        }

        return updated;
      });

      // Clean up old particles
      setParticles((prev) => prev.filter((p) => now - p.id < 500));

      animFrameRef.current = requestAnimationFrame(tick);
    };

    // Initial spawn
    const firstBubble = spawnBubble();
    if (firstBubble) {
      setBubbles([firstBubble]);
      lastSpawnRef.current = Date.now();
    }

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, riseDuration, maxOnScreen, spawnBubble]);

  // Spacebar handler
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'intro') return;

    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();

      if (phase === 'intro') {
        startGame();
        return;
      }

      // Pop the oldest (highest) bubble — the one with the smallest createdAt
      setBubbles((prev) => {
        const active = prev.filter((b) => !b.popped);
        if (active.length === 0) return prev;

        // Oldest = earliest createdAt = highest on screen
        const oldest = active.reduce((a, b) =>
          a.createdAt < b.createdAt ? a : b,
        );

        // Calculate its current Y position for particles
        const elapsed = (Date.now() - oldest.createdAt) / 1000;
        const progress = Math.min(elapsed / riseDuration, 1);
        const yPercent = 85 - progress * 85; // 85% -> 0%

        // Spawn particles
        const now = Date.now();
        const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
          id: now + i,
          x: oldest.x,
          y: yPercent,
          angle: (i * 360) / 8,
        }));
        setParticles((p) => [...p, ...newParticles]);
        setPopped((c) => c + 1);

        return prev.map((b) =>
          b.id === oldest.id ? { ...b, popped: true } : b,
        );
      });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, riseDuration, startGame]);

  // ─── INTRO OVERLAY ──────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}>
        {/* Ocean background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-cyan-400 to-blue-700" />
        {/* Light rays */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-0 bg-gradient-to-b from-white to-transparent"
              style={{
                left: `${15 + i * 22}%`,
                width: '60px',
                height: '100%',
                transform: `rotate(${-5 + i * 5}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-lg rounded-2xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
          <h2 className="mb-4 text-3xl font-bold text-blue-900">How to Play</h2>
          <div className="mb-6 space-y-3 text-left text-blue-800">
            <p>🫧 Bubbles will rise from the bottom of the screen, each containing a word.</p>
            <p>✅ When your student says the word correctly, press <kbd className="rounded bg-blue-100 px-2 py-0.5 font-mono text-sm font-bold">SPACE</kbd> to pop it.</p>
            <p>💨 Missed bubbles float to the top and disappear.</p>
          </div>
          <p className="mb-6 text-sm text-blue-600">
            Ready? Press <kbd className="rounded bg-blue-100 px-2 py-0.5 font-mono text-sm font-bold">SPACE</kbd> or click Start to begin.
          </p>
          <button
            onClick={startGame}
            className="rounded-xl bg-blue-600 px-10 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // ─── END SCREEN ─────────────────────────────────────────────
  if (phase === 'done') {
    const total = popped + missed;
    const accuracy = total > 0 ? Math.round((popped / total) * 100) : 0;
    return (
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-cyan-400 to-blue-700" />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur">
          <span className="text-6xl">🎉</span>
          <h2 className="text-4xl font-bold text-blue-900">Great job!</h2>
          <p className="text-2xl text-blue-800">
            {popped} out of {total} words
          </p>
          <p className="text-5xl font-bold text-blue-600">{accuracy}%</p>
          <div className="mt-4 flex gap-4">
            <button
              onClick={playAgain}
              className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-blue-700"
            >
              Play Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-cyan-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-cyan-700"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GAMEPLAY ───────────────────────────────────────────────
  return (
    <div
      ref={gameAreaRef}
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
    >
      {/* Ocean background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-cyan-400 to-blue-700" />

      {/* Light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute top-0 bg-gradient-to-b from-white to-transparent"
            style={{
              left: `${10 + i * 20}%`,
              width: '50px',
              height: '100%',
              transform: `rotate(${-8 + i * 4}deg)`,
            }}
          />
        ))}
      </div>

      {/* Seaweed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pointer-events-none" style={{ height: '18%' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="text-green-700/40 flex items-end"
            style={{
              fontSize: `${2 + (i % 3) * 0.8}rem`,
              transform: `scaleX(${i % 2 === 0 ? 1 : -1})`,
            }}
          >
            🌿
          </div>
        ))}
      </div>

      {/* Decorative fish */}
      {FISH.map((fish, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-30"
          style={{
            top: `${fish.y}%`,
            fontSize: '1.5rem',
            animation: `swim-${fish.direction} ${fish.duration}s linear ${fish.delay}s infinite`,
            transform: fish.direction === 'left' ? 'scaleX(-1)' : undefined,
          }}
        >
          {fish.emoji}
        </div>
      ))}

      {/* Bubbles */}
      {bubbles.map((bubble) => {
        if (bubble.popped) return null;
        const elapsed = (Date.now() - bubble.createdAt) / 1000;
        const progress = Math.min(elapsed / riseDuration, 1);
        // Rise from bottom (85%) to top (0%)
        const yPercent = 85 - progress * 85;
        // Gentle sine-wave sway
        const sway = Math.sin((elapsed * Math.PI) / 2) * 3;

        return (
          <div
            key={bubble.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${bubble.x + sway}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'top 0.1s linear, left 0.1s linear',
            }}
          >
            {/* Bubble circle */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32"
              style={{
                background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), rgba(100,200,255,0.35) 50%, rgba(50,150,220,0.2))',
                boxShadow: '0 0 20px rgba(100,200,255,0.3), inset 0 -4px 12px rgba(0,100,200,0.15)',
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              {/* Shine highlight */}
              <div
                className="absolute rounded-full bg-white/60"
                style={{
                  top: '15%',
                  left: '20%',
                  width: '30%',
                  height: '20%',
                  filter: 'blur(2px)',
                }}
              />
              {/* Word */}
              <span className="relative z-10 text-center text-2xl font-bold text-blue-950 sm:text-3xl md:text-4xl drop-shadow-sm"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
              >
                {bubble.word}
              </span>
            </div>
          </div>
        );
      })}

      {/* Particles from popped bubbles */}
      {particles.map((p) => {
        const age = Date.now() - p.id;
        const t = Math.min(age / 400, 1);
        const dist = t * 60;
        const rad = (p.angle * Math.PI) / 180;
        const px = p.x + (Math.cos(rad) * dist) / 10;
        const py = p.y + (Math.sin(rad) * dist) / 10;
        return (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-200"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              width: `${8 * (1 - t)}px`,
              height: `${8 * (1 - t)}px`,
              opacity: 1 - t,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* CSS animations for fish */}
      <style jsx>{`
        @keyframes swim-right {
          0% { left: -5%; }
          100% { left: 105%; }
        }
        @keyframes swim-left {
          0% { left: 105%; }
          100% { left: -5%; }
        }
      `}</style>
    </div>
  );
}
