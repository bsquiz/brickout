import { applyCanvasLayout } from './canvasLayout';

describe('canvas layout', () => {
  test('synchronizes the canvas and responsive CSS variables', () => {
    const canvas = document.createElement('canvas');
    const shell = document.createElement('main');
    applyCanvasLayout(canvas, shell, { width: 675, height: 500, hudHeight: 50, orientation: 'landscape' });
    expect(canvas.width).toBe(675);
    expect(canvas.height).toBe(500);
    expect(shell.dataset.orientation).toBe('landscape');
    expect(shell.style.getPropertyValue('--arena-aspect')).toBe('675 / 500');
  });
});
