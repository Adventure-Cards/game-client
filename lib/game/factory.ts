import { v4 as uuidv4 } from 'uuid'

import {
  ManaColor,
  Game,
  Phase,
  Player,
  Creature,
  Artifact,
  CardType,
  CardLocation,
  EffectType,
  Target,
  CostType,
  EffectExecutionType,
  AbilitySpeed,
} from './types'

import { updateAvailableActionsForPlayers } from './actions'

export function buildTestGame(): Game {
  const card1: Creature = {
    id: uuidv4(),
    type: CardType.CREATURE,
    location: CardLocation.HAND,
    tapped: false,
    abilities: [
      {
        speed: AbilitySpeed.NORMAL,
        costs: [{ target: Target.PLAYER, type: CostType.MANA, color: ManaColor.WHITE, amount: 2 }],
        effects: [
          {
            executionType: EffectExecutionType.RESPONDABLE,
            type: EffectType.DAMAGE_ANY,
            number_of_targets: 1,
            amount: 1,
          },
        ],
      },
    ],
    attack: 1,
    defense: 1,
  }

  const card2: Artifact = {
    id: uuidv4(),
    type: CardType.ARTIFACT,
    location: CardLocation.HAND,
    tapped: false,
    abilities: [
      {
        speed: AbilitySpeed.INSTANT,
        costs: [{ target: Target.CARD, type: CostType.TAP }],
        effects: [
          {
            executionType: EffectExecutionType.IMMEDIATE,
            type: EffectType.MANA_ADD,
            color: ManaColor.WHITE,
            amount: 1,
          },
        ],
      },
    ],
  }

  const player1: Player = {
    id: uuidv4(),
    username: 'Olias',
    life: 20,
    deck: [{ ...card1 }, { ...card2 }],
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

  let game: Game = {
    players: [{ ...player1 }],
    hasPriority: player1.id,
    phase: Phase.MAIN,
    stack: [],
    turn: 1,
  }

  game = updateAvailableActionsForPlayers(game)

  return game
}
