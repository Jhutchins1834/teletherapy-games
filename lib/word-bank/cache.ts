/**
 * Shared pre-generated word banks for offline use.
 * Keys follow the pattern: {sound}_{position}_{level}
 * All games pull from this same cache.
 * Add more entries to expand offline coverage.
 */
const cache: Record<string, string[]> = {
  // /f/ in initial position, early level (ages 4-6)
  f_initial_early: [
    'fan', 'fish', 'foot', 'fork', 'five',
    'farm', 'fun', 'food', 'fire', 'face',
    'feet', 'fall',
  ],

  // /s/ in initial position, early level (ages 4-6)
  s_initial_early: [
    'sun', 'sock', 'soup', 'sand', 'seal',
    'sit', 'soap', 'sink', 'sad', 'see',
    'sew', 'sing',
  ],

  // /r/ in initial position, elementary level (ages 7-9)
  r_initial_elementary: [
    'rabbit', 'river', 'radio', 'ribbon', 'rocket',
    'rainbow', 'roof', 'rope', 'rain', 'run',
    'red', 'road',
  ],

  // /l/ in final position, elementary level (ages 7-9)
  l_final_elementary: [
    'ball', 'bell', 'call', 'doll', 'pull',
    'tail', 'wheel', 'snail', 'school', 'smell',
    'wall', 'hill',
  ],
};

export default cache;
