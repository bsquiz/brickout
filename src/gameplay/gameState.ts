import { Constants } from '../constants';
import type { LevelDefinition } from '../data/validateLevel';
import { attachBallToPaddle, createBall, createBricks, createPaddle, getNextAlienSpawnDelay } from '../entities';
import { getBallSpeed, getDefaultArena, getPaddleY, getStageArenaDimensions, remapRectangleCenter } from './arena';
import { getStageModifier } from './modifiers';
import { applyOwnedUpgrades } from './upgrades';
import { createLevelStats } from './grading';
import { isClearTarget } from './brickRules';
import type { ArenaDimensions, Ball, GamePhase, GameState, Rectangle } from './types';

export type CreateGameStateOptions = {
  level: LevelDefinition;
  phase?: GamePhase;
  highScore?: number;
  reducedMotion?: boolean;
  trailStyle?: GameState['trailStyle'];
  arena?: ArenaDimensions;
  randomSeed?: number;
};

export const createGameState = (options: CreateGameStateOptions): GameState => {
  const {
    level,
    phase = Constants.Id.GamePhase.MENU,
    highScore = 0,
    reducedMotion = false,
    trailStyle = Constants.Id.TrailStyle.CLASSIC,
    arena = getDefaultArena(),
    randomSeed = 0x9e3779b9
  } = options;
  const stageArena = getStageArenaDimensions(arena, 0);
  const paddle = createPaddle(stageArena);
  const bricks = createBricks(level, stageArena);
  const ball = createBall(paddle);
  return {
    randomSeed,
    arena: stageArena,
    baseArena: arena,
    stageModifier: getStageModifier(0),
    upgrades: [],
    pendingUpgradeChoices: [],
    phase: phase === Constants.Id.GamePhase.PLAYING ? Constants.Id.GamePhase.COUNTDOWN : phase,
    score: 0,
    highScore,
    lives: Constants.Game.INITIAL_LIVES,
    levelIndex: 0,
    levelBrickCount: bricks.filter(isClearTarget).length,
    levelStats: createLevelStats(0, Constants.Game.INITIAL_LIVES, 0),
    levelResult: null,
    ball,
    extraBalls: [],
    paddle,
    paddleVelocityX: 0,
    bricks,
    powerups: [],
    projectiles: [],
    alien: null,
    alienWarningSide: null,
    bossDefeated: false,
    enemyBullets: [],
    alienSpawnRemaining: getNextAlienSpawnDelay(),
    combo: 0,
    comboRemaining: 0,
    rallyHits: 0,
    returnStreak: 0,
    serveAim: Constants.Game.Serve.DEFAULT_AIM,
    wallBouncesSincePaddle: 0,
    alienHitSincePaddle: false,
    dashCooldown: 0,
    brickToneIndex: 0,
    pendingExplosions: [],
    countdownRemaining: phase === Constants.Id.GamePhase.PLAYING ? Constants.Game.LEVEL_COUNTDOWN_SECONDS : 0,
    hitStopRemaining: 0,
    elapsedSeconds: 0,
    finalTargetTurns: 0,
    effects: {
      particles: [],
      floatingTexts: [],
      shockwaves: [],
      paddleFragments: [],
      banner: null,
      shake: 0,
      paddleImpact: 0,
      paddleImpactX: 0,
      ballImpact: 0,
      chargePulse: 0,
      alienDamageFlash: 0,
      nearMissGlow: 0,
      flash: 0,
      lifeFlash: 0,
      backgroundPulse: 0,
      cameraZoom: 0,
      cameraKickX: 0,
      cameraKickY: 0,
      lightningArcs: [],
      vortexSparks: []
    },
    activeEffects: { stickyRemaining: 0, slowMotionRemaining: 0, laserRemaining: 0, laserCooldown: 0, shieldCharges: 0, overdriveRemaining: 0 },
    reducedMotion,
    trailStyle,
    transitionRemaining: 0,
    events: []
  };
};

