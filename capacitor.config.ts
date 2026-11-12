import type { CapacitorConfig } from '@capacitor/cli';
import { MobileApp } from './src/build/mobile';

const config: CapacitorConfig = {
  appId: MobileApp.ID,
  appName: MobileApp.NAME,
  webDir: MobileApp.WEB_DIRECTORY,
  android: {
    backgroundColor: '#07111f'
  }
};

export default config;
