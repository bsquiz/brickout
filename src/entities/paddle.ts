import { Constants } from '../constants';
import { getPaddleY } from '../gameplay/arena';
import type { ArenaDimensions, Paddle } from '../gameplay/types';

export const createPaddle = (arena: ArenaDimensions): Paddle => ({
  x: (arena.width - Constants.Entities.Paddle.WIDTH) / 2,
  y: getPaddleY(arena),
  width: Constants.Entities.Paddle.WIDTH,
  height: Constants.Entities.Paddle.HEIGHT
});

export const resetPaddle = (paddle: Paddle, arena: ArenaDimensions): void => {
  paddle.width = Constants.Entities.Paddle.WIDTH;
  paddle.x = (arena.width - paddle.width) / 2;
  paddle.y = getPaddleY(arena, paddle.height);
};
