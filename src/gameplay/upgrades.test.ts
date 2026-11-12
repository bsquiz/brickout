import { createTestGameState } from '../test/fixtures';
import { chooseUpgrade, getUpgradeChoices } from './upgrades';

describe('run upgrades', () => {
  test('does not offer an upgrade that is already owned', () => {
    expect(getUpgradeChoices(['wide-paddle'])).not.toContain('wide-paddle');
  });

  test('applies a selected upgrade and resumes the countdown', () => {
    const state = createTestGameState({ phase: 'upgrade', pendingUpgradeChoices: ['reserve-shield'] });
    expect(chooseUpgrade(state, 'reserve-shield')).toBe(true);
    expect(state.activeEffects.shieldCharges).toBe(1);
    expect(state.phase).toBe('countdown');
  });
});
