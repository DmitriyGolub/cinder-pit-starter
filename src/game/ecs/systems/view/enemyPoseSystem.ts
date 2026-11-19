import { Not } from 'bitecs'
import { Dead, Enemy, Sprite } from '../../components'
import { ENEMY_WALK } from '../../../config/view'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const walkerQuery = defineQuery([Enemy, Sprite, Not(Dead)])
const corpseQuery = defineQuery([Enemy, Sprite, Dead])

export function enemyPoseSystem(world: GameWorld): void {
  const step = world.time.elapsed * ENEMY_WALK.fps
  for (const enemy of walkerQuery(world)) {
    Sprite.frame[enemy] = `${Enemy.sprite[enemy]}_walk${Math.floor(step + Sprite.phase[enemy]) % ENEMY_WALK.frames}`
  }
  for (const enemy of corpseQuery(world)) Sprite.frame[enemy] = `${Enemy.sprite[enemy]}_dead`
}
