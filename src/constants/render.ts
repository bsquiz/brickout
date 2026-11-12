export const Render = {
  Performance: {
    BRICK_GLOW_LIMIT: 60
  },
  EnemyBullet: {
    DANGER_START_Y: 330,
    DANGER_DISTANCE: 120,
    TRAIL_LENGTH: 18,
    SHADOW_BLUR: 8,
    PULSE_FREQUENCY: 16,
    REDUCED_MOTION_ALPHA: 0.25,
    BASE_PULSE_ALPHA: 0.2,
    PULSE_ALPHA_RANGE: 0.1,
    BASE_DANGER_RADIUS: 8,
    DANGER_RADIUS_RANGE: 8,
    CORNER_RADIUS: 3,
    TRANSPARENT_TRAIL: 'rgb(244 63 94 / 0%)'
  },
  Background: {
    FALLBACK_COLORS: ['#020617', '#0f172a'],
    GRID_MAX_OPACITY: 0.3,
    GRID_BASE_OPACITY: 0.1,
    GRID_COMBO_OPACITY: 0.012,
    GRID_PULSE_OPACITY: 0.1,
    SLOW_MOTION_SCALE: 0.35,
    TRAVEL_SPEED: 8,
    BALL_SPEED_INFLUENCE: 0.025,
    HORIZONTAL_SPACING: 80,
    VERTICAL_SPACING: 38,
    HORIZON_Y: 120,
    VERTICAL_GRID_START_Y: 150,
    GRID_BOTTOM_OVERSCAN: 40,
    PULSE_RADIUS_SCALE: 0.7,
    PULSE_ALPHA: 0.35,
    PULSE_LINE_WIDTH: 3,
    PULSE_MIN_RADIUS: 8,
    HORIZON_GLOW: 16,
    HORIZON_BASE_ALPHA: 0.28,
    HORIZON_PULSE_ALPHA: 0.18,
    VIGNETTE_INNER_SCALE: 0.24,
    VIGNETTE_OUTER_SCALE: 0.72,
    VIGNETTE_INNER_COLOR: 'rgb(0 0 0 / 0%)',
    VIGNETTE_OUTER_COLOR: 'rgb(0 0 0 / 42%)'
  },
  Effects: {
    Lightning: {
      COLOR: '#67e8f9',
      SEGMENTS: 5,
      JITTER: 6,
      LINE_WIDTH: 3,
      LIFE_ALPHA_MULTIPLIER: 5
    },
    Shockwave: {
      MAX_ALPHA: 0.8,
      BASE_LINE_WIDTH: 2,
      LIFE_LINE_WIDTH: 4
    },
    Vortex: {
      LIFE_ALPHA_MULTIPLIER: 1.8,
      SHADOW_BLUR: 8,
      BASE_RADIUS: 1.5,
      LIFE_RADIUS: 2
    },
    PARTICLE_LIFE_ALPHA_MULTIPLIER: 1.8,
    Fragment: {
      LIFE_ALPHA_MULTIPLIER: 2.5,
      SHADOW_BLUR: 5
    },
    FloatingText: {
      LIFE_ALPHA_MULTIPLIER: 2,
      FONT: 'bold 14px ui-monospace, monospace'
    },
    Banner: {
      FADE_MULTIPLIER: 3,
      BACKGROUND: 'rgb(2 6 23 / 76%)',
      WIDTH: 250,
      HEIGHT: 54,
      X_OFFSET: 125,
      Y_OFFSET: 36,
      TEXT_Y_OFFSET: 9,
      LINE_WIDTH: 2,
      FONT: 'bold 19px ui-monospace, monospace'
    },
    FLASH_MAX_ALPHA: 0.16,
    Danger: {
      INNER_RADIUS: 150,
      OUTER_RADIUS_SCALE: 0.72,
      INNER_COLOR: 'rgb(244 63 94 / 0%)',
      REDUCED_MOTION_ALPHA: 0.12,
      BASE_ALPHA: 0.1,
      PULSE_FREQUENCY: 3,
      PULSE_ALPHA_RANGE: 0.04,
      LIFE_FLASH_ALPHA: 0.22
    }
  },
  Hud: {
    PANEL_BACKGROUND: 'rgb(2 6 23 / 76%)',
    STATUS_BACKGROUND: 'rgb(2 6 23 / 55%)',
    PHASE_BACKGROUND: 'rgb(2 6 23 / 75%)',
    INDICATOR_RING: 'rgb(148 163 184 / 25%)',
    RALLY_BACKGROUND: 'rgb(148 163 184 / 20%)',
    PROGRESS_BACKGROUND: 'rgb(148 163 184 / 18%)',
    GRADE_C: '#94a3b8',
    GRADE_A: '#facc15'
  },
  Powerup: {
    PILL_BACKGROUND: 'rgb(2 6 23 / 88%)',
    PILL_LINE_WIDTH: 1.5,
    PILL_INSET: 0.75,
    GLOW_BLUR: 7,
    ICON_BOUNDS_WIDTH: 24,
    ICON_BOUNDS_HEIGHT: 18
  },
  Alien: {
    GLOW_BLUR: 10,
    BOSS_HEALTH_Y_OFFSET: 9,
    BOSS_HEALTH_HEIGHT: 5,
    BOSS_HEALTH_BACKGROUND: 'rgb(15 23 42 / 85%)'
  },
  Sprite: {
    BALL_SIZE: 10,
    BALL_FRAME_COUNT: 3,
    ALIEN_FRAME_WIDTH: 96,
    ALIEN_FRAME_HEIGHT: 48,
    ALIEN_FRAME_COLUMNS: 4,
    ALIEN_FRAME_ROWS: 6,
    ALIEN_IDLE_FRAME_COUNT: 3,
    ALIEN_ATTACK_FRAME: 3,
    BRICK_FRAME_WIDTH: 100,
    BRICK_FRAME_HEIGHT: 40,
    BRICK_FRAME_COLUMNS: 5,
    BRICK_FRAME_COUNT: 10,
    BRICK_CAP_WIDTH: 18,
    POWERUP_FRAME_SIZE: 64,
    POWERUP_FRAME_COLUMNS: 4,
    POWERUP_FRAME_COUNT: 11,
    POWERUP_ICON_SIZE: 18,
    PADDLE_FRAME_WIDTH: 80,
    PADDLE_FRAME_HEIGHT: 20,
    PADDLE_FRAME_COUNT: 6
  },
  Colors: {
    BACKGROUND: '#01030d',
    FOREGROUND: '#f5fbff',
    MUTED: '#9eb6d4',
    PARTICLE: '#ffffff',
    SHIELD: '#22d3ee',
    STICKY: '#2dd4bf',
    LASER: '#ff3cac',
    ALIEN: '#b7ff2a',
    ENEMY_BULLET: '#ff3864',
    LEVEL_BACKGROUNDS: [
      ['#01030d', '#071426'],
      ['#08031a', '#24084a'],
      ['#02131e', '#063545'],
      ['#16050d', '#3d0b2a']
    ],
    BRICK_ROWS: ['#f5fbff', '#20d9ff', '#ff3cac', '#65ff8f', '#ffe44d', '#ff8a34'],
    BRICK_ROW_FILTERS: [
      'saturate(0) brightness(1.65)',
      'none',
      'hue-rotate(140deg) saturate(1.4) brightness(1.05)',
      'hue-rotate(-45deg) saturate(1.25) brightness(1.05)',
      'hue-rotate(-125deg) saturate(1.35) brightness(1.15)',
      'hue-rotate(-150deg) saturate(1.35) brightness(1.12)'
    ],
    SUPER_BALL: '#ffe44d',
    CHARGED_BALL: '#fde047',
    FROZEN_BALL: '#bae6fd',
    SLOW_MOTION: '#60a5fa',
    TRAIL_NEON: '#22d3ee',
    TRAIL_EMBER: '#fb923c',
    POWERUP_ORANGE: '#fb923c',
    DARK_INK: '#020617'
  },
  Font: {
    HUD: '16px ui-monospace, SFMono-Regular, Menlo, monospace',
    SMALL: '12px ui-monospace, SFMono-Regular, Menlo, monospace',
    MESSAGE: 'bold 38px ui-monospace, SFMono-Regular, Menlo, monospace',
    DEBUG: '13px ui-monospace, SFMono-Regular, Menlo, monospace'
  }
} as const;
