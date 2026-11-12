import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';
import { clamp01 } from '../utils/math';

export const renderEnemyBullets = (context: CanvasRenderingContext2D, state: GameState): void => {
  context.save();
  context.fillStyle = Constants.Render.Colors.ENEMY_BULLET;
  context.shadowColor = Constants.Render.Colors.ENEMY_BULLET;
  context.shadowBlur = Constants.Render.EnemyBullet.SHADOW_BLUR;
  for (const bullet of state.enemyBullets) {
    const danger = clamp01(
      (bullet.y - Constants.Render.EnemyBullet.DANGER_START_Y) / Constants.Render.EnemyBullet.DANGER_DISTANCE
    );
    const trailTop = bullet.y - Constants.Render.EnemyBullet.TRAIL_LENGTH;
    const gradient = context.createLinearGradient(bullet.x, trailTop, bullet.x, bullet.y + bullet.height);
    gradient.addColorStop(0, Constants.Render.EnemyBullet.TRANSPARENT_TRAIL);
    gradient.addColorStop(1, Constants.Render.Colors.ENEMY_BULLET);
    context.fillStyle = gradient;
    context.fillRect(bullet.x, trailTop, bullet.width, bullet.height + Constants.Render.EnemyBullet.TRAIL_LENGTH);
    context.fillStyle = Constants.Render.Colors.ENEMY_BULLET;
    if (danger > 0) {
      context.globalAlpha = danger * (state.reducedMotion
        ? Constants.Render.EnemyBullet.REDUCED_MOTION_ALPHA
        : Constants.Render.EnemyBullet.BASE_PULSE_ALPHA + Math.sin(state.elapsedSeconds * Constants.Render.EnemyBullet.PULSE_FREQUENCY) * Constants.Render.EnemyBullet.PULSE_ALPHA_RANGE);
      context.beginPath();
      context.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, Constants.Render.EnemyBullet.BASE_DANGER_RADIUS + danger * Constants.Render.EnemyBullet.DANGER_RADIUS_RANGE, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    }
    context.beginPath();
    context.roundRect(bullet.x, bullet.y, bullet.width, bullet.height, Constants.Render.EnemyBullet.CORNER_RADIUS);
    context.fill();
  }
  context.restore();
};
