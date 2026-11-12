import { Constants } from '../constants';
import type { Brick, BrickBehavior } from '../gameplay/types';
import { drawHorizontalNineSlice } from './horizontalNineSlice';
import { drawSpriteFrame } from './primitives/sprite';
import { applyCenteredTransform } from './primitives/transform';

type BrickRenderer = (context: CanvasRenderingContext2D, brick: Brick, color: string) => void;

export type BrickSpriteFrame = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const BrickSpriteFrames: Record<BrickBehavior, BrickSpriteFrame> = {
  normal: 0,
  armored: 1,
  moving: 2,
  explosive: 3,
  indestructible: 4,
  regenerating: 5,
  lightning: 6,
  frozen: 7,
  portal: 8,
  directional: 9
};

export const isBrickBaseSpriteReady = (sprite?: HTMLImageElement): sprite is HTMLImageElement =>
  sprite !== undefined &&
  sprite.complete &&
  sprite.naturalWidth >= Constants.Render.Sprite.BRICK_FRAME_WIDTH &&
  sprite.naturalHeight >= Constants.Render.Sprite.BRICK_FRAME_HEIGHT;

export const isBrickOverlaySheetReady = (sprites?: HTMLImageElement): sprites is HTMLImageElement =>
  sprites !== undefined &&
  sprites.complete &&
  sprites.naturalWidth >= Constants.Render.Sprite.BRICK_FRAME_WIDTH * Constants.Render.Sprite.BRICK_FRAME_COLUMNS &&
  sprites.naturalHeight >= Constants.Render.Sprite.BRICK_FRAME_HEIGHT * Math.ceil(Constants.Render.Sprite.BRICK_FRAME_COUNT / Constants.Render.Sprite.BRICK_FRAME_COLUMNS);

export const getBrickRowFilter = (rowIndex: number): string =>
  Constants.Render.Colors.BRICK_ROW_FILTERS[rowIndex % Constants.Render.Colors.BRICK_ROW_FILTERS.length] ?? 'none';

const drawBrickBase = (context: CanvasRenderingContext2D, brick: Brick, sprite: HTMLImageElement): void => {
  const previousFilter = context.filter;
  context.filter = getBrickRowFilter(brick.rowIndex);
  drawHorizontalNineSlice(context, sprite, {
    sourceWidth: Constants.Render.Sprite.BRICK_FRAME_WIDTH,
    sourceHeight: Constants.Render.Sprite.BRICK_FRAME_HEIGHT,
    sourceCapWidth: Constants.Render.Sprite.BRICK_CAP_WIDTH,
    x: brick.x,
    y: brick.y,
    width: brick.width,
    height: brick.height
  });
  context.filter = previousFilter;
};

const drawBrickOverlay = (context: CanvasRenderingContext2D, brick: Brick, sprites: HTMLImageElement): void => {
  const frame = BrickSpriteFrames[brick.behavior];
  if (frame === BrickSpriteFrames.normal) return;
  const angle = brick.behavior === Constants.Id.BrickBehavior.DIRECTIONAL
    ? { up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[brick.direction ?? 'up']
    : 0;
  context.save();
  const rotated = Math.abs(angle) === Math.PI / 2;
  const availableWidth = rotated ? brick.height : brick.width;
  const availableHeight = rotated ? brick.width : brick.height;
  const scale = Math.min(
    availableWidth / Constants.Render.Sprite.BRICK_FRAME_WIDTH,
    availableHeight / Constants.Render.Sprite.BRICK_FRAME_HEIGHT,
    1
  );
  const overlayWidth = Constants.Render.Sprite.BRICK_FRAME_WIDTH * scale;
  const overlayHeight = Constants.Render.Sprite.BRICK_FRAME_HEIGHT * scale;
  applyCenteredTransform(context, brick, { rotation: angle });
  drawSpriteFrame(context, sprites, {
    frame,
    columns: Constants.Render.Sprite.BRICK_FRAME_COLUMNS,
    frameWidth: Constants.Render.Sprite.BRICK_FRAME_WIDTH,
    frameHeight: Constants.Render.Sprite.BRICK_FRAME_HEIGHT,
    destination: {
      x: brick.x + (brick.width - overlayWidth) / 2,
      y: brick.y + (brick.height - overlayHeight) / 2,
      width: overlayWidth,
      height: overlayHeight
    }
  });
  context.restore();
};

const fillBrick = (context: CanvasRenderingContext2D, brick: Brick, color: string): void => {
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(brick.x + 1, brick.y + 1, brick.width - 2, brick.height - 2, 3);
  context.fill();
};

const drawHitPoints = (context: CanvasRenderingContext2D, brick: Brick): void => {
  if (brick.hitPoints <= 1 || !Number.isFinite(brick.hitPoints)) return;
  const pipCount = Math.min(5, brick.hitPoints);
  const pipWidth = 4;
  const gap = 2;
  const totalWidth = pipCount * pipWidth + (pipCount - 1) * gap;
  context.fillStyle = 'rgb(2 6 23 / 72%)';
  for (let index = 0; index < pipCount; index += 1) {
    context.fillRect(brick.x + (brick.width - totalWidth) / 2 + index * (pipWidth + gap), brick.y + brick.height - 5, pipWidth, 2);
  }
};

export const BrickVisualRegistry: Record<BrickBehavior, BrickRenderer> = {
  normal: fillBrick,
  armored: fillBrick,
  moving: fillBrick,
  explosive: fillBrick,
  indestructible: fillBrick,
  regenerating: fillBrick,
  lightning: fillBrick,
  frozen: fillBrick,
  portal: fillBrick,
  directional: fillBrick
};

type RenderBrickOptions = {
  isFinalTarget: boolean;
  finalTargetTurns: number;
  elapsedSeconds: number;
  reducedMotion: boolean;
  glowEnabled?: boolean;
  baseSprite?: HTMLImageElement;
  overlaySprites?: HTMLImageElement;
};

export const renderBrick = (context: CanvasRenderingContext2D, brick: Brick, options: RenderBrickOptions): void => {
  const color = Constants.Render.Colors.BRICK_ROWS[brick.rowIndex % Constants.Render.Colors.BRICK_ROWS.length] ?? Constants.Render.Colors.FOREGROUND;
  context.save();
  context.shadowColor = color;
  context.shadowBlur = options.glowEnabled === false ? 0 : brick.behavior === 'lightning' ? 14 : 7;
  if (
    isBrickBaseSpriteReady(options.baseSprite) &&
    (brick.behavior === Constants.Id.BrickBehavior.NORMAL || isBrickOverlaySheetReady(options.overlaySprites))
  ) {
    drawBrickBase(context, brick, options.baseSprite);
    if (isBrickOverlaySheetReady(options.overlaySprites)) drawBrickOverlay(context, brick, options.overlaySprites);
  } else {
    BrickVisualRegistry[brick.behavior](context, brick, color);
  }
  context.restore();
  drawHitPoints(context, brick);

  if (!options.isFinalTarget) return;
  const progress = Math.min(1, options.finalTargetTurns / Constants.Game.AimAssist.TURNS_TO_MAX);
  const pulse = options.reducedMotion ? 0.65 : 0.55 + Math.sin(options.elapsedSeconds * 7) * 0.2;
  context.globalAlpha = Math.min(1, pulse + progress * 0.25);
  context.strokeStyle = Constants.Render.Colors.FOREGROUND;
  context.lineWidth = 1 + progress * 2;
  context.strokeRect(brick.x - 3, brick.y - 3, brick.width + 6, brick.height + 6);
  context.globalAlpha = 1;
};
