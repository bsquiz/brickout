import type { GameState } from '../types';

export const updateTimers = (state: GameState, deltaSeconds: number): void => {
  state.comboRemaining = Math.max(0, state.comboRemaining - deltaSeconds);
  if (state.comboRemaining === 0) state.combo = 0;
  state.activeEffects.stickyRemaining = Math.max(0, state.activeEffects.stickyRemaining - deltaSeconds);
  state.activeEffects.slowMotionRemaining = Math.max(0, state.activeEffects.slowMotionRemaining - deltaSeconds);
  state.activeEffects.laserRemaining = Math.max(0, state.activeEffects.laserRemaining - deltaSeconds);
  state.activeEffects.overdriveRemaining = Math.max(0, state.activeEffects.overdriveRemaining - deltaSeconds);
  state.dashCooldown = Math.max(0, state.dashCooldown - deltaSeconds);
};
