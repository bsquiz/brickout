import { Constants } from '../../constants';
import type { LevelDefinition } from '../../data/validateLevel';
import { spawnLevelClearEffects } from '../effects';
import { loadLevel } from '../gameState';
import { gradeLevel } from '../grading';
import type { GameState } from '../types';
import { getUpgradeChoices } from '../upgrades';

export const updateLevelTransition = (state: GameState, levels: LevelDefinition[], deltaSeconds: number): void => {
  state.transitionRemaining -= deltaSeconds;
  if (state.transitionRemaining > 0) return;
  const nextLevelIndex = state.levelIndex + 1;
  if (nextLevelIndex >= levels.length) {
    state.phase = Constants.Id.GamePhase.GAME_WON;
    return;
  }
  const offerUpgrade = state.bossDefeated && getUpgradeChoices(state.upgrades).length > 0;
  state.levelIndex = nextLevelIndex;
  const level = levels[nextLevelIndex];
  if (level === undefined) return;
  loadLevel(state, level);
  if (offerUpgrade) {
    state.pendingUpgradeChoices = getUpgradeChoices(state.upgrades);
    state.phase = Constants.Id.GamePhase.UPGRADE;
  }
};

export const completeLevel = (state: GameState): void => {
  state.levelResult = gradeLevel(state.levelStats, state.elapsedSeconds, state.lives, state.score, state.levelBrickCount);
  state.phase = Constants.Id.GamePhase.LEVEL_WON;
  state.transitionRemaining = Constants.Game.LEVEL_TRANSITION_SECONDS;
  state.events.push(Constants.Id.GameEvent.LEVEL_WON);
  spawnLevelClearEffects(state);
};
