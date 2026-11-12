import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';

export const getGridOpacity = (combo: number, backgroundPulse: number): number =>
  Math.min(
    Constants.Render.Background.GRID_MAX_OPACITY,
    Constants.Render.Background.GRID_BASE_OPACITY +
      Math.max(0, combo) * Constants.Render.Background.GRID_COMBO_OPACITY +
      Math.max(0, backgroundPulse) * Constants.Render.Background.GRID_PULSE_OPACITY
  );

export const renderBackground = (context: CanvasRenderingContext2D, state: GameState): void => {
  const colors = Constants.Render.Colors.LEVEL_BACKGROUNDS[state.levelIndex % Constants.Render.Colors.LEVEL_BACKGROUNDS.length] ?? Constants.Render.Background.FALLBACK_COLORS;
  const gradient = context.createLinearGradient(0, 0, 0, state.arena.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, state.arena.width, state.arena.height);

  const ballSpeed = Math.hypot(state.ball.velocity.x, state.ball.velocity.y);
  const motionScale = state.activeEffects.slowMotionRemaining > 0 ? Constants.Render.Background.SLOW_MOTION_SCALE : 1;
  const travel = state.reducedMotion ? 0 : state.elapsedSeconds * (Constants.Render.Background.TRAVEL_SPEED + ballSpeed * Constants.Render.Background.BALL_SPEED_INFLUENCE) * motionScale;
  context.save();
  context.globalAlpha = getGridOpacity(state.combo, state.effects.backgroundPulse);
  context.strokeStyle = colors[0] === '#01030d' ? Constants.Render.Colors.SHIELD : Constants.Render.Colors.FOREGROUND;
  context.lineWidth = 1;
  for (let x = -Constants.Render.Background.HORIZONTAL_SPACING; x < state.arena.width + Constants.Render.Background.HORIZONTAL_SPACING; x += Constants.Render.Background.HORIZONTAL_SPACING) {
    context.beginPath();
    context.moveTo(state.arena.width / 2, Constants.Render.Background.HORIZON_Y);
    context.lineTo(x + (travel % Constants.Render.Background.HORIZONTAL_SPACING), state.arena.height);
    context.stroke();
  }
  for (let y = Constants.Render.Background.VERTICAL_GRID_START_Y; y < state.arena.height + Constants.Render.Background.GRID_BOTTOM_OVERSCAN; y += Constants.Render.Background.VERTICAL_SPACING) {
    const offset = travel % Constants.Render.Background.VERTICAL_SPACING;
    context.beginPath();
    context.moveTo(0, y + offset);
    context.lineTo(state.arena.width, y + offset);
    context.stroke();
  }
  context.restore();

  if (state.effects.backgroundPulse > 0 && !state.reducedMotion) {
    const pulseRadius = (1 - state.effects.backgroundPulse) * Math.max(state.arena.width, state.arena.height) * Constants.Render.Background.PULSE_RADIUS_SCALE;
    context.save();
    context.globalAlpha = state.effects.backgroundPulse * Constants.Render.Background.PULSE_ALPHA;
    context.strokeStyle = Constants.Render.Colors.SHIELD;
    context.lineWidth = Constants.Render.Background.PULSE_LINE_WIDTH;
    context.beginPath();
    context.arc(state.arena.width / 2, state.arena.height / 2, Math.max(Constants.Render.Background.PULSE_MIN_RADIUS, pulseRadius), 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  context.save();
  context.strokeStyle = Constants.Render.Colors.SHIELD;
  context.shadowColor = Constants.Render.Colors.SHIELD;
  context.shadowBlur = Constants.Render.Background.HORIZON_GLOW;
  context.globalAlpha = Constants.Render.Background.HORIZON_BASE_ALPHA + state.effects.backgroundPulse * Constants.Render.Background.HORIZON_PULSE_ALPHA;
  context.beginPath();
  context.moveTo(0, Constants.Render.Background.HORIZON_Y);
  context.lineTo(state.arena.width, Constants.Render.Background.HORIZON_Y);
  context.stroke();
  context.restore();

  const centerX = state.arena.width / 2;
  const centerY = state.arena.height / 2;
  const vignette = context.createRadialGradient(centerX, centerY, Math.min(state.arena.width, state.arena.height) * Constants.Render.Background.VIGNETTE_INNER_SCALE, centerX, centerY, Math.max(state.arena.width, state.arena.height) * Constants.Render.Background.VIGNETTE_OUTER_SCALE);
  vignette.addColorStop(0, Constants.Render.Background.VIGNETTE_INNER_COLOR);
  vignette.addColorStop(1, Constants.Render.Background.VIGNETTE_OUTER_COLOR);
  context.fillStyle = vignette;
  context.fillRect(0, 0, state.arena.width, state.arena.height);
};
