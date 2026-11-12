import { getArenaDimensions, getBrickWidth, getStageArenaDimensions, getStageShape, remapRectangleCenter } from './arena';

describe('responsive arena', () => {
  test('selects tall and wide logical arenas from viewport orientation', () => {
    expect(getArenaDimensions(390, 844).orientation).toBe('portrait');
    expect(getArenaDimensions(844, 390).orientation).toBe('landscape');
  });

  test('keeps ten brick columns across either arena', () => {
    expect(getBrickWidth(getArenaDimensions(390, 844))).toBe(37.5);
    expect(getBrickWidth(getArenaDimensions(844, 390))).toBe(67.5);
  });

  test('preserves normalized entity centers during rotation', () => {
    const portrait = getArenaDimensions(390, 844);
    const landscape = getArenaDimensions(844, 390);
    const entity = { x: 182.5, y: 445, width: 10, height: 10 };
    remapRectangleCenter(entity, portrait, landscape);
    expect(entity.x + entity.width / 2).toBeCloseTo(landscape.width / 2);
  });

  test('cycles through wider and taller arena profiles between levels', () => {
    const base = getArenaDimensions(390, 844);
    const wide = getStageArenaDimensions(base, 1);
    const tall = getStageArenaDimensions(base, 2);
    expect(getStageShape(1).id).toBe('wide');
    expect(wide.width).toBeGreaterThan(base.width);
    expect(wide.height).toBe(base.height);
    expect(getStageShape(2).id).toBe('tall');
    expect(tall.width).toBe(base.width);
    expect(tall.height).toBeGreaterThan(base.height);
  });
});
