export const UpdateSystem = {
  EFFECTS: 'effects',
  PHASE: 'phase',
  TIMERS: 'timers',
  CONTROLS: 'controls',
  BRICKS: 'bricks',
  BALLS: 'balls',
  POWERUPS: 'powerups',
  PROJECTILES: 'projectiles',
  ALIENS: 'aliens',
  COMPLETION: 'completion'
} as const;

export type UpdateSystemId = typeof UpdateSystem[keyof typeof UpdateSystem];

export type UpdateObserver = {
  start: (system: UpdateSystemId) => void;
  end: (system: UpdateSystemId) => void;
};
