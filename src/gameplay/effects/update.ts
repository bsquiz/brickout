import { Constants } from '../../constants';
import type { GameState } from '../types';

export const updateVisualEffects = (state: GameState, deltaSeconds: number): void => {
  for (const particle of state.effects.particles) {
    particle.x += particle.velocity.x * deltaSeconds;
    particle.y += particle.velocity.y * deltaSeconds;
    particle.velocity.y += 260 * deltaSeconds;
    particle.life -= deltaSeconds;
  }
  state.effects.particles = state.effects.particles.filter((particle) => particle.life > 0);

  for (const text of state.effects.floatingTexts) {
    text.y -= 28 * deltaSeconds;
    text.life -= deltaSeconds;
  }
  state.effects.floatingTexts = state.effects.floatingTexts.filter((text) => text.life > 0);
  for (const shockwave of state.effects.shockwaves) {
    shockwave.radius = Math.max(0, shockwave.radius + shockwave.speed * deltaSeconds);
    shockwave.life -= deltaSeconds;
  }
  state.effects.shockwaves = state.effects.shockwaves.filter((shockwave) => shockwave.life > 0);
  for (const fragment of state.effects.paddleFragments) {
    fragment.x += fragment.velocity.x * deltaSeconds;
    fragment.y += fragment.velocity.y * deltaSeconds;
    fragment.velocity.y += 420 * deltaSeconds;
    fragment.rotation += fragment.angularVelocity * deltaSeconds;
    fragment.life -= deltaSeconds;
  }
  state.effects.paddleFragments = state.effects.paddleFragments.filter((fragment) => fragment.life > 0);
  if (state.effects.banner !== null) {
    state.effects.banner.remaining -= deltaSeconds;
    if (state.effects.banner.remaining <= 0) state.effects.banner = null;
  }
  state.effects.shake = Math.max(0, state.effects.shake - 28 * deltaSeconds);
  state.effects.paddleImpact = Math.max(0, state.effects.paddleImpact - 5 * deltaSeconds);
  state.effects.ballImpact = Math.max(0, state.effects.ballImpact - Constants.Animation.Ball.IMPACT_DECAY_PER_SECOND * deltaSeconds);
  state.effects.chargePulse = Math.max(0, state.effects.chargePulse - Constants.Animation.Ball.CHARGE_PULSE_DECAY_PER_SECOND * deltaSeconds);
  state.effects.alienDamageFlash = Math.max(0, state.effects.alienDamageFlash - Constants.Animation.Alien.DAMAGE_FLASH_DECAY_PER_SECOND * deltaSeconds);
  state.effects.nearMissGlow = Math.max(0, state.effects.nearMissGlow - Constants.Animation.NearMiss.GLOW_DECAY_PER_SECOND * deltaSeconds);
  state.effects.flash = Math.max(0, state.effects.flash - deltaSeconds);
  state.effects.lifeFlash = Math.max(0, state.effects.lifeFlash - deltaSeconds * 2.5);
  state.effects.backgroundPulse = Math.max(0, state.effects.backgroundPulse - deltaSeconds * 1.8);
  state.effects.cameraZoom = Math.max(0, state.effects.cameraZoom - deltaSeconds * 0.12);
  state.effects.cameraKickX *= Math.max(0, 1 - deltaSeconds * 12);
  state.effects.cameraKickY *= Math.max(0, 1 - deltaSeconds * 12);
  for (const arc of state.effects.lightningArcs) arc.life -= deltaSeconds;
  state.effects.lightningArcs = state.effects.lightningArcs.filter((arc) => arc.life > 0);
  for (const spark of state.effects.vortexSparks) {
    spark.life -= deltaSeconds;
    spark.radius *= Math.max(0, 1 - deltaSeconds * 5.2);
    spark.angle += Math.PI * 2 * Constants.Animation.Vortex.TURNS * deltaSeconds / spark.maxLife;
  }
  state.effects.vortexSparks = state.effects.vortexSparks.filter((spark) => spark.life > 0);
};
