import { Constants } from '../constants';
import { loadPreferences, savePreferences } from './preferences';

describe('preferences', () => {
  beforeEach(() => localStorage.clear());

  test('round-trips the high score and accessibility settings', () => {
    savePreferences({ highScore: 420, muted: true, reducedMotion: true, selectedTrail: 'neon' });
    expect(loadPreferences()).toEqual({ highScore: 420, muted: true, reducedMotion: true, selectedTrail: 'neon' });
  });

  test('falls back safely when stored data is malformed', () => {
    localStorage.setItem(Constants.Storage.PREFERENCES_KEY, '{broken');
    expect(loadPreferences()).toEqual({ highScore: 0, muted: false, reducedMotion: false, selectedTrail: 'classic' });
  });
});
