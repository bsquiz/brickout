import type { InputController } from '../input/inputController';
import { createTestAppElements } from '../test/appFixtures';
import { bindAppEvents, type AppEventHandlers } from './eventBindings';

const createTestInputController = (): InputController => ({
  state: { left: false, right: false, launch: false, pause: false, dash: false, paddleTargetX: null },
  endFrame: jest.fn(),
  destroy: jest.fn()
});

const createTestHandlers = (): AppEventHandlers => ({
  startGame: jest.fn(),
  selectDebugLevel: jest.fn(),
  toggleAudio: jest.fn(),
  toggleReducedMotion: jest.fn(),
  cycleTrail: jest.fn()
});

describe('bindAppEvents', () => {
  it('routes controls to application handlers and input state', () => {
    const elements = createTestAppElements();
    const input = createTestInputController();
    const handlers = createTestHandlers();
    elements.debugLevelSelect.append(new Option('Level 2', '1'));
    elements.debugLevelSelect.value = '1';
    elements.reducedMotionInput.checked = true;
    bindAppEvents(elements, input, handlers);

    elements.startButton.click();
    elements.debugLevelSelect.dispatchEvent(new Event('change'));
    elements.reducedMotionInput.dispatchEvent(new Event('change'));
    elements.dashButton.dispatchEvent(new Event('pointerdown'));

    expect(handlers.startGame).toHaveBeenCalledTimes(1);
    expect(handlers.selectDebugLevel).toHaveBeenCalledWith('1');
    expect(handlers.toggleReducedMotion).toHaveBeenCalledWith(true);
    expect(input.state.dash).toBe(true);
  });

  it('returns an unbind function', () => {
    const elements = createTestAppElements();
    const handlers = createTestHandlers();
    const unbind = bindAppEvents(elements, createTestInputController(), handlers);

    unbind();
    elements.startButton.click();

    expect(handlers.startGame).not.toHaveBeenCalled();
  });
});
