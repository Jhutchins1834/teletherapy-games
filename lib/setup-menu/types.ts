export type LevelKey = 'early' | 'elementary' | 'upper-elementary' | 'teen-adult';

export type FieldSchema = {
  type: 'select';
  options: (string | number)[];
  label: string;
  helperText?: string;
};

export type SetupSchema = Record<string, FieldSchema>;

export type SetupChoices = Record<string, string | number>;

export type GameConfig = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  setupSchema: SetupSchema;
  /** Multiply the wordCount by this factor when fetching words. Default: 1. */
  wordMultiplier?: number;
  component: React.ComponentType<{ words: string[]; setup: SetupChoices }>;
};
