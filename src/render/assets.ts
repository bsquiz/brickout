import { createBrickLayerCache, type BrickLayerCache } from './brickLayer';
import { loadImageAsset } from './imageAsset';

export type RenderAssets = {
  ballSprites: HTMLImageElement;
  paddleSprites: HTMLImageElement;
  brickBaseSprite: HTMLImageElement;
  brickOverlaySprites: HTMLImageElement;
  powerupSprites: HTMLImageElement;
  alienSprites: HTMLImageElement;
  brickLayer: BrickLayerCache;
};

export const createRenderAssets = (
  ballSpritesUrl: string,
  paddleSpritesUrl: string,
  brickBaseSpriteUrl: string,
  brickOverlaySpritesUrl: string,
  powerupSpritesUrl: string,
  alienSpritesUrl: string
): RenderAssets => {
  const ballSprites = loadImageAsset(ballSpritesUrl, 'ball sprites');
  const paddleSprites = loadImageAsset(paddleSpritesUrl, 'paddle sprites');
  const brickBaseSprite = loadImageAsset(brickBaseSpriteUrl, 'brick base sprite');
  const brickOverlaySprites = loadImageAsset(brickOverlaySpritesUrl, 'brick overlay sprites');
  const powerupSprites = loadImageAsset(powerupSpritesUrl, 'power-up sprites');
  const alienSprites = loadImageAsset(alienSpritesUrl, 'alien sprites');
  return { ballSprites, paddleSprites, brickBaseSprite, brickOverlaySprites, powerupSprites, alienSprites, brickLayer: createBrickLayerCache() };
};
