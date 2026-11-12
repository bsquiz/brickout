import { Constants } from '../constants';
import type { GameState } from '../gameplay/types';
import { fillPlayableArea } from './primitives/area';

export const renderLaunchGuide = (context: CanvasRenderingContext2D, state: GameState): void => {
  if (state.ball.launched || state.phase === Constants.Id.GamePhase.LIFE_LOST) return;
  const centerX = state.ball.x + state.ball.width / 2;
  const horizontalAim = state.ball.pendingLaunchDirection === 'perpendicular' ? 0 : state.serveAim;
  const breath = state.reducedMotion ? 0 : (Math.sin(state.elapsedSeconds * 4) + 1) / 2;
  const guideLength = Constants.Game.Serve.GUIDE_LENGTH + breath * 8;
  context.save();
  context.setLineDash([5, 7]);
  context.strokeStyle = `rgb(245 251 255 / ${0.34 + breath * 0.24})`;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(centerX, state.ball.y - 4);
  context.lineTo(centerX + horizontalAim * guideLength, state.ball.y - guideLength);
  context.stroke();
  context.setLineDash([]);
  context.strokeStyle = Constants.Render.Colors.SHIELD;
  context.globalAlpha = 0.3 + breath * 0.35;
  context.beginPath();
  context.arc(centerX, state.ball.y + state.ball.height / 2, 8 + breath * 4, 0, Math.PI * 2);
  context.stroke();
  context.restore();
};

export const renderBallDanger = (context: CanvasRenderingContext2D, state: GameState): void => {
  const balls = [state.ball, ...state.extraBalls];
  const endangered = balls.filter((ball) => ball.launched && ball.velocity.y > 0 && ball.y > state.arena.height * 0.82);
  if (endangered.length === 0) return;
  context.save();
  context.fillStyle = Constants.Render.Colors.ENEMY_BULLET;
  context.globalAlpha = state.reducedMotion ? 0.18 : 0.15 + Math.sin(state.elapsedSeconds * 15) * 0.08;
  context.fillRect(0, state.arena.height - 10, state.arena.width, 10);
  context.restore();
};

export const renderBlackout = (context: CanvasRenderingContext2D, state: GameState): void => {
  if (state.stageModifier !== Constants.Id.StageModifier.BLACKOUT || state.phase === Constants.Id.GamePhase.MENU) return;
  const centerX = state.ball.x + state.ball.width / 2;
  const centerY = state.ball.y + state.ball.height / 2;
  const gradient = context.createRadialGradient(centerX, centerY, 42, centerX, centerY, 185);
  gradient.addColorStop(0, 'rgb(1 3 13 / 0%)');
  gradient.addColorStop(0.55, 'rgb(1 3 13 / 30%)');
  gradient.addColorStop(1, 'rgb(1 3 13 / 88%)');
  context.fillStyle = gradient;
  fillPlayableArea(context, state.arena);
};
