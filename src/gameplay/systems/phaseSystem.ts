import { attachBallToPaddle } from '../../entities';
import { Constants } from '../../constants';
import type { LevelDefinition } from '../../data/validateLevel';
import { updateServeAim } from '../serve';
import type { GameState, InputState } from '../types';
import { updateLevelTransition } from './levelSystem';
import { movePaddle } from './paddleSystem';

const togglePause = (state: GameState): boolean => {
  if (state.phase === Constants.Id.GamePhase.PAUSED) {
    state.phase = state.countdownRemaining > 0 ? Constants.Id.GamePhase.COUNTDOWN : Constants.Id.GamePhase.PLAYING;
    return true;
  }
  if (state.phase === Constants.Id.GamePhase.PLAYING || state.phase === Constants.Id.GamePhase.COUNTDOWN) {
    state.phase = Constants.Id.GamePhase.PAUSED;
    return true;
  }
  return false;
};

const updateCountdown = (state: GameState, input: InputState, deltaSeconds: number): void => {
  updateServeAim(state, input, deltaSeconds);
  movePaddle(state, input, deltaSeconds);
  attachBallToPaddle(state.ball, state.paddle);
  state.countdownRemaining = Math.max(0, state.countdownRemaining - deltaSeconds);
  if (state.countdownRemaining === 0) {
    state.phase = Constants.Id.GamePhase.PLAYING;
    state.levelStats.startedAt = state.elapsedSeconds;
  }
};

export const updateGamePhase = (
  state: GameState,
  input: InputState,
  levels: LevelDefinition[],
  deltaSeconds: number
): boolean => {
  if (input.pause && togglePause(state)) return true;
  if (state.phase === Constants.Id.GamePhase.PAUSED || state.phase === Constants.Id.GamePhase.UPGRADE) return true;
  state.elapsedSeconds += deltaSeconds;
  if (state.phase === Constants.Id.GamePhase.LIFE_LOST) {
    state.transitionRemaining = Math.max(0, state.transitionRemaining - deltaSeconds);
    if (state.transitionRemaining === 0) state.phase = state.lives <= 0 ? Constants.Id.GamePhase.GAME_OVER : Constants.Id.GamePhase.PLAYING;
    return true;
  }
  if (state.phase === Constants.Id.GamePhase.LEVEL_WON) {
    updateLevelTransition(state, levels, deltaSeconds);
    return true;
  }
  if (state.phase === Constants.Id.GamePhase.COUNTDOWN) {
    updateCountdown(state, input, deltaSeconds);
    return true;
  }
  return state.phase !== Constants.Id.GamePhase.PLAYING;
};
