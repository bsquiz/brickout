const createCenterBarrierStage = (): unknown[] => [
  ...Array.from({ length: 8 }, (_, rowIndex) => Array.from({ length: 10 }, (_, columnIndex) =>
    rowIndex === 0 && columnIndex === 4 ? { powerup: 'score-500' } : {}
  )),
  Array.from({ length: 10 }, () => null),
  Array.from({ length: 10 }, () => null),
  [null, null, ...Array.from({ length: 6 }, () => ({ behavior: 'indestructible' })), null, null]
];

export const rawLevels: unknown = [
  [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [{ powerup: 'score-100' }, { powerup: 'multiball' }, {}, { behavior: 'explosive' }, {}, { powerup: 'shield' }, {}],
    [{ hitPoints: 1, powerup: 'super-ball' }, {}, { powerup: 'sticky' }, { powerup: 'speed-up' }, { powerup: 'laser' }, {}, {}]
  ],
  [
    [{ behavior: 'armored' }, { behavior: 'frozen' }, { behavior: 'portal', portalId: 'cyan' }, { behavior: 'moving' }, { behavior: 'directional', direction: 'up' }, { behavior: 'lightning' }, { behavior: 'regenerating' }, { behavior: 'portal', portalId: 'cyan' }, { behavior: 'directional', direction: 'down' }, { behavior: 'boost' }],
    [null, {}, null, { powerup: 'slow-motion' }, null, {}, null, { powerup: 'expand' }, null, {}]
  ],
  [
    [null, null, null, null, {}, {}, null, null, null, null],
    [null, null, null, {}, {}, {}, {}, null, null, null],
    [null, null, { behavior: 'directional', direction: 'left' }, { behavior: 'lightning' }, {}, {}, { behavior: 'frozen' }, { behavior: 'directional', direction: 'right' }, null, null],
    [null, {}, {}, {}, {}, {}, { powerup: 'expand' }, {}, {}, null],
    [null, null, {}, {}, {}, {}, {}, {}, null, null],
    [null, null, null, {}, {}, {}, {}, null, null, null],
    [null, null, null, null, {}, {}, null, null, null, null]
  ],
  [
    [null, null, null, null, null, null, null, null, null, null],
    [null, {}, {}, null, null, null, null, {}, {}, null],
    [null, {}, {}, null, null, null, null, {}, {}, null],
    [null, {}, {}, {}, null, null, {}, {}, {}, null],
    [null, null, {}, {}, null, null, {}, {}, null, null],
    [null, null, null, {}, {}, {}, {}, null, null, null],
    [null, null, null, null, {}, {}, null, null, null, null]
  ],
  [
    Array.from({ length: 10 }, (_, index) => ({ hitPoints: 2, behavior: index === 4 ? 'indestructible' : 'armored' })),
    [{}, null, {}, null, {}, null, {}, null, {}, null],
    [null, {}, null, {}, null, {}, null, {}, null, {}],
    [{}, null, {}, null, {}, null, {}, null, {}, null],
    [{}, {}, { powerup: 'score-200' }, {}, {}, { powerup: 'expand' }, {}, {}, {}, {}]
  ],
  [
    [null, null, null, null, null, null, null, null, null, null],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  ],
  [
    [{}, null, {}, null, null, null, {}, null, {}, null],
    [null, {}, null, {}, null, {}, null, {}, null, {}],
    [{}, null, {}, null, {}, null, {}, null, {}, null],
    [null, {}, null, {}, null, {}, null, {}, null, {}],
    [null, null, {}, null, {}, null, {}, null, null, null]
  ],
  [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, { powerup: 'super-ball' }, {}, {}, {}, {}, {}, {}, {}, {}]
  ],
  [
    [{}, null, {}, {}, {}, null, null, {}, {}, {}],
    [{}, null, {}, null, {}, null, null, {}, null, null],
    [{}, null, {}, null, {}, null, null, {}, null, null],
    [{}, null, {}, null, {}, null, null, {}, null, null],
    [{}, null, {}, null, {}, {}, {}, {}, null, null]
  ],
  createCenterBarrierStage()
];
