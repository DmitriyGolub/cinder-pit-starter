import { addComponent, addEntity } from 'bitecs'
import { floorHeight } from '../arena/Level'
import { ARENA } from '../config/arena'
import { PLAYER } from '../config/player'
import { STARTING_WEAPON, WEAPON_RAISE } from '../config/weapons'
import { Body, Health, Player, Shootable, Weapon, Position, Rotation, Velocity, ViewRig } from '../ecs/components'
import type { GameWorld } from '../ecs/world'

const CELL_CENTER = 0.5

export function spawnPlayer(world: GameWorld): number {
  const player = addEntity(world)
  for (const component of [Player, Position, Velocity, Rotation, Body, ViewRig, Health, Shootable, Weapon]) addComponent(world, player, component)
  const x = ARENA.size / 2 + CELL_CENTER
  const y = ARENA.size / 2 + CELL_CENTER
  Position.x[player] = x
  Position.y[player] = y
  Position.z[player] = floorHeight(world.level, x, y)
  ViewRig.height[player] = Position.z[player]
  Body.radius[player] = PLAYER.radius
  Body.height[player] = PLAYER.height
  Health.hp[player] = PLAYER.healthMax
  Health.max[player] = PLAYER.healthMax
  Weapon.kind[player] = STARTING_WEAPON
  Weapon.cooldown[player] = WEAPON_RAISE
  Weapon.sinceShot[player] = WEAPON_RAISE
  return player
}
