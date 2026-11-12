import { Constants } from '../constants';
import { getGridOpacity } from './background';

describe('neon background intensity', () => {
  test('responds to combo energy and clamps excessive bloom', () => {
    expect(getGridOpacity(0, 0)).toBe(Constants.Render.Background.GRID_BASE_OPACITY);
    expect(getGridOpacity(5, 0)).toBeGreaterThan(getGridOpacity(0, 0));
    expect(getGridOpacity(100, 10)).toBe(Constants.Render.Background.GRID_MAX_OPACITY);
  });
});
