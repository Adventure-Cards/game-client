import { IGame, ICard, CardLocation } from './types'

export function getGameStateForPlayer(game: IGame): IGameStateForPlayer {
  const player = game.players.find((player) => player.username === 'player')
  if (!player) {
    throw new Error(`unable to find player`)
  }

  const opponent = game.players.find((player) => player.username === 'opponent')
  if (!opponent) {
    throw new Error(`unable to find opponent`)
  }

  return {
    player: {
      id: player.id,
      username: player.username,
      life: player.life,
      mana: player.mana,
      hand: player.cards.filter((card) => card.location === CardLocation.HAND),
      numberOfCardsInLibrary: player.cards.filter((card) => card.location === CardLocation.LIBRARY).length,
      battlefield: player.cards.filter((card) => card.location === CardLocation.BATTLEFIELD),
      graveyard: player.cards.filter((card) => card.location === CardLocation.GRAVEYARD),
      stack: player.cards.filter((card) => card.location === CardLocation.STACK),
    },
    opponent: {
      id: opponent.id,
      username: opponent.username,
      life: opponent.life,
      mana: opponent.mana,
      numberOfCardsInHand: opponent.cards.filter((card) => card.location === CardLocation.BATTLEFIELD).length,
      numberOfCardsInLibrary: opponent.cards.filter((card) => card.location === CardLocation.LIBRARY).length,
      battlefield: opponent.cards.filter((card) => card.location === CardLocation.BATTLEFIELD),
      graveyard: opponent.cards.filter((card) => card.location === CardLocation.GRAVEYARD),
      stack: opponent.cards.filter((card) => card.location === CardLocation.STACK),
    },
  }
}

interface IGameStateForPlayer {
  player: IPlayerForPlayer
  opponent: IOpponentForPlayer
}

export interface IPlayerForPlayer {
  id: string
  username: string
  life: number
  mana: number
  hand: ICard[]
  numberOfCardsInLibrary: number
  battlefield: ICard[]
  graveyard: ICard[]
  stack: ICard[]
}

export interface IOpponentForPlayer {
  id: string
  username: string
  life: number
  mana: number
  numberOfCardsInHand: number
  numberOfCardsInLibrary: number
  battlefield: ICard[]
  graveyard: ICard[]
  stack: ICard[]
}
