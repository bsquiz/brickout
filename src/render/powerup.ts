import { Constants } from '../constants';
import { PowerupRegistry, type PowerupShape } from '../entities';
import type { Powerup, PowerupType } from '../gameplay/types';
import { drawSpriteFrame } from './primitives/sprite';

export type PowerupSpriteFrame = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const PowerupSpriteFrames: Partial<Record<PowerupType, PowerupSpriteFrame>> = {
  shrink: 0,
  expand: 1,
  'super-ball': 2,
  multiball: 3,
  sticky: 4,
  'slow-motion': 5,
  shield: 6,
  laser: 7,
  'score-100': 8,
  'score-200': 9,
  'score-500': 10
};

export const isPowerupSpriteSheetReady = (sprites?: HTMLImageElement): sprites is HTMLImageElement =>
  sprites !== undefined &&
  sprites.complete &&
  sprites.naturalWidth >= Constants.Render.Sprite.POWERUP_FRAME_SIZE * Constants.Render.Sprite.POWERUP_FRAME_COLUMNS &&
  sprites.naturalHeight >= Constants.Render.Sprite.POWERUP_FRAME_SIZE * Math.ceil(Constants.Render.Sprite.POWERUP_FRAME_COUNT / Constants.Render.Sprite.POWERUP_FRAME_COLUMNS);

const drawPowerupSprite = (context: CanvasRenderingContext2D, powerup: Powerup, sprites: HTMLImageElement): boolean => {
  const frame = PowerupSpriteFrames[powerup.type];
  if (frame === undefined) return false;
  const size = Constants.Render.Sprite.POWERUP_ICON_SIZE;
  drawSpriteFrame(context, sprites, {
    frame,
    columns: Constants.Render.Sprite.POWERUP_FRAME_COLUMNS,
    frameWidth: Constants.Render.Sprite.POWERUP_FRAME_SIZE,
    frameHeight: Constants.Render.Sprite.POWERUP_FRAME_SIZE,
    destination: {
      x: powerup.x + (powerup.width - size) / 2,
      y: powerup.y + (powerup.height - size) / 2,
      width: size,
      height: size
    }
  });
  return true;
};

export const drawPowerupPill = (
  context: CanvasRenderingContext2D,
  powerup: Powerup,
  color: string
): void => {
  const inset = Constants.Render.Powerup.PILL_INSET;
  context.fillStyle = Constants.Render.Powerup.PILL_BACKGROUND;
  context.strokeStyle = color;
  context.lineWidth = Constants.Render.Powerup.PILL_LINE_WIDTH;
  context.beginPath();
  context.roundRect(
    powerup.x + inset,
    powerup.y + inset,
    powerup.width - inset * 2,
    powerup.height - inset * 2,
    (powerup.height - inset * 2) / 2
  );
  context.fill();
  context.stroke();
};

const getFallbackIconBounds = (powerup: Powerup): Powerup => ({
  ...powerup,
  x: powerup.x + (powerup.width - Constants.Render.Powerup.ICON_BOUNDS_WIDTH) / 2,
  y: powerup.y + (powerup.height - Constants.Render.Powerup.ICON_BOUNDS_HEIGHT) / 2,
  width: Constants.Render.Powerup.ICON_BOUNDS_WIDTH,
  height: Constants.Render.Powerup.ICON_BOUNDS_HEIGHT
});

type ShapeRenderer = (context: CanvasRenderingContext2D, powerup: Powerup) => void;

const pathPolygon = (context: CanvasRenderingContext2D, points: ReadonlyArray<readonly [number, number]>): void => {
  const first = points[0];
  if (first === undefined) return;
  context.beginPath();
  context.moveTo(first[0], first[1]);
  points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
  context.closePath();
  context.fill();
};

