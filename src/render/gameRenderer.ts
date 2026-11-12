import type { GameState } from '../gameplay/types';
import { renderBackground } from './background';
import { renderDebug } from './debug';
import { renderEntities } from './entities';
import { renderEffects } from './effects';
import { renderHud, renderPhaseMessage, renderStatus } from './hud';
import { renderAlienThreat } from './alienThreat';
import { renderBallDanger, renderBlackout, renderLaunchGuide } from './visibility';
import type { RenderAssets } from './assets';

export const renderGame = (context: CanvasRenderingContext2D, state: GameState, fps: number | null, assets: RenderAssets, invariantErrors: string[] = []): void => {
  renderBackground(context, state);
  context.save();
  if (!state.reducedMotion && state.effects.cameraZoom > 0) {
    const scale = 1 + state.effects.cameraZoom;
    context.translate(state.arena.width / 2 + state.effects.cameraKickX, state.arena.height / 2 + state.effects.cameraKickY);
    context.scale(scale, scale);
    context.translate(-state.arena.width / 2, -state.arena.height / 2);
  }
  if (state.effects.shake > 0 && !state.reducedMotion) {
    context.translate(
      Math.sin(state.elapsedSeconds * 91.7) * state.effects.shake * 0.5,
      Math.cos(state.elapsedSeconds * 73.1) * state.effects.shake * 0.5
    );
  }
  renderEntities(context, state, assets);
  renderLaunchGuide(context, state);
  renderAlienThreat(context, state, assets.alienSprites);
  renderEffects(context, state);
  renderBlackout(context, state);
  renderBallDanger(context, state);
  context.restore();
  renderHud(context, state);
  renderPhaseMessage(context, state);
  renderStatus(context, state);
  if (fps !== null) renderDebug(context, fps, state, invariantErrors);
};
