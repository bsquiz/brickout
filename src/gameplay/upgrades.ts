import { Constants } from '../constants';
import type { GameState, RunUpgrade } from './types';

export type UpgradeDefinition = {
  label: string;
  description: string;
  apply: (state: GameState) => void;
};

export const UpgradeRegistry: Record<RunUpgrade, UpgradeDefinition> = {
  [Constants.Id.RunUpgrade.WIDE_PADDLE]: {
    label: 'Wide loadout',
    description: 'Start each stage with a wider paddle',
    apply: (state) => { state.paddle.width = Math.max(state.paddle.width, Constants.Entities.Paddle.WIDTH * 1.25); }
  },
  [Constants.Id.RunUpgrade.RESERVE_SHIELD]: {
    label: 'Reserve shield',
    description: 'Start each stage with one shield charge',
    apply: (state) => { state.activeEffects.shieldCharges += 1; }
  },
  [Constants.Id.RunUpgrade.POWERUP_LUCK]: {
    label: 'Powerup luck',
    description: 'Destroyed bricks can reveal bonus powerups',
    apply: () => undefined
  },
  [Constants.Id.RunUpgrade.BULLET_DAMPENER]: {
    label: 'Bullet dampener',
    description: 'Alien bullets move more slowly',
    apply: () => undefined
  }
};

const upgradeOrder: RunUpgrade[] = Object.values(Constants.Id.RunUpgrade);

export const getUpgradeChoices = (owned: RunUpgrade[]): RunUpgrade[] =>
  upgradeOrder.filter((upgrade) => !owned.includes(upgrade)).slice(0, 3);

export const applyOwnedUpgrades = (state: GameState): void => {
  state.upgrades.forEach((upgrade) => UpgradeRegistry[upgrade].apply(state));
};

export const chooseUpgrade = (state: GameState, upgrade: RunUpgrade): boolean => {
  if (!state.pendingUpgradeChoices.includes(upgrade)) return false;
  state.upgrades.push(upgrade);
  state.pendingUpgradeChoices = [];
  UpgradeRegistry[upgrade].apply(state);
  state.phase = Constants.Id.GamePhase.COUNTDOWN;
  return true;
};
