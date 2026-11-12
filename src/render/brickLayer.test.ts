import { createTestBrick, createTestGameState } from '../test/fixtures';
import { createBrickLayerCache, isDynamicBrick, renderCachedBrickLayer } from './brickLayer';

const createTestContext = (): CanvasRenderingContext2D => ({
  clearRect: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  roundRect: jest.fn(),
  fill: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn()
} as unknown as CanvasRenderingContext2D);

describe('brick layer cache', () => {
  afterEach(() => jest.restoreAllMocks());

  test('reuses the stationary brick layer until visual state changes', () => {
    const cacheContext = createTestContext();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(cacheContext);
    const cache = createBrickLayerCache();
    const output = createTestContext();
    const state = createTestGameState({
      bricks: [createTestBrick(), createTestBrick({ x: 50, baseX: 50 })]
    });

    renderCachedBrickLayer(output, state, cache, null);
    renderCachedBrickLayer(output, state, cache, null);

    expect(cacheContext.clearRect).toHaveBeenCalledTimes(1);
    expect(cacheContext.fill).toHaveBeenCalledTimes(2);
    expect(output.drawImage).toHaveBeenCalledTimes(2);

    state.bricks[0]!.hitPoints = 2;
    state.bricks[0]!.maxHitPoints = 2;
    renderCachedBrickLayer(output, state, cache, null);
    expect(cacheContext.clearRect).toHaveBeenCalledTimes(2);
  });

  test('keeps moving and highlighted final bricks out of the cached layer', () => {
    const moving = createTestBrick({ behavior: 'moving' });
    const normal = createTestBrick({ x: 50, baseX: 50 });
    const state = createTestGameState({ bricks: [moving, normal] });

    expect(isDynamicBrick(state, moving, null)).toBe(true);
    expect(isDynamicBrick(state, normal, normal)).toBe(true);
    expect(isDynamicBrick(state, normal, null)).toBe(false);
  });
});
