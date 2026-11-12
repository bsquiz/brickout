import { Constants } from '../constants';
import type { GameEventType } from '../gameplay/types';

export type SoundVoice = {
  frequency: number;
  endFrequency: number;
  delaySeconds: number;
  durationSeconds: number;
  waveform: OscillatorType;
  volume: number;
};

export type NoiseBurst = {
  delaySeconds: number;
  durationSeconds: number;
  volume: number;
  lowpassFrequency: number;
};

export type SoundRecipe = {
  voices: SoundVoice[];
  noise?: NoiseBurst;
};

const voice = (
  frequency: number,
  endFrequency: number = frequency,
  durationSeconds: number = Constants.Audio.Duration.HIT,
  delaySeconds: number = 0,
  waveform: OscillatorType = 'square',
  volume: number = Constants.Audio.Volume.EFFECT
): SoundVoice => ({ frequency, endFrequency, delaySeconds, durationSeconds, waveform, volume });

const getBrickFrequency = (combo: number, brickToneIndex: number): number => {
  const rowOffset = Constants.Audio.BRICK_SCALE[brickToneIndex % Constants.Audio.BRICK_SCALE.length] ?? 0;
  return Constants.Audio.Frequency.BRICK + rowOffset + Math.min(combo, 12) * 18;
};

export const getSoundRecipe = (event: GameEventType, combo: number, brickToneIndex: number): SoundRecipe => {
  switch (event) {
    case Constants.Id.GameEvent.WALL_HIT:
      return { voices: [voice(310, 190, Constants.Audio.Duration.CLICK, 0, 'triangle', 0.045)] };
    case Constants.Id.GameEvent.PADDLE_HIT:
      return { voices: [voice(420, 760, Constants.Audio.Duration.HIT, 0, 'sine', 0.085)] };
    case Constants.Id.GameEvent.PERFECT_RETURN:
      return { voices: [voice(660, 1320, 0.18, 0, 'triangle', 0.09), voice(990, 1480, 0.16, 0.04, 'sine', 0.06)] };
    case Constants.Id.GameEvent.BRICK_HIT: {
      const frequency = getBrickFrequency(combo, brickToneIndex);
      return {
        voices: [voice(frequency, frequency * 0.82, Constants.Audio.Duration.CLICK, 0, 'square', 0.055)],
        noise: { delaySeconds: 0, durationSeconds: 0.035, volume: 0.018, lowpassFrequency: 1800 }
      };
    }
    case Constants.Id.GameEvent.POWERUP:
      return { voices: [
        voice(440, 520, Constants.Audio.Duration.POWERUP_NOTE, 0, 'triangle'),
        voice(660, 740, Constants.Audio.Duration.POWERUP_NOTE, 0.055, 'triangle'),
        voice(880, 1040, Constants.Audio.Duration.POWERUP_NOTE, 0.11, 'triangle')
      ] };
    case Constants.Id.GameEvent.LASER:
      return { voices: [voice(1050, 210, Constants.Audio.Duration.LASER, 0, 'sawtooth', 0.035)] };
    case Constants.Id.GameEvent.ALIEN_WARNING:
      return { voices: [
        voice(130, 165, Constants.Audio.Duration.WARNING, 0, 'square', 0.055),
        voice(165, 130, Constants.Audio.Duration.WARNING, 0.15, 'square', 0.055)
      ] };
    case Constants.Id.GameEvent.ALIEN_SHOT:
      return { voices: [voice(340, 85, 0.14, 0, 'sawtooth', 0.045)] };
    case Constants.Id.GameEvent.ALIEN_HIT:
      return {
        voices: [voice(1080, 95, 0.3, 0, 'triangle', 0.08)],
        noise: { delaySeconds: 0, durationSeconds: 0.22, volume: Constants.Audio.Volume.NOISE, lowpassFrequency: 1200 }
      };
    case Constants.Id.GameEvent.NEAR_MISS:
      return { voices: [voice(880, 1180, 0.1, 0, 'triangle', 0.045)] };
    case Constants.Id.GameEvent.LIFE_LOST:
      return {
        voices: [
          voice(260, 70, Constants.Audio.Duration.EXPLOSION, 0, 'sawtooth', 0.07),
          voice(130, 45, Constants.Audio.Duration.EXPLOSION, 0.045, 'triangle', 0.065)
        ],
        noise: { delaySeconds: 0, durationSeconds: Constants.Audio.Duration.EXPLOSION, volume: 0.05, lowpassFrequency: 800 }
      };
    case Constants.Id.GameEvent.LEVEL_WON:
      return { voices: Constants.Audio.LEVEL_CLEAR_CHORD.map((ratio, index) =>
        voice(Constants.Audio.Frequency.LEVEL_WON * ratio, Constants.Audio.Frequency.LEVEL_WON * ratio, Constants.Audio.Duration.CHORD, index * 0.075, 'sine', 0.065)
      ) };
  }
};

export const getEventFrequencies = (event: GameEventType, combo: number, brickToneIndex: number): number[] =>
  getSoundRecipe(event, combo, brickToneIndex).voices.map(({ frequency }) => frequency);
