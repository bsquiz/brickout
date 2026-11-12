import { Constants } from '../../constants';
import { createPowerup } from '../../entities';
import { getCollisionAxis } from '../collisions';
import { spawnBrickEffects, spawnBrickHitEffects, spawnComboMilestone, spawnLightningArc } from '../effects';
import { isDamageableBrick, isDirectionalHitAllowed } from '../brickRules';
import { nextRandom } from '../random';
import { getBrickScore } from '../scoring';
import { awardSkillShot } from '../skillShots';
import { applyFrozenSlow } from '../ballEffects';
import type { Ball, Brick, GameState } from '../types';

const addComboScore = (state: GameState, brick: Brick): void => {
  state.combo = state.comboRemaining > 0 ? state.combo + 1 : 1;
  state.comboRemaining = Constants.Game.COMBO_WINDOW_SECONDS;
  state.rallyHits += 1;
  const basePoints = getBrickScore(brick.points, state.combo, state.rallyHits);
  const heatPoints = basePoints * (1 + state.returnStreak * Constants.Game.RallyHeat.SCORE_BONUS_PER_RETURN);
  const multiplier = state.activeEffects.overdriveRemaining > 0 ? Constants.Game.Overdrive.SCORE_MULTIPLIER : 1;
  const points = Math.round(heatPoints * multiplier);
  state.brickToneIndex = brick.rowIndex;
  state.score += points;
  state.highScore = Math.max(state.highScore, state.score);
  state.levelStats.bricksDestroyed += 1;
  state.levelStats.maxCombo = Math.max(state.levelStats.maxCombo, state.combo);
  for (const ball of [state.ball, ...state.extraBalls]) {
    const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
    const targetSpeed = Math.min(Constants.Game.Brick.MAX_BALL_SPEED, speed * Constants.Game.Brick.BALL_SPEED_MULTIPLIER);
    if (speed > 0) {
      ball.velocity.x *= targetSpeed / speed;
      ball.velocity.y *= targetSpeed / speed;
    }
  }
  spawnBrickEffects(state, brick, points);
  spawnComboMilestone(state);
  if (state.levelStats.paddleReturns === 0 && state.levelStats.bricksDestroyed >= Constants.Game.Brick.OPENING_BLITZ_BRICKS) awardSkillShot(state, Constants.Id.SkillShot.OPENING_BLITZ);
  if (state.alienHitSincePaddle) {
    awardSkillShot(state, Constants.Id.SkillShot.ALIEN_COMBO);
    state.alienHitSincePaddle = false;
  }
  if (state.wallBouncesSincePaddle >= Constants.Game.Brick.BANK_MASTER_BOUNCES) {
    awardSkillShot(state, Constants.Id.SkillShot.BANK_MASTER);
    state.wallBouncesSincePaddle = 0;
  }
};

const removeBrick = (state: GameState, brickIndex: number): void => {
  const brick = state.bricks[brickIndex];
  if (brick === undefined || !isDamageableBrick(brick)) return;
  addComboScore(state, brick);
  state.bricks.splice(brickIndex, 1);
  if (brick.powerup !== undefined) state.powerups.push(createPowerup(brick, brick.powerup));
  else if (state.upgrades.includes(Constants.Id.RunUpgrade.POWERUP_LUCK) && nextRandom(state) < Constants.Spawn.PowerupDrops.BONUS_CHANCE) {
    const types = Constants.Spawn.PowerupDrops.BONUS;
    const type = types[Math.floor(nextRandom(state) * types.length)] ?? Constants.Id.PowerupType.EXPAND;
    state.powerups.push(createPowerup(brick, type));
  }

  if (brick.behavior === Constants.Id.BrickBehavior.EXPLOSIVE) {
    const centerX = brick.x + brick.width / 2;
    const centerY = brick.y + brick.height / 2;
    const neighbors = state.bricks
      .map((candidate) => ({
        candidate,
        distance: Math.hypot(candidate.x + candidate.width / 2 - centerX, candidate.y + candidate.height / 2 - centerY)
      }))
      .filter(({ candidate, distance }) => isDamageableBrick(candidate) && distance <= Constants.Entities.Brick.Explosion.RADIUS)
      .sort((first, second) => first.distance - second.distance);
    neighbors.forEach(({ candidate }, waveIndex) => {
      if (!state.pendingExplosions.some(({ brick: pending }) => pending === candidate)) {
        state.pendingExplosions.push({
          brick: candidate,
          remaining: Constants.Entities.Brick.Explosion.INITIAL_DELAY_SECONDS + waveIndex * Constants.Entities.Brick.Explosion.STAGGER_SECONDS
        });
      }
    });
  }
  if (brick.behavior === Constants.Id.BrickBehavior.LIGHTNING) {
    const target = state.bricks
      .filter(isDamageableBrick)
      .sort((first, second) => Math.hypot(first.x - brick.x, first.y - brick.y) - Math.hypot(second.x - brick.x, second.y - brick.y))[0];
    if (target !== undefined) {
      spawnLightningArc(state, brick, target);
      const targetIndex = state.bricks.indexOf(target);
      target.hitPoints -= 1;
      if (target.hitPoints <= 0) removeBrick(state, targetIndex);
    }
  }
};

