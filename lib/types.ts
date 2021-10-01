export interface IDeck {
  id: number
  numericId: number
  owner: string
  name: string
  cards: ICardData[]
}

export interface ICardData {
  level: number
  name: string
  type: string
  cost?: string | undefined
  rarity?: string | undefined
  color?: string | undefined
  attack?: string | undefined
  defense?: string | undefined
  ability_1?: string | undefined
  ability_2?: string | undefined
  effect1?: string | undefined
  effect2?: string | undefined
  effect3?: string | undefined
  // not currently used for game
  effect?: string | undefined
  specialEffect?: string | undefined
  emoji?: string | undefined
}
