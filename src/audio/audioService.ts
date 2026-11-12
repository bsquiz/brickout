import { Constants } from '../constants';
import type { GameEventType } from '../gameplay/types';
import type { GamePhase } from '../gameplay/types';
import { approachMusicPlaybackRate } from './music';
import { getSoundRecipe, type NoiseBurst, type SoundVoice } from './soundRecipes';

export type AudioService = {
  enable: () => Promise<void>;
  play: (events: GameEventType[], combo: number, brickToneIndex: number) => void;
  syncMusic: (shouldPlay: boolean) => void;
  syncMusicRate: (targetRate: number, deltaSeconds: number) => void;
  setMuted: (muted: boolean) => void;
  isEnabled: () => boolean;
};

export const shouldPlayMusic = (phase: GamePhase): boolean =>
  phase === Constants.Id.GamePhase.PLAYING ||
  phase === Constants.Id.GamePhase.COUNTDOWN ||
  phase === Constants.Id.GamePhase.LIFE_LOST ||
  phase === Constants.Id.GamePhase.LEVEL_WON ||
  phase === Constants.Id.GamePhase.UPGRADE;

export const createAudioService = (backgroundMusicUrl?: string): AudioService => {
  let context: AudioContext | null = null;
  let muted = false;
  let musicRequested = false;
  const music = backgroundMusicUrl === undefined ? null : new Audio(backgroundMusicUrl);
  if (music !== null) {
    music.loop = true;
    music.preload = 'auto';
    music.volume = 0.28;
    music.preservesPitch = false;
  }

  const syncMusicPlayback = (): void => {
    if (music === null) return;
    if (musicRequested && !muted) {
      if (music.paused) void music.play().catch(() => undefined);
    } else {
      music.pause();
    }
  };

  const enable = async (): Promise<void> => {
    context ??= new AudioContext();
    await context.resume();
    syncMusicPlayback();
  };

  const playVoice = (sound: SoundVoice): void => {
    if (muted || context === null || context.state !== 'running') return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startTime = context.currentTime + sound.delaySeconds;
    const endTime = startTime + sound.durationSeconds;
    oscillator.frequency.setValueAtTime(sound.frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, sound.endFrequency), endTime);
    oscillator.type = sound.waveform;
    gain.gain.setValueAtTime(sound.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  };

  const playNoise = (sound: NoiseBurst): void => {
    if (muted || context === null || context.state !== 'running') return;
    const frameCount = Math.ceil(context.sampleRate * sound.durationSeconds);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const startTime = context.currentTime + sound.delaySeconds;
    const endTime = startTime + sound.durationSeconds;
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(sound.lowpassFrequency, startTime);
    filter.frequency.exponentialRampToValueAtTime(120, endTime);
    gain.gain.setValueAtTime(sound.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startTime);
    source.stop(endTime);
  };

  return {
    enable,
    play: (events, combo, brickToneIndex) => events.forEach((event) => {
      const recipe = getSoundRecipe(event, combo, brickToneIndex);
      recipe.voices.forEach(playVoice);
      if (recipe.noise !== undefined) playNoise(recipe.noise);
    }),
    syncMusic: (shouldPlay) => {
      musicRequested = shouldPlay;
      syncMusicPlayback();
    },
    syncMusicRate: (targetRate, deltaSeconds) => {
      if (music === null) return;
      music.playbackRate = approachMusicPlaybackRate(music.playbackRate, targetRate, deltaSeconds);
    },
    setMuted: (value) => {
      muted = value;
      syncMusicPlayback();
    },
    isEnabled: () => context?.state === 'running'
  };
};
