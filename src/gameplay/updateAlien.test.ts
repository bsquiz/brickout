import { hitAlienWithBall, updateAlienThreat } from './updateAlien';
import { createTestAlien, createTestBall, createTestEnemyBullet, createTestGameState } from '../test/fixtures';
import { Constants } from '../constants';

describe('updateAlienThreat', () => {
  test('warns from a chosen edge before spawning', () => {
    const state = createTestGameState({ alienSpawnRemaining: 1.05 });
    updateAlienThreat(state, 0);
    expect(state.alienWarningSide).not.toBeNull();
    expect(state.events).toContain('alien-warning');
    updateAlienThreat(state, 1.1);
    expect(state.alien).not.toBeNull();
    expect(state.alienWarningSide).toBeNull();
  });

  test('fires while crossing the visible board', () => {
    const state = createTestGameState({ alien: createTestAlien({ shootRemaining: 0 }) });
    expect(updateAlienThreat(state, 0)).toBe(false);
    expect(state.enemyBullets).toHaveLength(1);
    expect(state.events).toContain('alien-shot');
    expect(state.alien?.shotAnimationRemaining).toBe(Constants.Animation.Alien.ATTACK_FRAME_SECONDS);
    updateAlienThreat(state, Constants.Animation.Alien.ATTACK_FRAME_SECONDS);
    expect(state.alien?.shotAnimationRemaining).toBe(0);
  });

  test('reports a paddle hit from an enemy bullet', () => {
    const state = createTestGameState({
      alienSpawnRemaining: 100,
      enemyBullets: [createTestEnemyBullet()]
    });
    expect(updateAlienThreat(state, 0)).toBe(true);
    expect(state.enemyBullets).toHaveLength(0);
  });

  test('lets a shield absorb an enemy bullet', () => {
    const state = createTestGameState({
      alienSpawnRemaining: 100,
      enemyBullets: [createTestEnemyBullet()]
    });
    state.activeEffects.shieldCharges = 1;
    expect(updateAlienThreat(state, 0)).toBe(false);
    expect(state.activeEffects.shieldCharges).toBe(0);
  });

  test('bosses alternate between 45-degree left, center, and 45-degree right shots', () => {
    const state = createTestGameState({ alien: createTestAlien({ isBoss: true, hitPoints: 6, maxHitPoints: 6, shootRemaining: 0 }) });
    updateAlienThreat(state, 0);
    if (state.alien !== null) state.alien.shootRemaining = 0;
    updateAlienThreat(state, 0);
    if (state.alien !== null) state.alien.shootRemaining = 0;
    updateAlienThreat(state, 0);
    expect(state.enemyBullets).toHaveLength(3);
    expect(state.enemyBullets[0]?.velocityX).toBeCloseTo(-Constants.Entities.EnemyBullet.SPEED);
    expect(state.enemyBullets[1]?.velocityX).toBeCloseTo(0);
    expect(state.enemyBullets[2]?.velocityX).toBeCloseTo(Constants.Entities.EnemyBullet.SPEED);
    expect(state.alien?.shootRemaining).toBe(1.44);
  });

  test('regular aliens use the reduced firing rate', () => {
    const state = createTestGameState({ alien: createTestAlien({ shootRemaining: 0 }) });
    updateAlienThreat(state, 0);
    expect(state.alien?.shootRemaining).toBe(2.3);
  });

  test('awards a near miss once after a bullet passes the paddle', () => {
    const state = createTestGameState({
      alienSpawnRemaining: 100,
      enemyBullets: [createTestEnemyBullet({ x: 202, y: 501 })]
    });
    updateAlienThreat(state, 0);
    expect(state.score).toBe(25);
    expect(state.events).toContain('near-miss');
  });

  test('requires repeated boss hits and drops power-ups on defeat', () => {
    const boss = createTestAlien({ isBoss: true, hitPoints: 2, maxHitPoints: 2 });
    const ball = createTestBall({ x: 110, y: 240 });
    const state = createTestGameState({ alien: boss, ball, enemyBullets: [createTestEnemyBullet({ y: 300 })] });
    expect(hitAlienWithBall(state, ball)).toBe(true);
    expect(state.alien).toBe(boss);
    expect(state.enemyBullets).toHaveLength(1);
    expect(hitAlienWithBall(state, ball)).toBe(true);
    expect(state.alien).toBeNull();
    expect(state.bossDefeated).toBe(true);
    expect(state.powerups).toHaveLength(3);
    expect(state.enemyBullets).toHaveLength(0);
  });
});
