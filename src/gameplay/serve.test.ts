import { Constants } from '../constants';
import { createTestGameState } from '../test/fixtures';
import type { InputState } from './types';
import { updateServeAim } from './serve';

const input = (overrides: Partial<InputState> = {}): InputState => ({
  left: false, right: false, launch: false, pause: false, dash: false,
  paddleTargetX: null, ...overrides
});

describe('directional serving', () => {
  test('aims paddle-controlled serves with left and right input', () => {
    const state = createTestGameState();
    state.ball.launched = false;
    updateServeAim(state, input({ left: true }), 1);
    expect(state.serveAim).toBe(-Constants.Game.Serve.MAX_HORIZONTAL_RATIO);
    updateServeAim(state, input({ right: true }), 1);
    expect(state.serveAim).toBeGreaterThan(0);
  });
});
