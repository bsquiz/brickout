import { Constants } from '../constants';
import type { Ball, Brick, GameState } from './types';
import { clamp } from '../utils/math';

export const teleportBall = (state: GameState, ball: Ball, portal: Brick): boolean => {
  if (portal.behavior !== Constants.Id.BrickBehavior.PORTAL || portal.portalId === undefined || ball.portalCooldown > 0) return false;
  const exit = state.bricks.find((brick) => brick !== portal && brick.behavior === Constants.Id.BrickBehavior.PORTAL && brick.portalId === portal.portalId);
  if (exit === undefined) return false;
  const speed = Math.hypot(ball.velocity.x, ball.velocity.y);
  const directionX = speed === 0 ? 0 : ball.velocity.x / speed;
  const directionY = speed === 0 ? -1 : ball.velocity.y / speed;
  const clearance = Math.max(exit.width, exit.height) / 2 + ball.width / 2 + Constants.Game.Portal.EXIT_PADDING;
  ball.x = exit.x + exit.width / 2 - ball.width / 2 + directionX * clearance;
  ball.y = exit.y + exit.height / 2 - ball.height / 2 + directionY * clearance;
  ball.x = clamp(ball.x, 0, state.arena.width - ball.width);
  ball.y = Math.max(state.arena.hudHeight, Math.min(state.arena.height - ball.height, ball.y));
  ball.portalCooldown = Constants.Game.Portal.COOLDOWN_SECONDS;
  state.effects.shockwaves.push({
    x: exit.x + exit.width / 2,
    y: exit.y + exit.height / 2,
    radius: 5,
    speed: 160,
    life: 0.35,
    color: Constants.Render.Colors.SUPER_BALL
  });
  state.events.push(Constants.Id.GameEvent.WALL_HIT);
  return true;
};
