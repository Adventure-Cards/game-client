// WORLD //

export enum ManaColor {
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

export enum Phase {
  MAIN = 'MAIN',
  END = 'END',
}

export interface ManaPool {
  white: number
  blue: number
  black: number
  red: number
  green: number
  colorless: number
}

export interface Player {
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

export enum CardType {
  CREATURE = 'CREATURE',
  ARTIFACT = 'ARTIFACT',
  ENCHANTMENT = 'ENCHANTMENT',
  SPELL = 'SPELL',
}

export enum CardLocation {
  HAND = 'HAND',
  BATTLEFIELD = 'BATTLEFIELD',
  LIBRARY = 'LIBRARY',
  GRAVEYARD = 'GRAVEYARD',
}

export interface Creature extends BaseCard {
  type: CardType.CREATURE
  attack: number
  defense: number
}

export interface Artifact extends BaseCard {
  type: CardType.ARTIFACT
}

export interface Enchantment extends BaseCard {
  type: CardType.ENCHANTMENT
}

export interface Spell extends BaseCard {
  type: CardType.SPELL
}

export type Card = Creature | Artifact | Enchantment | Spell

// COSTS //
// a Cost exists as part of the static data associated with a card
// Costs are used to create CostItems when submitting an Action

export interface BaseCost {
  target: CostTarget
  type: CostType
}

export enum CostTarget {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
}

export enum CostType {
  TAP = 'TAP',
  MANA = 'MANA',
  SACRIFICE_PERMANENT = 'SACRIFICE_PERMANENT',
}

export interface CostMana extends BaseCost {
  target: CostTarget.PLAYER
  type: CostType.MANA
  color: ManaColor
  amount: number
}

export interface CostSacrificePermanent extends BaseCost {
  target: CostTarget.PLAYER
  type: CostType.SACRIFICE_PERMANENT
  number: number
}

export interface CostTap extends BaseCost {
  target: CostTarget.CARD
  type: CostType.TAP
}

export type Cost = CostMana | CostSacrificePermanent | CostTap

// COST ITEMS //
// a CostItem exists as part of an Action
// it refers to a specific cost being paid in the game

export interface BaseCostItem {
  cost: Cost
  target: CostTarget
}

export interface CostItemPlayer extends BaseCostItem {
  cost: Cost
  target: CostTarget.PLAYER
  playerId: string
}

export interface CostItemCard extends BaseCostItem {
  cost: Cost
  target: CostTarget.CARD
  cardId: string
}

export type CostItem = CostItemPlayer | CostItemCard

// EFFECT CREATORS

export interface Ability {
  costs: Cost[]
  effects: Effect[]
}

export interface EffectTrigger {
  on: EffectType
  costs: Cost[]
  effects: Effect[]
}

// EFFECTS

export interface BaseEffect {
  type: EffectType
}

export enum EffectType {
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
export interface EffectDamageAny extends BaseEffect {
  type: EffectType.DAMAGE_ANY
  number_of_targets: 1
  amount: number
}

// this just mutates the controllers mana pool
export interface EffectManaAdd extends BaseEffect {
  type: EffectType.MANA_ADD
  color: ManaColor
  amount: number
}

// this mutates the games priorityPlayerId
export interface EffectReleasePriority extends BaseEffect {
  type: EffectType.RELEASE_PRIORITY
}

export type Effect = EffectManaAdd | EffectDamageAny | EffectReleasePriority

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

export interface EffectAction extends BaseAction {
  type: ActionType.EFFECT_ACTION
}

export interface PriorityAction extends BaseAction {
  type: ActionType.PRIORITY_ACTION
}

export type Action = AbilityAction | EffectAction | PriorityAction

// STACK

export interface StackItem {
  controllerId: string
  effect: Effect
}
