import { Constants } from '../constants';
import { createTestBrick } from '../test/fixtures';
import {
  BrickSpriteFrames,
  BrickVisualRegistry,
  getBrickRowFilter,
  isBrickBaseSpriteReady,
  isBrickOverlaySheetReady,
  renderBrick
} from './brick';
import type { BrickBehavior } from '../gameplay/types';

describe('BrickVisualRegistry', () => {
  test('provides a focused renderer for every brick behavior', () => {
    const behaviors: BrickBehavior[] = ['normal', 'armored', 'moving', 'explosive', 'indestructible', 'regenerating', 'lightning', 'frozen', 'portal', 'directional'];
    expect(Object.keys(BrickVisualRegistry).sort()).toEqual([...behaviors].sort());
    behaviors.forEach((behavior) => expect(typeof BrickVisualRegistry[behavior]).toBe('function'));
  });

  test('maps every brick behavior to its row-major sprite frame', () => {
    expect(BrickSpriteFrames).toEqual({
      normal: 0,
      armored: 1,
      moving: 2,
      explosive: 3,
      indestructible: 4,
      regenerating: 5,
      lightning: 6,
      frozen: 7,
      portal: 8,
      directional: 9
    });
  });

  test('cycles the configured tint filter by brick row', () => {
    Constants.Render.Colors.BRICK_ROW_FILTERS.forEach((filter, rowIndex) => {
      expect(getBrickRowFilter(rowIndex)).toBe(filter);
      expect(getBrickRowFilter(rowIndex + Constants.Render.Colors.BRICK_ROW_FILTERS.length)).toBe(filter);
    });
  });

  test('composes the base brick with the selected behavior overlay', () => {
    const drawImage = jest.fn();
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      drawImage
    } as unknown as CanvasRenderingContext2D;
    const baseSprite = {
      complete: true,
      naturalWidth: Constants.Render.Sprite.BRICK_FRAME_WIDTH,
      naturalHeight: Constants.Render.Sprite.BRICK_FRAME_HEIGHT
    } as HTMLImageElement;
    const overlaySprites = {
      complete: true,
      naturalWidth: Constants.Render.Sprite.BRICK_FRAME_WIDTH * Constants.Render.Sprite.BRICK_FRAME_COLUMNS,
      naturalHeight: Constants.Render.Sprite.BRICK_FRAME_HEIGHT * 2
    } as HTMLImageElement;

    renderBrick(context, createTestBrick({ behavior: 'portal' }), {
      isFinalTarget: false,
      finalTargetTurns: 0,
      elapsedSeconds: 0,
      reducedMotion: false,
      baseSprite,
      overlaySprites
    });

    expect(isBrickBaseSpriteReady(baseSprite)).toBe(true);
    expect(isBrickOverlaySheetReady(overlaySprites)).toBe(true);
    expect(drawImage).toHaveBeenNthCalledWith(
      4,
      overlaySprites,
      3 * Constants.Render.Sprite.BRICK_FRAME_WIDTH,
      Constants.Render.Sprite.BRICK_FRAME_HEIGHT,
      Constants.Render.Sprite.BRICK_FRAME_WIDTH,
      Constants.Render.Sprite.BRICK_FRAME_HEIGHT,
      0,
      50,
      50,
      20
    );
  });

  test('rotates directional overlays without stretching their aspect ratio', () => {
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      drawImage: jest.fn()
    } as unknown as CanvasRenderingContext2D;
    const baseSprite = { complete: true, naturalWidth: 100, naturalHeight: 40 } as HTMLImageElement;
    const overlaySprites = { complete: true, naturalWidth: 500, naturalHeight: 80 } as HTMLImageElement;

    renderBrick(context, createTestBrick({ behavior: 'directional', direction: 'right' }), {
      isFinalTarget: false,
      finalTargetTurns: 0,
      elapsedSeconds: 0,
      reducedMotion: false,
      baseSprite,
      overlaySprites
    });

    expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
    expect(context.scale).not.toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenLastCalledWith(
      overlaySprites,
      400,
      40,
      100,
      40,
      15,
      56,
      20,
      8
    );
  });

  test('draws a normal brick without an overlay', () => {
    const drawImage = jest.fn();
    const context = {
      save: jest.fn(),
      restore: jest.fn(),
      drawImage
    } as unknown as CanvasRenderingContext2D;
    const baseSprite = { complete: true, naturalWidth: 100, naturalHeight: 40 } as HTMLImageElement;
    const overlaySprites = { complete: true, naturalWidth: 500, naturalHeight: 80 } as HTMLImageElement;

    renderBrick(context, createTestBrick(), {
      isFinalTarget: false,
      finalTargetTurns: 0,
      elapsedSeconds: 0,
      reducedMotion: false,
      baseSprite,
      overlaySprites
    });

    expect(drawImage).toHaveBeenCalledTimes(3);
    expect(drawImage).toHaveBeenNthCalledWith(1, baseSprite, 0, 0, 18, 40, 0, 50, 9, 20);
  });
});
