import { Game, Target, CostType, Cost, CostItem } from './types'

export function validateCostItem(game: Game, costItem: CostItem) {
  switch (costItem.target) {
    case Target.PLAYER:
      return validateCostPlayer(game, costItem.cost, costItem.playerId)
    case Target.CARD:
      return validateCostCard(game, costItem.cost, costItem.cardId)
    default:
      throw new Error(`unhandled CostTarget`)
  }
}

function validateCostPlayer(game: Game, cost: Cost, playerId: string) {
  const player = game.players.find((player) => player.id === playerId)
  if (!player) {
    throw new Error(`no player found with id ${playerId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.MANA:
      if (player.manaPool[cost.color] < cost.amount) {
        return false
      }
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return true
}

function validateCostCard(game: Game, cost: Cost, cardId: string) {
  const card = game.players
    .map((player) => player.deck)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.TAP:
      if (card.tapped) {
        return false
      }
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return true
}

export function processCostItem(initialGame: Game, costItem: CostItem) {
  let game = { ...initialGame }

  switch (costItem.target) {
    case Target.PLAYER:
      game = processCostPlayer(game, costItem.cost, costItem.playerId)
      break
    case Target.CARD:
      game = processCostCard(game, costItem.cost, costItem.cardId)
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}

function processCostPlayer(initialGame: Game, cost: Cost, playerId: string) {
  let game = { ...initialGame }

  const player = game.players.find((player) => player.id === playerId)
  if (!player) {
    throw new Error(`no player found with id ${playerId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.MANA:
      player.manaPool[cost.color] -= cost.amount
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}

function processCostCard(initialGame: Game, cost: Cost, cardId: string) {
  let game = { ...initialGame }

  const card = game.players
    .map((player) => player.deck)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.TAP:
      card.tapped = true
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}
