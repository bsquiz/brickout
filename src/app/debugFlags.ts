export type DebugFlags = {
  debugEnabled: boolean;
  visualizerEnabled: boolean;
};

export const getDebugFlags = (search: string): DebugFlags => {
  const parameters = new URLSearchParams(search);
  const debugEnabled = parameters.get('debug') === 'true';
  return {
    debugEnabled,
    visualizerEnabled: debugEnabled && parameters.get('visualizer') === 'true'
  };
};
