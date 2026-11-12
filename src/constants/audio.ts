export const Audio = {
  Music: {
    NORMAL_PLAYBACK_RATE: 1,
    SLOW_PLAYBACK_RATE: 0.7,
    URGENT_PLAYBACK_RATE: 1.07,
    RATE_TRANSITION_PER_SECOND: 4.5
  },
  Volume: {
    EFFECT: 0.075,
    NOISE: 0.04
  },
  Frequency: {
    WALL: 300,
    PADDLE: 600,
    BRICK: 900,
    POWERUP: 400,
    LASER: 720,
    ALIEN_SHOT: 180,
    ALIEN_WARNING: 130,
    ALIEN_HIT: 1080,
    LIFE_LOST: 220,
    LEVEL_WON: 700
  },
  BRICK_SCALE: [0, 72, 120, 168, 240, 312],
  LEVEL_CLEAR_CHORD: [1, 1.25, 1.5],
  Duration: {
    CLICK: 0.045,
    HIT: 0.075,
    POWERUP_NOTE: 0.09,
    LASER: 0.07,
    WARNING: 0.12,
    EXPLOSION: 0.28,
    CHORD: 0.34
  }
} as const;
