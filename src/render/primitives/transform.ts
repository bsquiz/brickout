import type { Rectangle } from '../../gameplay/types';

export type CenteredTransformOptions = {
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  alignScaleToRotation?: boolean;
};

export const applyCenteredTransform = (
  context: CanvasRenderingContext2D,
  rectangle: Rectangle,
  options: CenteredTransformOptions = {}
): void => {
  const centerX = rectangle.x + rectangle.width / 2;
  const centerY = rectangle.y + rectangle.height / 2;
  const { scaleX = 1, scaleY = 1, rotation = 0, offsetX = 0, offsetY = 0, alignScaleToRotation = false } = options;
  context.translate(centerX + offsetX, centerY + offsetY);
  if (rotation !== 0) context.rotate(rotation);
  if (scaleX !== 1 || scaleY !== 1) context.scale(scaleX, scaleY);
  if (rotation !== 0 && alignScaleToRotation) context.rotate(-rotation);
  context.translate(-centerX, -centerY);
};
