// PUBLIC TYPES

export interface IGameStateForPlayer {
  player: IPlayerForPlayer
  opponent: IOpponentForPlayer

  metadata: IGameMetadata
  turn: number
  phase: Phase
  hasPriority: string
  hasTurn: string
  stack: IStackItem[]
}

export interface IPlayerForPlayer {
  id: string
  address: string
  life: number
  mana: number
  hand: ICard[]
  numberOfCardsInLibrary: number
  battlefield: ICard[]
  graveyard: ICard[]
  stack: ICard[]
  actions: IAction[]
}

export interface IOpponentForPlayer {
  id: string
  address: string
  life: number
  mana: number
  numberOfCardsInHand: number
  numberOfCardsInLibrary: number
  battlefield: ICard[]
  graveyard: ICard[]
  stack: ICard[]
  actions: IAction[]
}

export type IGameMetadata = {
  id: string
  status: IGameStatus
  players: {
    address: string
    status: IPlayerStatus
    deckId: number | null
  }[]
}

export enum IPlayerStatus {
  JOINED = 'JOINED',
  READY = 'READY',
}

export enum IGameStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLAYERS_JOINED = 'PLAYERS_JOINED',
  STARTED = 'STARTED',
}

// INTERNAL TYPES, SHOULDN'T NEED ON CLIENT

export interface IGame {
  metadata: IGameMetadata
  turn: number
  phase: Phase
  players: IPlayer[]

  hasPriority: string
  hasTurn: string
  stack: IStackItem[]
}

export enum Phase {
  START = 'START',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
  END = 'END',
}

export interface IPlayer {
  id: string
  address: string

  life: number
  mana: number

  cards: ICard[]

  availableActions: IAction[]
}

export enum Target {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
}

// CARDS //

export interface IBaseCard {
  id: string
  type: CardType
  level: number
  name: string

  location: CardLocation
  tapped: boolean
  cost: ICostMana
  actions: IAction[]
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
  STACK = 'STACK',
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

  PHASE_START = 'PHASE_START',
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
  amount: number
}

export interface IEffectDamagePlayer extends IBaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.DAMAGE_PLAYER
  target: Target.PLAYER
}

// this mutates the games priorityPlayerId
export interface IEffectReleasePriority extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.RELEASE_PRIORITY
}

export interface IEffectPhaseStart extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_START
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
  | IEffectDamageAny
  | IEffectDamagePlayer
  | IEffectReleasePriority
  | IEffectPhaseStart
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
