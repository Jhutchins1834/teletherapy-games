'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import registry from '@/games/_registry';
import SetupMenu from '@/lib/setup-menu/SetupMenu';
import type { SetupChoices } from '@/lib/setup-menu/types';

// Dynamic import of each game's cache
const cacheModules: Record<string, () => Promise<{ default: Record<string, string[]> }>> = {
  'barnyard-race': () => import('@/games/barnyard-race/cache'),
};

async function loadCache(gameId: string): Promise<Record<string, string[]>> {
  const loader = cacheModules[gameId];
  if (!loader) return {};
  const mod = await loader();
  return mod.default;
}

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const game = registry.find((g) => g.id === gameId);

  const [phase, setPhase] = useState<'setup' | 'playing'>('setup');
  const [words, setWords] = useState<string[]>([]);
  const [setup, setSetup] = useState<SetupChoices>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!game) {
    notFound();
  }

  const handleSubmit = async (choices: SetupChoices, forceRefresh: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const cache = await loadCache(gameId);

      // Import getWords dynamically to keep it client-side
      const { getWords } = await import('@/lib/word-bank/index');
      const result = await getWords(choices, cache, forceRefresh);

      setWords(result);
      setSetup(choices);
      setPhase('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  const GameComponent = game.component;

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-amber-200">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <a
            href="/"
            className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 transition hover:bg-amber-200"
          >
            ← Back
          </a>
          <h1 className="text-2xl font-bold text-amber-900">
            {game.thumbnail} {game.title}
          </h1>
        </div>

        {phase === 'setup' && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <SetupMenu
                schema={game.setupSchema}
                onSubmit={handleSubmit}
                loading={loading}
              />
              {error && (
                <p className="mt-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {phase === 'playing' && (
          <GameComponent words={words} setup={setup} />
        )}
      </div>
    </main>
  );
}
