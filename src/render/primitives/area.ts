import type { ArenaDimensions } from '../../gameplay/types';

export const fillPlayableArea = (context: CanvasRenderingContext2D, arena: ArenaDimensions): void => {
  context.fillRect(0, arena.hudHeight, arena.width, arena.height - arena.hudHeight);
};
