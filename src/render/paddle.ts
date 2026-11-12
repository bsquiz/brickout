import { Constants } from '../constants';
import type { ActiveEffects, Paddle, VisualEffects } from '../gameplay/types';
import { drawSpriteFrame } from './primitives/sprite';
import { applyCenteredTransform } from './primitives/transform';

export type PaddleSpriteFrame = 0 | 1 | 2 | 3 | 4 | 5;
export type PaddleVisual = 'normal' | 'sticky' | 'laser' | 'shrunken' | 'expanded';

export const getPaddleVisual = (paddleWidth: number, effects: Pick<ActiveEffects, 'stickyRemaining' | 'laserRemaining'>): PaddleVisual => {
  if (effects.laserRemaining > 0) return 'laser';
  if (effects.stickyRemaining > 0) return 'sticky';
  if (paddleWidth <= Constants.Entities.Paddle.WIDTH * Constants.Entities.Paddle.SHRINK_MULTIPLIER) return 'shrunken';
  if (paddleWidth >= Constants.Entities.Paddle.WIDTH * Constants.Entities.Paddle.EXPAND_MULTIPLIER) return 'expanded';
  return 'normal';
};

export const PaddleSpriteFrames: Record<PaddleVisual, PaddleSpriteFrame> = {
  normal: 0,
  sticky: 1,
  laser: 2,
  shrunken: 0,
  expanded: 0
};

const renderFallbackPaddle = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void => {
  context.beginPath();
  context.roundRect(x, y, width, height, 5);
  context.fill();
};

export const renderPaddle = (
  context: CanvasRenderingContext2D,
  paddle: Paddle,
  activeEffects: ActiveEffects,
  visualEffects: VisualEffects,
  reducedMotion: boolean,
  sprites: HTMLImageElement,
  velocityX = 0
): void => {
  const visual = getPaddleVisual(paddle.width, activeEffects);
  const color = activeEffects.overdriveRemaining > 0
    ? Constants.Render.Colors.SUPER_BALL
    : visual === 'laser' ? Constants.Render.Colors.LASER : visual === 'sticky' ? Constants.Render.Colors.STICKY : Constants.Render.Colors.FOREGROUND;
  const impact = reducedMotion ? 0 : visualEffects.paddleImpact;
  const width = paddle.width * (1 + impact * 0.12);
  const height = paddle.height * (1 - impact * 0.2);
  const x = paddle.x - (width - paddle.width) / 2;
  const y = paddle.y + paddle.height - height;
  const sheetIsReady = sprites.complete && sprites.naturalWidth >= Constants.Render.Sprite.PADDLE_FRAME_WIDTH * Constants.Render.Sprite.PADDLE_FRAME_COUNT;
  const tilt = reducedMotion ? 0 : Math.max(
    -Constants.Animation.Paddle.MAX_TILT_RADIANS,
    Math.min(Constants.Animation.Paddle.MAX_TILT_RADIANS, velocityX / Constants.Animation.Paddle.TILT_SPEED_DIVISOR)
  );

  context.save();
  applyCenteredTransform(context, paddle, { rotation: tilt });
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = activeEffects.overdriveRemaining > 0 ? 26 : 14;
  if (!sheetIsReady) {
    renderFallbackPaddle(context, x, y, width, height);
  } else {
    drawSpriteFrame(context, sprites, {
      frame: PaddleSpriteFrames[visual],
      columns: Constants.Render.Sprite.PADDLE_FRAME_COUNT,
      frameWidth: Constants.Render.Sprite.PADDLE_FRAME_WIDTH,
      frameHeight: Constants.Render.Sprite.PADDLE_FRAME_HEIGHT,
      destination: { x, y, width, height }
    });
  }
  context.restore();

  if (impact <= 0) return;
  const impactX = paddle.x + paddle.width * (0.5 + visualEffects.paddleImpactX * 0.5);
  context.save();
  context.globalAlpha = impact;
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(impactX, paddle.y, 8 + (1 - impact) * 20, Math.PI, Math.PI * 2);
  context.stroke();
  context.restore();
};
