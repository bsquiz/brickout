import { Constants } from '../../constants';
import { attachBallToPaddle, launchBall } from '../../entities';
import { intersects } from '../collisions';
import { awardSkillShot } from '../skillShots';
import { updateServeAim } from '../serve';
import { teleportBall } from '../portals';
import { hitAlienWithBall } from '../updateAlien';
import type { Ball, GameState, InputState } from '../types';
import { clamp } from '../../utils/math';
import { hitBrick } from './brickSystem';
import { getFinalTarget, intersectsBrickTarget } from './finalBrickAssist';
import { reflectFromPaddle } from './paddleReturnSystem';
import { getBallMovementScale, updateBallEffects } from '../ballEffects';

const updateTrail = (ball: Ball, deltaSeconds: number, reducedMotion: boolean): void => {
  ball.portalCooldown = Math.max(0, ball.portalCooldown - deltaSeconds);
  ball.trail.forEach((point) => { point.life -= deltaSeconds; });
  ball.trail = ball.trail.filter((point) => point.life > 0);
  if (ball.launched && !reducedMotion) ball.trail.push({ x: ball.x + ball.width / 2, y: ball.y + ball.height / 2, life: 0.22 });
  if (ball.trail.length > 14) ball.trail.shift();
};

const enforceMinimumVerticalVelocity = (ball: Ball): void => {
  const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
  const minimum = speed * Constants.Game.PaddleEnglish.MIN_VERTICAL_RATIO;
  if (speed === 0 || Math.abs(ball.velocity.y) >= minimum) return;
  ball.velocity.y = (ball.velocity.y < 0 ? -1 : 1) * minimum;
  ball.velocity.x = (ball.velocity.x < 0 ? -1 : 1) * Math.sqrt(Math.max(0, speed * speed - minimum * minimum));
};

const interceptEnemyBullet = (state: GameState, ball: Ball): void => {
  const index = state.enemyBullets.findIndex((bullet) => !bullet.reflected && intersects(ball, bullet));
  if (index < 0) return;
  const bullet = state.enemyBullets[index];
  if (bullet === undefined) return;
  if (ball.isCharged || state.activeEffects.overdriveRemaining > 0) {
    const alienCenter = state.alien === null ? ball.x + ball.width / 2 : state.alien.x + state.alien.width / 2;
    bullet.velocityX = (alienCenter - (bullet.x + bullet.width / 2)) * 0.8;
    bullet.velocityY = -Constants.Entities.EnemyBullet.SPEED * 1.25;
    bullet.y = ball.y - bullet.height - 3;
    bullet.reflected = true;
    bullet.nearMissAwarded = true;
    ball.isCharged = false;
    awardSkillShot(state, Constants.Id.SkillShot.COUNTER_SHOT);
  } else state.enemyBullets.splice(index, 1);
  state.effects.shockwaves.push({
    x: ball.x + ball.width / 2,
    y: ball.y + ball.height / 2,
    radius: 4,
    speed: 130,
    life: 0.25,
    color: Constants.Render.Colors.ALIEN
  });
  state.effects.ballImpact = 1;
  state.events.push(Constants.Id.GameEvent.WALL_HIT);
};

const updateBall = (state: GameState, ball: Ball, input: InputState, deltaSeconds: number): boolean => {
  updateTrail(ball, deltaSeconds, state.reducedMotion);
  const movementScale = getBallMovementScale(ball);
  updateBallEffects(ball, deltaSeconds);
  if (!ball.launched) {
    attachBallToPaddle(ball, state.paddle);
    updateServeAim(state, input, deltaSeconds);
    if (input.launch) launchBall(ball, state.arena, state.serveAim);
    return true;
  }

  ball.x += ball.velocity.x * deltaSeconds * movementScale;
  ball.y += ball.velocity.y * deltaSeconds * movementScale * (state.stageModifier === Constants.Id.StageModifier.LOW_GRAVITY ? 0.72 : 1);
  if (ball.x <= 0 || ball.x + ball.width >= state.arena.width) {
    ball.x = clamp(ball.x, 0, state.arena.width - ball.width);
    ball.velocity.x *= -1;
    state.wallBouncesSincePaddle += 1;
    state.effects.ballImpact = 1;
    state.events.push(Constants.Id.GameEvent.WALL_HIT);
  }
  if (ball.y <= state.arena.hudHeight) {
    ball.y = state.arena.hudHeight;
    ball.velocity.y = Math.abs(ball.velocity.y);
    state.wallBouncesSincePaddle += 1;
    state.effects.ballImpact = 1;
    state.events.push(Constants.Id.GameEvent.WALL_HIT);
  }

  if (ball.velocity.y > 0) {
    const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
    const extraGrace = Math.min(
      Constants.Game.PaddleForgiveness.MAX_EXTRA_PIXELS,
      Math.max(0, speed - Constants.Game.PaddleForgiveness.SPEED_THRESHOLD) / 100 * Constants.Game.PaddleForgiveness.PIXELS_PER_100_SPEED
    );
    const grace = Constants.Game.PaddleForgiveness.BASE_PIXELS + extraGrace;
    if (intersects(ball, {
      x: state.paddle.x - grace,
      y: state.paddle.y - grace,
      width: state.paddle.width + grace * 2,
      height: state.paddle.height + grace * 2
    })) reflectFromPaddle(state, ball);
  }

  interceptEnemyBullet(state, ball);
  hitAlienWithBall(state, ball);
  const finalTarget = getFinalTarget(state);
  const brickIndex = state.bricks.findIndex((brick) => intersectsBrickTarget(ball, brick, finalTarget));
  if (brickIndex >= 0) {
    const brick = state.bricks[brickIndex];
    if (brick !== undefined && !teleportBall(state, ball, brick)) hitBrick(state, brickIndex, ball);
  }
  enforceMinimumVerticalVelocity(ball);

  if (ball.y <= state.arena.height) return true;
  if (state.activeEffects.shieldCharges <= 0) return false;
  state.activeEffects.shieldCharges -= 1;
  ball.y = state.arena.height - ball.height - 4;
  ball.velocity.y = -Math.abs(ball.velocity.y);
  state.effects.ballImpact = 1;
  state.events.push(Constants.Id.GameEvent.WALL_HIT);
  return true;
};

export const updateBalls = (state: GameState, input: InputState, deltaSeconds: number): boolean => {
  const survivors = [state.ball, ...state.extraBalls].filter((ball) => updateBall(state, ball, input, deltaSeconds));
  if (survivors.length === 0) return false;
  const firstBall = survivors[0];
  if (firstBall !== undefined) state.ball = firstBall;
  state.extraBalls = survivors.slice(1);
  return true;
};
