import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';

export const initializeNativeRuntime = async (onBack: () => void): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  await Promise.allSettled([StatusBar.hide(), KeepAwake.keepAwake(), SplashScreen.hide()]);
  await App.addListener('backButton', onBack);
};
