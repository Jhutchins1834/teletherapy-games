'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';
import { getIconForWord } from '@/lib/word-icons/index';
import type { LucideIcon } from 'lucide-react';

type Props = {
  words: string[];
  setup: SetupChoices;
};

type BugData = {
  id: number;
  word: string;
  owner: 'child' | 'therapist';
  spawnY: number; // percentage (15-75)
  createdAt: number;
  caught: boolean;
  catchTarget?: 'left' | 'right'; // set on catch — which jar it flies to
  catchTime?: number;
  icon: LucideIcon | null;
  bugStyle: number; // 0-2, picks emoji variant
};

const SPEED_MAP: Record<string, number> = { Slow: 12, Medium: 8, Fast: 5 };
const MAX_BUGS: Record<string, number> = { Easy: 1, Medium: 3, Hard: 3 };
const BUG_EMOJIS = ['🐛', '🦋', '🐞'];

export default function BugCatcher({ words, setup }: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro');
  const [bugs, setBugs] = useState<BugData[]>([]);
  const [childCaught, setChildCaught] = useState(0);
  const [therapistCaught, setTherapistCaught] = useState(0);
  const wordQueueRef = useRef<{ word: string; owner: 'child' | 'therapist'; icon: LucideIcon | null }[]>([]);
  const nextIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(0 as unknown as ReturnType<typeof setInterval>);

  const difficulty = String(setup.difficulty || 'Easy');
  const speedLabel = String(setup.speed || 'Medium');
  const baseDuration = SPEED_MAP[speedLabel] || 8;
  const flyDuration = difficulty === 'Hard' ? baseDuration / 1.25 : baseDuration;
  const maxOnScreen = MAX_BUGS[difficulty] || 1;

  // Target per player = the wordCount setting (words array is 2× that size)
  const targetPerPlayer = Number(setup.wordCount);

  const initQueue = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    wordQueueRef.current = shuffled.map((word, i) => ({
      word,
      owner: i % 2 === 0 ? 'child' as const : 'therapist' as const,
      icon: getIconForWord(word),
    }));
  }, [words]);

  const spawnBug = useCallback((): BugData | null => {
    if (wordQueueRef.current.length === 0) return null;
    const entry = wordQueueRef.current.shift()!;
    const id = nextIdRef.current++;
    const spawnY = 15 + Math.random() * 60;
    return {
      id,
      word: entry.word,
      owner: entry.owner,
      spawnY,
      createdAt: Date.now(),
      caught: false,
      icon: entry.icon,
      bugStyle: id % 3,
    };
  }, []);

  const startGame = useCallback(() => {
    initQueue();
    setBugs([]);
    setChildCaught(0);
    setTherapistCaught(0);
    nextIdRef.current = 0;
    lastSpawnRef.current = 0;
    setPhase('playing');
  }, [initQueue]);

  const playAgain = useCallback(() => startGame(), [startGame]);

  // Catch a bug on click
  const handleCatchBug = useCallback((bugId: number) => {
    setBugs((prev) => {
      const bug = prev.find((b) => b.id === bugId);
      if (!bug || bug.caught) return prev;

      if (bug.owner === 'child') setChildCaught((c) => c + 1);
      else setTherapistCaught((c) => c + 1);

      return prev.map((b) =>
        b.id === bugId
          ? {
              ...b,
              caught: true,
              catchTarget: bug.owner === 'child' ? 'left' as const : 'right' as const,
              catchTime: Date.now(),
            }
          : b,
      );
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const firstBug = spawnBug();
    if (firstBug) {
      setBugs([firstBug]);
      lastSpawnRef.current = Date.now();
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();

      setBugs((prev) => {
        const stillAlive: BugData[] = [];

        for (const b of prev) {
          // Remove caught bugs after their animation (600ms)
          if (b.caught && b.catchTime && now - b.catchTime > 600) {
            continue;
          }
          // Check for escaped bugs (miss counts derived at end: targetPerPlayer - caught)
          const elapsed = (now - b.createdAt) / 1000;
          if (!b.caught && elapsed >= flyDuration) {
            continue;
          }
          stillAlive.push(b);
        }

        let updated = stillAlive;

        // Spawn new bugs
        const activeCount = updated.filter((b) => !b.caught).length;
        const wordsLeft = wordQueueRef.current.length;
        const canSpawn =
          activeCount < maxOnScreen &&
          wordsLeft > 0 &&
          now - lastSpawnRef.current > 600;

        if (canSpawn) {
          const newBug = spawnBug();
          if (newBug) {
            updated = [...updated, newBug];
            lastSpawnRef.current = now;
          }
        }

        // End check
        const activeAfter = updated.filter((b) => !b.caught).length;
        const wordsLeftAfter = wordQueueRef.current.length;
        if (wordsLeftAfter === 0 && activeAfter === 0) {
          setTimeout(() => setPhase('done'), 200);
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(timerRef.current);
  }, [phase, flyDuration, maxOnScreen, spawnBug]);


  // ─── INTRO ────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MeadowBg />
        <div className="relative z-10 mx-auto max-w-lg rounded-2xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
          <h2 className="mb-4 text-3xl font-bold text-green-900">How to Play</h2>
          <div className="mb-6 space-y-3 text-left text-green-800">
            <p>🐛 Bugs will flutter across the meadow, each carrying a word.</p>
            <p>🩷 <strong>Pink bugs</strong> belong to the child. 💙 <strong>Blue bugs</strong> belong to the therapist.</p>
            <p>✅ When the word is said correctly, <strong>click the bug</strong> to catch it!</p>
            <p>💨 Bugs that escape are counted as misses.</p>
          </div>
          <button
            onClick={startGame}
            className="rounded-xl bg-green-600 px-10 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-green-700"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // ─── END SCREEN ───────────────────────────────────────────────
  if (phase === 'done') {
    const finalChildMissed = targetPerPlayer - childCaught;
    const finalTherapistMissed = targetPerPlayer - therapistCaught;
    let headline: string;
    let subtext: string;
    if (childCaught > therapistCaught) {
      headline = 'Great catching!';
      subtext = 'The child wins this round!';
    } else if (therapistCaught > childCaught) {
      headline = 'Nice try — let\u2019s play again!';
      subtext = 'The therapist wins this round!';
    } else {
      headline = 'It\u2019s a tie!';
      subtext = 'Great teamwork!';
    }

    return (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
      >
        <MeadowBg />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur max-w-md">
          <span className="text-6xl">🎉</span>
          <h2 className="text-3xl font-bold text-green-900">{headline}</h2>
          <p className="text-lg text-green-700">{subtext}</p>
          <div className="flex gap-8 mt-2">
            <div className="text-center">
              <p className="text-sm font-semibold text-pink-600">Child</p>
              <p className="text-3xl font-bold text-pink-700">{childCaught} / {targetPerPlayer}</p>
              <p className="text-xs text-pink-400">{finalChildMissed} missed</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600">Therapist</p>
              <p className="text-3xl font-bold text-blue-700">{therapistCaught} / {targetPerPlayer}</p>
              <p className="text-xs text-blue-400">{finalTherapistMissed} missed</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={playAgain}
              className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
            >
              Play Again
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

  // ─── GAMEPLAY ─────────────────────────────────────────────────
  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '75vh', width: '100%' }}
    >
      <MeadowBg />

      {/* Child's jar — LEFT */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10 sm:left-4">
        <p className="text-xs font-bold text-pink-700 sm:text-sm">Child</p>
        <Jar color="pink" caught={childCaught} total={targetPerPlayer} />
        <p className="text-xs font-semibold text-pink-600">
          {childCaught} / {targetPerPlayer}
        </p>
      </div>

      {/* Therapist's jar — RIGHT */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10 sm:right-4">
        <p className="text-xs font-bold text-blue-700 sm:text-sm">Therapist</p>
        <Jar color="blue" caught={therapistCaught} total={targetPerPlayer} />
        <p className="text-xs font-semibold text-blue-600">
          {therapistCaught} / {targetPerPlayer}
        </p>
      </div>

      {/* Bugs */}
      {bugs.map((bug) => (
        <FlyingBug
          key={bug.id}
          bug={bug}
          flyDuration={flyDuration}
          onCatch={handleCatchBug}
        />
      ))}

      <GameStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════ */

function MeadowBg() {
  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100" />
      {/* Distant hills */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <ellipse cx="150" cy="380" rx="200" ry="80" fill="rgba(74,222,128,0.25)" />
        <ellipse cx="600" cy="370" rx="250" ry="90" fill="rgba(74,222,128,0.2)" />
      </svg>
      {/* Grass ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-gradient-to-t from-green-600 to-green-400 rounded-b-2xl" />
      {/* Grass tufts */}
      <div className="absolute bottom-[16%] left-0 right-0 flex justify-around pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className="text-green-500/50" style={{ fontSize: `${0.8 + (i % 3) * 0.3}rem` }}>
            🌱
          </span>
        ))}
      </div>
      {/* Slow drifting clouds */}
      <div className="absolute top-[8%] pointer-events-none opacity-40 text-3xl" style={{ animation: 'cloud-drift 45s linear infinite', left: '-5%' }}>
        ☁️
      </div>
      <div className="absolute top-[15%] pointer-events-none opacity-30 text-2xl" style={{ animation: 'cloud-drift 60s linear 15s infinite', left: '-5%' }}>
        ☁️
      </div>
    </>
  );
}

function Jar({ color, caught, total }: { color: 'pink' | 'blue'; caught: number; total: number }) {
  const fillPercent = total > 0 ? Math.min((caught / total) * 100, 100) : 0;
  const bgTint = color === 'pink' ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)';
  const fillColor = color === 'pink' ? 'rgba(236,72,153,0.35)' : 'rgba(59,130,246,0.35)';

  return (
    <div
      className="relative overflow-hidden rounded-lg border-2"
      style={{
        width: '44px',
        height: '60px',
        borderColor: color === 'pink' ? 'rgba(236,72,153,0.5)' : 'rgba(59,130,246,0.5)',
        background: bgTint,
      }}
    >
      {/* Fill level */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
        style={{ height: `${fillPercent}%`, backgroundColor: fillColor }}
      />
      {/* Glass shine */}
      <div
        className="absolute top-1 left-1 w-2 rounded-full bg-white/50"
        style={{ height: '40%' }}
      />
      {/* Lid */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-t-sm"
        style={{
          width: '36px',
          height: '6px',
          backgroundColor: color === 'pink' ? '#ec4899' : '#3b82f6',
        }}
      />
    </div>
  );
}

function FlyingBug({
  bug,
  flyDuration,
  onCatch,
}: {
  bug: BugData;
  flyDuration: number;
  onCatch: (id: number) => void;
}) {
  const isPink = bug.owner === 'child';
  const Icon = bug.icon;

  // If caught, animate toward the jar
  if (bug.caught && bug.catchTime) {
    const elapsed = (Date.now() - bug.catchTime) / 600;
    const t = Math.min(elapsed, 1);
    const targetX = bug.catchTarget === 'left' ? 5 : 92;
    const targetY = 45;
    // Compute start position from how far the bug had traveled
    const flyElapsed = (bug.catchTime - bug.createdAt) / 1000;
    const flyProgress = Math.min(flyElapsed / flyDuration, 1);
    const startX = 10 + flyProgress * 80;
    const currentX = startX + (targetX - startX) * t;
    const currentY = bug.spawnY + (targetY - bug.spawnY) * t;
    const scale = 1 - t * 0.6;

    return (
      <div
        className="absolute pointer-events-none z-20"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: 1 - t * 0.5,
          transition: 'none',
        }}
      >
        <BugBody isPink={isPink} emoji={BUG_EMOJIS[bug.bugStyle]} word={bug.word} icon={Icon} />
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-pointer z-20"
      style={{
        top: `${bug.spawnY}%`,
        left: '8%',
        transform: 'translate(-50%, -50%)',
        animation: `bug-fly ${flyDuration}s linear forwards, bug-flutter 1.2s ease-in-out infinite`,
      }}
      onClick={() => onCatch(bug.id)}
    >
      <BugBody isPink={isPink} emoji={BUG_EMOJIS[bug.bugStyle]} word={bug.word} icon={Icon} />
    </div>
  );
}

function BugBody({
  isPink,
  emoji,
  word,
  icon: Icon,
}: {
  isPink: boolean;
  emoji: string;
  word: string;
  icon: LucideIcon | null;
}) {
  return (
    <div className="flex items-center gap-1">
      {/* Bug emoji with color tint overlay */}
      <div
        className="relative flex items-center justify-center text-3xl sm:text-4xl"
        style={{
          filter: isPink
            ? 'drop-shadow(0 0 6px rgba(236,72,153,0.6))'
            : 'drop-shadow(0 0 6px rgba(59,130,246,0.6))',
        }}
      >
        <span>{emoji}</span>
        {/* Color dot indicator */}
        <div
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full border border-white"
          style={{ backgroundColor: isPink ? '#ec4899' : '#3b82f6' }}
        />
      </div>
      {/* Word card attached to the bug */}
      <div
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 shadow-md"
        style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          border: `2px solid ${isPink ? 'rgba(236,72,153,0.4)' : 'rgba(59,130,246,0.4)'}`,
        }}
      >
        {Icon && (
          <Icon
            size={18}
            className={isPink ? 'text-pink-500' : 'text-blue-500'}
            strokeWidth={2}
          />
        )}
        <span className="text-lg font-bold text-gray-800 sm:text-xl">
          {word}
        </span>
      </div>
    </div>
  );
}

function GameStyles() {
  return (
    <style jsx global>{`
      @keyframes bug-fly {
        from { left: 8%; }
        to { left: 95%; }
      }
      @keyframes bug-flutter {
        0%, 100% {
          transform: translate(-50%, -50%) rotate(-3deg);
        }
        25% {
          transform: translate(-50%, calc(-50% - 8px)) rotate(2deg);
        }
        50% {
          transform: translate(-50%, -50%) rotate(-2deg);
        }
        75% {
          transform: translate(-50%, calc(-50% + 6px)) rotate(3deg);
        }
      }
      @keyframes cloud-drift {
        from { left: -10%; }
        to { left: 110%; }
      }
    `}</style>
  );
}
