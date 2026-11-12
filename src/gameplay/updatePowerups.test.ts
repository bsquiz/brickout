import { Constants } from '../constants';
import { createTestGameState, createTestPowerup } from '../test/fixtures';
import { updatePowerups } from './updatePowerups';

describe('updatePowerups', () => {
  test('allows multiple timed powerups to remain active together', () => {
    const state = createTestGameState({
      powerups: [createTestPowerup({ type: 'sticky' }), createTestPowerup({ type: 'slow-motion' })]
    });
    updatePowerups(state, 0);
    expect(state.powerups).toHaveLength(0);
    expect(state.activeEffects.stickyRemaining).toBe(Constants.Game.POWERUP_DURATION_SECONDS);
    expect(state.activeEffects.slowMotionRemaining).toBe(Constants.Game.POWERUP_DURATION_SECONDS);
  });

  test('activates the ball speed boost when collected', () => {
    const state = createTestGameState({
      powerups: [createTestPowerup({ type: 'speed-up' })]
    });

    updatePowerups(state, 0);

    expect(state.powerups).toHaveLength(0);
    expect(state.ball.boostSpeedRemaining).toBe(Constants.Game.Brick.Boost.SPEED_DURATION_SECONDS);
    expect(state.events).toContain(Constants.Id.GameEvent.POWERUP);
  });
});
