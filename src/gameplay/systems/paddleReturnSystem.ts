import { Constants } from '../../constants';
import { spawnPaddleEffects, spawnPerfectReturnEffects } from '../effects';
import { getBallSpeed } from '../arena';
import { awardSkillShot } from '../skillShots';
import type { Ball, GameState } from '../types';
import { applyFinalBrickAimAssist, getFinalTarget } from './finalBrickAssist';

export const reflectFromPaddle = (state: GameState, ball: Ball): void => {
  const ballCenter = ball.x + ball.width / 2;
  const paddleCenter = state.paddle.x + state.paddle.width / 2;
  const normalizedOffset = (ballCenter - paddleCenter) / (state.paddle.width / 2);
  state.returnStreak = Math.min(Constants.Game.RallyHeat.MAX_RETURNS, state.returnStreak + 1);
  state.levelStats.paddleReturns += 1;
  state.levelStats.maxHeat = Math.max(state.levelStats.maxHeat, state.returnStreak);
  if (state.returnStreak === Constants.Game.RallyHeat.MAX_RETURNS && state.activeEffects.overdriveRemaining <= 0) {
    state.activeEffects.overdriveRemaining = Constants.Game.Overdrive.DURATION_SECONDS;
    awardSkillShot(state, Constants.Id.SkillShot.OVERDRIVE);
    state.effects.backgroundPulse = 1;
  }

  const baseSpeed = getBallSpeed(state.arena);
  const currentSpeed = Math.hypot(ball.velocity.x, ball.velocity.y);
  const heatedSpeed = baseSpeed * (1 + state.returnStreak * Constants.Game.RallyHeat.SPEED_BONUS_PER_RETURN);
  const speed = Math.min(baseSpeed * Constants.Game.RallyHeat.MAX_SPEED_MULTIPLIER, Math.max(currentSpeed, heatedSpeed));
  const movementInfluence = state.paddleVelocityX / Constants.Entities.Paddle.SPEED * Constants.Game.PaddleEnglish.MOVEMENT_WEIGHT;
  const horizontalRatio = Math.max(
    -Constants.Game.PaddleEnglish.MAX_HORIZONTAL_RATIO,
    Math.min(Constants.Game.PaddleEnglish.MAX_HORIZONTAL_RATIO, normalizedOffset * Constants.Game.PaddleEnglish.IMPACT_WEIGHT + movementInfluence)
  );
  ball.velocity.x = horizontalRatio * speed;
  ball.velocity.y = -Math.sqrt(Math.max(0, speed * speed - ball.velocity.x * ball.velocity.x));
  if (getFinalTarget(state) !== null) state.finalTargetTurns += 1;
  applyFinalBrickAimAssist(state, ball);

  ball.y = state.paddle.y - ball.height;
  state.effects.paddleImpact = 1;
  state.effects.paddleImpactX = normalizedOffset;
  state.effects.ballImpact = 1;
  state.rallyHits = 0;
  state.wallBouncesSincePaddle = 0;
  const isPerfect = Math.abs(normalizedOffset) <= Constants.Game.PerfectReturn.CENTER_THRESHOLD;
  ball.isCharged = isPerfect;
  ball.perfectSuper = isPerfect;
  if (isPerfect) {
    state.levelStats.perfectReturns += 1;
    state.events.push(Constants.Id.GameEvent.PERFECT_RETURN);
    spawnPerfectReturnEffects(state, ballCenter);
  }
  state.alienHitSincePaddle = false;
  spawnPaddleEffects(state, ballCenter, ball.isSuper || ball.perfectSuper ? Constants.Render.Colors.SUPER_BALL : Constants.Render.Colors.FOREGROUND);
  state.events.push(Constants.Id.GameEvent.PADDLE_HIT);
  if (state.activeEffects.stickyRemaining > 0) {
    ball.launched = false;
    ball.pendingLaunchDirection = 'angled';
    ball.velocity = { x: 0, y: 0 };
    state.serveAim = 0;
  }
};
