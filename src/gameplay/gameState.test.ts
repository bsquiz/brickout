import { createTestGameState, createTestLevel } from '../test/fixtures';
import { getArenaDimensions } from './arena';
import { loadLevel, resizeGameArena } from './gameState';

describe('resizeGameArena', () => {
  test('creates only the classic gameplay state', () => {
    const state = createTestGameState();
    expect(state).not.toHaveProperty('mode');
    expect(state).not.toHaveProperty('invaders');
    expect(state).not.toHaveProperty('pilotSteering');
    expect(state.bricks.length).toBeGreaterThan(0);
    expect(state.lives).toBe(3);
  });

  test('preserves live progress and remaps entities into landscape', () => {
    const state = createTestGameState();
    const remainingBrick = state.bricks[0];
    const originalBallCenterRatio = (state.ball.x + state.ball.width / 2) / state.arena.width;
    resizeGameArena(state, getArenaDimensions(844, 390));

    expect(state.arena.orientation).toBe('landscape');
    expect(state.bricks).toEqual([remainingBrick]);
    expect(remainingBrick?.width).toBe(67.5);
    expect((state.ball.x + state.ball.width / 2) / state.arena.width).toBeCloseTo(originalBallCenterRatio);
    expect(state.paddle.y + state.paddle.height).toBe(state.arena.height);
  });

  test('applies the next level arena shape before placing entities', () => {
    const state = createTestGameState();
    const previousWidth = state.arena.width;
    state.levelIndex = 1;
    loadLevel(state, createTestLevel());
    expect(state.arena.width).toBeGreaterThan(previousWidth);
    expect(state.paddle.y + state.paddle.height).toBe(state.arena.height);
    expect(state.bricks[0]?.width).toBe(state.arena.width / 10);
  });
});
