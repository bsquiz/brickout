import { Constants } from '../constants';
import { AlienRegistry } from '../entities';
import { createTestAlien } from '../test/fixtures';
import { renderAlien } from './alien';
import { getAlienAnimationFrame, isAlienSpriteSheetReady } from './alienSprite';

const createTestContext = (): CanvasRenderingContext2D => ({
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  drawImage: jest.fn(),
  fillRect: jest.fn()
} as unknown as CanvasRenderingContext2D);

const createTestSprites = (): HTMLImageElement => ({
  complete: true,
  naturalWidth: Constants.Render.Sprite.ALIEN_FRAME_WIDTH * Constants.Render.Sprite.ALIEN_FRAME_COLUMNS,
  naturalHeight: Constants.Render.Sprite.ALIEN_FRAME_HEIGHT * Constants.Render.Sprite.ALIEN_FRAME_ROWS
} as HTMLImageElement);

describe('alien sprite rendering', () => {
  test('maps every alien kind to a dedicated animation row', () => {
    expect(Object.fromEntries(Object.entries(AlienRegistry).map(([kind, definition]) => [kind, definition.spriteRow]))).toEqual({
      scout: 0, gunner: 1, shielded: 2, splitter: 3, thief: 4, boss: 5
    });
  });

  test('draws the selected alien frame at entity dimensions', () => {
    const context = createTestContext();
    const sprites = createTestSprites();
    const alien = createTestAlien({ kind: 'thief' });

    renderAlien(context, alien, { reducedMotion: true, sprites });

    expect(isAlienSpriteSheetReady(sprites)).toBe(true);
    expect(context.drawImage).toHaveBeenCalledWith(
      sprites,
      0,
      Constants.Render.Sprite.ALIEN_FRAME_HEIGHT * 4,
      Constants.Render.Sprite.ALIEN_FRAME_WIDTH,
      Constants.Render.Sprite.ALIEN_FRAME_HEIGHT,
      alien.x,
      alien.y,
      alien.width,
      alien.height
    );
  });

  test('cycles idle frames and shows the attack frame after firing', () => {
    const alien = createTestAlien();
    expect(getAlienAnimationFrame(alien, 0, false)).toBe(0);
    expect(getAlienAnimationFrame(alien, 0.13, false)).toBe(1);
    expect(getAlienAnimationFrame(alien, 0.26, false)).toBe(2);
    expect(getAlienAnimationFrame(alien, 0.26, true)).toBe(0);
    alien.shotAnimationRemaining = 0.1;
    expect(getAlienAnimationFrame(alien, 0.26, true)).toBe(Constants.Render.Sprite.ALIEN_ATTACK_FRAME);
  });

  test('keeps the code-rendered health bar over the boss sprite', () => {
    const context = createTestContext();
    const boss = createTestAlien({ kind: 'boss', isBoss: true, width: 88, height: 38, hitPoints: 3, maxHitPoints: 6 });

    renderAlien(context, boss, { reducedMotion: true, sprites: createTestSprites() });

    expect(context.fillRect).toHaveBeenNthCalledWith(
      1,
      boss.x,
      boss.y - Constants.Render.Alien.BOSS_HEALTH_Y_OFFSET,
      boss.width,
      Constants.Render.Alien.BOSS_HEALTH_HEIGHT
    );
    expect(context.fillRect).toHaveBeenNthCalledWith(
      2,
      boss.x,
      boss.y - Constants.Render.Alien.BOSS_HEALTH_Y_OFFSET,
      boss.width / 2,
      Constants.Render.Alien.BOSS_HEALTH_HEIGHT
    );
  });

  test('applies bobbing and damage squash while motion is enabled', () => {
    const context = createTestContext();
    const alien = createTestAlien();
    const elapsedSeconds = Math.PI / 10;

    renderAlien(context, alien, { elapsedSeconds, damageFlash: 1, sprites: createTestSprites() });

    expect(context.translate).toHaveBeenNthCalledWith(1, alien.x + alien.width / 2, alien.y + alien.height / 2 + 1.5);
    const [scaleX, scaleY] = (context.scale as jest.Mock).mock.calls[0] as [number, number];
    expect(scaleX).toBeCloseTo(1.14);
    expect(scaleY).toBeCloseTo(0.86);
    expect(context.save).toHaveBeenCalledTimes(1);
    expect(context.restore).toHaveBeenCalledTimes(1);
  });

  test('flickers at critical health unless reduced motion is enabled', () => {
    const animatedContext = createTestContext();
    const reducedContext = createTestContext();
    const alien = createTestAlien({ hitPoints: 1, maxHitPoints: 3 });

    renderAlien(animatedContext, alien, { elapsedSeconds: 0, sprites: createTestSprites() });
    renderAlien(reducedContext, alien, { elapsedSeconds: 0, reducedMotion: true, sprites: createTestSprites() });

    expect(animatedContext.globalAlpha).toBeCloseTo(0.62);
    expect(reducedContext.globalAlpha).not.toBe(0.62);
    expect(reducedContext.scale).not.toHaveBeenCalled();
  });

  test('keeps healthy aliens fully opaque', () => {
    const context = createTestContext();

    renderAlien(context, createTestAlien({ hitPoints: 2, maxHitPoints: 3 }), { sprites: createTestSprites() });

    expect(context.globalAlpha).not.toBe(0.62);
  });

  test('rejects incomplete sprite assets so vector fallback can render', () => {
    expect(isAlienSpriteSheetReady({ complete: false, naturalWidth: 384, naturalHeight: 288 } as HTMLImageElement)).toBe(false);
  });
});
