export type LevelKey = 'early' | 'elementary' | 'upper-elementary' | 'teen-adult';

export type FieldSchema = {
  type: 'select';
  options: (string | number)[];
  label: string;
};

export type SetupSchema = Record<string, FieldSchema>;

export type SetupChoices = Record<string, string | number>;

export type GameConfig = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  setupSchema: SetupSchema;
  component: React.ComponentType<{ words: string[]; setup: SetupChoices }>;
};
