import backgroundMusicUrl from '../../assets/bgm.mp3';
import alienSpritesUrl from '../../assets/aliens-animated.png';
import ballSpritesUrl from '../../assets/balls.png';
import brickBaseSpriteUrl from '../../assets/brick-base.png';
import brickOverlaySpritesUrl from '../../assets/brick-overlays.png';
import paddleSpritesUrl from '../../assets/paddle.png';
import powerupSpritesUrl from '../../assets/powerups.png';
import { createAudioService } from '../audio/audioService';
import { Constants } from '../constants';
import { rawLevels } from '../data/levels';
import { validateLevels } from '../data/validateLevel';
import { createCodeVisualizer } from '../debug/codeVisualizer';
import { createTraceCollector } from '../debug/traceCollector';
import { getNextTrailStyle } from '../entities/trail';
import { getArenaDimensions } from '../gameplay/arena';
import { createGameState, loadLevel, resizeGameArena } from '../gameplay/gameState';
import { chooseUpgrade } from '../gameplay/upgrades';
import { createInputController } from '../input/inputController';
import { initializeNativeRuntime } from '../mobile/nativeRuntime';
import { createRenderAssets } from '../render/assets';
import { createFpsTracker } from '../render/debug';
import { loadPreferences, savePreferences } from '../storage/preferences';
import { applyCanvasLayout } from '../ui/canvasLayout';
import { createDebugLevelOptions, parseDebugLevelIndex } from '../ui/debugLevelSelect';
import { formatHighScore, getInputMode, getMenuControlHint } from '../ui/menu';
import { getDebugFlags } from './debugFlags';
import { getAppElements } from './dom';
import { bindAppEvents } from './eventBindings';
import { createGameLoop } from './gameLoop';
import { createUiController } from './uiController';

export type Application = {
  start: () => void;
  destroy: () => void;
};

