import { Constants } from '../constants';
import type { TrailStyle } from '../gameplay/types';

const unlockScores: Record<TrailStyle, number> = {
  [Constants.Id.TrailStyle.CLASSIC]: 0,
  [Constants.Id.TrailStyle.NEON]: 500,
  [Constants.Id.TrailStyle.EMBER]: 1500,
  [Constants.Id.TrailStyle.RAINBOW]: 3000
};

export const getUnlockedTrailStyles = (highScore: number): TrailStyle[] =>
  (Object.entries(unlockScores) as [TrailStyle, number][])
    .filter(([, score]) => highScore >= score)
    .map(([style]) => style);

export const getNextTrailStyle = (current: TrailStyle, highScore: number): TrailStyle => {
  const unlocked = getUnlockedTrailStyles(highScore);
  const currentIndex = Math.max(0, unlocked.indexOf(current));
  return unlocked[(currentIndex + 1) % unlocked.length] ?? Constants.Id.TrailStyle.CLASSIC;
};
