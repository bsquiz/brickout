import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';
import { StageModifierRegistry } from '../gameplay/modifiers';
import { isClearTarget } from '../gameplay/brickRules';
import { getStageShape } from '../gameplay/arena';
import { clamp01 } from '../utils/math';
import { drawProgressBar } from './primitives/progressBar';

export const getRemainingBrickRatio = (state: GameState): number => {
  if (state.levelBrickCount <= 0) return 0;
  let remaining = 0;
  for (const brick of state.bricks) if (isClearTarget(brick)) remaining += 1;
  return clamp01(remaining / state.levelBrickCount);
};

export const getComboProgress = (state: GameState): number =>
  clamp01(state.comboRemaining / Constants.Game.COMBO_WINDOW_SECONDS);

export type EffectIndicator = { color: string; progress: number; label: string };

export const getEffectIndicators = (state: GameState): EffectIndicator[] => {
  const indicators: EffectIndicator[] = [];
  if (state.activeEffects.stickyRemaining > 0) indicators.push({ label: 'M', color: Constants.Render.Colors.STICKY, progress: state.activeEffects.stickyRemaining / Constants.Game.POWERUP_DURATION_SECONDS });
  if (state.activeEffects.slowMotionRemaining > 0) indicators.push({ label: 'T', color: Constants.Render.Colors.SLOW_MOTION, progress: state.activeEffects.slowMotionRemaining / Constants.Game.POWERUP_DURATION_SECONDS });
  if (state.activeEffects.laserRemaining > 0) indicators.push({ label: 'L', color: Constants.Render.Colors.LASER, progress: state.activeEffects.laserRemaining / Constants.Game.POWERUP_DURATION_SECONDS });
  if (state.activeEffects.shieldCharges > 0) indicators.push({ label: 'S', color: Constants.Render.Colors.SHIELD, progress: 1 });
  return indicators;
};