const shapeRenderers: Record<PowerupShape, ShapeRenderer> = {
  triangle: (context, powerup) => pathPolygon(context, [
    [powerup.x + 3, powerup.y + 4],
    [powerup.x + powerup.width - 3, powerup.y + 4],
    [powerup.x + powerup.width / 2, powerup.y + powerup.height - 2]
  ]),
  plus: (context, powerup) => {
    context.fillRect(powerup.x + 9, powerup.y + 2, 6, 14);
    context.fillRect(powerup.x + 5, powerup.y + 6, 14, 6);
  },
  diamond: (context, powerup) => pathPolygon(context, [
    [powerup.x + powerup.width / 2, powerup.y + 1],
    [powerup.x + powerup.width - 3, powerup.y + powerup.height / 2],
    [powerup.x + powerup.width / 2, powerup.y + powerup.height - 1],
    [powerup.x + 3, powerup.y + powerup.height / 2]
  ]),
  multiball: (context, powerup) => {
    const ballOffsets: ReadonlyArray<readonly [number, number]> = [[7, 10], [12, 5], [17, 10]];
    for (const [offsetX, offsetY] of ballOffsets) {
      context.beginPath();
      context.arc(powerup.x + offsetX, powerup.y + offsetY, 4, 0, Math.PI * 2);
      context.fill();
    }
  },
  magnet: (context, powerup) => {
    context.lineWidth = 5;
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.arc(powerup.x + powerup.width / 2, powerup.y + 7, 7, 0, Math.PI);
    context.stroke();
    context.fillRect(powerup.x + 3, powerup.y + 6, 5, 9);
    context.fillRect(powerup.x + powerup.width - 8, powerup.y + 6, 5, 9);
  },
  clock: (context, powerup) => {
    const centerX = powerup.x + powerup.width / 2;
    const centerY = powerup.y + powerup.height / 2;
    context.lineWidth = 3;
    context.strokeStyle = context.fillStyle;
    context.beginPath();
    context.arc(centerX, centerY, 7, 0, Math.PI * 2);
    context.moveTo(centerX, centerY);
    context.lineTo(centerX, centerY - 5);
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + 4, centerY + 2);
    context.stroke();
  },
  shield: (context, powerup) => pathPolygon(context, [
    [powerup.x + 3, powerup.y + 2],
    [powerup.x + powerup.width - 3, powerup.y + 2],
    [powerup.x + powerup.width - 5, powerup.y + 12],
    [powerup.x + powerup.width / 2, powerup.y + powerup.height - 1],
    [powerup.x + 5, powerup.y + 12]
  ]),
  bolt: (context, powerup) => pathPolygon(context, [
    [powerup.x + 13, powerup.y + 1],
    [powerup.x + 5, powerup.y + 10],
    [powerup.x + 11, powerup.y + 10],
    [powerup.x + 9, powerup.y + 17],
    [powerup.x + 19, powerup.y + 7],
    [powerup.x + 13, powerup.y + 7]
  ]),
  chevrons: (context, powerup) => {
    const centerX = powerup.x + powerup.width / 2;
    const centerY = powerup.y + powerup.height / 2;
    const spacing = Constants.Render.Powerup.SPEED_ICON_SPACING;
    const halfWidth = Constants.Render.Powerup.SPEED_ICON_HALF_WIDTH;
    const halfHeight = Constants.Render.Powerup.SPEED_ICON_HALF_HEIGHT;
    context.lineWidth = Constants.Render.Powerup.SPEED_ICON_LINE_WIDTH;
    context.strokeStyle = context.fillStyle;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    for (const offsetX of [-spacing / 2, spacing / 2]) {
      context.beginPath();
      context.moveTo(centerX + offsetX - halfWidth, centerY - halfHeight);
      context.lineTo(centerX + offsetX + halfWidth, centerY);
      context.lineTo(centerX + offsetX - halfWidth, centerY + halfHeight);
      context.stroke();
    }
  },
  coin: (context, powerup) => {
    context.beginPath();
    context.arc(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2, 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = Constants.Render.Colors.DARK_INK;
    context.font = 'bold 8px ui-monospace, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('1', powerup.x + powerup.width / 2, powerup.y + powerup.height / 2);
  },
  star: (context, powerup) => {
    const centerX = powerup.x + powerup.width / 2;
    const centerY = powerup.y + powerup.height / 2;
    const points = Array.from({ length: 10 }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const radius = index % 2 === 0 ? 8 : 3.5;
      return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius] as const;
    });
    pathPolygon(context, points);
  },
  crown: (context, powerup) => pathPolygon(context, [
    [powerup.x + 3, powerup.y + 5],
    [powerup.x + 8, powerup.y + 10],
    [powerup.x + 12, powerup.y + 3],
    [powerup.x + 16, powerup.y + 10],
    [powerup.x + 21, powerup.y + 5],
    [powerup.x + 19, powerup.y + 16],
    [powerup.x + 5, powerup.y + 16]
  ])
};

export const renderPowerup = (context: CanvasRenderingContext2D, powerup: Powerup, sprites?: HTMLImageElement): void => {
  const definition = PowerupRegistry[powerup.type];
  context.save();
  context.shadowColor = definition.color;
  context.shadowBlur = Constants.Render.Powerup.GLOW_BLUR;
  drawPowerupPill(context, powerup, definition.color);
  const spriteDrawn = isPowerupSpriteSheetReady(sprites) && drawPowerupSprite(context, powerup, sprites);
  if (!spriteDrawn) {
    context.fillStyle = definition.color;
    shapeRenderers[definition.shape](context, getFallbackIconBounds(powerup));
  }
  context.restore();
};
