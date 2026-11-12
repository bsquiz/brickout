import { movePaddle } from './paddleSystem';
import type { GameState, InputState } from '../types';

export const updatePlayerControls = (state: GameState, input: InputState, deltaSeconds: number): void => {
  movePaddle(state, input, deltaSeconds);
};
