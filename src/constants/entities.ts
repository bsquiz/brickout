export const Entities = {
  Ball: {
    SIZE: 10,
    SPEED: 240
  },
  Paddle: {
    WIDTH: 80,
    HEIGHT: 20,
    SPEED: 300,
    SHRINK_MULTIPLIER: 0.5,
    EXPAND_MULTIPLIER: 2
  },
  Brick: {
    HEIGHT: 20,
    POINTS: 10,
    ARMORED_MIN_HIT_POINTS: 3,
    REGENERATING_MIN_HIT_POINTS: 3,
    Explosion: {
      RADIUS: 85,
      INITIAL_DELAY_SECONDS: 0.08,
      STAGGER_SECONDS: 0.06
    }
  },
  Powerup: {
    WIDTH: 32,
    HEIGHT: 20,
    SPEED: 120,
    DROP_GAP: 8
  },
  Projectile: {
    WIDTH: 4,
    HEIGHT: 14,
    SPEED: 420,
    FIRE_INTERVAL_SECONDS: 0.45
  },
  Alien: {
    WIDTH: 92,
    HEIGHT: 44,
    Y_RATIO: 0.47,
    SPEED: 82,
    FIRE_INTERVAL_SECONDS: 2.3,
    POINTS: 250,
    MIN_SPAWN_SECONDS: 8,
    MAX_SPAWN_SECONDS: 16,
    BOSS_WIDTH: 176,
    BOSS_HEIGHT: 76,
    BOSS_SPEED: 52,
    BOSS_FIRE_INTERVAL_SECONDS: 1.44,
    BOSS_POINTS: 1000
  },
  AlienVariant: {
    SHIELDED_HEALTH: 2,
    GUNNER_SPREAD: 72,
    SWARM_SPAWN_MULTIPLIER: 0.55,
    BULLET_DAMPENER_MULTIPLIER: 0.72
  },
  EnemyBullet: {
    WIDTH: 6,
    HEIGHT: 14,
    SPEED: 190,
    BOSS_PATTERN_ANGLES_DEGREES: [-45, 0, 45]
  }
} as const;
