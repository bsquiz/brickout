import { Constants } from '../constants';
import type { StageShape } from '../constants/stage';
import type { ArenaDimensions, Rectangle } from './types';

const withOrientation = (dimensions: { width: number; height: number; hudHeight: number }, orientation: ArenaDimensions['orientation']): ArenaDimensions => ({
  ...dimensions,
  orientation
});

export const getArenaDimensions = (viewportWidth: number, viewportHeight: number): ArenaDimensions =>
  viewportWidth / Math.max(1, viewportHeight) >= Constants.Game.Arena.ORIENTATION_BREAKPOINT
    ? withOrientation(Constants.Game.Arena.LANDSCAPE, 'landscape')
    : withOrientation(Constants.Game.Arena.PORTRAIT, 'portrait');

export const getDefaultArena = (): ArenaDimensions => withOrientation(Constants.Game.Arena.BASELINE, 'portrait');

export const getStageShape = (levelIndex: number): StageShape =>
  Constants.Stage.Shapes[levelIndex % Constants.Stage.Shapes.length] ?? Constants.Stage.Shapes[0]!;

export const getStageArenaDimensions = (base: ArenaDimensions, levelIndex: number): ArenaDimensions => {
  const shape = getStageShape(levelIndex);
  return withOrientation({
    width: Math.round(base.width * shape.widthMultiplier),
    height: Math.round(base.height * shape.heightMultiplier),
    hudHeight: base.hudHeight
  }, base.orientation);
};

export const getBrickWidth = (arena: ArenaDimensions): number => arena.width / 10;

export const getPaddleY = (arena: ArenaDimensions, paddleHeight: number = Constants.Entities.Paddle.HEIGHT): number =>
  arena.height - Constants.Game.Arena.PADDLE_BOTTOM_MARGIN - paddleHeight;

export const getAlienY = (arena: ArenaDimensions): number =>
  arena.hudHeight + (arena.height - arena.hudHeight) * Constants.Entities.Alien.Y_RATIO;

export const getBallSpeed = (arena: ArenaDimensions): number =>
  Constants.Entities.Ball.SPEED * Math.sqrt(arena.height / Constants.Game.Arena.LANDSCAPE.height);

export const remapRectangleCenter = (rectangle: Rectangle, previous: ArenaDimensions, next: ArenaDimensions): void => {
  const centerXRatio = (rectangle.x + rectangle.width / 2) / previous.width;
  const playablePrevious = previous.height - previous.hudHeight;
  const centerYRatio = (rectangle.y + rectangle.height / 2 - previous.hudHeight) / playablePrevious;
  rectangle.x = centerXRatio * next.width - rectangle.width / 2;
  rectangle.y = next.hudHeight + centerYRatio * (next.height - next.hudHeight) - rectangle.height / 2;
};
