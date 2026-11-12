import { Id } from '../constants/identifiers';
import type { BrickBehavior, BrickDirection, PowerupType } from '../gameplay/types';

export type BrickDefinition = {
  hitPoints: number;
  powerup?: PowerupType;
  behavior?: BrickBehavior;
  portalId?: string;
  direction?: BrickDirection;
};

export type LevelDefinition = ReadonlyArray<ReadonlyArray<BrickDefinition | null>>;

const powerupTypes: ReadonlySet<string> = new Set(Object.values(Id.PowerupType));
const brickBehaviors: ReadonlySet<string> = new Set(Object.values(Id.BrickBehavior));
const brickDirections: ReadonlySet<string> = new Set(Object.values(Id.BrickDirection));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseCell = (value: unknown, levelIndex: number, rowIndex: number, columnIndex: number): BrickDefinition | null => {
  if (value === null) return null;
  if (!isRecord(value)) throw new Error(`Level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1} must be a brick or null`);

  const unknownKeys = Object.keys(value).filter((key) => key !== 'hitPoints' && key !== 'powerup' && key !== 'behavior' && key !== 'portalId' && key !== 'direction');
  if (unknownKeys.length > 0) throw new Error(`Unknown brick field: ${unknownKeys[0]}`);

  const hitPoints = value.hitPoints ?? 1;
  if (!Number.isInteger(hitPoints) || (hitPoints as number) <= 0) throw new Error(`Invalid hitPoints at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);

  const powerup = value.powerup;
  if (powerup !== undefined && (typeof powerup !== 'string' || !powerupTypes.has(powerup))) throw new Error(`Unknown powerup at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);

  const behavior = value.behavior;
  if (behavior !== undefined && (typeof behavior !== 'string' || !brickBehaviors.has(behavior))) throw new Error(`Unknown brick behavior at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);

  const portalId = value.portalId;
  if (behavior === Id.BrickBehavior.PORTAL && (typeof portalId !== 'string' || portalId.trim() === '')) throw new Error(`Portal brick requires portalId at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);
  if (behavior !== Id.BrickBehavior.PORTAL && portalId !== undefined) throw new Error(`portalId requires portal behavior at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);
  const direction = value.direction;
  if (behavior === Id.BrickBehavior.DIRECTIONAL && (typeof direction !== 'string' || !brickDirections.has(direction))) throw new Error(`Directional brick requires a valid direction at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);
  if (behavior !== Id.BrickBehavior.DIRECTIONAL && direction !== undefined) throw new Error(`direction requires directional behavior at level ${levelIndex + 1}, row ${rowIndex + 1}, column ${columnIndex + 1}`);

  const definition: BrickDefinition = { hitPoints: hitPoints as number };
  if (powerup !== undefined) definition.powerup = powerup as PowerupType;
  if (behavior !== undefined) definition.behavior = behavior as BrickBehavior;
  if (portalId !== undefined) definition.portalId = portalId as string;
  if (direction !== undefined) definition.direction = direction as BrickDirection;
  return definition;
};

export const validateLevels = (value: unknown): LevelDefinition[] => {
  if (!Array.isArray(value) || value.length === 0) throw new Error('Levels must be a non-empty array');

  return value.map((level, levelIndex) => {
    if (!Array.isArray(level) || level.length === 0) throw new Error(`Level ${levelIndex + 1} must contain rows`);
    if (level.length > 20) throw new Error(`Level ${levelIndex + 1} is too tall`);
    const columnCount = Array.isArray(level[0]) ? level[0].length : 0;
    if (columnCount < 1 || columnCount > 10) throw new Error(`Level ${levelIndex + 1} rows must contain between 1 and 10 cells`);

    const parsedLevel = level.map((row, rowIndex) => {
      if (!Array.isArray(row) || row.length !== columnCount) throw new Error(`Level ${levelIndex + 1}, row ${rowIndex + 1} must contain exactly ${columnCount} cells`);
      return row.map((cell, columnIndex) => parseCell(cell, levelIndex, rowIndex, columnIndex));
    });
    const portalCounts = new Map<string, number>();
    parsedLevel.flat().forEach((brick) => {
      if (brick?.portalId !== undefined) portalCounts.set(brick.portalId, (portalCounts.get(brick.portalId) ?? 0) + 1);
    });
    portalCounts.forEach((count, portalId) => {
      if (count !== 2) throw new Error(`Portal pair ${portalId} in level ${levelIndex + 1} must contain exactly two bricks`);
    });
    return parsedLevel;
  });
};
