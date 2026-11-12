import type { Rectangle } from '../../gameplay/types';

export type SpriteFrameOptions = {
  frame: number;
  columns: number;
  frameWidth: number;
  frameHeight: number;
  destination: Rectangle;
};

export const drawSpriteFrame = (
  context: CanvasRenderingContext2D,
  sprites: CanvasImageSource,
  options: SpriteFrameOptions
): void => {
  const sourceX = options.frame % options.columns * options.frameWidth;
  const sourceY = Math.floor(options.frame / options.columns) * options.frameHeight;
  context.drawImage(
    sprites,
    sourceX,
    sourceY,
    options.frameWidth,
    options.frameHeight,
    options.destination.x,
    options.destination.y,
    options.destination.width,
    options.destination.height
  );
};
