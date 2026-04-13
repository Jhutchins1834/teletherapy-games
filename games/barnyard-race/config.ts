import type { GameConfig, LevelKey } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'barnyard-race',
  title: 'Barnyard Race',
  description:
    'Two farm animals race to the barn! Take turns practicing words — correct answers move your animal forward.',
  thumbnail: '🐷',
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
      label: 'Level',
      options: ['early', 'elementary', 'upper-elementary', 'teen-adult'] as LevelKey[],
    },
    wordCount: {
      type: 'select',
      label: 'Word Count (board length)',
      options: [5, 10, 15, 20],
    },
  },
  component: Game,
};

export default config;
