import { Constants } from '../constants';
import type { LevelDefinition } from '../data/validateLevel';
import { isClearTarget } from './brickRules';
import { updateVisualEffects } from './effects';
import { updateAlienThreat } from './updateAlien';
import { updatePowerups } from './updatePowerups';
import type { GameState, InputState } from './types';
import { updateBalls } from './systems/ballSystem';
import { updateBricks } from './systems/brickSystem';
import { getFinalTarget } from './systems/finalBrickAssist';
import { completeLevel } from './systems/levelSystem';
import { loseLife } from './systems/lifeSystem';
import { updateGamePhase } from './systems/phaseSystem';
import { updatePlayerControls } from './systems/playerControlSystem';
import { updateProjectiles } from './systems/projectileSystem';
import { updateTimers } from './systems/timerSystem';
import { UpdateSystem, type UpdateObserver } from './updateTrace';
import { clamp } from '../utils/math';

export const updateGame = (
  state: GameState,
  input: InputState,
  levels: LevelDefinition[],
  unboundedDeltaSeconds: number,
  observer?: UpdateObserver
): void => {
  const realDeltaSeconds = clamp(unboundedDeltaSeconds, 0, Constants.Game.MAX_FRAME_SECONDS);
  state.events = [];
  observer?.start(UpdateSystem.EFFECTS);
  updateVisualEffects(state, realDeltaSeconds);
  observer?.end(UpdateSystem.EFFECTS);
  observer?.start(UpdateSystem.PHASE);
  const phaseHandled = updateGamePhase(state, input, levels, realDeltaSeconds);
  observer?.end(UpdateSystem.PHASE);
  if (phaseHandled) return;

  if (getFinalTarget(state) === null) state.finalTargetTurns = 0;
  if (state.hitStopRemaining > 0) {
    state.hitStopRemaining = Math.max(0, state.hitStopRemaining - realDeltaSeconds);
    return;
  }

  const gameDeltaSeconds = state.activeEffects.slowMotionRemaining > 0
    ? realDeltaSeconds * Constants.Game.SLOW_MOTION_SCALE
    : realDeltaSeconds;
  observer?.start(UpdateSystem.TIMERS);
  updateTimers(state, realDeltaSeconds);
  observer?.end(UpdateSystem.TIMERS);
  observer?.start(UpdateSystem.CONTROLS);
  updatePlayerControls(state, input, gameDeltaSeconds);
  observer?.end(UpdateSystem.CONTROLS);
  observer?.start(UpdateSystem.BRICKS);
  updateBricks(state, gameDeltaSeconds);
  observer?.end(UpdateSystem.BRICKS);
  observer?.start(UpdateSystem.BALLS);
  const ballRemainsInPlay = updateBalls(state, input, gameDeltaSeconds);
  observer?.end(UpdateSystem.BALLS);
  if (!ballRemainsInPlay) loseLife(state);
  if (state.phase !== Constants.Id.GamePhase.PLAYING) return;

  observer?.start(UpdateSystem.POWERUPS);
  updatePowerups(state, gameDeltaSeconds);
  observer?.end(UpdateSystem.POWERUPS);
  observer?.start(UpdateSystem.PROJECTILES);
  updateProjectiles(state, gameDeltaSeconds);
  observer?.end(UpdateSystem.PROJECTILES);
  observer?.start(UpdateSystem.ALIENS);
  const alienHitPlayer = !state.events.includes(Constants.Id.GameEvent.LIFE_LOST) && updateAlienThreat(state, gameDeltaSeconds);
  observer?.end(UpdateSystem.ALIENS);
  if (alienHitPlayer) loseLife(state);
  observer?.start(UpdateSystem.COMPLETION);
  if (!state.bricks.some(isClearTarget)) completeLevel(state);
  observer?.end(UpdateSystem.COMPLETION);
};
