import { Constants } from '../constants';
import { createTestGameState } from '../test/fixtures';
import { PaddleSpriteFrames, getPaddleVisual, renderPaddle } from './paddle';

const inactiveEffects = { stickyRemaining: 0, laserRemaining: 0 };

describe('paddle sprite selection', () => {
  test('uses the normal artwork for every size-only paddle variation', () => {
    expect(PaddleSpriteFrames.normal).toBe(0);
    expect(PaddleSpriteFrames.sticky).toBe(1);
    expect(PaddleSpriteFrames.laser).toBe(2);
    expect(PaddleSpriteFrames.shrunken).toBe(0);
    expect(PaddleSpriteFrames.expanded).toBe(0);
  });

  test('selects size-specific artwork', () => {
    expect(getPaddleVisual(Constants.Entities.Paddle.WIDTH, inactiveEffects)).toBe('normal');
    expect(getPaddleVisual(40, inactiveEffects)).toBe('shrunken');
    expect(getPaddleVisual(160, inactiveEffects)).toBe('expanded');
  });

  test('active equipment takes priority over paddle size', () => {
    expect(getPaddleVisual(160, { ...inactiveEffects, stickyRemaining: 1 })).toBe('sticky');
    expect(getPaddleVisual(40, { ...inactiveEffects, stickyRemaining: 1, laserRemaining: 1 })).toBe('laser');
  });

  test.each([40, 160])('scales frame zero to a %i pixel paddle', (paddleWidth) => {
    const state = createTestGameState();
    const drawImage = jest.fn();
    const context = {
      save: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      restore: jest.fn(),
      drawImage
    } as unknown as CanvasRenderingContext2D;
    const sprites = { complete: true, naturalWidth: Constants.Render.Sprite.PADDLE_FRAME_WIDTH * Constants.Render.Sprite.PADDLE_FRAME_COUNT } as HTMLImageElement;

    renderPaddle(context, { ...state.paddle, width: paddleWidth }, state.activeEffects, state.effects, true, sprites);

    expect(drawImage).toHaveBeenCalledWith(
      sprites,
      0,
      0,
      Constants.Render.Sprite.PADDLE_FRAME_WIDTH,
      Constants.Render.Sprite.PADDLE_FRAME_HEIGHT,
      expect.any(Number),
      expect.any(Number),
      paddleWidth,
      state.paddle.height
    );
  });
});
