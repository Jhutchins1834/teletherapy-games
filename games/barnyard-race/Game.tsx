'use client';

import { useState, useCallback } from 'react';
import type { SetupChoices } from '@/lib/setup-menu/types';

type Props = {
  words: string[];
  setup: SetupChoices;
};

const PLAYERS = [
  { name: 'Player 1', emoji: '🐷', label: 'Pig' },
  { name: 'Player 2', emoji: '🐮', label: 'Cow' },
];

export default function BarnyardRace({ words, setup }: Props) {
  const boardLength = Number(setup.wordCount);
  const [positions, setPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);

  const currentWord = words[wordIndex % words.length];

  const handleCorrect = useCallback(() => {
    const newPositions = [...positions];
    newPositions[currentPlayer] += 1;
    setPositions(newPositions);

    if (newPositions[currentPlayer] >= boardLength) {
      setWinner(currentPlayer);
      return;
    }

    setWordIndex((i) => i + 1);
    setCurrentPlayer((p) => (p + 1) % 2);
  }, [positions, currentPlayer, boardLength]);

  const handleTryAgain = useCallback(() => {
    // Keep the same word, pass the turn
    setCurrentPlayer((p) => (p + 1) % 2);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setPositions([0, 0]);
    setCurrentPlayer(0);
    setWordIndex(0);
    setWinner(null);
  }, []);

  // Celebration screen
  if (winner !== null) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
        <div className="text-8xl">{PLAYERS[winner].emoji}</div>
        <h2 className="text-4xl font-bold text-amber-900">
          {PLAYERS[winner].label} wins!
        </h2>
        <p className="text-xl text-amber-700">Great job practicing!</p>
        <div className="flex gap-4">
          <button
            onClick={handlePlayAgain}
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
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center gap-6 px-4 py-6">
      {/* Turn indicator */}
      <div className="flex items-center gap-3 rounded-full bg-amber-100 px-6 py-2 shadow">
        <span className="text-3xl">{PLAYERS[currentPlayer].emoji}</span>
        <span className="text-xl font-bold text-amber-900">
          {PLAYERS[currentPlayer].name}&apos;s Turn
        </span>
      </div>

      {/* Race tracks */}
      <div className="w-full max-w-3xl space-y-3">
        {PLAYERS.map((player, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-20 text-sm font-semibold text-amber-800">
              {player.label}
            </span>
            <div className="relative flex-1">
              {/* Track background — wooden fence look */}
              <div className="flex h-12 rounded-lg border-2 border-amber-700 bg-amber-200 overflow-hidden">
                {Array.from({ length: boardLength }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-r border-amber-400 last:border-r-0 ${
                      i < positions[idx] ? 'bg-green-300' : ''
                    }`}
                  />
                ))}
              </div>
              {/* Animal token */}
              <div
                className="absolute top-0 flex h-12 items-center justify-center text-3xl transition-all duration-500 ease-out"
                style={{
                  left: `${(positions[idx] / boardLength) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {player.emoji}
              </div>
            </div>
            {/* Barn at finish */}
            <span className="text-2xl" title="Barn">
              🏠
            </span>
          </div>
        ))}
      </div>

      {/* Word card */}
      <div className="mt-4 flex w-full max-w-lg flex-col items-center rounded-2xl border-4 border-amber-600 bg-white p-8 shadow-xl">
        <p className="mb-2 text-sm font-medium text-amber-600 uppercase tracking-wide">
          Say this word:
        </p>
        <p className="text-6xl font-bold text-amber-900 md:text-8xl">
          {currentWord}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleCorrect}
          className="rounded-xl bg-green-600 px-8 py-4 text-xl font-bold text-white shadow-md transition hover:bg-green-700"
        >
          Correct ✓
        </button>
        <button
          onClick={handleTryAgain}
          className="rounded-xl bg-amber-500 px-8 py-4 text-xl font-bold text-white shadow-md transition hover:bg-amber-600"
        >
          Try again
        </button>
      </div>

      {/* Word progress */}
      <p className="text-sm text-amber-600">
        Word {(wordIndex % words.length) + 1} of {words.length}
      </p>
    </div>
  );
}
