# Teletherapy Games

A growing library of turn-taking games for speech, OT, and PT teletherapy sessions. Built with Next.js, Tailwind CSS, and the Anthropic SDK.

## Getting Started

### Prerequisites

- Node.js 20+
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Local Development

```bash
# Install dependencies
npm install

# Copy the env file and add your API key
cp .env.local.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game picker.

### Production Build

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the environment variable `ANTHROPIC_API_KEY` in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js.

## How to Add a New Game

Adding a game takes three steps:

### 1. Create a game folder

```
games/
  my-new-game/
    config.ts    # metadata + setup menu schema
    Game.tsx     # the playable React component
    cache.ts     # (optional) pre-generated word banks
```

### 2. Export a config

`config.ts` must default-export an object matching the `GameConfig` type:

```ts
import type { GameConfig } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'my-new-game',
  title: 'My New Game',
  description: 'A short description shown on the game picker.',
  thumbnail: '🎯',
  setupSchema: {
    sound:     { type: 'select', label: 'Target Sound', options: ['/f/', '/s/', '/r/'] },
    position:  { type: 'select', label: 'Position',     options: ['initial', 'medial', 'final'] },
    level:     { type: 'select', label: 'Level',         options: ['early', 'elementary', 'upper-elementary', 'teen-adult'] },
    wordCount: { type: 'select', label: 'Word Count',    options: [5, 10, 15, 20] },
    // Add any extra fields your game needs — the setup menu renders them automatically.
  },
  component: Game,
};

export default config;
```

Your `Game.tsx` component receives `{ words: string[]; setup: SetupChoices }` as props.

### 3. Register it

Open `games/_registry.ts` and add one line:

```ts
import myNewGame from './my-new-game/config';

const registry: GameConfig[] = [
  barnyardRace,
  myNewGame,   // ← add here
];
```

That's it — the homepage and dynamic route will pick it up automatically.

## Project Structure

```
app/
  layout.tsx                    # root layout
  page.tsx                      # game picker hub
  games/[gameId]/page.tsx       # dynamic game loader
  api/words/route.ts            # Claude-powered word generation
games/
  _registry.ts                  # game index
  barnyard-race/                # game #1
    config.ts
    Game.tsx
    cache.ts
lib/
  claude.ts                     # Anthropic SDK wrapper
  setup-menu/
    SetupMenu.tsx               # dynamic setup form
    types.ts                    # shared types
  word-bank/
    index.ts                    # cache-first word lookup
    prompt.ts                   # Claude prompt builder
```

## Word Bank

Words are loaded cache-first: the app checks the game's `cache.ts` before calling the API. This means the app works offline for any sound/position/level combo that has been pre-seeded. When the cache misses, the app calls `/api/words` which uses Claude to generate age-appropriate words.

Clinicians can check "Generate new words (skip cache)" in the setup menu to force fresh generation via the API.
