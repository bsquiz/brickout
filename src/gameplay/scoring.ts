import { Constants } from '../constants';

export const getRallyMultiplier = (rallyHits: number): number =>
  Math.min(Constants.Game.Combo.MAX_RALLY_MULTIPLIER, 1 + Math.floor(Math.max(0, rallyHits - 1) / 3));

export const getBrickScore = (basePoints: number, combo: number, rallyHits: number): number =>
  basePoints * Math.max(1, combo) * getRallyMultiplier(rallyHits);
