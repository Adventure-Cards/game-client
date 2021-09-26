import { v4 as uuidv4 } from 'uuid'

// WORLD //

enum ManaColor {
  WHITE = 'white',
  BLUE = 'blue',
  BLACK = 'black',
  RED = 'red',
  GREEN = 'green',
  COLORLESS = 'colorless',
}

export interface Game {
  players: Player[]
  hasPriority: string
  phase: Phase
  stack: StackItem[]
}

enum Phase {
  MAIN = 'MAIN',
  END = 'END',
}

interface ManaPool {
  white: number
  blue: number
  black: number
  red: number
  green: number
  colorless: number
}

interface Player {
  id: string
  username: string
  life: number
  deck: Card[]
  availableActions: Action[]
  manaPool: ManaPool
}

// CARDS //

export interface BaseCard {
  id: string
  type: CardType
  location: CardLocation
  tapped: boolean
  abilities: Ability[]
}

enum CardType {
  CREATURE = 'CREATURE',
  ARTIFACT = 'ARTIFACT',
  ENCHANTMENT = 'ENCHANTMENT',
  SPELL = 'SPELL',
}

enum CardLocation {
  HAND = 'HAND',
  BATTLEFIELD = 'BATTLEFIELD',
  LIBRARY = 'LIBRARY',
  GRAVEYARD = 'GRAVEYARD',
}

interface Creature extends BaseCard {
  type: CardType.CREATURE
  attack: number
  defense: number
}

interface Artifact extends BaseCard {
  type: CardType.ARTIFACT
}

interface Enchantment extends BaseCard {
  type: CardType.ENCHANTMENT
}

interface Spell extends BaseCard {
  type: CardType.SPELL
}

export type Card = Creature | Artifact | Enchantment | Spell

// COSTS //
// a Cost exists as part of the static data associated with a card
// Costs are used to create CostItems when submitting an Action

interface BaseCost {
  target: CostTarget
  type: CostType
}

enum CostTarget {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
}

enum CostType {
  TAP = 'TAP',
  MANA = 'MANA',
  SACRIFICE_PERMANENT = 'SACRIFICE_PERMANENT',
}

interface CostMana extends BaseCost {
  target: CostTarget.PLAYER
  type: CostType.MANA
  color: ManaColor
  amount: number
}

interface CostSacrificePermanent extends BaseCost {
  target: CostTarget.PLAYER
  type: CostType.SACRIFICE_PERMANENT
  number: number
}

interface CostTap extends BaseCost {
  target: CostTarget.CARD
  type: CostType.TAP
}

type Cost = CostMana | CostSacrificePermanent | CostTap

// COST ITEMS //
// a CostItem exists as part of an Action
// it refers to a specific cost being paid in the game

interface BaseCostItem {
  cost: Cost
  target: CostTarget
}

interface CostItemPlayer extends BaseCostItem {
  cost: Cost
  target: CostTarget.PLAYER
  playerId: string
}

interface CostItemCard extends BaseCostItem {
  cost: Cost
  target: CostTarget.CARD
  cardId: string
}

type CostItem = CostItemPlayer | CostItemCard

// EFFECT CREATORS

interface Ability {
  costs: Cost[]
  effects: Effect[]
}

interface EffectTrigger {
  on: EffectType
  costs: Cost[]
  effects: Effect[]
}

// EFFECTS

interface BaseEffect {
  type: EffectType
}

enum EffectType {
  DAMAGE_ANY = 'DAMAGE_ANY',
  DAMAGE_PLAYER = 'DAMAGE_PLAYER',
  DAMAGE_CREATURE = 'DAMAGE_CREATURE',
  SELECT_TARGET = 'SELECT_TARGET',
  MANA_ADD = 'MANA_ADD',
  MANA_SUBTRACT = 'MANA_SUBTRACT',
  PHASE_UNTAP = 'PHASE_UNTAP',
  PHASE_UPKEEP = 'PHASE_UPKEEP',
  PHASE_DRAW = 'PHASE_DRAW',
  PHASE_MAIN = 'PHASE_MAIN',
  RELEASE_PRIORITY = 'RELEASE_PRIORITY',
}

// this will kick off the EffectSelectTargets????? who knows
interface EffectDamageAny extends BaseEffect {
  type: EffectType.DAMAGE_ANY
  number_of_targets: 1
  amount: number
}

// this just mutates the controllers mana pool
interface EffectManaAdd extends BaseEffect {
  type: EffectType.MANA_ADD
  color: ManaColor
  amount: number
}

// this mutates the games priorityPlayerId
interface EffectReleasePriority extends BaseEffect {
  type: EffectType.RELEASE_PRIORITY
}

type Effect = EffectManaAdd | EffectDamageAny | EffectReleasePriority

// ACTIONS

export interface BaseAction {
  type: ActionType
  controllerId: string
  costItems: CostItem[]
  effects: Effect[]
}

