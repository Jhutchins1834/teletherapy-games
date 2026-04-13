import type { SetupChoices, LevelKey } from '@/lib/setup-menu/types';

type CacheStore = Record<string, string[]>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getWords(
  setup: SetupChoices,
  cache: CacheStore,
  forceRefresh = false,
): Promise<string[]> {
  const sound = String(setup.sound).replace(/\//g, '');
  const position = String(setup.position);
  const level = String(setup.level) as LevelKey;
  const wordCount = Number(setup.wordCount);
  const cacheKey = `${sound}_${position}_${level}`;

  // Cache-first lookup
  if (!forceRefresh && cache[cacheKey] && cache[cacheKey].length >= wordCount) {
    return shuffle(cache[cacheKey]).slice(0, wordCount);
  }

  // API fallback
  try {
    const res = await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sound, position, level, wordCount }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data.words) && data.words.length > 0) {
      return data.words.slice(0, wordCount);
    }
    throw new Error('Invalid API response');
  } catch {
    // Fallback to cache even if not enough words
    if (cache[cacheKey] && cache[cacheKey].length > 0) {
      return shuffle(cache[cacheKey]).slice(0, wordCount);
    }
    throw new Error(
      `No words available for ${cacheKey}. Please check your API key or try a cached sound/position/level combination.`,
    );
  }
}
