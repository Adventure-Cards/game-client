// LOBBY  DATA //
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

export interface IGameStateForPlaytest {
  player1: IPlayerForPlayer
  player2: IPlayerForPlayer

  metadata: IGameMetadata
  turn: number
  phase: Phase
  hasPriority: string
  hasTurn: string
  stack: IStackItem[]
}

interface IPlayerForPlayer {
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

interface IOpponentForPlayer {
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

// GAME  DATA //
export interface IGame {
  metadata: IGameMetadata
  players: IPlayer[]

  turn: number
  phase: Phase
  hasPriority: string
  hasTurn: string
  stack: IStackItem[]
}

export enum Phase {
  START = 'START',
  MAIN = 'MAIN',
  ATTACKERS = 'ATTACKERS',
  BLOCKERS = 'BLOCKERS',
  BATTLE = 'BATTLE',
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
  cost: ICostMana

  location: CardLocation
  tapped: boolean
  actions: IAction[]
  activeAttack: IActiveAttack | null
  activeBlock: IActiveBlock | null
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

interface IActiveAttack {
  attackingCardId: string
  defendingPlayerId: string
}

interface IActiveBlock {
  blockingCardId: string
  attackingCardId: string
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
  type: EffectType
  executionType: EffectExecutionType
}

export enum EffectExecutionType {
  RESPONDABLE = 'RESPONDABLE',
  IMMEDIATE = 'IMMEDIATE',
}

export enum EffectType {
  PASS_PRIORITY = 'PASS_PRIORITY',

  CAST = 'CAST',
  DECLARE_ATTACK = 'DECLARE_ATTACK',
  DECLARE_BLOCK = 'DECLARE_BLOCK',

  PHASE_START = 'PHASE_START',
  PHASE_MAIN = 'PHASE_MAIN',
  PHASE_ATTACKERS = 'PHASE_ATTACKERS',
  PHASE_BLOCKERS = 'PHASE_BLOCKERS',
  PHASE_BATTLE = 'PHASE_BATTLE',
  PHASE_END = 'PHASE_END',
}

export interface IEffectCast extends IBaseEffect {
  executionType: EffectExecutionType.RESPONDABLE
  type: EffectType.CAST
}

export interface IEffectPassPriority extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PASS_PRIORITY
}

export interface IEffectDeclareAttack extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.DECLARE_ATTACK
}

export interface IEffectDeclareBlock extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.DECLARE_BLOCK
}

export interface IEffectPhaseStart extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_START
}

export interface IEffectPhaseMain extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_MAIN
}

export interface IEffectPhaseAttackers extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_ATTACKERS
}

export interface IEffectPhaseBlockers extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_BLOCKERS
}

export interface IEffectPhaseBattle extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_BATTLE
}

export interface IEffectPhaseEnd extends IBaseEffect {
  executionType: EffectExecutionType.IMMEDIATE
  type: EffectType.PHASE_END
}

export type IEffect =
  | IEffectPassPriority
  | IEffectCast
  | IEffectDeclareAttack
  | IEffectDeclareBlock
  | IEffectPhaseStart
  | IEffectPhaseMain
  | IEffectPhaseAttackers
  | IEffectPhaseBlockers
  | IEffectPhaseBattle
  | IEffectPhaseEnd

// EFFECT ITEMS //
// refers to a specific effect that will happen

export interface IBaseEffectItem {
  type: EffectItemType
  controllerId: string
  executionType: EffectExecutionType
  arguments?: { [key: string]: string | number }
}

export enum EffectItemType {
  PASS_PRIORITY = 'PASS_PRIORITY',
  CAST = 'CAST',
  TARGETS_PLAYER = 'TARGETS_PLAYER',
  TARGETS_CARD = 'TARGETS_CARD',
  WITH_AMOUNT = 'WITH_AMOUNT',
  DECLARE_ATTACK = 'DECLARE_ATTACK',
  DECLARE_BLOCK = 'DECLARE_BLOCK',
}
export interface IEffectItemPassPriority extends IBaseEffectItem {
  type: EffectItemType.PASS_PRIORITY
}

export interface IEffectItemCast extends IBaseEffectItem {
  type: EffectItemType.CAST
  arguments: {
    cardId: string
  }
}

export interface IEffectItemDeclareAttack extends IBaseEffectItem {
  type: EffectItemType.DECLARE_ATTACK
  arguments: {
    attackingCardId: string
    defendingPlayerId: string
  }
}

export interface IEffectItemDeclareBlock extends IBaseEffectItem {
  type: EffectItemType.DECLARE_BLOCK
  arguments: {
    blockingCardId: string
    attackingCardId: string
  }
}

export type IEffectItem =
  | IEffectItemPassPriority
  | IEffectItemCast
  | IEffectItemDeclareAttack
  | IEffectItemDeclareBlock

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

// ACTIONS

export interface IBaseAction {
  type: ActionType
  controllerId: string
  costItems: ICostItem[]
  effectItems: IEffectItem[]
}

export enum ActionType {
  CAST_ACTION = 'CAST_ACTION',
  ATTACK_ACTION = 'ATTACK_ACTION',
  BLOCK_ACTION = 'BLOCK_ACTION',
  ABILITY_ACTION = 'ABILITY_ACTION',
  EFFECT_ACTION = 'EFFECT_ACTION',
  PRIORITY_ACTION = 'PRIORITY_ACTION',
}

export interface ICastAction extends IBaseAction {
  type: ActionType.CAST_ACTION
  cardId: string
}

export interface IAttackAction extends IBaseAction {
  type: ActionType.ATTACK_ACTION
  cardId: string
}

export interface IBlockAction extends IBaseAction {
  type: ActionType.BLOCK_ACTION
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

export type IAction =
  | ICastAction
  | IAttackAction
  | IBlockAction
  | IAbilityAction
  | IEffectAction
  | IPriorityAction

// TRIGGERS

export interface ITrigger {
  on: EffectType
  effectItems: IEffectItem[]
}

// STACK

export interface IStackItem {
  controllerId: string
  effectItem: IEffectItem
}
