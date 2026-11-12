import { createTestBall, createTestBrick } from '../test/fixtures';
import { isClearTarget, isDirectionalHitAllowed } from './brickRules';

describe('brick rules', () => {
  test('does not require portal bricks to clear a stage', () => {
    expect(isClearTarget(createTestBrick({ behavior: 'portal' }))).toBe(false);
  });

  test('only accepts hits approaching a directional brick face', () => {
    const brick = createTestBrick({ behavior: 'directional', direction: 'left' });
    expect(isDirectionalHitAllowed(brick, createTestBall({ velocity: { x: 100, y: 0 } }))).toBe(true);
    expect(isDirectionalHitAllowed(brick, createTestBall({ velocity: { x: -100, y: 0 } }))).toBe(false);
  });
});
