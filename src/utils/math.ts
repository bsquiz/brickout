export const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.max(minimum, Math.min(maximum, value));

export const clamp01 = (value: number): number => clamp(value, 0, 1);
