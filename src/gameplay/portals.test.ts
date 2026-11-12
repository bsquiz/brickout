import { createTestBall, createTestBrick, createTestGameState } from '../test/fixtures';
import { teleportBall } from './portals';

describe('portal bricks', () => {
  test('teleports a ball to its paired portal while preserving velocity', () => {
    const entrance = createTestBrick({ behavior: 'portal', portalId: 'a', x: 50, y: 80 });
    const exit = createTestBrick({ behavior: 'portal', portalId: 'a', x: 350, y: 300, baseX: 350 });
    const ball = createTestBall({ velocity: { x: 120, y: -200 } });
    const state = createTestGameState({ ball, bricks: [entrance, exit] });
    expect(teleportBall(state, ball, entrance)).toBe(true);
    expect(ball.x).toBeGreaterThan(exit.x);
    expect(ball.velocity).toEqual({ x: 120, y: -200 });
    expect(ball.portalCooldown).toBeGreaterThan(0);
  });

  test('blocks immediate portal re-entry', () => {
    const portal = createTestBrick({ behavior: 'portal', portalId: 'a' });
    const state = createTestGameState({ bricks: [portal, createTestBrick({ behavior: 'portal', portalId: 'a', x: 300 })] });
    const ball = createTestBall({ portalCooldown: 0.1 });
    expect(teleportBall(state, ball, portal)).toBe(false);
  });
});
