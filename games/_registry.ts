import type { GameConfig } from '@/lib/setup-menu/types';
import barnyardRace from './barnyard-race/config';
import bubblePop from './bubble-pop/config';
import mountainClimber from './mountain-climber/config';
import bugCatcher from './bug-catcher/config';
import metamorphosis from './metamorphosis/config';
import barnyardExplorer from './barnyard-explorer/config';

const registry: GameConfig[] = [
  barnyardRace,
  bubblePop,
  mountainClimber,
  bugCatcher,
  metamorphosis,
  barnyardExplorer,
  // Add new games here — one line per game.
];

export default registry;
