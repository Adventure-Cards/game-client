// WORLD //

export enum IManaColor {
  WHITE = 'white',
  BLUE = 'blue',
  BLACK = 'black',
  RED = 'red',
  GREEN = 'green',
  COLORLESS = 'colorless',
}

export interface IGame {
  turn: number
  phase: Phase
  players: IPlayer[]
  opponentLife: number // hack for demo
  hasPriority: string
  stack: IStackItem[]
}

export enum Phase {
  UNTAP = 'UNTAP',
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
  END = 'END',
}

export interface IManaPool {
  white: number
  blue: number
  black: number
  red: number
  green: number
  colorless: number
}

export interface IPlayer {
  id: string
  username: string
  life: number
  deck: ICard[]
  availableActions: IAction[]
  manaPool: IManaPool
}

export enum Target {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
}

// CARDS //

export interface IBaseCard {
  name: string
  level: number
  id: string
  type: CardType
  location: CardLocation
  tapped: boolean
  cost: ICostMana
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

export interface ICreature extends IBaseCard {
  type: CardType.CREATURE
  abilities: IAbility[]
  attack: number
  defense: number
}

export interface IArtifact extends IBaseCard {
  type: CardType.ARTIFACT
  abilities: IAbility[]
}

export interface IEnchantment extends IBaseCard {
  type: CardType.ENCHANTMENT
  abilities: IAbility[]
}

export interface ISpell extends IBaseCard {
  type: CardType.SPELL
  effects: IEffect[]
}

export type ICard = ICreature | IArtifact | IEnchantment | ISpell

// COSTS //
// a Cost exists as part of the static data associated with a card
// Costs are used to create CostItems when submitting an Action

export interface IBaseCost {
  target: Target
  type: CostType
}

export enum CostType {
  TAP = 'TAP',
  MANA = 'MANA',
  SACRIFICE_PERMANENT = 'SACRIFICE_PERMANENT',
}

export interface ICostMana extends IBaseCost {
  target: Target.PLAYER
  type: CostType.MANA
  color: IManaColor
  amount: number
}

export interface ICostSacrificePermanent extends IBaseCost {
  target: Target.PLAYER
  type: CostType.SACRIFICE_PERMANENT
  number: number
}

export interface ICostTap extends IBaseCost {
  target: Target.CARD
  type: CostType.TAP
}

export type ICost = ICostMana | ICostSacrificePermanent | ICostTap

// COST ITEMS //
// a CostItem exists as part of an Action
// it refers to a specific cost being paid in the game

export interface IBaseCostItem {
  cost: ICost
  target: Target
}

export interface ICostItemPlayer extends IBaseCostItem {
  target: Target.PLAYER
  playerId: string
}

export interface ICostItemCard extends IBaseCostItem {
  target: Target.CARD
  cardId: string
}

export type ICostItem = ICostItemPlayer | ICostItemCard

// EFFECTS
// an Effect exists as part of the static data associated with a card
// Effects are used to create EffectItems when submitting an Action

export interface IBaseEffect {
  executionType: EffectExecutionType
  type: EffectType
  target?: Target
}

export enum EffectExecutionType {
  RESPONDABLE = 'RESPONDABLE',
  IMMEDIATE = 'IMMEDIATE',
}

export enum EffectType {
  CAST = 'CAST',

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

export interface IEffectCast extends IBaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.CAST
}
export interface IEffectDamageAny extends IBaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.DAMAGE_ANY
}

export interface IEffectDamagePlayer extends IBaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.DAMAGE_PLAYER
  target: Target.PLAYER
}

// this just mutates the controllers mana pool
export interface IEffectManaAdd extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.MANA_ADD
  color: IManaColor
  amount: number
}

// this mutates the games priorityPlayerId
export interface IEffectReleasePriority extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.RELEASE_PRIORITY
}

export interface IEffectPhaseUntap extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_UNTAP
}

export interface IEffectPhaseDraw extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_DRAW
}

export interface IEffectPhaseMain extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_MAIN
}

export interface IEffectPhaseCombat extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_COMBAT
}

export interface IEffectPhaseEnd extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_END
}

export type IEffect =
  | IEffectCast
  | IEffectManaAdd
  | IEffectDamageAny
  | IEffectDamagePlayer
  | IEffectReleasePriority
  | IEffectPhaseUntap
  | IEffectPhaseDraw
  | IEffectPhaseMain
  | IEffectPhaseCombat
  | IEffectPhaseEnd

// EFFECT ITEMS //
// an EffectItem exists as part of an Action
// it refers to a specific effect that will happen

export interface IBaseEffectItem {
  type: EffectItemType
  controllerId: string
  effect: IEffect
}

export enum EffectItemType {
  CORE = 'CORE',
  CAST = 'CAST',
  TARGETS_PLAYER = 'TARGETS_PLAYER',
  TARGETS_CARD = 'TARGETS_CARD',
  WITH_AMOUNT = 'WITH_AMOUNT',
}
export interface IEffectItemCore extends IBaseEffectItem {
  type: EffectItemType.CORE
}

export interface IEffectItemCast extends IBaseEffectItem {
  type: EffectItemType.CAST
  cardId: string
}

export interface IEffectItemTargetsPlayer extends IBaseEffectItem {
  type: EffectItemType.TARGETS_PLAYER
  playerId: string
}

export interface IEffectItemTargetsCard extends IBaseEffectItem {
  type: EffectItemType.TARGETS_CARD
  cardId: string
}

export interface IEffectItemWithAmount extends IBaseEffectItem {
  type: EffectItemType.WITH_AMOUNT
  amount: number
}

export type IEffectItem =
  | IEffectItemCore
  | IEffectItemCast
  | IEffectItemTargetsPlayer
  | IEffectItemTargetsCard
  | IEffectItemWithAmount

// EFFECT CREATORS

export enum AbilitySpeed {
  NORMAL = 'NORMAL',
  INSTANT = 'INSTANT',
}

export interface IAbility {
  id: string
  name: string
  description: string
  speed: AbilitySpeed
  costs: ICost[]
  effects: IEffect[]
}

export interface IEffectTrigger {
  on: EffectType
  costs: ICost[]
  effects: IEffect[]
}

// ACTIONS

export interface IBaseAction {
  type: ActionType
  controllerId: string
  costItems: ICostItem[]
  effectItems: IEffectItem[]
}

export enum ActionType {
  CAST_ACTION = 'CAST_ACTION',
  COMBAT_ACTION = 'COMBAT_ACTION',
  ABILITY_ACTION = 'ABILITY_ACTION',
  EFFECT_ACTION = 'EFFECT_ACTION',
  PRIORITY_ACTION = 'PRIORITY_ACTION',
}

export interface ICastAction extends IBaseAction {
  type: ActionType.CAST_ACTION
  cardId: string
}

export interface ICombatAction extends IBaseAction {
  type: ActionType.COMBAT_ACTION
  cardId: string
}

export interface IAbilityAction extends IBaseAction {
  type: ActionType.ABILITY_ACTION
  abilityId: string
  cardId: string
}

export interface IEffectAction extends IBaseAction {
  type: ActionType.EFFECT_ACTION
}

export interface IPriorityAction extends IBaseAction {
  type: ActionType.PRIORITY_ACTION
}

export type IAction = ICastAction | ICombatAction | IAbilityAction | IEffectAction | IPriorityAction

// STACK

export interface IStackItem {
  controllerId: string
  effectItem: IEffectItem
}
