import { Constants } from '../constants';
import { createTestPowerup } from '../test/fixtures';
import { drawPowerupPill, isPowerupSpriteSheetReady, PowerupSpriteFrames, renderPowerup } from './powerup';

describe('powerup sprite rendering', () => {
  test('maps every sprite-backed powerup type to its row-major frame', () => {
    expect(PowerupSpriteFrames).toEqual({
      shrink: 0,
      expand: 1,
      'super-ball': 2,
      multiball: 3,
      sticky: 4,
      'slow-motion': 5,
      shield: 6,
      laser: 7,
      'score-100': 8,
      'score-200': 9,
      'score-500': 10
    });
  });

  test('draws the speed-up chevrons when the spritesheet has no matching frame', () => {
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      roundRect: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      drawImage: jest.fn()
    } as unknown as CanvasRenderingContext2D;
    const sprites = {
      complete: true,
      naturalWidth: Constants.Render.Sprite.POWERUP_FRAME_SIZE * Constants.Render.Sprite.POWERUP_FRAME_COLUMNS,
      naturalHeight: Constants.Render.Sprite.POWERUP_FRAME_SIZE * 3
    } as HTMLImageElement;

    renderPowerup(context, createTestPowerup({ type: 'speed-up' }), sprites);

    expect(context.drawImage).not.toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledTimes(2);
    expect(context.stroke).toHaveBeenCalledTimes(3);
  });

  test('draws the selected frame centered on the pickup bounds', () => {
    const drawImage = jest.fn();
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      roundRect: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      drawImage
    } as unknown as CanvasRenderingContext2D;
    const sprites = {
      complete: true,
      naturalWidth: Constants.Render.Sprite.POWERUP_FRAME_SIZE * Constants.Render.Sprite.POWERUP_FRAME_COLUMNS,
      naturalHeight: Constants.Render.Sprite.POWERUP_FRAME_SIZE * 3
    } as HTMLImageElement;
    const powerup = createTestPowerup({ type: 'score-500' });

    renderPowerup(context, powerup, sprites);

    expect(isPowerupSpriteSheetReady(sprites)).toBe(true);
    expect(drawImage).toHaveBeenCalledWith(
      sprites,
      2 * Constants.Render.Sprite.POWERUP_FRAME_SIZE,
      2 * Constants.Render.Sprite.POWERUP_FRAME_SIZE,
      Constants.Render.Sprite.POWERUP_FRAME_SIZE,
      Constants.Render.Sprite.POWERUP_FRAME_SIZE,
      powerup.x + (powerup.width - Constants.Render.Sprite.POWERUP_ICON_SIZE) / 2,
      powerup.y + (powerup.height - Constants.Render.Sprite.POWERUP_ICON_SIZE) / 2,
      Constants.Render.Sprite.POWERUP_ICON_SIZE,
      Constants.Render.Sprite.POWERUP_ICON_SIZE
    );
  });

  test('draws a rounded pill around the centered icon', () => {
    const context = {
      beginPath: jest.fn(),
      roundRect: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn()
    } as unknown as CanvasRenderingContext2D;
    const powerup = createTestPowerup();
    const inset = Constants.Render.Powerup.PILL_INSET;

    drawPowerupPill(context, powerup, '#ffffff');

    expect(context.roundRect).toHaveBeenCalledWith(
      powerup.x + inset,
      powerup.y + inset,
      powerup.width - inset * 2,
      powerup.height - inset * 2,
      (powerup.height - inset * 2) / 2
    );
    expect(context.fill).toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalled();
  });

  test('rejects incomplete sprite assets so vector fallback can render', () => {
    expect(isPowerupSpriteSheetReady({ complete: false, naturalWidth: 256, naturalHeight: 192 } as HTMLImageElement)).toBe(false);
  });
});
