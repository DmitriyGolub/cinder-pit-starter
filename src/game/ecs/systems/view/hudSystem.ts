import { Health, Player, Weapon } from '../../components'
import { PLAYER_VIEW_START } from '../../../config/hud'
import { WEAPONS } from '../../../config/weapons'
import type { GameWorld } from '../../world'
import { defineQuery } from '../../defineQuery'

const playerHealthQuery = defineQuery([Player, Health, Weapon])

export function hudSystem(world: GameWorld): void {
  for (const player of playerHealthQuery(world)) {
    world.hud.showPlayer({
      ...PLAYER_VIEW_START,
      hp: Math.ceil(Health.hp[player]),
      healthMax: Math.ceil(Health.max[player]),
      time: world.run.time,
      kills: world.run.kills,
      weapon: WEAPONS[Weapon.kind[player]].name,
    })
  }
}
