export interface IDeck {
  mintId: number
  owner: string
  cards: ICardData[]
}

export interface ICardData {
  level: number
  name: string
  type: string
}
