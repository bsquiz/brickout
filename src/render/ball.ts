import { Constants } from '../constants';
import type { Ball } from '../gameplay/types';
import { drawSpriteFrame } from './primitives/sprite';
import { applyCenteredTransform } from './primitives/transform';

export type BallSpriteFrame = 0 | 1 | 2;

export const getBallSpriteFrame = (ball: Pick<Ball, 'isSuper' | 'perfectSuper' | 'isCharged'>): BallSpriteFrame => {
  if (ball.isCharged) return 2;
  if (ball.isSuper || ball.perfectSuper) return 1;
  return 0;
};

const renderFallbackBall = (context: CanvasRenderingContext2D, ball: Ball, overdrive: boolean): void => {
  context.fillStyle = getBallGlowColor(ball, overdrive);
  context.beginPath();
  context.arc(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2, 0, Math.PI * 2);
  context.fill();
};

export const getBallGlowColor = (ball: Pick<Ball, 'boostSpeedRemaining' | 'frozenSlowRemaining' | 'isCharged' | 'isSuper' | 'perfectSuper'>, overdrive: boolean): string => {
  if (ball.frozenSlowRemaining > 0) return Constants.Render.Colors.FROZEN_BALL;
  if (ball.boostSpeedRemaining > 0) return Constants.Render.Colors.BOOSTED_BALL;
  if (overdrive || ball.isCharged) return Constants.Render.Colors.CHARGED_BALL;
  if (ball.isSuper || ball.perfectSuper) return Constants.Render.Colors.SUPER_BALL;
  return Constants.Render.Colors.FOREGROUND;
};

export const renderBall = (
  context: CanvasRenderingContext2D,
  ball: Ball,
  sprites: HTMLImageElement,
  overdrive = false,
  impact = 0,
  chargePulse = 0,
  reducedMotion = false
): void => {
  const glowColor = getBallGlowColor(ball, overdrive);
  const centerX = ball.x + ball.width / 2;
  const centerY = ball.y + ball.height / 2;
  const animatedImpact = reducedMotion ? 0 : impact;
  const rotation = Math.atan2(ball.velocity.y, ball.velocity.x);
  context.save();
  applyCenteredTransform(context, ball, {
    rotation,
    scaleX: 1 + animatedImpact * Constants.Animation.Ball.STRETCH,
    scaleY: 1 - animatedImpact * Constants.Animation.Ball.SQUASH,
    alignScaleToRotation: true
  });
  context.shadowColor = glowColor;
  context.shadowBlur = ball.isCharged || ball.isSuper || ball.perfectSuper ? 18 : 10;
  const sheetIsReady = sprites.complete && sprites.naturalWidth >= Constants.Render.Sprite.BALL_SIZE * Constants.Render.Sprite.BALL_FRAME_COUNT;
  if (sheetIsReady) {
    drawSpriteFrame(context, sprites, {
      frame: overdrive ? 2 : getBallSpriteFrame(ball),
      columns: Constants.Render.Sprite.BALL_FRAME_COUNT,
      frameWidth: Constants.Render.Sprite.BALL_SIZE,
      frameHeight: Constants.Render.Sprite.BALL_SIZE,
      destination: ball
    });
  } else {
    renderFallbackBall(context, ball, overdrive);
  }
  context.restore();
  if (chargePulse <= 0 || reducedMotion) return;
  context.save();
  context.globalAlpha = chargePulse * 0.7;
  context.strokeStyle = glowColor;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(centerX, centerY, ball.width + (1 - chargePulse) * 18, 0, Math.PI * 2);
  context.stroke();
  context.restore();
};
