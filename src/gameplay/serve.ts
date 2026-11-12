import { Constants } from '../constants';
import type { GameState, InputState } from './types';

export const updateServeAim = (state: GameState, input: InputState, deltaSeconds: number): void => {
  if (state.ball.launched) return;
  const direction = Number(input.right) - Number(input.left);
  state.serveAim += direction * Constants.Game.Serve.AIM_CHANGE_PER_SECOND * deltaSeconds;
  state.serveAim = Math.max(
    -Constants.Game.Serve.MAX_HORIZONTAL_RATIO,
    Math.min(Constants.Game.Serve.MAX_HORIZONTAL_RATIO, state.serveAim)
  );
};
