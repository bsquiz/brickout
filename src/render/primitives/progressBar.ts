import { clamp01 } from '../../utils/math';

export type ProgressBarOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number;
  backgroundColor: string;
  foregroundColor: string;
};

export const drawProgressBar = (context: CanvasRenderingContext2D, options: ProgressBarOptions): void => {
  context.fillStyle = options.backgroundColor;
  context.fillRect(options.x, options.y, options.width, options.height);
  context.fillStyle = options.foregroundColor;
  context.fillRect(options.x, options.y, options.width * clamp01(options.progress), options.height);
};