export const createApplication = (): Application => {
  const elements = getAppElements();
  const levels = validateLevels(rawLevels);
  const firstLevel = levels[0];
  if (firstLevel === undefined) throw new Error('At least one level is required');

  const audio = createAudioService(backgroundMusicUrl);
  const renderAssets = createRenderAssets(
    ballSpritesUrl,
    paddleSpritesUrl,
    brickBaseSpriteUrl,
    brickOverlaySpritesUrl,
    powerupSpritesUrl,
    alienSpritesUrl
  );
  const preferences = loadPreferences();
  const inputMode = getInputMode(window.matchMedia('(pointer: coarse)').matches, navigator.maxTouchPoints);
  const { debugEnabled, visualizerEnabled } = getDebugFlags(window.location.search);
  const getViewportArena = () => getArenaDimensions(
    window.visualViewport?.width ?? window.innerWidth,
    window.visualViewport?.height ?? window.innerHeight
  );
  let currentArena = getViewportArena();
  let state = createGameState({
    level: firstLevel,
    phase: Constants.Id.GamePhase.MENU,
    highScore: preferences.highScore,
    reducedMotion: preferences.reducedMotion,
    trailStyle: preferences.selectedTrail,
    arena: currentArena,
    randomSeed: Date.now()
  });
  let persistedHighScore = preferences.highScore;
  let selectedLevelIndex = 0;

  const input = createInputController(elements.canvas, () => state.arena);
  const trace = visualizerEnabled ? createTraceCollector() : null;
  const codeVisualizer = visualizerEnabled ? createCodeVisualizer({
    root: elements.codeVisualizer,
    pipeline: elements.codePipeline,
    frame: elements.codeFrame,
    phase: elements.codePhase,
    entities: elements.codeEntities,
    events: elements.codeEvents,
    inspectorTitle: elements.codeInspectorTitle,
    inspectorDescription: elements.codeInspectorDescription,
    inspectorSource: elements.codeInspectorSource
  }) : null;
  const ui = createUiController(elements, inputMode, (upgrade) => { chooseUpgrade(state, upgrade); });
  const applyArenaLayout = (): void => applyCanvasLayout(elements.canvas, elements.gameShell, state.arena);

  const gameLoop = createGameLoop({
    canvas: elements.canvas,
    context: elements.context,
    input,
    audio,
    renderAssets,
    fpsTracker: createFpsTracker(),
    levels,
    debugEnabled,
    getState: () => state,
    applyArenaLayout,
    onPhaseChange: ui.syncPhase,
    onHighScore: (highScore) => {
      if (highScore <= persistedHighScore) return;
      persistedHighScore = highScore;
      preferences.highScore = highScore;
      savePreferences(preferences);
    },
    afterFrame: ui.showTerminal,
    trace,
    updateVisualizer: (currentState, currentTrace, timestamp) => {
      codeVisualizer?.update(currentState, currentTrace, timestamp);
    }
  });

  const startGame = (): void => {
    const selectedLevel = levels[selectedLevelIndex] ?? firstLevel;
    state = createGameState({
      level: selectedLevel,
      phase: Constants.Id.GamePhase.PLAYING,
      highScore: persistedHighScore,
      reducedMotion: preferences.reducedMotion,
      trailStyle: preferences.selectedTrail,
      arena: currentArena,
      randomSeed: Date.now()
    });
    if (selectedLevelIndex > 0) {
      state.levelIndex = selectedLevelIndex;
      loadLevel(state, selectedLevel);
    }
    applyArenaLayout();
    ui.showPlaying();
    gameLoop.resetClock();
    audio.syncMusic(true);
    void audio.enable();
  };

  const unbindEvents = bindAppEvents(elements, input, {
    startGame,
    selectDebugLevel: (value) => { selectedLevelIndex = parseDebugLevelIndex(value, levels.length); },
    toggleAudio: () => {
      void audio.enable().then(() => {
        preferences.muted = !preferences.muted && elements.audioButton.getAttribute('aria-pressed') === 'true';
        if (elements.audioButton.getAttribute('aria-pressed') !== 'true') preferences.muted = false;
        audio.setMuted(preferences.muted);
        elements.audioButton.textContent = preferences.muted ? 'Sound off' : 'Sound on';
        elements.audioButton.setAttribute('aria-pressed', String(!preferences.muted));
        savePreferences(preferences);
      });
    },
    toggleReducedMotion: (enabled) => {
      preferences.reducedMotion = enabled;
      state.reducedMotion = enabled;
      savePreferences(preferences);
    },
    cycleTrail: () => {
      preferences.selectedTrail = getNextTrailStyle(preferences.selectedTrail, persistedHighScore);
      state.trailStyle = preferences.selectedTrail;
      elements.trailButton.textContent = `Trail: ${preferences.selectedTrail}`;
      savePreferences(preferences);
    }
  });

  const handleViewportResize = (): void => {
    const nextArena = getViewportArena();
    if (nextArena.orientation === currentArena.orientation) return;
    currentArena = nextArena;
    resizeGameArena(state, nextArena);
    applyArenaLayout();
  };

  const initializeUi = (): void => {
    elements.debugLevelControl.hidden = !debugEnabled;
    elements.codeVisualizer.hidden = !visualizerEnabled;
    if (debugEnabled) {
      const options = createDebugLevelOptions(levels.length, Constants.Game.Level.TITLES).map(({ index, label }) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = label;
        return option;
      });
      elements.debugLevelSelect.replaceChildren(...options);
    }
    audio.setMuted(preferences.muted);
    elements.reducedMotionInput.checked = preferences.reducedMotion;
    elements.menuHint.textContent = getMenuControlHint(inputMode);
    elements.gameplayHint.textContent = getMenuControlHint(inputMode);
    elements.menuHighScore.textContent = formatHighScore(preferences.highScore);
    elements.audioButton.textContent = preferences.muted ? 'Sound off' : 'Enable sound';
    elements.audioButton.setAttribute('aria-pressed', 'false');
    elements.trailButton.textContent = `Trail: ${preferences.selectedTrail}`;
    applyArenaLayout();
  };

  window.addEventListener('resize', handleViewportResize);
  window.visualViewport?.addEventListener('resize', handleViewportResize);
  void initializeNativeRuntime(() => {
    const pausable = state.phase === Constants.Id.GamePhase.PLAYING ||
      state.phase === Constants.Id.GamePhase.COUNTDOWN ||
      state.phase === Constants.Id.GamePhase.PAUSED;
    if (pausable) input.state.pause = true;
  });

  return {
    start: () => {
      initializeUi();
      gameLoop.start();
    },
    destroy: () => {
      gameLoop.stop();
      codeVisualizer?.destroy();
      input.destroy();
      unbindEvents();
      window.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    }
  };
};