export const hitBrick = (state: GameState, brickIndex: number, ball?: Ball): void => {
  const brick = state.bricks[brickIndex];
  if (brick === undefined) return;
  state.events.push(Constants.Id.GameEvent.BRICK_HIT);
  if (ball !== undefined) state.effects.ballImpact = 1;
  brick.lastHitAt = state.elapsedSeconds;

  const overdriveDamage = ball !== undefined && state.activeEffects.overdriveRemaining > 0 ? Constants.Game.Overdrive.BONUS_DAMAGE : 0;
  const damage = (ball?.isCharged === true ? 1 + Constants.Game.PerfectReturn.BONUS_DAMAGE : 1) + overdriveDamage;
  const hasSuperBall = ball !== undefined && (ball.isSuper || ball.perfectSuper);
  const allowed = ball === undefined || isDirectionalHitAllowed(brick, ball) || hasSuperBall || state.activeEffects.overdriveRemaining > 0;
  if (isDamageableBrick(brick) && allowed) brick.hitPoints -= damage;
  if (ball !== undefined && allowed && brick.behavior === Constants.Id.BrickBehavior.FROZEN) applyFrozenSlow(ball);
  if (ball !== undefined && !hasSuperBall) {
    if (getCollisionAxis(ball, brick) === 'horizontal') ball.velocity.x *= -1;
    else ball.velocity.y *= -1;
  }

  const destroyed = brick.hitPoints <= 0 || (hasSuperBall && isDamageableBrick(brick));
  if (!allowed) state.effects.banner = { text: Constants.Ui.Text.WRONG_SIDE, color: Constants.Render.Colors.ENEMY_BULLET, remaining: Constants.Game.Brick.WRONG_SIDE_BANNER_SECONDS };
  else if (destroyed) {
    state.hitStopRemaining = state.reducedMotion ? 0 : Constants.Game.HIT_STOP_SECONDS;
    removeBrick(state, brickIndex);
  } else if (isDamageableBrick(brick) && brick.maxHitPoints > 1) spawnBrickHitEffects(state, brick);
  if (ball !== undefined) ball.isCharged = false;
};

export const updateBricks = (state: GameState, deltaSeconds: number): void => {
  for (const brick of state.bricks) {
    if (brick.behavior === Constants.Id.BrickBehavior.MOVING || (state.stageModifier === Constants.Id.StageModifier.MOVING_FORTRESS && brick.behavior === Constants.Id.BrickBehavior.NORMAL)) {
      brick.x += brick.moveDirection * Constants.Game.Brick.MOVEMENT_SPEED * deltaSeconds;
      if (Math.abs(brick.x - brick.baseX) >= Constants.Game.Brick.MOVEMENT_RANGE) brick.moveDirection = brick.moveDirection === 1 ? -1 : 1;
    }
    if (brick.behavior === Constants.Id.BrickBehavior.REGENERATING && brick.hitPoints < brick.maxHitPoints && state.elapsedSeconds - brick.lastHitAt > Constants.Game.Brick.REGENERATION_SECONDS) {
      brick.hitPoints += 1;
      brick.lastHitAt = state.elapsedSeconds;
    }
  }
  for (const pending of state.pendingExplosions) pending.remaining -= deltaSeconds;
  const ready = state.pendingExplosions.filter(({ remaining }) => remaining <= 0);
  state.pendingExplosions = state.pendingExplosions.filter(({ remaining }) => remaining > 0);
  for (const pending of ready) {
    const index = state.bricks.indexOf(pending.brick);
    if (index >= 0) removeBrick(state, index);
  }
};
