import type { AudioService } from '../audio/audioService';
import { shouldPlayMusic } from '../audio/audioService';
import { getMusicPlaybackRate } from '../audio/music';
import { Constants } from '../constants';
import type { LevelDefinition } from '../data/validateLevel';
import { RuntimeSystem } from '../debug/systemRegistry';
import type { TraceCollector } from '../debug/traceCollector';
import { getStateInvariantErrors } from '../gameplay/invariants';
import type { GameState } from '../gameplay/types';
import { updateGame } from '../gameplay/updateGame';
import type { InputController } from '../input/inputController';
import { provideHaptics } from '../mobile/hapticsService';
import type { RenderAssets } from '../render/assets';
import type { FpsTracker } from '../render/debug';
import { renderGame } from '../render/gameRenderer';
import { getRemainingBrickRatio } from '../render/hud';

export type GameLoop = {
  start: () => void;
  resetClock: () => void;
  stop: () => void;
};

export type GameLoopDependencies = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  input: InputController;
  audio: AudioService;
  renderAssets: RenderAssets;
  fpsTracker: FpsTracker;
  levels: LevelDefinition[];
  debugEnabled: boolean;
  getState: () => GameState;
  applyArenaLayout: () => void;
  onPhaseChange: (state: GameState) => void;
  onHighScore: (highScore: number) => void;
  afterFrame: (state: GameState) => void;
  trace: TraceCollector | null;
  updateVisualizer: (state: GameState, trace: TraceCollector, timestamp: number) => void;
};

export const getFrameDeltaSeconds = (timestamp: number, previousTimestamp: number | null): number =>
  previousTimestamp === null ? 0 : (timestamp - previousTimestamp) / 1000;

export const createGameLoop = (dependencies: GameLoopDependencies): GameLoop => {
  let lastTimestamp: number | null = null;
  let previousPhase = dependencies.getState().phase;
  let animationFrameId: number | null = null;

  const frame = (timestamp: number): void => {
    const state = dependencies.getState();
    const deltaSeconds = getFrameDeltaSeconds(timestamp, lastTimestamp);
    lastTimestamp = timestamp;
    dependencies.trace?.beginFrame();
    updateGame(state, dependencies.input.state, dependencies.levels, deltaSeconds, dependencies.trace ?? undefined);
    if (dependencies.canvas.width !== state.arena.width || dependencies.canvas.height !== state.arena.height) {
      dependencies.applyArenaLayout();
    }
    dependencies.input.endFrame();
    if (state.phase !== previousPhase) {
      previousPhase = state.phase;
      dependencies.onPhaseChange(state);
    }
    dependencies.trace?.start(RuntimeSystem.FEEDBACK);
    dependencies.audio.play(state.events, Math.max(state.combo, state.returnStreak), state.brickToneIndex);
    dependencies.audio.syncMusic(shouldPlayMusic(state.phase));
    dependencies.audio.syncMusicRate(getMusicPlaybackRate(
      state.activeEffects.slowMotionRemaining,
      getRemainingBrickRatio(state),
      state.returnStreak / Constants.Game.RallyHeat.MAX_RETURNS
    ), deltaSeconds);
    void provideHaptics(state.events, state.reducedMotion);
    dependencies.trace?.end(RuntimeSystem.FEEDBACK);
    dependencies.onHighScore(state.highScore);
    const fps = dependencies.fpsTracker.update(timestamp);
    dependencies.trace?.start(RuntimeSystem.RENDER);
    renderGame(
      dependencies.context,
      state,
      dependencies.debugEnabled ? fps : null,
      dependencies.renderAssets,
      dependencies.debugEnabled ? getStateInvariantErrors(state) : []
    );
    dependencies.trace?.end(RuntimeSystem.RENDER);
    if (dependencies.trace !== null) dependencies.updateVisualizer(state, dependencies.trace, timestamp);
    dependencies.afterFrame(state);
    animationFrameId = window.requestAnimationFrame(frame);
  };

  return {
    start: () => {
      if (animationFrameId !== null) return;
      const state = dependencies.getState();
      renderGame(dependencies.context, state, dependencies.debugEnabled ? 0 : null, dependencies.renderAssets);
      animationFrameId = window.requestAnimationFrame(frame);
    },
    resetClock: () => {
      lastTimestamp = null;
      previousPhase = dependencies.getState().phase;
    },
    stop: () => {
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
};
