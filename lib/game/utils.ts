import { IGame, CardLocation } from './types'

export function moveCardToStack(initialGame: IGame, cardId: string) {
  let game = { ...initialGame }

  const card = game.players
    .map((player) => player.cards)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while moving to stack`)
  }

  card.location = CardLocation.STACK

  return game
}

export function drawCard(initialGame: IGame, playerId: string) {
  let game = { ...initialGame }

  const player = game.players.find((player) => player.id === playerId)
  if (!player) {
    throw new Error(`no player found with id ${playerId} while drawing card`)
  }

  const library = player.cards.filter((card) => card.location === CardLocation.LIBRARY)
  if (library.length < 1) {
    throw new Error(`tried to draw card but none left, ${playerId} loses`)
  }

  library[0].location = CardLocation.HAND

  return game
}
