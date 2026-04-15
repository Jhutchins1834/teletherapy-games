import type { GameConfig, LevelKey } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'metamorphosis',
  title: 'Metamorphosis',
  description:
    'Race around a 30-space board, land on gold spaces to transform your animal into its ultimate form, then race home to win!',
  thumbnail: '🦋',
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
  },
  fixedWordCount: 35,
  component: Game,
};

export default config;
