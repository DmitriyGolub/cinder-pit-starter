import { biomeAt } from '../../../arena/Level'
import { Player, Position } from '../../components'
import { BIOME_NOISE, BIOMES } from '../../../config/biomes'
import { blue, green, red } from '../../../math/color'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const playerQuery = defineQuery([Player, Position])

export function atmosphereSystem(world: GameWorld): void {
  const { atmosphere } = world
  const blend = Math.min(1, world.time.delta * BIOME_NOISE.fogLerp)
  for (const player of playerQuery(world)) {
    const fog = BIOMES[biomeAt(world.level, Position.x[player], Position.y[player])].fog
    atmosphere.red += (red(fog) - atmosphere.red) * blend
    atmosphere.green += (green(fog) - atmosphere.green) * blend
    atmosphere.blue += (blue(fog) - atmosphere.blue) * blend
  }
  world.render.setFog(atmosphere.red, atmosphere.green, atmosphere.blue)
}
