import { Id } from '../../constants/identifiers';

type IdentifierValue<T> = T[keyof T];

export type SkillShotId = IdentifierValue<typeof Id.SkillShot>;
export type LevelGrade = 'C' | 'B' | 'A' | 'S';
export type LevelStats = {
  startedAt: number;
  startingLives: number;
  startingScore: number;
  bricksDestroyed: number;
  paddleReturns: number;
  perfectReturns: number;
  maxCombo: number;
  maxHeat: number;
  skillShots: SkillShotId[];
};
export type LevelResult = {
  grade: LevelGrade;
  elapsedSeconds: number;
  scoreGained: number;
  livesLost: number;
  skillShotCount: number;
};
export type GamePhase = IdentifierValue<typeof Id.GamePhase>;
export type StageModifier = IdentifierValue<typeof Id.StageModifier>;
export type RunUpgrade = IdentifierValue<typeof Id.RunUpgrade>;
export type AlienEntrySide = 'left' | 'right';
export type GameEventType = IdentifierValue<typeof Id.GameEvent>;
