import { Constants } from '../constants';
import type { LevelGrade, LevelResult, LevelStats } from './types';
import { clamp01 } from '../utils/math';

export const createLevelStats = (startedAt: number, startingLives: number, startingScore: number): LevelStats => ({
  startedAt,
  startingLives,
  startingScore,
  bricksDestroyed: 0,
  paddleReturns: 0,
  perfectReturns: 0,
  maxCombo: 0,
  maxHeat: 0,
  skillShots: []
});

const getGrade = (score: number): LevelGrade => {
  if (score >= Constants.Game.Grading.S_THRESHOLD) return 'S';
  if (score >= Constants.Game.Grading.A_THRESHOLD) return 'A';
  if (score >= Constants.Game.Grading.B_THRESHOLD) return 'B';
  return 'C';
};

export const gradeLevel = (
  stats: LevelStats,
  elapsedSeconds: number,
  lives: number,
  score: number,
  levelBrickCount: number
): LevelResult => {
  const duration = Math.max(0, elapsedSeconds - stats.startedAt);
  const livesLost = Math.max(0, stats.startingLives - lives);
  const parTime = Constants.Game.Grading.BASE_PAR_SECONDS + levelBrickCount * Constants.Game.Grading.SECONDS_PER_BRICK;
  const timePoints = 25 * clamp01(parTime / Math.max(1, duration));
  const survivalPoints = Math.max(0, 30 - livesLost * 12);
  const comboPoints = Math.min(15, stats.maxCombo * 1.5);
  const heatPoints = 15 * Math.min(1, stats.maxHeat / Constants.Game.RallyHeat.MAX_RETURNS);
  const skillPoints = Math.min(15, stats.skillShots.length * 5);
  return {
    grade: getGrade(timePoints + survivalPoints + comboPoints + heatPoints + skillPoints),
    elapsedSeconds: duration,
    scoreGained: Math.max(0, score - stats.startingScore),
    livesLost,
    skillShotCount: stats.skillShots.length
  };
};
