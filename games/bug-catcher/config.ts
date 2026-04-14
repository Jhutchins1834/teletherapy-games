import type { GameConfig, LevelKey } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'bug-catcher',
  title: 'Bug Catcher',
  description:
    'Catch the bugs before they escape! Click each bug when the word is said correctly to add it to your jar.',
  thumbnail: '🐛',
  setupSchema: {
    sound: {
      type: 'select',
      label: 'Target Sound',
      options: [
        '/f/', '/s/', '/r/', '/l/', '/k/', '/g/',
        '/th/', '/sh/', '/ch/',
        '/b/', '/p/', '/m/', '/n/', '/t/', '/d/',
        '/v/', '/z/', '/w/', '/y/', '/h/',
        '/st/', '/sp/', '/sk/',
        '/bl/', '/br/', '/fl/', '/fr/',
        '/gl/', '/gr/', '/pl/', '/pr/',
        '/sl/', '/sm/', '/sn/', '/sw/',
        '/tr/', '/dr/', '/cl/', '/cr/',
      ],
    },
    position: {
      type: 'select',
      label: 'Position in Word',
      options: ['initial', 'medial', 'final'] as ('initial' | 'medial' | 'final')[],
    },
    level: {
      type: 'select',
      label: 'Student Level',
      helperText: 'Controls vocabulary difficulty — keeps words age-appropriate.',
      options: ['early', 'elementary', 'upper-elementary', 'teen-adult'] as LevelKey[],
    },
    wordCount: {
      type: 'select',
      label: 'Word Count',
      helperText: 'Total bugs in the session. Game ends when all bugs are caught or escape.',
      options: [5, 10, 15, 20],
    },
    difficulty: {
      type: 'select',
      label: 'Game Difficulty',
      helperText: 'Controls how many bugs appear on screen at once.',
      options: ['Easy', 'Medium', 'Hard'],
    },
    speed: {
      type: 'select',
      label: 'Speed',
      helperText: 'Controls how fast bugs fly across the screen. Hard adds a 1.25× multiplier.',
      options: ['Slow', 'Medium', 'Fast'],
    },
  },
  component: Game,
};

export default config;
