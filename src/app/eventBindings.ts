import type { InputController } from '../input/inputController';
import type { AppElements } from './dom';

export type AppEventHandlers = {
  startGame: () => void;
  selectDebugLevel: (value: string) => void;
  toggleAudio: () => void;
  toggleReducedMotion: (enabled: boolean) => void;
  cycleTrail: () => void;
};

export const bindAppEvents = (
  elements: AppElements,
  input: InputController,
  handlers: AppEventHandlers
): (() => void) => {
  const startGame = (): void => handlers.startGame();
  const selectDebugLevel = (): void => handlers.selectDebugLevel(elements.debugLevelSelect.value);
  const dash = (event: PointerEvent): void => {
    event.preventDefault();
    input.state.dash = true;
  };
  const toggleAudio = (): void => handlers.toggleAudio();
  const pause = (): void => { input.state.pause = true; };
  const toggleReducedMotion = (): void => handlers.toggleReducedMotion(elements.reducedMotionInput.checked);
  const cycleTrail = (): void => handlers.cycleTrail();

  elements.startButton.addEventListener('click', startGame);
  elements.debugLevelSelect.addEventListener('change', selectDebugLevel);
  elements.dashButton.addEventListener('pointerdown', dash);
  elements.audioButton.addEventListener('click', toggleAudio);
  elements.pauseButton.addEventListener('click', pause);
  elements.resumeButton.addEventListener('click', pause);
  elements.restartButton.addEventListener('click', startGame);
  elements.reducedMotionInput.addEventListener('change', toggleReducedMotion);
  elements.trailButton.addEventListener('click', cycleTrail);

  return () => {
    elements.startButton.removeEventListener('click', startGame);
    elements.debugLevelSelect.removeEventListener('change', selectDebugLevel);
    elements.dashButton.removeEventListener('pointerdown', dash);
    elements.audioButton.removeEventListener('click', toggleAudio);
    elements.pauseButton.removeEventListener('click', pause);
    elements.resumeButton.removeEventListener('click', pause);
    elements.restartButton.removeEventListener('click', startGame);
    elements.reducedMotionInput.removeEventListener('change', toggleReducedMotion);
    elements.trailButton.removeEventListener('click', cycleTrail);
  };
};
