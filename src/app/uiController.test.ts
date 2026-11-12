import { createTestAppElements } from '../test/appFixtures';
import { createTestGameState } from '../test/fixtures';
import { createUiController } from './uiController';

describe('createUiController', () => {
  it('switches the interface into active gameplay', () => {
    const elements = createTestAppElements();
    const controller = createUiController(elements, 'touch', jest.fn());

    controller.showPlaying();

    expect(elements.menu.hidden).toBe(true);
    expect(elements.pauseButton.hidden).toBe(false);
    expect(elements.touchActions.hidden).toBe(false);
    expect(elements.gameShell.dataset.mode).toBe('active');
  });

  it('shows a terminal score only once', () => {
    const elements = createTestAppElements();
    const controller = createUiController(elements, 'keyboard', jest.fn());
    const state = createTestGameState({ phase: 'game-over', score: 325, highScore: 500 });

    controller.showTerminal(state);
    controller.showTerminal({ ...state, score: 999 });

    expect(elements.menuMessage.textContent).toBe('Game over. Score: 325.');
    expect(elements.menuHighScore.textContent).toBe('500');
    expect(elements.gameShell.dataset.mode).toBe('terminal');
  });

  it('renders upgrade choices and applies the selected upgrade', () => {
    const elements = createTestAppElements();
    const chooseUpgrade = jest.fn();
    const controller = createUiController(elements, 'keyboard', chooseUpgrade);
    const state = createTestGameState({ phase: 'upgrade', pendingUpgradeChoices: ['wide-paddle'] });

    controller.syncPhase(state);
    elements.upgradeOptions.querySelector('button')?.click();

    expect(elements.upgradeMenu.hidden).toBe(true);
    expect(chooseUpgrade).toHaveBeenCalledWith('wide-paddle');
  });
});
