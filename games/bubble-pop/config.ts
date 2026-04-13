import type { GameConfig, LevelKey } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'bubble-pop',
  title: 'Bubble Pop',
  description:
    'Pop rising bubbles by saying the word inside! An underwater adventure for practicing target sounds.',
  thumbnail: '🫧',
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
      helperText: 'Total words in the session. Game ends when all words are used.',
      options: [5, 10, 15, 20],
    },
    difficulty: {
      type: 'select',
      label: 'Game Difficulty',
      helperText: 'Controls how many bubbles appear on screen at once.',
      options: ['Easy', 'Medium', 'Hard'],
    },
    speed: {
      type: 'select',
      label: 'Speed',
      helperText: 'Controls how fast bubbles rise. Hard difficulty adds a 1.25\u00d7 multiplier.',
      options: ['Slow', 'Medium', 'Fast'],
    },
  },
  component: Game,
};

export default config;
