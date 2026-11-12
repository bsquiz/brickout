import { getCollisionAxis, intersects } from './collisions';

describe('collisions', () => {
  test('uses full rectangles rather than object centers', () => {
    expect(intersects({ x: 8, y: 8, width: 4, height: 4 }, { x: 10, y: 10, width: 10, height: 10 })).toBe(true);
  });

  test('identifies the shallowest collision axis', () => {
    expect(getCollisionAxis({ x: 46, y: 55, width: 10, height: 10 }, { x: 0, y: 50, width: 50, height: 20 })).toBe('horizontal');
    expect(getCollisionAxis({ x: 20, y: 46, width: 10, height: 10 }, { x: 0, y: 50, width: 50, height: 20 })).toBe('vertical');
  });
});
