export const CAMERA = { heightLerp: 12, bobRate: 2.2, bobFrequency: 2, bobHeight: 0.03, deadEye: 0.15 }

export const WEAPON_VIEW = { swayX: 6, swayY: 5, raiseOffset: 160, deadOffset: 200, kick: 14, kickDecay: 7, fireFrame: 0.45, lightScale: 0.6, lightBase: 0.4 }

export const INDICATORS = { range: 12, max: 10, fovMargin: 0.9, alphaMin: 0.15, alphaRange: 0.45 }

export const NUMBER_STYLE = { normal: 0, crit: 1, damageOverTime: 10 }

export const NUMBERS = {
  life: 0.8,
  max: 60,
  rise: 0.9,
  merge: 0.18,
  pop: 0.18,
  popScale: 0.45,
  spread: 0.35,
  stroke: 4,
  font: '"Courier New", monospace',
  normal: { size: 20, color: '#fff4d8', suffix: '' },
  crit: { size: 30, color: '#ffd030', suffix: '!' },
  damageOverTime: { size: 15, suffix: '' },
  growPerHundred: 0.15,
  growMax: 0.6,
}

export const PROCS = { life: 0.9, rise: 0.7, lift: 0.45, size: 36, pop: 0.2, popScale: 0.6, merge: 0.5, max: 40, slots: 3, spread: 0.3, fadeGain: 2.5 }

export const HURT_ARC = { life: 0.6, radius: 0.42, width: 14, spread: 0.35 }

export const CONFIRM_LIFE = 0.12

export const ENEMY_WALK = { fps: 6, frames: 4 }

export const FLOAT = { rate: 3, amplitude: 0.08 }

export const VIEW_FRONT = 0.8

export const SPIN_MIN = 0.12

export const AURA_VIEW = { pulseTime: 0.45, lift: 0.03, effectCap: 24 }

export const LIGHTNING = { life: 0.2, segments: 6, jaggedness: 0.3, glow: 7, core: 2, glowColor: '#d8c040', coreColor: '#fffbe0' }

export const LEVEL_VIEW = { sideShade: 0.8 }

export const VIEW_SCREEN = { unit: 100, halfWidth: 160, halfHeight: 100, originX: 1, originY: 32, depth: 1, far: 10, alphaCutoff: 0.5 }

export const SPRITE_SHADER = { alphaCutoff: 0.5, tintGain: 2.2, luma: [0.3, 0.59, 0.11] }

export const GLOW_SHADER = {
  beatBase: 0.75, beatAmplitude: 0.25, beatRate: 3, corePower: 2, coreGain: 0.55,
  ringRadius: 0.78, ringSharp: 14, ringBase: 0.6, ringAmplitude: 0.4, ringSpokes: 6, ringSpin: 2,
  waveRate: 0.6, waveSharp: 10, waveGain: 0.6,
}

export const HAZE_SHADER = {
  seedTime: 20, noiseX: 2.2, noiseY: 2.5, swayRate: 0.7, swayFrequency: 3, swayAmplitude: 0.3, rise: 0.8,
  edgeSoft: 0.25, baseWidth: 0.55, widthGrow: 0.45, fadeIn: 0.18, fadeOut: 0.55,
  densityLow: 0.35, densityHigh: 0.85, gain: 0.9,
}

export const AURA_SHADER = {
  swirlA: 5, swirlRateA: 1.7, swirlTwistA: 9, swirlB: 3, swirlRateB: 1.1, swirlTwistB: 13,
  bodyBase: 0.12, bodySwirl: 0.14, bodyInner: 0.1, bodyOuter: 0.7, rimStart: 0.88, rimPeak: 0.97,
  waveSharp: 8, waveFade: 0.6, waveGain: 1.2, flashGain: 0.25,
}

export const RENDER = {
  pixelScale: 3,
  fov: 72,
  near: 0.05,
  far: 100,
  fogNear: 4,
  fogFar: 24,
  spriteScale: 1 / 64,
  spritesMax: 8192,
  sky: 0x140b0e,
}

export const STATUS_VIEW = { flicker: 9, duty: 0.45 }

export const MELEE_VIEW = {
  tint: 0xfff4e0,
  flickerStart: 3,
  flickerEnd: 16,
  windupSquash: 1.15,
  lungeSquash: 0.8,
  slashForward: 1.1,
  slashTint: 0xffd090,
  dustTint: 0x8a7a6a,
}

export const IMPACT = { hitStop: 0.08, hitStopThreshold: 0.8, shake: 0.2, shakeDecay: 7, shakeFrequency: 47, shakePhaseX: 1, shakePhaseY: 1.3, shakePhaseZ: 0.7, shakeVerticalScale: 0.5 }

export const SHADOW_VIEW = { max: 600, lift: 0.015, radiusScale: 1.6, flyingFade: 0.6 }

export const SHADOW_SHADER = { strength: 0.55, softness: 0.35 }
