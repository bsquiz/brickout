import { Constants } from '../constants';
import type { LevelDefinition } from '../data/validateLevel';
import type { ArenaDimensions, Brick } from '../gameplay/types';

export const getBrickStartingHitPoints = (behavior: Brick['behavior'], configuredHitPoints: number): number => {
  if (behavior === Constants.Id.BrickBehavior.ARMORED) {
    return Math.max(Constants.Entities.Brick.ARMORED_MIN_HIT_POINTS, configuredHitPoints);
  }
  if (behavior === Constants.Id.BrickBehavior.REGENERATING) {
    return Math.max(Constants.Entities.Brick.REGENERATING_MIN_HIT_POINTS, configuredHitPoints);
  }
  return configuredHitPoints;
};

export const createBricks = (level: LevelDefinition, arena: ArenaDimensions): Brick[] => {
  const columnCount = level[0]?.length ?? 10;
  const brickWidth = arena.width / columnCount;
  return (
  level.flatMap((row, rowIndex) =>
    row.flatMap((definition, columnIndex) => {
      if (definition === null) return [];
      const behavior = definition.behavior ?? Constants.Id.BrickBehavior.NORMAL;
      const hitPoints = getBrickStartingHitPoints(behavior, definition.hitPoints);

      const brick: Brick = {
        x: columnIndex * brickWidth,
        y: arena.hudHeight + rowIndex * Constants.Entities.Brick.HEIGHT,
        width: brickWidth,
        height: Constants.Entities.Brick.HEIGHT,
        hitPoints,
        maxHitPoints: hitPoints,
        points: Constants.Entities.Brick.POINTS,
        rowIndex,
        behavior,
        baseX: columnIndex * brickWidth,
        moveDirection: 1,
        lastHitAt: 0
      };

      if (definition.powerup !== undefined) brick.powerup = definition.powerup;
      if (definition.portalId !== undefined) brick.portalId = definition.portalId;
      if (definition.direction !== undefined) brick.direction = definition.direction;
      return [brick];
    })
  ));
};