const renderLives = (context: CanvasRenderingContext2D, state: GameState): void => {
  const imminentDanger = state.enemyBullets.some((bullet) => bullet.y > 390);
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  context.globalAlpha = imminentDanger && !state.reducedMotion ? 0.55 + Math.sin(state.elapsedSeconds * 18) * 0.4 : 1;
  for (let index = 0; index < state.lives; index += 1) {
    context.beginPath();
    context.arc(state.arena.width - 16 - index * 15, 21, 4.5, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
};

const renderEffectIndicators = (context: CanvasRenderingContext2D, state: GameState): void => {
  const indicators = getEffectIndicators(state);
  indicators.forEach((indicator, index) => {
    const x = 12 + index * 25;
    context.strokeStyle = Constants.Render.Hud.INDICATOR_RING;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x + 7, 38, 7, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = indicator.color;
    context.beginPath();
    context.arc(x + 7, 38, 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp01(indicator.progress));
    context.stroke();
    context.fillStyle = indicator.color;
    context.font = 'bold 8px ui-monospace, monospace';
    context.textAlign = 'center';
    context.fillText(indicator.label, x + 7, 38);
  });
};

export const getRallyHeatProgress = (state: Pick<GameState, 'returnStreak'>): number =>
  clamp01(state.returnStreak / Constants.Game.RallyHeat.MAX_RETURNS);

const renderRallyHeat = (context: CanvasRenderingContext2D, state: GameState): void => {
  const width = Constants.Game.RallyHeat.GAUGE_WIDTH;
  const x = state.arena.width / 2 - width / 2;
  const progress = getRallyHeatProgress(state);
  drawProgressBar(context, {
    x,
    y: 34,
    width,
    height: 7,
    progress,
    backgroundColor: Constants.Render.Hud.RALLY_BACKGROUND,
    foregroundColor: state.activeEffects.overdriveRemaining > 0 || progress >= 0.75
      ? Constants.Render.Colors.SUPER_BALL
      : Constants.Render.Colors.SHIELD
  });
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  context.font = 'bold 6px ui-monospace, monospace';
  context.textAlign = 'center';
  context.fillText(state.activeEffects.overdriveRemaining > 0 ? 'OVERDRIVE' : 'HEAT', state.arena.width / 2, 38);
};

export const renderHud = (context: CanvasRenderingContext2D, state: GameState): void => {
  context.fillStyle = Constants.Render.Hud.PANEL_BACKGROUND;
  context.fillRect(0, 0, state.arena.width, state.arena.hudHeight);
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  const scoreSize = Math.min(20, 16 + Math.max(0, state.combo - 1) * 0.6);
  context.font = `bold ${scoreSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(`SCORE ${String(state.score).padStart(3, '0')}`, 12, 21);
  context.textAlign = 'center';
  const stageShape = getStageShape(state.levelIndex);
  const centerLabel = `LEVEL ${state.levelIndex + 1} · ${stageShape.id.toUpperCase()}`;
  context.fillText(state.combo > 1 ? `COMBO x${state.combo}` : centerLabel, state.arena.width / 2, 21);
  renderLives(context, state);
  renderEffectIndicators(context, state);
  renderRallyHeat(context, state);

  if (state.dashCooldown > 0) {
    context.fillStyle = Constants.Render.Colors.MUTED;
    context.font = 'bold 9px ui-monospace, monospace';
    context.textAlign = 'right';
    context.fillText(`DASH ${state.dashCooldown.toFixed(1)}s`, state.arena.width - 10, 38);
  }

  if (state.combo > 1) {
    drawProgressBar(context, {
      x: state.arena.width / 2 - 58,
      y: 35,
      width: 116,
      height: 5,
      progress: getComboProgress(state),
      backgroundColor: Constants.Render.Hud.PROGRESS_BACKGROUND,
      foregroundColor: state.combo >= 6 ? Constants.Render.Colors.SUPER_BALL : Constants.Render.Colors.SHIELD
    });
  }

  drawProgressBar(context, {
    x: 0,
    y: state.arena.hudHeight - 4,
    width: state.arena.width,
    height: 4,
    progress: getRemainingBrickRatio(state),
    backgroundColor: Constants.Render.Hud.PROGRESS_BACKGROUND,
    foregroundColor: Constants.Render.Colors.SHIELD
  });
};

export const renderStatus = (context: CanvasRenderingContext2D, state: GameState): void => {
  let message: string | null = null;
  let subtitle: string | null = null;
  if (state.phase === Constants.Id.GamePhase.COUNTDOWN) {
    const introElapsed = Constants.Game.LEVEL_COUNTDOWN_SECONDS - state.countdownRemaining;
    if (introElapsed < Constants.Game.LEVEL_INTRO_TITLE_SECONDS) {
      message = `LEVEL ${state.levelIndex + 1}`;
      const title = Constants.Game.Level.TITLES[state.levelIndex] ?? 'Breakout';
      subtitle = `${title} · ${StageModifierRegistry[state.stageModifier].label}`;
    } else {
      message = state.countdownRemaining > 0.7 ? String(Math.ceil(state.countdownRemaining)) : 'GO!';
    }
  }
  if (message === null) return;
  context.fillStyle = Constants.Render.Hud.STATUS_BACKGROUND;
  const centerY = state.arena.height / 2;
  context.fillRect(0, centerY - 45, state.arena.width, 90);
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  context.font = Constants.Render.Font.MESSAGE;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(message, state.arena.width / 2, subtitle === null ? centerY : centerY - 10);
  if (subtitle !== null) {
    context.fillStyle = Constants.Render.Colors.SHIELD;
    context.font = Constants.Render.Font.SMALL;
    context.fillText(subtitle.toUpperCase(), state.arena.width / 2, centerY + 20);
  }
};

export const renderPhaseMessage = (context: CanvasRenderingContext2D, state: GameState): void => {
  const messages = {
    [Constants.Id.GamePhase.LEVEL_WON]: 'LEVEL CLEAR',
    [Constants.Id.GamePhase.GAME_OVER]: 'GAME OVER',
    [Constants.Id.GamePhase.GAME_WON]: 'YOU WIN'
  } as const;
  if (!(state.phase in messages)) return;

  context.fillStyle = Constants.Render.Hud.PHASE_BACKGROUND;
  const centerY = state.arena.height / 2;
  if (state.phase === Constants.Id.GamePhase.LEVEL_WON && state.levelResult !== null) {
    const result = state.levelResult;
    const gradeColors = { C: Constants.Render.Hud.GRADE_C, B: Constants.Render.Colors.SHIELD, A: Constants.Render.Hud.GRADE_A, S: Constants.Render.Colors.SUPER_BALL } as const;
    context.fillRect(0, centerY - 82, state.arena.width, 164);
    context.fillStyle = gradeColors[result.grade];
    context.font = 'bold 42px ui-monospace, monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`${result.grade} RANK`, state.arena.width / 2, centerY - 35);
    context.fillStyle = Constants.Render.Colors.FOREGROUND;
    context.font = Constants.Render.Font.SMALL;
    context.fillText(
      `${result.elapsedSeconds.toFixed(1)}s  ·  +${result.scoreGained}  ·  ${result.livesLost} LIVES LOST`,
      state.arena.width / 2,
      centerY + 10
    );
    context.fillStyle = Constants.Render.Colors.SHIELD;
    context.fillText(`${result.skillShotCount} SKILL SHOTS`, state.arena.width / 2, centerY + 38);
    return;
  }
  context.fillRect(0, centerY - 50, state.arena.width, 100);
  context.fillStyle = Constants.Render.Colors.FOREGROUND;
  context.font = Constants.Render.Font.MESSAGE;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(messages[state.phase as keyof typeof messages], state.arena.width / 2, centerY);
};
