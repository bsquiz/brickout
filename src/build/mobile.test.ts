import { MobileApp } from './mobile';

describe('mobile build configuration', () => {
  test('uses a valid Android application id and Vite output directory', () => {
    expect(MobileApp.ID).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/);
    expect(MobileApp.NAME).toBe('Brickout');
    expect(MobileApp.WEB_DIRECTORY).toBe('dist');
  });
});
