import { getDefaultArena } from '../gameplay/arena';
import type { LevelDefinition } from '../data/validateLevel';
import { Constants } from '../constants';
import { createBricks, getBrickStartingHitPoints } from './brick';

describe('brick creation', () => {
  test('fills the arena with the level-defined column count', () => {
    const level: LevelDefinition = [Array.from({ length: 7 }, () => ({ hitPoints: 1 }))];
    const arena = getDefaultArena();
    const bricks = createBricks(level, arena);
    expect(bricks).toHaveLength(7);
    expect(bricks[0]?.width).toBeCloseTo(arena.width / 7);
    expect(bricks[6]?.x + (bricks[6]?.width ?? 0)).toBeCloseTo(arena.width);
  });

  test('gives regenerating bricks enough health to survive and repair damage', () => {
    expect(getBrickStartingHitPoints('regenerating', 1)).toBe(
      Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS
    );

    const level: LevelDefinition = [[{ hitPoints: 1, behavior: 'regenerating' }]];
    const brick = createBricks(level, getDefaultArena())[0];

    expect(brick).toEqual(expect.objectContaining({
      behavior: 'regenerating',
      hitPoints: Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS,
      maxHitPoints: Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS
    }));
  });
});
