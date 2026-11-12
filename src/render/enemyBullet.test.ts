import { Constants } from '../constants';
import { createTestEnemyBullet, createTestGameState } from '../test/fixtures';
import { renderEnemyBullets } from './enemyBullet';

describe('renderEnemyBullets', () => {
  test('draws a configured trail and danger glow for nearby bullets', () => {
    const gradient = { addColorStop: jest.fn() } as unknown as CanvasGradient;
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      createLinearGradient: jest.fn(() => gradient),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      roundRect: jest.fn(),
      fill: jest.fn()
    } as unknown as CanvasRenderingContext2D;
    const bullet = createTestEnemyBullet({ y: Constants.Render.EnemyBullet.DANGER_START_Y + Constants.Render.EnemyBullet.DANGER_DISTANCE });
    const state = createTestGameState({ enemyBullets: [bullet], reducedMotion: true });

    renderEnemyBullets(context, state);

    expect(context.createLinearGradient).toHaveBeenCalledWith(
      bullet.x,
      bullet.y - Constants.Render.EnemyBullet.TRAIL_LENGTH,
      bullet.x,
      bullet.y + bullet.height
    );
    expect(context.arc).toHaveBeenCalled();
    expect(context.roundRect).toHaveBeenCalledWith(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height,
      Constants.Render.EnemyBullet.CORNER_RADIUS
    );
  });
});
