import { Id } from './identifiers';

export const Spawn = {
  PowerupDrops: {
    BONUS_CHANCE: 0.08,
    BOSS: [Id.PowerupType.MULTIBALL, Id.PowerupType.SHIELD, Id.PowerupType.LASER],
    BONUS: [
      Id.PowerupType.EXPAND,
      Id.PowerupType.SHIELD,
      Id.PowerupType.MULTIBALL,
      Id.PowerupType.SLOW_MOTION,
      Id.PowerupType.SCORE_100,
      Id.PowerupType.SCORE_200,
      Id.PowerupType.SCORE_500
    ]
  }
} as const;
