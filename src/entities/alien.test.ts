import { Constants } from '../constants';
import { createAlien, createEnemyBullet, getAlienKind, getNextAlienSpawnDelay } from './alien';
import { AlienRegistry } from './alienRegistry';

describe('alien entity', () => {
  test('can enter from either side of the board', () => {
    const fromLeft = createAlien({ random: () => 0 });
    const fromRight = createAlien({ random: () => 0.75 });
    expect(fromLeft.x).toBeLessThan(0);
    expect(fromLeft.velocityX).toBeGreaterThan(0);
    expect(fromRight.x).toBe(Constants.Game.Arena.BASELINE.width);
    expect(fromRight.velocityX).toBeLessThan(0);
  });

  test('creates a centered downward bullet', () => {
    const alien = createAlien({ random: () => 0 });
    const bullet = createEnemyBullet(alien);
    expect(bullet.x + bullet.width / 2).toBe(alien.x + alien.width / 2);
    expect(bullet.y).toBe(alien.y + alien.height);
  });

  test('keeps randomized spawn delays inside the configured window', () => {
    expect(getNextAlienSpawnDelay(() => 0)).toBe(8);
    expect(getNextAlienSpawnDelay(() => 1)).toBe(16);
  });

  test('unlocks new alien kinds as levels advance', () => {
    expect(getAlienKind(0, () => 0.99)).toBe('scout');
    expect(getAlienKind(8, () => 0.99)).toBe('thief');
  });

  test('creates shielded aliens with two hit points', () => {
    expect(createAlien({ random: () => 0, entrySide: 'left', kind: 'shielded' }).hitPoints).toBe(2);
  });

  test('creates regular and boss aliens at the enlarged dimensions', () => {
    const regular = createAlien({ random: () => 0, entrySide: 'left' });
    const boss = createAlien({ random: () => 0, entrySide: 'left', isBoss: true });

    expect(regular).toEqual(expect.objectContaining({
      width: Constants.Entities.Alien.WIDTH,
      height: Constants.Entities.Alien.HEIGHT
    }));
    expect(boss).toEqual(expect.objectContaining({
      width: Constants.Entities.Alien.BOSS_WIDTH,
      height: Constants.Entities.Alien.BOSS_HEIGHT
    }));
  });

  test('defines gameplay and rendering metadata for every alien kind', () => {
    expect(Object.keys(AlienRegistry).sort()).toEqual(['boss', 'gunner', 'scout', 'shielded', 'splitter', 'thief']);
    Object.values(AlienRegistry).forEach((definition) => {
      expect(definition.width).toBeGreaterThan(0);
      expect(definition.spriteRow).toBeGreaterThanOrEqual(0);
    });
  });
});
