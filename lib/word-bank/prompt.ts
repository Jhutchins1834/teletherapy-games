import type { LevelKey } from '@/lib/setup-menu/types';

const LEVEL_CONSTRAINTS: Record<LevelKey, string> = {
  early:
    '1 syllable preferred, max 2. Concrete nouns only — animals, food, body parts, toys, household objects. Must be words a 4-6 year old uses in daily speech. No abstract concepts.',
  elementary:
    '1-2 syllables. Common everyday vocabulary a 7-9 year old would know. Concrete nouns and common verbs. No academic or technical words.',
  'upper-elementary':
    '1-3 syllables. Vocabulary appropriate for ages 10-12, including common school subjects. Still prefer concrete over abstract.',
  'teen-adult':
    'No restrictions beyond the target sound and position.',
};

export function buildPrompt(
  sound: string,
  position: string,
  level: LevelKey,
  wordCount: number,
): string {
  const constraint = LEVEL_CONSTRAINTS[level];

  return `You are a speech-language pathology assistant. Generate exactly ${wordCount} English words that contain the sound "${sound}" in the ${position} position of the word.

Level constraint: ${constraint}

Rules:
- No proper nouns.
- No hyphenated words.
- No archaic or obscure words.
- No words with alternate common pronunciations where the target sound would not be produced.
- Every word MUST contain the "${sound}" sound in the ${position} position.

Return ONLY valid JSON in this exact format, with no markdown fences, no explanation, no prose:
{"words": ["word1", "word2", "word3"]}`;
}
