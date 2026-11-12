export type DebugLevelOption = {
  index: number;
  label: string;
};

export const createDebugLevelOptions = (levelCount: number, titles: readonly string[]): DebugLevelOption[] =>
  Array.from({ length: Math.max(0, levelCount) }, (_, index) => ({
    index,
    label: `Level ${index + 1} · ${titles[index] ?? 'Untitled stage'}`
  }));

export const parseDebugLevelIndex = (value: string, levelCount: number): number => {
  const index = Number.parseInt(value, 10);
  return Number.isInteger(index) && index >= 0 && index < levelCount ? index : 0;
};
