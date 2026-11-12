import { Constants } from '../constants';
import { getAlienDefinition } from '../entities';
import type { Alien, GameState } from '../gameplay/types';
import { renderAlien } from './alien';
import { renderEnemyBullets } from './enemyBullet';

const renderAlienWarning = (context: CanvasRenderingContext2D, state: GameState): void => {
  if (state.alien !== null || state.alienWarningSide === null) return;
  const warningProgress = 1 - state.alienSpawnRemaining / Constants.Game.ALIEN_WARNING_SECONDS;
  const entersFromLeft = state.alienWarningSide === 'left';
  const edgeX = entersFromLeft ? 12 : state.arena.width - 12;
  const direction = entersFromLeft ? 1 : -1;
  context.save();
  context.globalAlpha = state.reducedMotion ? 0.75 : 0.5 + Math.sin(state.elapsedSeconds * 18) * 0.3;
  context.fillStyle = Constants.Render.Colors.ENEMY_BULLET;
  context.shadowColor = Constants.Render.Colors.ENEMY_BULLET;
  context.shadowBlur = 12;
  for (let index = 0; index < 3; index += 1) {
    const x = edgeX + direction * index * 9;
    context.beginPath();
    context.moveTo(x, state.arena.height * Constants.Entities.Alien.Y_RATIO + 4);
    context.lineTo(x + direction * 7, state.arena.height * Constants.Entities.Alien.Y_RATIO + 11);
    context.lineTo(x, state.arena.height * Constants.Entities.Alien.Y_RATIO + 18);
    context.closePath();
    context.fill();
  }
  context.globalAlpha = 0.12 + warningProgress * 0.15;
  context.fillRect(entersFromLeft ? 0 : state.arena.width - 3, state.arena.hudHeight, 3, state.arena.height - state.arena.hudHeight);
  context.restore();
};

const renderWarpRings = (context: CanvasRenderingContext2D, state: GameState, alien: Alien): void => {
  const entryEdgeX = alien.velocityX > 0 ? 0 : state.arena.width;
  const entryDistance = Math.abs(alien.x + alien.width / 2 - entryEdgeX);
  if (entryDistance >= alien.width * 1.6 || state.reducedMotion) return;
  context.save();
  context.strokeStyle = getAlienDefinition(alien).color;
  context.lineWidth = 2;
  for (let index = 0; index < Constants.Animation.Alien.WARP_RING_COUNT; index += 1) {
    context.globalAlpha = Math.max(0, 0.7 - index * 0.2 - entryDistance / alien.width * 0.18);
    context.beginPath();
    context.ellipse(entryEdgeX, alien.y + alien.height / 2, 5 + index * 7, 18 + index * 5, 0, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
};

export const renderAlienThreat = (context: CanvasRenderingContext2D, state: GameState, sprites?: HTMLImageElement): void => {
  renderAlienWarning(context, state);
  if (state.alien !== null) {
    renderWarpRings(context, state, state.alien);
    renderAlien(context, state.alien, {
      elapsedSeconds: state.elapsedSeconds,
      damageFlash: state.effects.alienDamageFlash,
      reducedMotion: state.reducedMotion,
      sprites
    });
  }
  renderEnemyBullets(context, state);
};
