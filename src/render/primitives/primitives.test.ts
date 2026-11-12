import { fillPlayableArea } from './area';
import { drawProgressBar } from './progressBar';
import { drawSpriteFrame } from './sprite';
import { applyCenteredTransform } from './transform';

const createContext = (): CanvasRenderingContext2D => ({
  drawImage: jest.fn(),
  fillRect: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  scale: jest.fn()
} as unknown as CanvasRenderingContext2D);

describe('render primitives', () => {
  test('draws a row-major sprite frame', () => {
    const context = createContext();
    const sprites = {} as HTMLImageElement;
    drawSpriteFrame(context, sprites, {
      frame: 5,
      columns: 4,
      frameWidth: 16,
      frameHeight: 8,
      destination: { x: 10, y: 20, width: 32, height: 16 }
    });
    expect(context.drawImage).toHaveBeenCalledWith(sprites, 16, 8, 16, 8, 10, 20, 32, 16);
  });

  test('applies scale and rotation around a rectangle center', () => {
    const context = createContext();
    applyCenteredTransform(context, { x: 10, y: 20, width: 40, height: 20 }, {
      scaleX: 1.2,
      scaleY: 0.8,
      rotation: 0.5,
      offsetY: 2,
      alignScaleToRotation: true
    });
    expect(context.translate).toHaveBeenNthCalledWith(1, 30, 32);
    expect(context.rotate).toHaveBeenNthCalledWith(1, 0.5);
    expect(context.scale).toHaveBeenCalledWith(1.2, 0.8);
    expect(context.rotate).toHaveBeenNthCalledWith(2, -0.5);
    expect(context.translate).toHaveBeenNthCalledWith(2, -30, -30);
  });

  test('draws a clamped progress bar', () => {
    const context = createContext();
    drawProgressBar(context, { x: 2, y: 3, width: 100, height: 5, progress: 1.5, backgroundColor: '#000', foregroundColor: '#fff' });
    expect(context.fillRect).toHaveBeenNthCalledWith(1, 2, 3, 100, 5);
    expect(context.fillRect).toHaveBeenNthCalledWith(2, 2, 3, 100, 5);
  });

  test('fills only the playable arena below the HUD', () => {
    const context = createContext();
    fillPlayableArea(context, { width: 500, height: 600, hudHeight: 50, orientation: 'portrait' });
    expect(context.fillRect).toHaveBeenCalledWith(0, 50, 500, 550);
  });
});
