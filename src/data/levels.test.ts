import { rawLevels } from './levels';
import { validateLevels } from './validateLevel';

describe('handcrafted levels', () => {
  test('finishes with a filled field above a centered indestructible barrier', () => {
    const levels = validateLevels(rawLevels);
    const stage = levels.at(-1);
    expect(stage).toHaveLength(11);
    expect(stage?.slice(0, 8).flat().every((brick) => brick !== null)).toBe(true);
    expect(stage?.[8]?.every((brick) => brick === null)).toBe(true);
    expect(stage?.[9]?.every((brick) => brick === null)).toBe(true);
    expect(stage?.[10]?.[0]).toBeNull();
    expect(stage?.[10]?.[1]).toBeNull();
    expect(stage?.[10]?.slice(2, 8).every((brick) => brick?.behavior === 'indestructible')).toBe(true);
    expect(stage?.[10]?.[8]).toBeNull();
    expect(stage?.[10]?.[9]).toBeNull();
  });
});
