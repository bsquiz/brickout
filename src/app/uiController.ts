import { Constants } from '../constants';
import type { RunUpgrade, GameState } from '../gameplay/types';
import { UpgradeRegistry } from '../gameplay/upgrades';
import { formatHighScore, getGameplayControlHint, type MenuInputMode } from '../ui/menu';
import type { AppElements } from './dom';

export type UiController = {
  showPlaying: () => void;
  showTerminal: (state: GameState) => void;
  syncPhase: (state: GameState) => void;
};

export const createUiController = (
  elements: AppElements,
  inputMode: MenuInputMode,
  chooseUpgrade: (upgrade: RunUpgrade) => void
): UiController => {
  let terminalMenuShown = false;

  const showPlaying = (): void => {
    elements.menu.hidden = true;
    elements.pauseMenu.hidden = true;
    elements.pauseButton.hidden = false;
    elements.gameplayHint.hidden = false;
    elements.touchActions.hidden = inputMode !== Constants.Ui.InputMode.TOUCH;
    elements.gameplayHint.textContent = getGameplayControlHint(inputMode);
    elements.upgradeMenu.hidden = true;
    elements.gameShell.dataset.mode = Constants.Ui.Mode.ACTIVE;
    terminalMenuShown = false;
  };

  const showTerminal = (state: GameState): void => {
    const terminal = state.phase === Constants.Id.GamePhase.GAME_OVER || state.phase === Constants.Id.GamePhase.GAME_WON;
    if (terminalMenuShown || !terminal) return;
    terminalMenuShown = true;
    elements.menuMessage.textContent = state.phase === Constants.Id.GamePhase.GAME_WON
      ? `You won with ${state.score} points.`
      : `Game over. Score: ${state.score}.`;
    elements.menuHighScore.textContent = formatHighScore(state.highScore);
    elements.startButton.textContent = Constants.Ui.Text.PLAY_AGAIN;
    elements.menu.hidden = false;
    elements.pauseMenu.hidden = true;
    elements.pauseButton.hidden = true;
    elements.gameplayHint.hidden = true;
    elements.touchActions.hidden = true;
    elements.upgradeMenu.hidden = true;
    elements.gameShell.dataset.mode = Constants.Ui.Mode.TERMINAL;
  };

  const renderUpgradeChoices = (state: GameState): void => {
    elements.upgradeOptions.replaceChildren();
    state.pendingUpgradeChoices.forEach((upgrade) => {
      const definition = UpgradeRegistry[upgrade];
      const button = document.createElement('button');
      const title = document.createElement('strong');
      const description = document.createElement('span');
      title.textContent = definition.label;
      description.textContent = definition.description;
      button.append(title, description);
      button.addEventListener('click', () => {
        chooseUpgrade(upgrade);
        elements.upgradeMenu.hidden = true;
      });
      elements.upgradeOptions.append(button);
    });
  };

  const syncPhase = (state: GameState): void => {
    const paused = state.phase === Constants.Id.GamePhase.PAUSED;
    elements.pauseMenu.hidden = !paused;
    elements.pauseButton.hidden = paused || state.phase === Constants.Id.GamePhase.LIFE_LOST;
    if (!terminalMenuShown) elements.gameShell.dataset.mode = paused ? Constants.Ui.Mode.PAUSED : Constants.Ui.Mode.ACTIVE;
    if (paused) elements.resumeButton.focus();
    if (state.phase === Constants.Id.GamePhase.UPGRADE) {
      renderUpgradeChoices(state);
      elements.upgradeMenu.hidden = false;
    } else {
      elements.upgradeMenu.hidden = true;
    }
  };

  return { showPlaying, showTerminal, syncPhase };
};
