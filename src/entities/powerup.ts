import { Constants } from '../constants';
import type { Brick, GameState, Powerup, PowerupType } from '../gameplay/types';

export type PowerupShape = 'triangle' | 'plus' | 'diamond' | 'multiball' | 'magnet' | 'clock' | 'shield' | 'bolt' | 'coin' | 'star' | 'crown';

type PowerupDefinition = {
  label: string;
  color: string;
  shape: PowerupShape;
  apply: (state: GameState) => void;
};

export const PowerupRegistry: Record<PowerupType, PowerupDefinition> = {
  shrink: {
    label: 'Paddle shrink',
    color: Constants.Render.Colors.POWERUP_ORANGE,
    shape: 'triangle',
    apply: (state) => {
      state.paddle.width = Constants.Entities.Paddle.WIDTH * Constants.Entities.Paddle.SHRINK_MULTIPLIER;
    }
  },
  expand: {
    label: 'Paddle expand',
    color: '#4ade80',
    shape: 'plus',
    apply: (state) => {
      state.paddle.width = Constants.Entities.Paddle.WIDTH * Constants.Entities.Paddle.EXPAND_MULTIPLIER;
    }
  },
  'super-ball': {
    label: 'Super ball',
    color: '#facc15',
    shape: 'diamond',
    apply: (state) => {
      state.ball.isSuper = true;
      state.extraBalls.forEach((ball) => { ball.isSuper = true; });
    }
  },
  multiball: {
    label: 'Multiball',
    color: '#c084fc',
    shape: 'multiball',
    apply: (state) => {
      const source = state.ball;
      for (const direction of [-1, 1]) {
        state.extraBalls.push({
          ...source,
          velocity: { x: direction * Constants.Entities.Ball.SPEED * 0.7, y: -Math.abs(source.velocity.y || Constants.Entities.Ball.SPEED) },
          launched: true,
          isCharged: false,
          trail: []
        });
      }
    }
  },
  sticky: {
    label: 'Sticky paddle',
    color: Constants.Render.Colors.STICKY,
    shape: 'magnet',
    apply: (state) => {
      state.activeEffects.stickyRemaining = Constants.Game.POWERUP_DURATION_SECONDS;
    }
  },
  'slow-motion': {
    label: 'Slow motion',
    color: Constants.Render.Colors.SLOW_MOTION,
    shape: 'clock',
    apply: (state) => {
      state.activeEffects.slowMotionRemaining = Constants.Game.POWERUP_DURATION_SECONDS;
    }
  },
  shield: {
    label: 'Shield ready',
    color: '#38bdf8',
    shape: 'shield',
    apply: (state) => {
      state.activeEffects.shieldCharges += 1;
    }
  },
  laser: {
    label: 'Laser paddle',
    color: '#fb7185',
    shape: 'bolt',
    apply: (state) => {
      state.activeEffects.laserRemaining = Constants.Game.POWERUP_DURATION_SECONDS;
      state.activeEffects.laserCooldown = 0;
    }
  },
  'score-100': {
    label: '+100 points',
    color: Constants.Render.Colors.POWERUP_ORANGE,
    shape: 'coin',
    apply: (state) => {
      state.score += Constants.Game.ScorePowerup.SMALL_POINTS;
      state.highScore = Math.max(state.highScore, state.score);
    }
  },
  'score-200': {
    label: '+200 points',
    color: '#e2e8f0',
    shape: 'star',
    apply: (state) => {
      state.score += Constants.Game.ScorePowerup.MEDIUM_POINTS;
      state.highScore = Math.max(state.highScore, state.score);
    }
  },
  'score-500': {
    label: '+500 points',
    color: Constants.Render.Colors.CHARGED_BALL,
    shape: 'crown',
    apply: (state) => {
      state.score += Constants.Game.ScorePowerup.LARGE_POINTS;
      state.highScore = Math.max(state.highScore, state.score);
    }
  }
};

export const createPowerupAt = (x: number, y: number, type: PowerupType): Powerup => ({
  x,
  y,
  width: Constants.Entities.Powerup.WIDTH,
  height: Constants.Entities.Powerup.HEIGHT,
  type
});

export const createPowerup = (brick: Brick, type: PowerupType): Powerup =>
  createPowerupAt(brick.x + (brick.width - Constants.Entities.Powerup.WIDTH) / 2, brick.y, type);
