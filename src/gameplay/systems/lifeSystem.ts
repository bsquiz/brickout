import { Constants } from '../../constants';
import { createBall, resetPaddle } from '../../entities';
import { spawnPaddleDeathEffects } from '../effects';
import type { GameState } from '../types';

export const loseLife = (state: GameState): void => {
  state.lives -= 1;
  state.combo = 0;
  state.comboRemaining = 0;
  state.events.push(Constants.Id.GameEvent.LIFE_LOST);
  state.effects.shake = state.reducedMotion ? 0 : 12;
  state.effects.lifeFlash = 1;
  spawnPaddleDeathEffects(state);
  resetPaddle(state.paddle, state.arena);
  state.ball = createBall(state.paddle);
  state.extraBalls = [];
  state.powerups = [];
  state.projectiles = [];
  state.alien = null;
  state.alienWarningSide = null;
  state.enemyBullets = [];
  state.alienSpawnRemaining = Constants.Entities.Alien.MIN_SPAWN_SECONDS;
  state.returnStreak = 0;
  state.serveAim = Constants.Game.Serve.DEFAULT_AIM;
  state.alienHitSincePaddle = false;
  state.activeEffects = { stickyRemaining: 0, slowMotionRemaining: 0, laserRemaining: 0, laserCooldown: 0, shieldCharges: 0, overdriveRemaining: 0 };
  state.phase = Constants.Id.GamePhase.LIFE_LOST;
  state.transitionRemaining = Constants.Game.PADDLE_DEATH_SECONDS;
};
