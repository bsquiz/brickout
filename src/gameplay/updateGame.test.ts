import { Constants } from '../constants';
import type { InputState } from './types';
import { updateGame } from './updateGame';
import { UpdateSystem, type UpdateObserver, type UpdateSystemId } from './updateTrace';
import { createTestAlien, createTestBall, createTestBrick, createTestEnemyBullet, createTestGameState, createTestLevel, createTestPowerup } from '../test/fixtures';

const idleInput: InputState = { left: false, right: false, launch: false, pause: false, dash: false, paddleTargetX: null };
const centeredBallX = (Constants.Game.Arena.BASELINE.width - Constants.Entities.Ball.SIZE) / 2;
const centeredPaddleX = (Constants.Game.Arena.BASELINE.width - Constants.Entities.Paddle.WIDTH) / 2;

describe('updateGame', () => {
  test('reports the gameplay systems traversed during an active frame', () => {
    const starts: UpdateSystemId[] = [];
    const ends: UpdateSystemId[] = [];
    const observer: UpdateObserver = {
      start: (system) => { starts.push(system); },
      end: (system) => { ends.push(system); }
    };
    const state = createTestGameState({
      bricks: [createTestBrick({ x: 0 }), createTestBrick({ x: 400, baseX: 400 })],
      alienSpawnRemaining: 100
    });

    updateGame(state, idleInput, [createTestLevel()], 0, observer);

    expect(starts).toEqual([
      UpdateSystem.EFFECTS,
      UpdateSystem.PHASE,
      UpdateSystem.TIMERS,
      UpdateSystem.CONTROLS,
      UpdateSystem.BRICKS,
      UpdateSystem.BALLS,
      UpdateSystem.POWERUPS,
      UpdateSystem.PROJECTILES,
      UpdateSystem.ALIENS,
      UpdateSystem.COMPLETION
    ]);
    expect(ends).toEqual(starts);
  });

  test('wins after transitioning beyond the final level', () => {
    const levels = [createTestLevel()];
    const state = createTestGameState({ phase: 'level-won', transitionRemaining: 0.001 });
    updateGame(state, idleInput, levels, 0.01);
    expect(state.phase).toBe('game-won');
  });

  test('collects adjacent powerups without skipping either item', () => {
    const state = createTestGameState({
      powerups: [createTestPowerup({ type: 'shrink' }), createTestPowerup({ type: 'expand' })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.powerups).toHaveLength(0);
    expect(state.events.filter((event) => event === 'powerup')).toHaveLength(2);
    expect(state.paddle.width).toBe(160);
    expect(state.effects.banner?.text).toBe('PADDLE EXPAND');
  });

  test('applies a collected powerup immediately', () => {
    const state = createTestGameState({ powerups: [createTestPowerup({ type: 'shield' })] });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.activeEffects.shieldCharges).toBe(1);
  });

  test('dashes in the held direction and starts a cooldown', () => {
    const state = createTestGameState();
    updateGame(state, { ...idleInput, right: true, dash: true }, [createTestLevel()], 0);
    expect(state.paddle.x).toBe(centeredPaddleX + Constants.Game.DASH_DISTANCE);
    expect(state.dashCooldown).toBe(Constants.Game.DASH_COOLDOWN_SECONDS);
  });

  test('loses at most one life for one out-of-bounds ball', () => {
    const state = createTestGameState({ ball: createTestBall({ y: 501, velocity: { x: 0, y: 240 } }) });
    updateGame(state, idleInput, [createTestLevel()], 0.016);
    updateGame(state, idleInput, [createTestLevel()], 0.016);
    expect(state.lives).toBe(2);
    expect(state.phase).toBe('life-lost');
    expect(state.effects.paddleFragments.length).toBeGreaterThan(0);
  });

  test('respawns only after the paddle death animation finishes', () => {
    const state = createTestGameState({ ball: createTestBall({ y: 501, velocity: { x: 0, y: 240 } }) });
    updateGame(state, idleInput, [createTestLevel()], 0.016);
    for (let frame = 0; frame < 8; frame += 1) updateGame(state, idleInput, [createTestLevel()], Constants.Game.MAX_FRAME_SECONDS);
    expect(state.phase).toBe('life-lost');
    for (let frame = 0; frame < 10; frame += 1) updateGame(state, idleInput, [createTestLevel()], Constants.Game.MAX_FRAME_SECONDS);
    expect(state.phase).toBe('playing');
  });

  test('removes a hit brick and enters the level transition', () => {
    const brick = createTestBrick({ x: 100, y: 100 });
    const state = createTestGameState({
      ball: createTestBall({ x: 110, y: 105, velocity: { x: 0, y: 240 } }),
      bricks: [brick]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.score).toBe(10);
    expect(state.bricks).toHaveLength(0);
    expect(state.phase).toBe('level-won');
    expect(state.levelResult?.grade).toMatch(/[C-S]/);
  });

  test('moves at the same rate across different frame rates', () => {
    const atSixtyFps = createTestGameState();
    const atOneTwentyFps = createTestGameState();
    const rightInput: InputState = { ...idleInput, right: true };

    for (let frame = 0; frame < 30; frame += 1) updateGame(atSixtyFps, rightInput, [createTestLevel()], 1 / 60);
    for (let frame = 0; frame < 60; frame += 1) updateGame(atOneTwentyFps, rightInput, [createTestLevel()], 1 / 120);

    expect(atSixtyFps.paddle.x).toBeCloseTo(atOneTwentyFps.paddle.x, 8);
  });

  test('moves a frozen ball at the temporary reduced speed', () => {
    const bricks = [createTestBrick({ x: 0 }), createTestBrick({ x: 300, baseX: 300 })];
    const normal = createTestGameState({
      ball: createTestBall({ x: 150, y: 300, velocity: { x: 100, y: -100 } }),
      bricks: [...bricks],
      alienSpawnRemaining: 100
    });
    const slowed = createTestGameState({
      ball: createTestBall({ x: 150, y: 300, velocity: { x: 100, y: -100 }, frozenSlowRemaining: 1 }),
      bricks: [...bricks],
      alienSpawnRemaining: 100
    });

    updateGame(normal, idleInput, [createTestLevel()], Constants.Game.MAX_FRAME_SECONDS);
    updateGame(slowed, idleInput, [createTestLevel()], Constants.Game.MAX_FRAME_SECONDS);

    expect(slowed.ball.x - 150).toBeCloseTo(
      (normal.ball.x - 150) * Constants.Game.Brick.Frozen.BALL_SPEED_SCALE
    );
  });

  test('moves toward a touch target without teleporting', () => {
    const state = createTestGameState();
    const touchInput: InputState = { ...idleInput, paddleTargetX: 450 };
    updateGame(state, touchInput, [createTestLevel()], 1 / 60);
    expect(state.paddle.x).toBe(centeredPaddleX + Constants.Entities.Paddle.SPEED / 60);
  });

  test('aims a serve with arrows instead of moving the paddle', () => {
    const state = createTestGameState({ ball: createTestBall({ launched: false, velocity: { x: 0, y: 0 } }) });
    const paddleX = state.paddle.x;
    for (let frame = 0; frame < 10; frame += 1) {
      updateGame(state, { ...idleInput, left: true }, [createTestLevel()], Constants.Game.MAX_FRAME_SECONDS);
    }
    expect(state.paddle.x).toBe(paddleX);
    expect(state.serveAim).toBeLessThan(0);
    updateGame(state, { ...idleInput, launch: true }, [createTestLevel()], 0);
    expect(state.ball.velocity.x).toBeLessThan(0);
  });

  test('changes paddle bounce angle based on impact position', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredBallX + 30, y: 475, velocity: { x: 0, y: 240 } })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.velocity.x).toBeGreaterThan(0);
    expect(state.ball.velocity.y).toBeLessThan(0);
  });

  test('builds rally heat and speed on successful paddle returns', () => {
    const state = createTestGameState({ ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } }) });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.returnStreak).toBe(1);
    expect(Math.hypot(state.ball.velocity.x, state.ball.velocity.y)).toBeGreaterThan(Constants.Entities.Ball.SPEED);
  });

  test('activates overdrive at maximum heat', () => {
    const state = createTestGameState({
      returnStreak: Constants.Game.RallyHeat.MAX_RETURNS - 1,
      ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.activeEffects.overdriveRemaining).toBe(Constants.Game.Overdrive.DURATION_SECONDS);
    expect(state.levelStats.skillShots).toContain('overdrive');
    expect(state.score).toBe(Constants.Game.SkillShot.OVERDRIVE_POINTS);
  });

  test('catches a fast ball just outside the visible paddle', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredPaddleX - Constants.Entities.Ball.SIZE - 1, y: 475, velocity: { x: 0, y: 360 } })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.velocity.y).toBeLessThan(0);
    expect(state.returnStreak).toBe(1);
  });

  test('destroys an alien bullet on normal ball contact', () => {
    const ball = createTestBall({ x: 220, y: 300 });
    const state = createTestGameState({ ball, enemyBullets: [createTestEnemyBullet({ x: 220, y: 300 })], alienSpawnRemaining: 100 });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.enemyBullets).toHaveLength(0);
  });

  test('reflects an alien bullet with a charged ball', () => {
    const ball = createTestBall({ x: 220, y: 300, isCharged: true });
    const state = createTestGameState({ ball, enemyBullets: [createTestEnemyBullet({ x: 220, y: 300 })], alienSpawnRemaining: 100 });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.enemyBullets[0]).toEqual(expect.objectContaining({ reflected: true, velocityY: expect.any(Number) }));
    expect(state.enemyBullets[0]?.velocityY).toBeLessThan(0);
    expect(state.levelStats.skillShots).toContain('counter-shot');
  });

  test('corrects nearly horizontal trajectories in paddle modes', () => {
    const state = createTestGameState({ ball: createTestBall({ x: 250, y: 250, velocity: { x: 240, y: 1 } }) });
    updateGame(state, idleInput, [createTestLevel()], 0);
    const speed = Math.hypot(state.ball.velocity.x, state.ball.velocity.y);
    expect(Math.abs(state.ball.velocity.y)).toBeGreaterThanOrEqual(speed * Constants.Game.PaddleEnglish.MIN_VERTICAL_RATIO);
  });

  test('adds a rally heat bonus to brick score', () => {
    const state = createTestGameState({
      returnStreak: 2,
      ball: createTestBall({ x: 110, y: 105, velocity: { x: 0, y: 240 } }),
      bricks: [createTestBrick({ x: 100, y: 100 })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.score).toBe(12);
  });

  test('requires directional bricks to be hit from their marked face', () => {
    const directionalBrick = createTestBrick({ x: 100, y: 100, behavior: 'directional', direction: 'left' });
    const spareBrick = createTestBrick({ x: 300, y: 100, baseX: 300 });
    const state = createTestGameState({
      ball: createTestBall({ x: 110, y: 105, velocity: { x: -120, y: -180 } }),
      bricks: [directionalBrick, spareBrick]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.bricks).toContain(directionalBrick);
    expect(directionalBrick.hitPoints).toBe(1);
    state.ball.x = 110;
    state.ball.y = 105;
    state.ball.velocity = { x: 120, y: -180 };
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.bricks).not.toContain(directionalBrick);
  });

  test('allows arrow-key aiming after the sticky paddle catches the ball', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredBallX - 5, y: 475, velocity: { x: 80, y: 240 } })
    });
    state.activeEffects.stickyRemaining = 5;
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.launched).toBe(false);
    expect(state.serveAim).toBe(0);

    updateGame(state, { ...idleInput, right: true }, [createTestLevel()], 0.25);
    updateGame(state, { ...idleInput, launch: true }, [createTestLevel()], 0);
    expect(state.ball.launched).toBe(true);
    expect(state.ball.velocity.x).toBeGreaterThan(0);
    expect(state.ball.velocity.y).toBe(-Constants.Entities.Ball.SPEED);
  });

  test('builds a score multiplier for rapid brick breaks', () => {
    const firstBrick = createTestBrick({ x: 100, y: 100 });
    const secondBrick = createTestBrick({ x: 150, y: 100, baseX: 150 });
    const state = createTestGameState({
      ball: createTestBall({ x: 110, y: 105, velocity: { x: 0, y: 240 } }),
      bricks: [firstBrick, secondBrick]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    state.hitStopRemaining = 0;
    state.ball.x = 160;
    state.ball.y = 105;
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.combo).toBe(2);
    expect(state.score).toBe(130);
    expect(state.levelStats.skillShots).toContain('opening-blitz');
  });

  test('uses a shield before taking a life', () => {
    const state = createTestGameState({
      ball: createTestBall({ y: 501, velocity: { x: 0, y: 240 } })
    });
    state.activeEffects.shieldCharges = 1;
    updateGame(state, idleInput, [createTestLevel()], 0.016);
    expect(state.lives).toBe(3);
    expect(state.activeEffects.shieldCharges).toBe(0);
    expect(state.ball.velocity.y).toBeLessThan(0);
  });

  test('toggles pause without advancing gameplay', () => {
    const state = createTestGameState();
    updateGame(state, { ...idleInput, pause: true }, [createTestLevel()], 0.016);
    expect(state.phase).toBe('paused');
    const ballY = state.ball.y;
    updateGame(state, idleInput, [createTestLevel()], 0.5);
    expect(state.ball.y).toBe(ballY);
  });

  test('does not require indestructible bricks to clear a level', () => {
    const state = createTestGameState({
      bricks: [createTestBrick({ behavior: 'indestructible' })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.phase).toBe('level-won');
  });

  test('progressively aims paddle bounces toward the final brick', () => {
    const createFinalBrickState = (turns: number) => createTestGameState({
      ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } }),
      bricks: [createTestBrick({ x: 0, baseX: 0 })],
      finalTargetTurns: turns
    });
    const earlyAssist = createFinalBrickState(0);
    const lateAssist = createFinalBrickState(14);
    updateGame(earlyAssist, idleInput, [createTestLevel()], 0);
    updateGame(lateAssist, idleInput, [createTestLevel()], 0);
    expect(earlyAssist.ball.velocity.x).toBeLessThan(0);
    expect(lateAssist.ball.velocity.x).toBeLessThan(earlyAssist.ball.velocity.x);
  });

  test('increases final-brick aim assist once per paddle return rather than over time', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } }),
      bricks: [createTestBrick({ x: 0, baseX: 0 })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.finalTargetTurns).toBe(1);
    updateGame(state, idleInput, [createTestLevel()], 0.05);
    expect(state.finalTargetTurns).toBe(1);
  });

  test('does not aim toward a brick while multiple targets remain', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } }),
      bricks: [createTestBrick({ x: 0 }), createTestBrick({ x: 400, baseX: 400 })],
      finalTargetTurns: 8
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.velocity.x).toBeCloseTo(0);
  });

  test('slightly expands the final brick collision area', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: 85, y: 95, velocity: { x: 0, y: -240 } }),
      bricks: [createTestBrick({ x: 100, y: 100, baseX: 100 })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.bricks).toHaveLength(0);
    expect(state.score).toBe(10);
  });

  test('loses one life when an alien bullet hits the paddle', () => {
    const state = createTestGameState({
      alienSpawnRemaining: 100,
      enemyBullets: [createTestEnemyBullet()]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.lives).toBe(2);
    expect(state.enemyBullets).toHaveLength(0);
  });

  test('destroys an alien when the ball collides with it', () => {
    const state = createTestGameState({
      alien: createTestAlien(),
      ball: createTestBall({ x: 110, y: 240, velocity: { x: 0, y: -240 } }),
      enemyBullets: [createTestEnemyBullet({ x: 20, y: 300 })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.alien).toBeNull();
    expect(state.score).toBe(250);
    expect(state.ball.velocity.y).toBeGreaterThan(0);
    expect(state.enemyBullets).toHaveLength(0);
    expect(state.events).toContain('alien-hit');
  });

  test('destroys an alien when a player laser hits it', () => {
    const state = createTestGameState({
      alien: createTestAlien(),
      alienSpawnRemaining: 100,
      projectiles: [{ x: 110, y: 240, width: 4, height: 14 }],
      enemyBullets: [createTestEnemyBullet({ x: 20, y: 300 })]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.alien).toBeNull();
    expect(state.projectiles).toHaveLength(0);
    expect(state.enemyBullets).toHaveLength(0);
    expect(state.score).toBe(Constants.Entities.Alien.POINTS);
    expect(state.events).toContain('alien-hit');
  });

  test('player lasers damage bosses one hit at a time', () => {
    const boss = createTestAlien({ kind: 'boss', isBoss: true, hitPoints: 2, maxHitPoints: 2 });
    const state = createTestGameState({
      alien: boss,
      alienSpawnRemaining: 100,
      projectiles: [{ x: 110, y: 240, width: 4, height: 14 }]
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.alien).toBe(boss);
    expect(boss.hitPoints).toBe(1);
    expect(state.projectiles).toHaveLength(0);
  });

  test('charges a centered paddle return', () => {
    const state = createTestGameState({ ball: createTestBall({ x: centeredBallX, y: 475, velocity: { x: 0, y: 240 } }) });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.isCharged).toBe(true);
    expect(state.ball.perfectSuper).toBe(true);
    expect(state.events).toContain('perfect-return');
  });

  test('perfect-return super ball penetrates bricks for the full turn', () => {
    const brick = createTestBrick({ x: 100, y: 100, hitPoints: 3, maxHitPoints: 3 });
    const state = createTestGameState({
      bricks: [brick],
      ball: createTestBall({ x: 110, y: 105, velocity: { x: 0, y: 240 }, perfectSuper: true })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.bricks).toHaveLength(0);
    expect(state.ball.velocity.y).toBeGreaterThan(0);
    expect(state.ball.perfectSuper).toBe(true);
  });

  test('a non-perfect paddle return ends perfect-return super ball', () => {
    const state = createTestGameState({
      ball: createTestBall({ x: centeredBallX + 30, y: 475, velocity: { x: 0, y: 240 }, perfectSuper: true })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(state.ball.perfectSuper).toBe(false);
  });

  test('uses a charged ball to deal two damage', () => {
    const brick = createTestBrick({ x: 100, y: 100, hitPoints: 3, maxHitPoints: 3 });
    const state = createTestGameState({
      bricks: [brick],
      ball: createTestBall({ x: 110, y: 105, isCharged: true })
    });
    updateGame(state, idleInput, [createTestLevel()], 0);
    expect(brick.hitPoints).toBe(1);
    expect(state.ball.isCharged).toBe(false);
  });
});
