import { Constants } from '../constants';
import type { InputState } from '../gameplay/types';

type DirectionControl = 'left' | 'right';

const keyControls: Partial<Record<string, DirectionControl>> = {
  [Constants.Input.Keyboard.Keys.LEFT]: 'left',
  [Constants.Input.Keyboard.Keys.RIGHT]: 'right'
};

export type InputController = {
  state: InputState;
  endFrame: () => void;
  destroy: () => void;
};

export const createInputController = (
  canvas: HTMLCanvasElement,
  getArena = (): { width: number; height: number } => ({ width: canvas.width, height: canvas.height }),
  now = (): number => performance.now()
): InputController => {
  const state: InputState = { left: false, right: false, launch: false, pause: false, dash: false, paddleTargetX: null };
  let activePointerId: number | null = null;
  const lastDirectionTap: Record<'left' | 'right', number | null> = { left: null, right: null };

  const setKeyboardControl = (event: KeyboardEvent, pressed: boolean): void => {
    if (event.code === Constants.Input.Keyboard.Keys.LAUNCH) {
      event.preventDefault();
      if (pressed && !event.repeat) state.launch = true;
      return;
    }
    if (event.code === Constants.Input.Keyboard.Keys.PAUSE || event.code === Constants.Input.Keyboard.Keys.ESCAPE) {
      event.preventDefault();
      if (pressed && !event.repeat) state.pause = true;
      return;
    }
    if (event.code === Constants.Input.Keyboard.Keys.BOOST_LEFT || event.code === Constants.Input.Keyboard.Keys.BOOST_RIGHT) {
      event.preventDefault();
      if (pressed && !event.repeat) state.dash = true;
      return;
    }
    const control = keyControls[event.code];
    if (control === undefined) return;
    event.preventDefault();
    if (pressed && !event.repeat && (control === 'left' || control === 'right')) {
      const timestamp = now();
      const previousTap = lastDirectionTap[control];
      if (previousTap !== null && timestamp - previousTap <= Constants.Input.Keyboard.DOUBLE_TAP_WINDOW_MS) {
        state.dash = true;
        lastDirectionTap[control] = null;
      } else lastDirectionTap[control] = timestamp;
    }
    state[control] = pressed;
  };
  const onKeyDown = (event: KeyboardEvent): void => setKeyboardControl(event, true);
  const onKeyUp = (event: KeyboardEvent): void => setKeyboardControl(event, false);

  const updatePointerTarget = (event: PointerEvent): void => {
    const bounds = canvas.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const arena = getArena();
    state.paddleTargetX = relativeX * (arena.width / bounds.width);
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (activePointerId !== null) return;
    event.preventDefault();
    activePointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    updatePointerTarget(event);
    state.launch = true;
  };
  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== activePointerId) return;
    event.preventDefault();
    updatePointerTarget(event);
  };
  const releasePointer = (event: PointerEvent): void => {
    if (event.pointerId !== activePointerId) return;
    activePointerId = null;
    state.paddleTargetX = null;
  };
  const releaseAll = (): void => {
    state.left = false;
    state.right = false;
    state.paddleTargetX = null;
    activePointerId = null;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', releaseAll);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  return {
    state,
    endFrame: () => {
      state.launch = false;
      state.pause = false;
      state.dash = false;
    },
    destroy: () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', releasePointer);
      canvas.removeEventListener('pointercancel', releasePointer);
    }
  };
};
