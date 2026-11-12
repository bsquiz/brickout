import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';

export type FpsTracker = {
  update: (timestamp: number) => number;
};

export const createFpsTracker = (): FpsTracker => {
  const frameTimes: number[] = [];
  return {
    update: (timestamp) => {
      frameTimes.push(timestamp);
      const cutoff = timestamp - 1000;
      while ((frameTimes[0] ?? timestamp) < cutoff) frameTimes.shift();
      if (frameTimes.length < 2) return 0;
      const elapsedSeconds = (timestamp - (frameTimes[0] ?? timestamp)) / 1000;
      return elapsedSeconds > 0 ? Math.round((frameTimes.length - 1) / elapsedSeconds) : 0;
    }
  };
};

export const renderDebug = (context: CanvasRenderingContext2D, fps: number, state: GameState, invariantErrors: string[]): void => {
  const { arena } = state;
  context.fillStyle = 'rgb(2 6 23 / 80%)';
  context.fillRect(8, arena.height - 48, 190, 40);
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  context.font = Constants.Render.Font.DEBUG;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(`FPS ${fps} · FX ${state.effects.particles.length} · ENT ${state.bricks.length + state.powerups.length + state.projectiles.length}`, 14, arena.height - 34);
  if (invariantErrors.length > 0) {
    context.fillStyle = Constants.Render.Colors.ENEMY_BULLET;
    context.fillText(invariantErrors.join(', '), 14, arena.height - 18);
  }
};
