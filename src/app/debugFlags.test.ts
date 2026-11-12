import { getDebugFlags } from './debugFlags';

describe('getDebugFlags', () => {
  it('enables the visualizer only when debug mode is also enabled', () => {
    expect(getDebugFlags('?visualizer=true')).toEqual({ debugEnabled: false, visualizerEnabled: false });
    expect(getDebugFlags('?debug=true&visualizer=true')).toEqual({ debugEnabled: true, visualizerEnabled: true });
  });

  it('supports debug mode without the visualizer', () => {
    expect(getDebugFlags('?debug=true')).toEqual({ debugEnabled: true, visualizerEnabled: false });
  });
});
