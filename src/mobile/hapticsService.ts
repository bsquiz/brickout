import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Constants } from '../constants';
import type { GameEventType } from '../gameplay/types';

export type HapticKind = typeof Constants.Haptics.Kind[keyof typeof Constants.Haptics.Kind];

export const getHapticKind = (events: GameEventType[]): HapticKind | null => {
  if (events.includes(Constants.Id.GameEvent.LIFE_LOST)) return Constants.Haptics.Kind.HEAVY;
  if (events.includes(Constants.Id.GameEvent.PERFECT_RETURN) || events.includes(Constants.Id.GameEvent.POWERUP) || events.includes(Constants.Id.GameEvent.ALIEN_HIT)) return Constants.Haptics.Kind.MEDIUM;
  if (events.includes(Constants.Id.GameEvent.NEAR_MISS) || events.includes(Constants.Id.GameEvent.BRICK_HIT)) return Constants.Haptics.Kind.LIGHT;
  return null;
};

export const provideHaptics = async (events: GameEventType[], reducedMotion: boolean): Promise<void> => {
  if (reducedMotion) return;
  const kind = getHapticKind(events);
  if (kind === null) return;
  if (Capacitor.isNativePlatform()) {
    if (kind === Constants.Haptics.Kind.HEAVY) await Haptics.notification({ type: NotificationType.Error });
    else await Haptics.impact({ style: kind === Constants.Haptics.Kind.MEDIUM ? ImpactStyle.Medium : ImpactStyle.Light });
    return;
  }
  if (typeof navigator.vibrate === 'function') navigator.vibrate(
    kind === Constants.Haptics.Kind.HEAVY
      ? Constants.Haptics.Duration.HEAVY_MS
      : kind === Constants.Haptics.Kind.MEDIUM
        ? Constants.Haptics.Duration.MEDIUM_MS
        : Constants.Haptics.Duration.LIGHT_MS
  );
};
