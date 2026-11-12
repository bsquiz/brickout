import { Constants } from '../constants';

export type MenuInputMode = typeof Constants.Ui.InputMode[keyof typeof Constants.Ui.InputMode];

export const getMenuControlHint = (inputMode: MenuInputMode): string =>
  inputMode === Constants.Ui.InputMode.TOUCH ? Constants.Ui.Text.TOUCH_CONTROLS : Constants.Ui.Text.KEYBOARD_CONTROLS;

export const getGameplayControlHint = (inputMode: MenuInputMode): string => getMenuControlHint(inputMode);

export const getInputMode = (hasCoarsePointer: boolean, touchPoints: number): MenuInputMode =>
  hasCoarsePointer || touchPoints > 0 ? Constants.Ui.InputMode.TOUCH : Constants.Ui.InputMode.KEYBOARD;

export const formatHighScore = (score: number): string => Math.max(0, Math.floor(score)).toLocaleString('en-US');
