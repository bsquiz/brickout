import { Constants } from '../constants';
import { approachMusicPlaybackRate, getMusicPlaybackRate } from './music';

describe('background music playback rate', () => {
  test('slows while the slow-motion effect is active', () => {
    expect(getMusicPlaybackRate(1)).toBe(Constants.Audio.Music.SLOW_PLAYBACK_RATE);
    expect(getMusicPlaybackRate(0)).toBe(Constants.Audio.Music.NORMAL_PLAYBACK_RATE);
  });

  test('raises the intensity when few bricks remain', () => {
    expect(getMusicPlaybackRate(0, 0.15)).toBe(Constants.Audio.Music.URGENT_PLAYBACK_RATE);
    expect(getMusicPlaybackRate(1, 0.15)).toBe(Constants.Audio.Music.SLOW_PLAYBACK_RATE);
  });

  test('raises playback energy with rally heat', () => {
    expect(getMusicPlaybackRate(0, 1, 1)).toBeCloseTo(Constants.Audio.Music.NORMAL_PLAYBACK_RATE + Constants.Game.RallyHeat.MUSIC_RATE_BONUS);
  });

  test('moves toward the target without overshooting', () => {
    expect(approachMusicPlaybackRate(1, 0.7, 0.01)).toBeCloseTo(0.955);
    expect(approachMusicPlaybackRate(0.99, 1, 1)).toBe(1);
  });
});
