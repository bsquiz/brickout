import { Constants } from '../constants';
import type { Brick, GameState, StageModifier } from '../gameplay/types';
import { isBrickBaseSpriteReady, isBrickOverlaySheetReady, renderBrick } from './brick';

type BrickSnapshot = Pick<Brick, 'x' | 'y' | 'width' | 'height' | 'hitPoints' | 'maxHitPoints' | 'rowIndex' | 'behavior' | 'baseX' | 'direction'>;

export type BrickLayerCache = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  snapshots: BrickSnapshot[];
  stageModifier: StageModifier | null;
  baseSpriteReady: boolean;
  overlaySheetReady: boolean;
};

export const createBrickLayerCache = (): BrickLayerCache => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) throw new Error('Brick cache requires a 2D canvas context');
  return { canvas, context, snapshots: [], stageModifier: null, baseSpriteReady: false, overlaySheetReady: false };
};

export const isDynamicBrick = (state: GameState, brick: Brick, finalTarget: Brick | null): boolean =>
  brick === finalTarget ||
  brick.behavior === Constants.Id.BrickBehavior.MOVING ||
  (state.stageModifier === Constants.Id.StageModifier.MOVING_FORTRESS && brick.behavior === Constants.Id.BrickBehavior.NORMAL);

const snapshotMatches = (snapshot: BrickSnapshot, brick: Brick): boolean =>
  snapshot.x === brick.x &&
  snapshot.y === brick.y &&
  snapshot.width === brick.width &&
  snapshot.height === brick.height &&
  snapshot.hitPoints === brick.hitPoints &&
  snapshot.maxHitPoints === brick.maxHitPoints &&
  snapshot.rowIndex === brick.rowIndex &&
  snapshot.behavior === brick.behavior &&
  snapshot.baseX === brick.baseX &&
  snapshot.direction === brick.direction;

const isCacheCurrent = (
  cache: BrickLayerCache,
  state: GameState,
  finalTarget: Brick | null,
  baseSprite?: HTMLImageElement,
  overlaySprites?: HTMLImageElement
): boolean => {
  if (
    cache.canvas.width !== state.arena.width ||
    cache.canvas.height !== state.arena.height ||
    cache.stageModifier !== state.stageModifier ||
    cache.baseSpriteReady !== isBrickBaseSpriteReady(baseSprite) ||
    cache.overlaySheetReady !== isBrickOverlaySheetReady(overlaySprites)
  ) return false;
  let snapshotIndex = 0;
  for (const brick of state.bricks) {
    if (isDynamicBrick(state, brick, finalTarget)) continue;
    const snapshot = cache.snapshots[snapshotIndex];
    if (snapshot === undefined || !snapshotMatches(snapshot, brick)) return false;
    snapshotIndex += 1;
  }
  return snapshotIndex === cache.snapshots.length;
};

const rebuildCache = (
  cache: BrickLayerCache,
  state: GameState,
  finalTarget: Brick | null,
  baseSprite?: HTMLImageElement,
  overlaySprites?: HTMLImageElement
): void => {
  if (cache.canvas.width !== state.arena.width) cache.canvas.width = state.arena.width;
  if (cache.canvas.height !== state.arena.height) cache.canvas.height = state.arena.height;
  cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
  cache.snapshots.length = 0;
  cache.stageModifier = state.stageModifier;
  cache.baseSpriteReady = isBrickBaseSpriteReady(baseSprite);
  cache.overlaySheetReady = isBrickOverlaySheetReady(overlaySprites);
  for (const brick of state.bricks) {
    if (isDynamicBrick(state, brick, finalTarget)) continue;
    renderBrick(cache.context, brick, {
      isFinalTarget: false,
      finalTargetTurns: 0,
      elapsedSeconds: state.elapsedSeconds,
      reducedMotion: state.reducedMotion,
      baseSprite,
      overlaySprites
    });
    cache.snapshots.push({
      x: brick.x,
      y: brick.y,
      width: brick.width,
      height: brick.height,
      hitPoints: brick.hitPoints,
      maxHitPoints: brick.maxHitPoints,
      rowIndex: brick.rowIndex,
      behavior: brick.behavior,
      baseX: brick.baseX,
      direction: brick.direction
    });
  }
};

export const renderCachedBrickLayer = (
  context: CanvasRenderingContext2D,
  state: GameState,
  cache: BrickLayerCache,
  finalTarget: Brick | null,
  baseSprite?: HTMLImageElement,
  overlaySprites?: HTMLImageElement
): void => {
  if (!isCacheCurrent(cache, state, finalTarget, baseSprite, overlaySprites)) {
    rebuildCache(cache, state, finalTarget, baseSprite, overlaySprites);
  }
  context.drawImage(cache.canvas, 0, 0);
};