export const loadLevel = (state: GameState, level: LevelDefinition): void => {
  state.arena = getStageArenaDimensions(state.baseArena, state.levelIndex);
  state.bricks = createBricks(level, state.arena);
  state.levelBrickCount = state.bricks.filter(isClearTarget).length;
  state.levelStats = createLevelStats(state.elapsedSeconds, state.lives, state.score);
  state.levelResult = null;
  state.powerups = [];
  state.projectiles = [];
  state.alien = null;
  state.alienWarningSide = null;
  state.bossDefeated = false;
  state.enemyBullets = [];
  state.alienSpawnRemaining = getNextAlienSpawnDelay();
  state.paddle = createPaddle(state.arena);
  state.stageModifier = getStageModifier(state.levelIndex);
  state.paddleVelocityX = 0;
  state.ball = createBall(state.paddle);
  state.extraBalls = [];
  state.phase = Constants.Id.GamePhase.COUNTDOWN;
  state.countdownRemaining = Constants.Game.LEVEL_COUNTDOWN_SECONDS;
  state.combo = 0;
  state.comboRemaining = 0;
  state.rallyHits = 0;
  state.returnStreak = 0;
  state.serveAim = Constants.Game.Serve.DEFAULT_AIM;
  state.wallBouncesSincePaddle = 0;
  state.alienHitSincePaddle = false;
  state.dashCooldown = 0;
  state.activeEffects.overdriveRemaining = 0;
  state.brickToneIndex = 0;
  state.pendingExplosions = [];
  state.finalTargetTurns = 0;
  state.transitionRemaining = 0;
  applyOwnedUpgrades(state);
};

const remapVelocity = (ball: Ball, arena: ArenaDimensions): void => {
  const magnitude = Math.hypot(ball.velocity.x, ball.velocity.y);
  if (magnitude === 0) return;
  const speed = getBallSpeed(arena);
  ball.velocity.x = ball.velocity.x / magnitude * speed;
  ball.velocity.y = ball.velocity.y / magnitude * speed;
};

const remapPoint = (point: { x: number; y: number }, previous: ArenaDimensions, next: ArenaDimensions): void => {
  point.x *= next.width / previous.width;
  point.y = next.hudHeight + (point.y - previous.hudHeight) * (next.height - next.hudHeight) / (previous.height - previous.hudHeight);
};

export const resizeGameArena = (state: GameState, nextBaseArena: ArenaDimensions): void => {
  const previous = state.arena;
  const nextArena = getStageArenaDimensions(nextBaseArena, state.levelIndex);
  state.baseArena = nextBaseArena;
  if (previous.width === nextArena.width && previous.height === nextArena.height && previous.hudHeight === nextArena.hudHeight) return;

  const balls = [state.ball, ...state.extraBalls];
  const remappedRectangles: Rectangle[] = [...balls, ...state.powerups, ...state.projectiles, ...state.enemyBullets];
  if (state.alien !== null) remappedRectangles.push(state.alien);
  remappedRectangles.forEach((rectangle) => remapRectangleCenter(rectangle, previous, nextArena));
  balls.forEach((ball) => {
    remapVelocity(ball, nextArena);
    ball.trail.forEach((point) => remapPoint(point, previous, nextArena));
  });

  const widthRatio = nextArena.width / previous.width;
  state.bricks.forEach((brick) => {
    brick.x *= widthRatio;
    brick.baseX *= widthRatio;
    brick.width *= widthRatio;
  });
  const paddleCenterRatio = (state.paddle.x + state.paddle.width / 2) / previous.width;
  state.paddle.x = paddleCenterRatio * nextArena.width - state.paddle.width / 2;
  state.paddle.y = getPaddleY(nextArena, state.paddle.height);
  state.effects.particles.forEach((point) => remapPoint(point, previous, nextArena));
  state.effects.floatingTexts.forEach((point) => remapPoint(point, previous, nextArena));
  state.effects.shockwaves.forEach((point) => remapPoint(point, previous, nextArena));
  state.effects.paddleFragments.forEach((point) => remapPoint(point, previous, nextArena));
  state.effects.lightningArcs.forEach((arc) => {
    arc.fromX *= widthRatio;
    arc.toX *= widthRatio;
    arc.fromY = nextArena.hudHeight + (arc.fromY - previous.hudHeight) * (nextArena.height - nextArena.hudHeight) / (previous.height - previous.hudHeight);
    arc.toY = nextArena.hudHeight + (arc.toY - previous.hudHeight) * (nextArena.height - nextArena.hudHeight) / (previous.height - previous.hudHeight);
  });
  state.arena = nextArena;
  if (!state.ball.launched) attachBallToPaddle(state.ball, state.paddle);
};
