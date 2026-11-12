import { Constants } from '../constants';
import { getHapticKind } from './hapticsService';

describe('haptic event mapping', () => {
  test('prioritizes major feedback over smaller impacts', () => {
    expect(getHapticKind(['brick-hit', 'life-lost'])).toBe(Constants.Haptics.Kind.HEAVY);
    expect(getHapticKind(['perfect-return'])).toBe(Constants.Haptics.Kind.MEDIUM);
    expect(getHapticKind(['near-miss'])).toBe(Constants.Haptics.Kind.LIGHT);
    expect(getHapticKind([])).toBeNull();
  });
});
