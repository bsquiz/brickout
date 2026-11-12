import { Constants } from '../constants';
import type { TrailStyle } from '../gameplay/types';

export type Preferences = {
  highScore: number;
  muted: boolean;
  reducedMotion: boolean;
  selectedTrail: TrailStyle;
};

const defaults: Preferences = { highScore: 0, muted: false, reducedMotion: false, selectedTrail: Constants.Id.TrailStyle.CLASSIC };
const trailStyles: readonly string[] = Object.values(Constants.Id.TrailStyle);

export const loadPreferences = (): Preferences => {
  try {
    const stored = localStorage.getItem(Constants.Storage.PREFERENCES_KEY);
    if (stored === null) return { ...defaults };
    const value = JSON.parse(stored) as Partial<Preferences>;
    return {
      highScore: typeof value.highScore === 'number' && value.highScore >= 0 ? value.highScore : 0,
      muted: value.muted === true,
      reducedMotion: value.reducedMotion === true,
      selectedTrail: trailStyles.includes(value.selectedTrail ?? '') ? value.selectedTrail as TrailStyle : Constants.Id.TrailStyle.CLASSIC
    };
  } catch {
    return { ...defaults };
  }
};

export const savePreferences = (preferences: Preferences): void => {
  try {
    localStorage.setItem(Constants.Storage.PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Storage may be unavailable in private browsing; gameplay can continue.
  }
};
