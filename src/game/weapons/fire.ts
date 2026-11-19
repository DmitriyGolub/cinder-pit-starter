import { Not } from 'bitecs'
import { Body, Dead, Enemy, Position, Rotation, ViewRig, Weapon } from '../ecs/components'
import { defineQuery } from '../ecs/defineQuery'
import { PLAYER_SHOT } from '../config/combat'
import { PLAYER } from '../config/player'
import { WEAPON_VIEW } from '../config/view'
import { WEAPONS, type WeaponConfig } from '../config/weapons'
import { spawnPlayerShot } from '../entities/projectile'
import { wrapAngle } from '../math/angle'
import type { GameWorld } from '../ecs/world'

interface Aim {
  climb: number
  rise: number
}

const aimableQuery = defineQuery([Enemy, Position, Body, Not(Dead)])
const CENTER = 0.5

const pelletOffset = (pellet: number, pellets: number) => (pellet - (pellets - 1) / 2) * PLAYER_SHOT.fan

function autoAimTarget(world: GameWorld, player: number, weapon: WeaponConfig): number {
  let best = -1
  let bestDistance = weapon.range
  for (const enemy of aimableQuery(world)) {
    const deltaX = Position.x[enemy] - Position.x[player]
    const deltaY = Position.y[enemy] - Position.y[player]
    const distance = Math.hypot(deltaX, deltaY)
    if (distance >= bestDistance || Math.abs(wrapAngle(Math.atan2(deltaY, deltaX) - Rotation.yaw[player])) > PLAYER_SHOT.autoAim) continue
    best = enemy
    bestDistance = distance
  }
  return best
}

function aim(world: GameWorld, player: number, weapon: WeaponConfig, muzzleZ: number): Aim {
  const target = autoAimTarget(world, player, weapon)
  if (target >= 0) {
    const flight = (Math.hypot(Position.x[target] - Position.x[player], Position.y[target] - Position.y[player]) - PLAYER_SHOT.muzzleDistance) / weapon.speed
    const centerZ = Position.z[target] + Body.height[target] * CENTER
    return { climb: (centerZ - muzzleZ) / flight, rise: flight }
  }
  const rise = PLAYER_SHOT.riseTiles / weapon.speed
  return { climb: (Position.z[player] + PLAYER.eye - PLAYER_SHOT.aimDrop - muzzleZ) / rise, rise }
}

export function fireWeapon(world: GameWorld, player: number): void {
  const weapon = WEAPONS[Weapon.kind[player]]
  const yaw = Rotation.yaw[player]
  const x = Position.x[player] + Math.cos(yaw) * PLAYER_SHOT.muzzleDistance
  const y = Position.y[player] + Math.sin(yaw) * PLAYER_SHOT.muzzleDistance
  const z = Position.z[player] + PLAYER.eye + weapon.muzzle * PLAYER_SHOT.muzzleDistance
  const { climb, rise } = aim(world, player, weapon, z)
  for (let pellet = 0; pellet < weapon.pellets; pellet++) {
    spawnPlayerShot(world, {
      source: player,
      x,
      y,
      z,
      yaw: yaw + pelletOffset(pellet, weapon.pellets) + (world.random() * 2 - 1) * weapon.spread,
      climb,
      rise,
      speed: weapon.speed,
      range: weapon.range,
      damage: weapon.damage,
      pierce: weapon.pierce,
      splash: weapon.splash,
      element: weapon.element,
    })
  }
  Weapon.cooldown[player] = weapon.cooldown
  Weapon.sinceShot[player] = 0
  ViewRig.kick[player] = WEAPON_VIEW.kick
}
