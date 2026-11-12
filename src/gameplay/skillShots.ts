import { Constants } from '../constants';
import type { GameState, SkillShotId } from './types';

type SkillShotDefinition = { label: string; points: number; color: string };

export const SkillShotRegistry: Record<SkillShotId, SkillShotDefinition> = {
  [Constants.Id.SkillShot.OPENING_BLITZ]: { label: 'OPENING BLITZ', points: Constants.Game.SkillShot.OPENING_BLITZ_POINTS, color: '#facc15' },
  [Constants.Id.SkillShot.BANK_MASTER]: { label: 'BANK MASTER', points: Constants.Game.SkillShot.BANK_MASTER_POINTS, color: Constants.Render.Colors.SHIELD },
  [Constants.Id.SkillShot.ALIEN_COMBO]: { label: 'ALIEN COMBO', points: Constants.Game.SkillShot.ALIEN_COMBO_POINTS, color: Constants.Render.Colors.ALIEN },
  [Constants.Id.SkillShot.OVERDRIVE]: { label: 'OVERDRIVE', points: Constants.Game.SkillShot.OVERDRIVE_POINTS, color: Constants.Render.Colors.SUPER_BALL },
  [Constants.Id.SkillShot.COUNTER_SHOT]: { label: 'COUNTER SHOT', points: Constants.Game.SkillShot.COUNTER_SHOT_POINTS, color: Constants.Render.Colors.ALIEN }
};

export const awardSkillShot = (state: GameState, id: SkillShotId): boolean => {
  if (state.levelStats.skillShots.includes(id)) return false;
  const skillShot = SkillShotRegistry[id];
  state.levelStats.skillShots.push(id);
  state.score += skillShot.points;
  state.highScore = Math.max(state.highScore, state.score);
  state.effects.banner = { text: `${skillShot.label} +${skillShot.points}`, color: skillShot.color, remaining: 0.9 };
  return true;
};
