import type { GameConfig } from '@/lib/setup-menu/types';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), { ssr: false });

const config: GameConfig = {
  id: 'barnyard-explorer',
  title: 'Barnyard Explorer',
  description:
    'Explore a rich barnyard world! Tap hidden objects to discover words tucked all around the farm.',
  thumbnail: '🐄',
  fixedWordCount: 25,
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
      options: ['initial', 'medial', 'final'],
    },
    skipWords: {
      type: 'checkbox',
      label: 'Skip words — just explore the scene',
      default: false,
      helperText: 'Animations play but no words are shown. Use for free exploration or reward time.',
    },
  },
  component: Game,
};

export default config;
