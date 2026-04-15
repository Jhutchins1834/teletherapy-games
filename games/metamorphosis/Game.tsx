'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';
import PiecePicker from './PiecePicker';
import Board, { type PlayerState } from './Board';
import SpinAnimation from './SpinAnimation';
import MetamorphosisReveal from './MetamorphosisReveal';
import { getPieceSVG, ANIMALS, type AnimalId, type FormLevel } from './pieces';
import boardData, { START_INDEX } from './board-layout';

type Props = {
  words: string[];
  setup: SetupChoices;
};

type Phase =
  | 'picking'     // choosing animal pieces
  | 'playing'     // normal turn: show word + correct/try-again
  | 'spinning'    // spin animation active
  | 'moving'      // piece animating along board
  | 'metamorphosis' // metamorphosis reveal
  | 'won'         // someone won (primary or fallback)
  | 'draw';       // tie

type WinInfo = {
  winner: 0 | 1;
  reason: 'primary' | 'metamorphosis' | 'distance';
};

const BOARD_SIZE = 30;

export default function MetamorphosisGame({ words, setup }: Props) {
  // ─── Core state ────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('picking');
  const [players, setPlayers] = useState<[PlayerState, PlayerState]>([
    { position: START_INDEX, upgrades: 0, animal: 'dog', totalMoved: 0 },
    { position: START_INDEX, upgrades: 0, animal: 'cat', totalMoved: 0 },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState([0, 0]);
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [spinResult, setSpinResult] = useState(0);
  const [metamorphTarget, setMetamorphTarget] = useState<{ player: 0 | 1; newForm: FormLevel } | null>(null);

  // Dev mode spin override
  const devOverrideRef = useRef<number | undefined>(undefined);

  const currentWord = wordIndex < words.length ? words[wordIndex] : null;
  const wordsExhausted = wordIndex >= words.length;

  // Auto-resolve when words are exhausted during playing phase
  useEffect(() => {
    if (phase === 'playing' && wordsExhausted) {
      const timer = setTimeout(() => resolveFallbackFromState(), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, wordsExhausted]);

  // Dev-mode key handler: press 1/2/3 to override next spin
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const handler = (e: KeyboardEvent) => {
      if (['1', '2', '3'].includes(e.key) && phase === 'playing') {
        devOverrideRef.current = parseInt(e.key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase]);

  // ─── Piece picking ─────────────────────────────────────────
  const handlePiecePick = useCallback((childAnimal: AnimalId, therapistAnimal: AnimalId) => {
    setPlayers([
      { position: START_INDEX, upgrades: 0, animal: childAnimal, totalMoved: 0 },
      { position: START_INDEX, upgrades: 0, animal: therapistAnimal, totalMoved: 0 },
    ]);
    setPhase('playing');
  }, []);

  // ─── Correct → trigger spin ────────────────────────────────
  const handleCorrect = useCallback(() => {
    setCorrectCount((prev) => {
      const next = [...prev];
      next[currentPlayer]++;
      return next;
    });
    setPhase('spinning');
  }, [currentPlayer]);

  // ─── Try again — do nothing, same word stays ──────────────
  const handleTryAgain = useCallback(() => {
    // No-op: same word, same player
  }, []);

  // ─── Spin complete → move piece ────────────────────────────
  const handleSpinComplete = useCallback((value: number) => {
    setSpinResult(value);
    devOverrideRef.current = undefined;

    const player = players[currentPlayer];
    let newPos = player.position;
    let passedStart = false;

    // Move one space at a time to check for passing START
    for (let i = 0; i < value; i++) {
      newPos = (newPos + 1) % BOARD_SIZE;
      // Check if we pass or land on START (only after first move ever)
      if (newPos === START_INDEX && player.totalMoved + i + 1 > 0 && player.upgrades === 2) {
        passedStart = true;
        break;
      }
    }

    const newTotalMoved = player.totalMoved + value;
    const landedSpace = boardData[newPos];
    const isGold = landedSpace.color === 'gold';
    const canUpgrade = isGold && player.upgrades < 2;

    // Update player state
    setPlayers((prev) => {
      const next: [PlayerState, PlayerState] = [...prev] as [PlayerState, PlayerState];
      next[currentPlayer] = {
        ...prev[currentPlayer],
        position: newPos,
        totalMoved: newTotalMoved,
        upgrades: canUpgrade ? ((prev[currentPlayer].upgrades + 1) as FormLevel) : prev[currentPlayer].upgrades,
      };
      return next;
    });

    // Advance word
    setWordIndex((i) => i + 1);

    // Determine what happens next
    if (passedStart && player.upgrades === 2) {
      // Primary win!
      setWinInfo({ winner: currentPlayer, reason: 'primary' });
      setPhase('won');
      return;
    }

    if (canUpgrade) {
      // Metamorphosis reveal
      setMetamorphTarget({
        player: currentPlayer,
        newForm: (player.upgrades + 1) as FormLevel,
      });
      setPhase('metamorphosis');
      return;
    }

    // Normal turn end — check if words exhausted
    const nextWordIdx = wordIndex + 1;
    if (nextWordIdx >= words.length) {
      resolveFallback(currentPlayer, newPos, newTotalMoved, canUpgrade);
      return;
    }

    // Pass turn
    setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
    setPhase('playing');
  }, [players, currentPlayer, wordIndex, words.length]);

  // ─── Metamorphosis complete ────────────────────────────────
  const handleMetamorphComplete = useCallback(() => {
    setMetamorphTarget(null);

    // Check if words are now exhausted
    if (wordIndex >= words.length) {
      resolveFallbackFromState();
      return;
    }

    setCurrentPlayer((p) => (p === 0 ? 1 : 0) as 0 | 1);
    setPhase('playing');
  }, [wordIndex, words.length]);

  // ─── Fallback win resolution ───────────────────────────────
  const resolveFallback = (cp: 0 | 1, newPos: number, newTotal: number, upgraded: boolean) => {
    // Build final player states for comparison
    const p0 = cp === 0
      ? { ...players[0], position: newPos, totalMoved: newTotal, upgrades: upgraded ? ((players[0].upgrades + 1) as FormLevel) : players[0].upgrades }
      : players[0];
    const p1 = cp === 1
      ? { ...players[1], position: newPos, totalMoved: newTotal, upgrades: upgraded ? ((players[1].upgrades + 1) as FormLevel) : players[1].upgrades }
      : players[1];

    if (p0.upgrades !== p1.upgrades) {
      const winner = p0.upgrades > p1.upgrades ? 0 : 1;
      setWinInfo({ winner: winner as 0 | 1, reason: 'metamorphosis' });
      setPhase('won');
    } else if (p0.totalMoved !== p1.totalMoved) {
      const winner = p0.totalMoved > p1.totalMoved ? 0 : 1;
      setWinInfo({ winner: winner as 0 | 1, reason: 'distance' });
      setPhase('won');
    } else {
      setPhase('draw');
    }
  };

  const resolveFallbackFromState = () => {
    const p0 = players[0];
    const p1 = players[1];
    if (p0.upgrades !== p1.upgrades) {
      setWinInfo({ winner: (p0.upgrades > p1.upgrades ? 0 : 1) as 0 | 1, reason: 'metamorphosis' });
      setPhase('won');
    } else if (p0.totalMoved !== p1.totalMoved) {
      setWinInfo({ winner: (p0.totalMoved > p1.totalMoved ? 0 : 1) as 0 | 1, reason: 'distance' });
      setPhase('won');
    } else {
      setPhase('draw');
    }
  };

  // ─── Piece Picker ──────────────────────────────────────────
  if (phase === 'picking') {
    return (
      <div
        className="relative mx-auto overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100"
        style={{ aspectRatio: '16/9', maxHeight: '78vh', width: '100%' }}
      >
        <PiecePicker onComplete={handlePiecePick} />
      </div>
    );
  }

  // ─── Win / Draw screens ────────────────────────────────────
  if (phase === 'won' && winInfo) {
    const winner = players[winInfo.winner];
    const loser = players[winInfo.winner === 0 ? 1 : 0];
    const animal = ANIMALS.find((a) => a.id === winner.animal)!;
    const WinnerPiece = getPieceSVG(winner.animal, winner.upgrades);
    const LoserPiece = getPieceSVG(loser.animal, loser.upgrades);
    const reasonText =
      winInfo.reason === 'primary'
        ? `${animal.forms[2]} completed the journey!`
        : winInfo.reason === 'metamorphosis'
        ? `${winInfo.winner === 0 ? 'Child' : 'Therapist'} wins by metamorphosis!`
        : `${winInfo.winner === 0 ? 'Child' : 'Therapist'} traveled farthest!`;

    return (
      <div
        className="relative mx-auto flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '78vh', width: '100%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50" />
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: '-5%',
                width: `${5 + Math.random() * 5}px`,
                height: `${5 + Math.random() * 5}px`,
                backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'][i % 6],
                animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur max-w-lg">
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center">
              <WinnerPiece size={80} />
              <span className="mt-1 text-xs font-bold text-amber-700">{winInfo.winner === 0 ? 'Child' : 'Therapist'}</span>
            </div>
            <span className="text-4xl">🏆</span>
            <div className="flex flex-col items-center opacity-60">
              <LoserPiece size={60} />
              <span className="mt-1 text-xs text-gray-500">{winInfo.winner === 0 ? 'Therapist' : 'Child'}</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-amber-900">
            {winInfo.winner === 0 ? 'Child' : 'Therapist'} wins!
          </h2>
          <p className="text-sm text-amber-700">{reasonText}</p>
          <div className="flex gap-6 text-sm text-amber-600">
            <span>Child: {correctCount[0]} correct</span>
            <span>Therapist: {correctCount[1]} correct</span>
          </div>
          <div className="mt-2 flex gap-4">
            <button
              onClick={() => {
                setWordIndex(0);
                setCorrectCount([0, 0]);
                setPlayers((prev) => [
                  { ...prev[0], position: START_INDEX, upgrades: 0, totalMoved: 0 },
                  { ...prev[1], position: START_INDEX, upgrades: 0, totalMoved: 0 },
                ]);
                setCurrentPlayer(0);
                setWinInfo(null);
                setPhase('playing');
              }}
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

        <style jsx>{`
          @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0); opacity: 0.9; }
            100% { transform: translateY(85vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (phase === 'draw') {
    const P0 = getPieceSVG(players[0].animal, players[0].upgrades);
    const P1 = getPieceSVG(players[1].animal, players[1].upgrades);

    return (
      <div
        className="relative mx-auto flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/9', maxHeight: '78vh', width: '100%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50" />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
          <div className="flex items-center gap-6">
            <P0 size={72} />
            <span className="text-3xl">🤝</span>
            <P1 size={72} />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">It&apos;s a tie!</h2>
          <p className="text-sm text-amber-700">Both adventurers tied!</p>
          <div className="flex gap-6 text-sm text-amber-600">
            <span>Child: {correctCount[0]} correct</span>
            <span>Therapist: {correctCount[1]} correct</span>
          </div>
          <div className="mt-2 flex gap-4">
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

  // ─── Main gameplay ─────────────────────────────────────────
  const PlayerPiece0 = getPieceSVG(players[0].animal, players[0].upgrades);
  const PlayerPiece1 = getPieceSVG(players[1].animal, players[1].upgrades);

  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl"
      style={{ aspectRatio: '16/9', maxHeight: '78vh', width: '100%' }}
    >
      {/* Board background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100" />

      {/* Board */}
      <div className="absolute inset-[3%]">
        <Board players={players} currentPlayer={currentPlayer} />
      </div>

      {/* Center area: word card, spin, controls */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3 pointer-events-auto">
          {/* Turn indicator */}
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 shadow">
            <div className="h-6 w-6">
              {currentPlayer === 0 ? <PlayerPiece0 size={24} /> : <PlayerPiece1 size={24} />}
            </div>
            <span className="text-sm font-bold text-amber-900">
              {currentPlayer === 0 ? "Child's" : "Therapist's"} turn
            </span>
            {/* Upgrade pips */}
            <div className="flex gap-0.5 ml-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full border ${
                    i < players[currentPlayer].upgrades
                      ? 'bg-amber-400 border-amber-500'
                      : 'bg-gray-200 border-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Spin animation (overlays word card when active) */}
          {phase === 'spinning' && (
            <SpinAnimation
              onComplete={handleSpinComplete}
              forcedValue={devOverrideRef.current}
            />
          )}

          {/* Word card (shown during playing phase) */}
          {phase === 'playing' && currentWord && (
            <>
              <div className="flex flex-col items-center rounded-2xl border-4 border-amber-300 bg-white/95 px-8 py-4 shadow-xl backdrop-blur">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-amber-500">
                  Say this word:
                </p>
                <p className="text-5xl font-bold text-amber-900 sm:text-6xl">
                  {currentWord}
                </p>
                <p className="mt-1 text-xs text-amber-400">
                  Word {wordIndex + 1} of {words.length}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCorrect}
                  className="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-green-700"
                >
                  Correct ✓
                </button>
                <button
                  onClick={handleTryAgain}
                  className="rounded-xl bg-amber-500 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-amber-600"
                >
                  Try again
                </button>
              </div>
            </>
          )}

          {/* Words exhausted mid-play — should not linger, auto-resolves */}
          {phase === 'playing' && !currentWord && (
            <div className="rounded-xl bg-white/90 p-4 shadow-lg text-center">
              <p className="text-amber-800 font-semibold">Great practice!</p>
              <p className="text-sm text-amber-600">Determining winner…</p>
            </div>
          )}
        </div>
      </div>

      {/* Metamorphosis overlay */}
      {phase === 'metamorphosis' && metamorphTarget && (
        <MetamorphosisReveal
          animalId={players[metamorphTarget.player].animal}
          newForm={metamorphTarget.newForm}
          onComplete={handleMetamorphComplete}
        />
      )}

      {/* Player info panels */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 rounded-lg bg-white/80 p-2 shadow text-xs">
        <div className="flex items-center gap-1.5">
          <PlayerPiece0 size={20} />
          <span className="font-semibold text-amber-800">Child</span>
          <div className="flex gap-0.5">
            {[0, 1].map((i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i < players[0].upgrades ? 'bg-amber-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <span className="text-amber-600">{correctCount[0]} correct</span>
      </div>

      <div className="absolute top-2 right-2 flex flex-col gap-1 rounded-lg bg-white/80 p-2 shadow text-xs">
        <div className="flex items-center gap-1.5">
          <PlayerPiece1 size={20} />
          <span className="font-semibold text-amber-800">Therapist</span>
          <div className="flex gap-0.5">
            {[0, 1].map((i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i < players[1].upgrades ? 'bg-amber-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <span className="text-amber-600">{correctCount[1]} correct</span>
      </div>
    </div>
  );
}
