export const Id = {
  GameEvent: {
    WALL_HIT: 'wall-hit',
    PADDLE_HIT: 'paddle-hit',
    PERFECT_RETURN: 'perfect-return',
    BRICK_HIT: 'brick-hit',
    POWERUP: 'powerup',
    LASER: 'laser',
    ALIEN_WARNING: 'alien-warning',
    ALIEN_SHOT: 'alien-shot',
    ALIEN_HIT: 'alien-hit',
    NEAR_MISS: 'near-miss',
    LIFE_LOST: 'life-lost',
    LEVEL_WON: 'level-won'
  },
  GamePhase: {
    MENU: 'menu',
    COUNTDOWN: 'countdown',
    PLAYING: 'playing',
    PAUSED: 'paused',
    UPGRADE: 'upgrade',
    LIFE_LOST: 'life-lost',
    LEVEL_WON: 'level-won',
    GAME_OVER: 'game-over',
    GAME_WON: 'game-won'
  },
  PowerupType: {
    SHRINK: 'shrink',
    EXPAND: 'expand',
    SUPER_BALL: 'super-ball',
    MULTIBALL: 'multiball',
    STICKY: 'sticky',
    SLOW_MOTION: 'slow-motion',
    SHIELD: 'shield',
    LASER: 'laser',
    SPEED_UP: 'speed-up',
    SCORE_100: 'score-100',
    SCORE_200: 'score-200',
    SCORE_500: 'score-500'
  },
  BrickBehavior: {
    NORMAL: 'normal',
    ARMORED: 'armored',
    MOVING: 'moving',
    EXPLOSIVE: 'explosive',
    INDESTRUCTIBLE: 'indestructible',
    REGENERATING: 'regenerating',
    LIGHTNING: 'lightning',
    FROZEN: 'frozen',
    BOOST: 'boost',
    PORTAL: 'portal',
    DIRECTIONAL: 'directional'
  },
  BrickDirection: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },
  AlienKind: {
    SCOUT: 'scout',
    GUNNER: 'gunner',
    SHIELDED: 'shielded',
    SPLITTER: 'splitter',
    THIEF: 'thief',
    BOSS: 'boss'
  },
  TrailStyle: {
    CLASSIC: 'classic',
    NEON: 'neon',
    EMBER: 'ember',
    RAINBOW: 'rainbow'
  },
  StageModifier: {
    STANDARD: 'standard',
    LOW_GRAVITY: 'low-gravity',
    ALIEN_SWARM: 'alien-swarm',
    MOVING_FORTRESS: 'moving-fortress',
    BLACKOUT: 'blackout'
  },
  RunUpgrade: {
    WIDE_PADDLE: 'wide-paddle',
    RESERVE_SHIELD: 'reserve-shield',
    POWERUP_LUCK: 'powerup-luck',
    BULLET_DAMPENER: 'bullet-dampener'
  },
  SkillShot: {
    OPENING_BLITZ: 'opening-blitz',
    BANK_MASTER: 'bank-master',
    ALIEN_COMBO: 'alien-combo',
    OVERDRIVE: 'overdrive',
    COUNTER_SHOT: 'counter-shot'
  }
} as const;
