import { Constants } from '../constants';
import { getAlienDefinition } from '../entities';
import type { Alien } from '../gameplay/types';
import { drawSpriteFrame } from './primitives/sprite';

export const isAlienSpriteSheetReady = (sprites?: HTMLImageElement): sprites is HTMLImageElement =>
  sprites !== undefined &&
  sprites.complete &&
  sprites.naturalWidth >= Constants.Render.Sprite.ALIEN_FRAME_WIDTH * Constants.Render.Sprite.ALIEN_FRAME_COLUMNS &&
  sprites.naturalHeight >= Constants.Render.Sprite.ALIEN_FRAME_HEIGHT * Constants.Render.Sprite.ALIEN_FRAME_ROWS;

export const getAlienAnimationFrame = (alien: Alien, elapsedSeconds: number, reducedMotion: boolean): number => {
  if (alien.shotAnimationRemaining > 0) return Constants.Render.Sprite.ALIEN_ATTACK_FRAME;
  if (reducedMotion) return 0;
  return Math.floor(elapsedSeconds * Constants.Animation.Alien.FRAMES_PER_SECOND) % Constants.Render.Sprite.ALIEN_IDLE_FRAME_COUNT;
};

const drawAlienSprite = (
  context: CanvasRenderingContext2D,
  alien: Alien,
  elapsedSeconds: number,
  reducedMotion: boolean,
  sprites: HTMLImageElement
): void => {
  const frame = getAlienDefinition(alien).spriteRow * Constants.Render.Sprite.ALIEN_FRAME_COLUMNS +
    getAlienAnimationFrame(alien, elapsedSeconds, reducedMotion);
  drawSpriteFrame(context, sprites, {
    frame,
    columns: Constants.Render.Sprite.ALIEN_FRAME_COLUMNS,
    frameWidth: Constants.Render.Sprite.ALIEN_FRAME_WIDTH,
    frameHeight: Constants.Render.Sprite.ALIEN_FRAME_HEIGHT,
    destination: alien
  });
};

const drawFallbackAlien = (context: CanvasRenderingContext2D, alien: Alien, color: string): void => {
  const centerX = alien.x + alien.width / 2;
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(centerX, alien.y + alien.height * 0.62, alien.width / 2, alien.height * 0.28, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(centerX, alien.y + alien.height * 0.52, alien.height * 0.35, Math.PI, 0);
  context.fill();
};

export const drawAlienVisual = (
  context: CanvasRenderingContext2D,
  alien: Alien,
  color: string,
  elapsedSeconds: number,
  reducedMotion: boolean,
  sprites?: HTMLImageElement
): void => {
  if (isAlienSpriteSheetReady(sprites)) drawAlienSprite(context, alien, elapsedSeconds, reducedMotion, sprites);
  else drawFallbackAlien(context, alien, color);
};
