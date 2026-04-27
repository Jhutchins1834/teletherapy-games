export type ObjectState = 'idle' | 'animating' | 'revealed';

export type ClickableObjectProps = {
  word: string;
  state: ObjectState;
  skipWords: boolean;
  onDiscover: () => void;
};

/** Small sparkle badge shown on discovered objects */
export function DiscoveredBadge() {
  return null; // Rendered by parent using CSS — this is a placeholder for the pattern.
}
