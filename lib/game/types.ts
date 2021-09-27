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
  turn: number
}

export enum Phase {
  UNTAP = 'UNTAP',
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
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

export enum Target {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
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
  target: Target
  type: CostType
}

export enum CostType {
  TAP = 'TAP',
  MANA = 'MANA',
  SACRIFICE_PERMANENT = 'SACRIFICE_PERMANENT',
}

export interface CostMana extends BaseCost {
  target: Target.PLAYER
  type: CostType.MANA
  color: ManaColor
  amount: number
}

export interface CostSacrificePermanent extends BaseCost {
  target: Target.PLAYER
  type: CostType.SACRIFICE_PERMANENT
  number: number
}

export interface CostTap extends BaseCost {
  target: Target.CARD
  type: CostType.TAP
}

export type Cost = CostMana | CostSacrificePermanent | CostTap

// COST ITEMS //
// a CostItem exists as part of an Action
// it refers to a specific cost being paid in the game

export interface BaseCostItem {
  cost: Cost
  target: Target
}

export interface CostItemPlayer extends BaseCostItem {
  target: Target.PLAYER
  playerId: string
}

export interface CostItemCard extends BaseCostItem {
  target: Target.CARD
  cardId: string
}

export type CostItem = CostItemPlayer | CostItemCard

// EFFECTS
// an Effect exists as part of the static data associated with a card
// Effects are used to create EffectItems when submitting an Action

export interface BaseEffect {
  executionType: EffectExecutionType
  type: EffectType
}

export enum EffectExecutionType {
  RESPONDABLE = 'RESPONDABLE',
  IMMEDIATE = 'IMMEDIATE',
}

export enum EffectType {
  DAMAGE_ANY = 'DAMAGE_ANY',
  DAMAGE_PLAYER = 'DAMAGE_PLAYER',
  DAMAGE_CREATURE = 'DAMAGE_CREATURE',
  SELECT_TARGET = 'SELECT_TARGET',
  MANA_ADD = 'MANA_ADD',

  PHASE_UNTAP = 'PHASE_UNTAP',
  PHASE_DRAW = 'PHASE_DRAW',
  PHASE_MAIN = 'PHASE_MAIN',
  PHASE_COMBAT = 'PHASE_COMBAT',
  PHASE_END = 'PHASE_END',

  RELEASE_PRIORITY = 'RELEASE_PRIORITY',
}

export interface EffectDamageAny extends BaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.DAMAGE_ANY
  number_of_targets: number
  amount: number
}

// this just mutates the controllers mana pool
export interface EffectManaAdd extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.MANA_ADD
  color: ManaColor
  amount: number
}

// this mutates the games priorityPlayerId
export interface EffectReleasePriority extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.RELEASE_PRIORITY
}

export interface EffectPhaseUntap extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_UNTAP
}

export interface EffectPhaseDraw extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_DRAW
}

export interface EffectPhaseMain extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_MAIN
}

export interface EffectPhaseCombat extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_COMBAT
}

export interface EffectPhaseEnd extends BaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_END
}

export type Effect =
  | EffectManaAdd
  | EffectDamageAny
  | EffectReleasePriority
  | EffectPhaseUntap
  | EffectPhaseDraw
  | EffectPhaseMain
  | EffectPhaseCombat
  | EffectPhaseEnd

// EFFECT ITEMS //
// an EffectItem exists as part of an Action
// it refers to a specific effect that will happen

export interface BaseEffectItem {
  effect: Effect
  controllerId: string
}

// later will need to add effectItem types like "single target", "multi target", etc

export type EffectItem = BaseEffectItem

// EFFECT CREATORS

export enum AbilitySpeed {
  NORMAL = 'NORMAL',
  INSTANT = 'INSTANT',
}

export interface Ability {
  speed: AbilitySpeed
  costs: Cost[]
  effects: Effect[]
}

export interface EffectTrigger {
  on: EffectType
  costs: Cost[]
  effects: Effect[]
}

// ACTIONS

export interface BaseAction {
  type: ActionType
  controllerId: string
  costItems: CostItem[]
  effectItems: EffectItem[]
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
  effectItem: EffectItem
}