export enum ActionType {
  ABILITY_ACTION = 'ABILITY_ACTION',
  EFFECT_ACTION = 'EFFECT_ACTION',
  PRIORITY_ACTION = 'PRIORITY_ACTION',
}

export interface AbilityAction extends BaseAction {
  type: ActionType.ABILITY_ACTION
  cardId: string
}

interface EffectAction extends BaseAction {
  type: ActionType.EFFECT_ACTION
}

interface PriorityAction extends BaseAction {
  type: ActionType.PRIORITY_ACTION
}

export type Action = AbilityAction | EffectAction | PriorityAction

// STACK

interface StackItem {
  controllerId: string
  effect: Effect
}

// TEST //

export function buildTestGame(): Game {
  const card1: Creature = {
    id: uuidv4(),
    type: CardType.CREATURE,
    location: CardLocation.HAND,
    tapped: false,
    abilities: [
      {
        costs: [{ target: CostTarget.PLAYER, type: CostType.MANA, color: ManaColor.WHITE, amount: 2 }],
        effects: [
          {
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
        costs: [{ target: CostTarget.CARD, type: CostType.TAP }],
        effects: [
          {
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
  }

  game = updateAvailableActionsForPlayers(game)

  return game
}

function updateAvailableActionsForPlayers(initialGame: Game): Game {
  let game = { ...initialGame }

  for (const player of game.players) {
    let availableActions: Action[] = []

    const cardActions = player.deck.map((card) => getActionsForCard(game, player, card)).flat()

    availableActions = [...availableActions, ...cardActions]

    if (game.hasPriority === player.id) {
      const releasePriorityAction: Action = {
        type: ActionType.PRIORITY_ACTION,
        controllerId: player.id,
        costItems: [],
        effects: [
          {
            type: EffectType.RELEASE_PRIORITY,
          },
        ],
      }
      availableActions = [...availableActions, releasePriorityAction]
    }

    // add effect actions here (look at top effect on stack and see if belongs to player?)

    player.availableActions = availableActions
  }

  return game
}

function getActionsForCard(game: Game, player: Player, card: Card) {
  const actions: AbilityAction[] = []

  for (const ability of card.abilities) {
    // put together CostItems
    const costItems: CostItem[] = []

    for (const cost of ability.costs) {
      switch (cost.target) {
        case CostTarget.PLAYER:
          costItems.push({
            cost: cost,
            target: cost.target,
            playerId: player.id,
          })
          break
        case CostTarget.CARD:
          costItems.push({
            cost: cost,
            target: cost.target,
            cardId: card.id,
          })
          break
        default:
          throw new Error(`unhandled cost target`)
      }
    }

    // validate that costItems can be paid
    for (const costItem of costItems) {
      if (!validateCostItem(game, costItem)) {
        break
      }
    }

    actions.push({
      type: ActionType.ABILITY_ACTION,
      cardId: card.id,
      controllerId: player.id,
      costItems: costItems,
      effects: ability.effects,
    })
  }

  return actions
}

export function handleAction(initialGame: Game, action: Action): Game {
  let game = { ...initialGame }

  // validate that costItems can be paid
  for (const costItem of action.costItems) {
    if (!validateCostItem(game, costItem)) {
      break
    }
  }

  // execute costs immediately (they never get added to the stack, just like MTG!)
  for (const costItem of action.costItems) {
    game = processCostItem(game, costItem)
  }

  for (const effect of action.effects) {
    game.stack.push({
      controllerId: action.controllerId,
      effect: effect,
    })
  }

  return game
}

function validateCostItem(game: Game, costItem: CostItem) {
  return true
}

function processCostItem(initialGame: Game, costItem: CostItem) {
  let game = { ...initialGame }

  switch (costItem.target) {
    case CostTarget.PLAYER:
      game = processCostPlayer(game, costItem.playerId, costItem.cost)
      break
    case CostTarget.CARD:
      game = processCostCard(game, costItem.cardId, costItem.cost)
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}

function processCostPlayer(initialGame: Game, playerId: string, cost: Cost) {
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

function processCostCard(initialGame: Game, cardId: string, cost: Cost) {
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

function processEffect(initialGame: Game, controllerId: string, effect: Effect) {
  let game = { ...initialGame }

  switch (effect.type) {
    case EffectType.MANA_ADD:
      const player = game.players.find((player) => player.id === controllerId)
      if (player) {
        player.manaPool[effect.color] += effect.amount
      }

      break
    default:
      throw new Error(`unhandled effect type: ${effect.type}`)
  }

  return game
}

export function processStackItem(initialGame: Game) {
  let game = { ...initialGame }

  // the purpose of this function is to pop the top StackItem
  // and process the effect

  // effects can:
  // 1) mutate player and card objects
  // 2) update the game phase
  // 3) create more effects

  const stackItem = game.stack.pop()

  if (stackItem) {
    processEffect(game, stackItem.controllerId, stackItem.effect)
  }

  // after processing a stack item, need to refresh the available actions
  // for each player, because the game state has changed
  game = updateAvailableActionsForPlayers(game)

  return game
}
