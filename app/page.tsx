'use client';

import Link from 'next/link';
import registry from '@/games/_registry';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-amber-200">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-amber-900 drop-shadow">
            🎮 Teletherapy Games
          </h1>
          <p className="mt-3 text-lg text-amber-800">
            Pick a game to start your session!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {registry.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group flex flex-col items-center rounded-2xl border-4 border-amber-600 bg-white p-6 shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              <span className="text-6xl">{game.thumbnail}</span>
              <h2 className="mt-3 text-xl font-bold text-amber-900 group-hover:text-green-700">
                {game.title}
              </h2>
              <p className="mt-1 text-center text-sm text-amber-700">
                {game.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
