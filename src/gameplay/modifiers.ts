import { Constants } from '../constants';
import type { StageModifier } from './types';

export type StageModifierDefinition = {
  label: string;
  description: string;
};

export const StageModifierRegistry: Record<StageModifier, StageModifierDefinition> = {
  [Constants.Id.StageModifier.STANDARD]: { label: 'Pure signal', description: 'Standard arcade rules' },
  [Constants.Id.StageModifier.LOW_GRAVITY]: { label: 'Low gravity', description: 'Slower vertical ball travel' },
  [Constants.Id.StageModifier.ALIEN_SWARM]: { label: 'Alien swarm', description: 'Aliens arrive more often' },
  [Constants.Id.StageModifier.MOVING_FORTRESS]: { label: 'Moving fortress', description: 'All ordinary bricks drift' },
  [Constants.Id.StageModifier.BLACKOUT]: { label: 'Blackout', description: 'The arena is lit by the ball' }
};

const modifierCycle: StageModifier[] = Object.values(Constants.Id.StageModifier);

export const getStageModifier = (levelIndex: number): StageModifier =>
  modifierCycle[levelIndex % modifierCycle.length] ?? Constants.Id.StageModifier.STANDARD;
