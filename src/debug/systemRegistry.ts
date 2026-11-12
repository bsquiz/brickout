import { UpdateSystem } from '../gameplay/updateTrace';

export const RuntimeSystem = {
  ...UpdateSystem,
  FEEDBACK: 'feedback',
  RENDER: 'render'
} as const;

export type RuntimeSystemId = typeof RuntimeSystem[keyof typeof RuntimeSystem];

export type RuntimeSystemDefinition = {
  id: RuntimeSystemId;
  label: string;
  description: string;
  source: string;
  color: string;
};

export const RuntimeSystemRegistry: readonly RuntimeSystemDefinition[] = [
  { id: RuntimeSystem.EFFECTS, label: 'Effects', description: 'Advances particles, trails, banners, and camera effects.', source: 'gameplay/effects.ts', color: '#c084fc' },
  { id: RuntimeSystem.PHASE, label: 'Phase', description: 'Handles pause, countdown, life loss, and level transitions.', source: 'gameplay/systems/phaseSystem.ts', color: '#38bdf8' },
  { id: RuntimeSystem.TIMERS, label: 'Timers', description: 'Counts down active powerups and temporary game states.', source: 'gameplay/systems/timerSystem.ts', color: '#67e8f9' },
  { id: RuntimeSystem.CONTROLS, label: 'Controls', description: 'Turns keyboard, pointer, and touch input into player movement.', source: 'gameplay/systems/playerControlSystem.ts', color: '#22d3ee' },
  { id: RuntimeSystem.BRICKS, label: 'Bricks', description: 'Updates moving, regenerating, frozen, and explosive bricks.', source: 'gameplay/systems/brickSystem.ts', color: '#fb7185' },
  { id: RuntimeSystem.BALLS, label: 'Balls + collisions', description: 'Moves balls and resolves walls, paddles, bricks, portals, and aliens.', source: 'gameplay/systems/ballSystem.ts', color: '#f8fafc' },
  { id: RuntimeSystem.POWERUPS, label: 'Powerups', description: 'Moves pickups and applies collected effects.', source: 'gameplay/updatePowerups.ts', color: '#a3e635' },
  { id: RuntimeSystem.PROJECTILES, label: 'Projectiles', description: 'Moves player lasers and resolves their impacts.', source: 'gameplay/systems/projectileSystem.ts', color: '#facc15' },
  { id: RuntimeSystem.ALIENS, label: 'Aliens', description: 'Spawns enemies, moves them, and updates enemy fire.', source: 'gameplay/updateAlien.ts', color: '#fb923c' },
  { id: RuntimeSystem.COMPLETION, label: 'Completion', description: 'Checks whether the level has been cleared.', source: 'gameplay/systems/levelSystem.ts', color: '#2dd4bf' },
  { id: RuntimeSystem.FEEDBACK, label: 'Audio + haptics', description: 'Turns game events into sound, music changes, and vibration.', source: 'app/gameLoop.ts', color: '#f472b6' },
  { id: RuntimeSystem.RENDER, label: 'Render', description: 'Draws the current game state to the canvas.', source: 'render/gameRenderer.ts', color: '#20d9ff' }
];
