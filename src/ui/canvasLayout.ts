import type { ArenaDimensions } from '../gameplay/types';

export const applyCanvasLayout = (canvas: HTMLCanvasElement, shell: HTMLElement, arena: ArenaDimensions): void => {
  canvas.width = arena.width;
  canvas.height = arena.height;
  shell.dataset.orientation = arena.orientation;
  shell.style.setProperty('--arena-ratio', String(arena.width / arena.height));
  shell.style.setProperty('--arena-aspect', `${arena.width} / ${arena.height}`);
};
