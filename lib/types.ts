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
  rarity?: string | undefined
  color?: string | undefined
  attack?: string | undefined
  defense?: string | undefined
  effect?: string | undefined
  specialEffect?: string | undefined
  ability_1?: string | undefined
  ability_2?: string | undefined
  emoji?: string | undefined
}
