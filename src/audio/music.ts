import { Constants } from '../constants';
import { clamp01 } from '../utils/math';

export const getMusicPlaybackRate = (slowMotionRemaining: number, remainingBrickRatio = 1, rallyHeat = 0): number =>
  slowMotionRemaining > 0
    ? Constants.Audio.Music.SLOW_PLAYBACK_RATE
    : remainingBrickRatio <= 0.2
      ? Constants.Audio.Music.URGENT_PLAYBACK_RATE
      : Constants.Audio.Music.NORMAL_PLAYBACK_RATE + clamp01(rallyHeat) * Constants.Game.RallyHeat.MUSIC_RATE_BONUS;

export const approachMusicPlaybackRate = (current: number, target: number, deltaSeconds: number): number => {
  const maximumChange = Constants.Audio.Music.RATE_TRANSITION_PER_SECOND * Math.max(0, deltaSeconds);
  const difference = target - current;
  return current + Math.sign(difference) * Math.min(Math.abs(difference), maximumChange);
};
