import { v4 as uuidv4 } from 'uuid'

import abilities from '../../data/abilities'
import effects from '../../data/effects'
import costs from '../../data/costs'

import {
  IManaColor,
  IGame,
  Phase,
  IPlayer,
  ICard,
  CardType,
  CardLocation,
  IAbility,
  EffectType,
  Target,
  CostType,
  EffectExecutionType,
  AbilitySpeed,
} from './types'

import { updateAvailableActionsForPlayers } from './actions'
import { IDeck, ICardData } from '../types'
import { randomIntFromInterval } from '../utils'

export function buildTestGame(deck: IDeck): IGame {
  const cards = deck.cards.map((card) => getCard(card))

  // put 3 cards into hand at random
  while (cards.filter((card) => card.location === CardLocation.HAND).length < 3) {
    cards[randomIntFromInterval(0, 44)].location = CardLocation.HAND
  }

  const player1: IPlayer = {
    id: uuidv4(),
    username: `deck-${deck.id}`,
    life: 20,
    deck: cards,
    availableActions: [],
    manaPool: {
      white: 0,
      blue: 0,
      black: 0,
      red: 0,
      green: 0,
      colorless: 0,
    },
  }

  let game: IGame = {
    players: [{ ...player1 }],
    hasPriority: player1.id,
    phase: Phase.MAIN,
    stack: [],
    turn: 1,
    opponentLife: 20,
  }

  game = updateAvailableActionsForPlayers(game)

  console.log('just updated available actions, new game:', game)

  return game
}

function getCard(cardData: ICardData): ICard {
  let card: ICard

  switch (cardData.type) {
    case 'CREATURE':
      if (!cardData.attack || !cardData.defense) {
        throw new Error('creature card missing stats')
      }
      card = {
        name: cardData.name,
        level: cardData.level,
        id: uuidv4(),
        type: (<any>CardType)[cardData.type],
        location: CardLocation.LIBRARY,
        tapped: false,
        abilities: [],
        attack: Number(cardData.attack),
        defense: Number(cardData.defense),
      }
      break
    case 'ARTIFACT':
      card = {
        name: cardData.name,
        level: cardData.level,
        id: uuidv4(),
        type: (<any>CardType)[cardData.type],
        location: CardLocation.LIBRARY,
        tapped: false,
        abilities: [],
      }
      break
    case 'ENCHANTMENT':
      card = {
        name: cardData.name,
        level: cardData.level,
        id: uuidv4(),
        type: (<any>CardType)[cardData.type],
        location: CardLocation.LIBRARY,
        tapped: false,
        abilities: [],
      }
      break
    case 'SPELL':
      card = {
        name: cardData.name,
        level: cardData.level,
        id: uuidv4(),
        type: (<any>CardType)[cardData.type],
        location: CardLocation.LIBRARY,
        tapped: false,
        abilities: [],
      }
      break
    default:
      throw new Error('card type not matched')
  }

  if (cardData.ability_1) {
    const ability1 = getAbility(cardData.ability_1)
    card.abilities.push(ability1)
  }
  if (cardData.ability_2) {
    const ability2 = getAbility(cardData.ability_2)
    card.abilities.push(ability2)
  }

  return card
}

function getAbility(abilityId: string): IAbility {
  const foundAbility = abilities.find((ability) => ability.id === abilityId)
  if (!foundAbility) {
    throw new Error(`abilityId not found: ${abilityId}`)
  }

  const result: IAbility = {
    id: foundAbility.id,
    name: foundAbility.name,
    description: foundAbility.description,
    speed: foundAbility.speed as AbilitySpeed,
    costs: [],
    effects: [],
  }

  const costKeys = ['cost1', 'cost2', 'cost3']
  costKeys.forEach((costIdx) => {
    // @ts-ignore
    const costId = foundAbility[costIdx]

    if (costId !== '') {
      const foundCost = costs.find((cost) => cost.id === costId)
      if (!foundCost) {
        throw new Error(`costId not found: ${costId}`)
      }

      result.costs.push({
        type: (<any>CostType)[foundCost.type],
        target: (<any>Target)[foundCost.target],
        color: (<any>IManaColor)[foundCost.color],
        amount: Number(foundCost.amount),
      })
    }
  })

  const effectKeys = ['effect1', 'effect2', 'effect3']
  effectKeys.forEach((effectIdx) => {
    // @ts-ignore
    const effectId = foundAbility[effectIdx]

    if (effectId !== '') {
      const foundEffect = effects.find((effect) => effect.id === effectId)
      if (!foundEffect) {
        throw new Error(`costId not found: ${effectId}`)
      }

      result.effects.push({
        type: (<any>EffectType)[foundEffect.type],
        executionType: (<any>EffectExecutionType)[foundEffect.executionType],
        target: (<any>Target)[foundEffect.target],
        color: (<any>IManaColor)[foundEffect.color],
        amount: Number(foundEffect.amount),
      })
    }
  })

  return result
}
