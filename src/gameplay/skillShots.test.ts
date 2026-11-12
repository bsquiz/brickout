import { Constants } from '../constants';
import { createTestGameState } from '../test/fixtures';
import { awardSkillShot } from './skillShots';

describe('skill shots', () => {
  test('awards each named skill once per level', () => {
    const state = createTestGameState();
    expect(awardSkillShot(state, 'opening-blitz')).toBe(true);
    expect(awardSkillShot(state, 'opening-blitz')).toBe(false);
    expect(state.score).toBe(Constants.Game.SkillShot.OPENING_BLITZ_POINTS);
    expect(state.levelStats.skillShots).toEqual(['opening-blitz']);
  });
});
