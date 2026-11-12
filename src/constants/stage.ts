export type StageShapeId = 'standard' | 'wide' | 'tall' | 'grand';

export type StageShape = {
  id: StageShapeId;
  label: string;
  widthMultiplier: number;
  heightMultiplier: number;
};

export const Stage = {
  Shapes: [
    { id: 'standard', label: 'Standard Grid', widthMultiplier: 1, heightMultiplier: 1 },
    { id: 'wide', label: 'Wide Circuit', widthMultiplier: 1.18, heightMultiplier: 1 },
    { id: 'tall', label: 'Deep Shaft', widthMultiplier: 1, heightMultiplier: 1.16 },
    { id: 'grand', label: 'Grand Arena', widthMultiplier: 1.12, heightMultiplier: 1.08 }
  ] as readonly StageShape[]
} as const;
