export type RandomState = { randomSeed: number };

export const nextRandom = (state: RandomState): number => {
  let seed = state.randomSeed | 0;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  state.randomSeed = seed >>> 0;
  return state.randomSeed / 0x100000000;
};
