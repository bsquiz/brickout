import { createInputController } from './inputController';

const createPointerEvent = (type: string, clientX: number, clientY = 250): PointerEvent => {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY });
  Object.defineProperty(event, 'pointerId', { value: 1 });
  return event as PointerEvent;
};

describe('createInputController', () => {
  test('maps canvas touches to game coordinates and retains quick launch taps for one frame', () => {
    const canvas = document.createElement('canvas');
    canvas.setPointerCapture = jest.fn();
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 0,
      left: 100,
      right: 1100,
      top: 0,
      bottom: 500,
      width: 1000,
      height: 500,
      toJSON: () => ({})
    });
    const input = createInputController(canvas, () => ({ width: 500, height: 500 }));

    canvas.dispatchEvent(createPointerEvent('pointerdown', 600));
    expect(input.state.paddleTargetX).toBe(250);
    canvas.dispatchEvent(createPointerEvent('pointerup', 600));

    expect(input.state.paddleTargetX).toBeNull();
    expect(input.state.launch).toBe(true);
    input.endFrame();
    expect(input.state.launch).toBe(false);
    input.destroy();
  });

  test('uses the active landscape arena width for touch coordinates', () => {
    const canvas = document.createElement('canvas');
    canvas.setPointerCapture = jest.fn();
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      x: 0, y: 0, left: 0, right: 900, top: 0, bottom: 500, width: 900, height: 500, toJSON: () => ({})
    });
    const input = createInputController(canvas, () => ({ width: 900, height: 500 }));
    canvas.dispatchEvent(createPointerEvent('pointerdown', 675));
    expect(input.state.paddleTargetX).toBe(675);
    input.destroy();
  });


  test.each(['ShiftLeft', 'ShiftRight'])('activates boost directly with %s', (code) => {
    const canvas = document.createElement('canvas');
    const input = createInputController(canvas);

    window.dispatchEvent(new KeyboardEvent('keydown', { code }));

    expect(input.state.dash).toBe(true);
    input.endFrame();
    expect(input.state.dash).toBe(false);
    input.destroy();
  });

  test('does not boost from double-tapping a direction key', () => {
    const canvas = document.createElement('canvas');
    const input = createInputController(canvas);
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));

    expect(input.state.dash).toBe(false);
    input.destroy();
  });
});
