export type LevelKey = 'early' | 'elementary' | 'upper-elementary' | 'teen-adult';

export type SelectFieldSchema = {
  type: 'select';
  options: (string | number)[];
  label: string;
  helperText?: string;
};

export type CheckboxFieldSchema = {
  type: 'checkbox';
  label: string;
  default: boolean;
  helperText?: string;
};

export type FieldSchema = SelectFieldSchema | CheckboxFieldSchema;

export type SetupSchema = Record<string, FieldSchema>;

export type SetupChoices = Record<string, string | number | boolean>;

export type GameConfig = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  setupSchema: SetupSchema;
  /** Multiply the wordCount by this factor when fetching words. Default: 1. */
  wordMultiplier?: number;
  /** Override wordCount entirely — use this fixed number instead of the setup field. */
  fixedWordCount?: number;
  component: React.ComponentType<{ words: string[]; setup: SetupChoices }>;
};
