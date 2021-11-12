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
  totalMana: number
  currentMana: number
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
  totalMana: number
  currentMana: number
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
  totalMana: number
  currentMana: number

  cards: ICard[]

  availableActions: IAction[]
}

export enum Target {
  PLAYER = 'PLAYER',
  CARD = 'CARD',
}

export enum ExecutionType {
  RESPONDABLE = 'RESPONDABLE',
  IMMEDIATE = 'IMMEDIATE',
}

// CARDS //

export interface IBaseCard {
  // static data
  id: string
  type: CardType
  level: number
  name: string
  cost: number

  // dynamic data
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
  effectTemplates: IEffectTemplate[]
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
}

export interface ICostMana extends IBaseCost {
  target: Target.PLAYER
  type: CostType.MANA
  amount: number
}

export interface ICostTap extends IBaseCost {
  target: Target.CARD
  type: CostType.TAP
}

export type ICost = ICostMana | ICostTap

// COST ITEMS //
// a CostItem exists as part of an Action
// it refers to a specific cost being paid in the game

export interface IBaseCostItem {
  type: CostItemType
  controllerId: string
  arguments?: { [key: string]: string | number }
}

export enum CostItemType {
  TAP = 'TAP',
  MANA = 'MANA',
}

export interface ICostItemTap extends IBaseCostItem {
  type: CostItemType.TAP
  arguments: {
    cardId: string
  }
}

export interface ICostItemMana extends IBaseCostItem {
  type: CostItemType.MANA
  arguments: {
    amount: number
  }
}

export type ICostItem = ICostItemTap | ICostItemMana

// EFFECTS
// an Effect exists as part of the static data associated with a card
// Effects are used to create EffectItems when submitting an Action

export interface IBaseEffectTemplate {
  type: EffectItemType
  executionType: ExecutionType
}

export interface IEffectTemplateDamageAny extends IBaseEffectTemplate {
  type: EffectItemType.DAMAGE_ANY
  executionType: ExecutionType.RESPONDABLE
  arguments: {
    target: string | null
    amount: number | null
  }
}

export interface IEffectTemplateReturnPermanentToHand extends IBaseEffectTemplate {
  type: EffectItemType.RETURN_PERMANENT_TO_HAND
  executionType: ExecutionType.RESPONDABLE
  arguments: {
    target: string | null
  }
}

export type IEffectTemplate = IEffectTemplateDamageAny | IEffectTemplateReturnPermanentToHand

// EFFECT ITEMS //
// refers to a specific effect that will happen

interface IBaseEffectItem {
  type: EffectItemType
  executionType: ExecutionType
  arguments?: { [key: string]: string | number }
}

export enum EffectItemType {
  // effects that map 1:1 with actions
  PASS_PRIORITY = 'PASS_PRIORITY',
  CAST_SPELL = 'CAST_SPELL',
  CAST_PERMANENT = 'CAST_PERMANENT',
  DECLARE_ATTACK = 'DECLARE_ATTACK',
  DECLARE_BLOCK = 'DECLARE_BLOCK',

  // child effects
  DAMAGE_ANY = 'DAMAGE_ANY',
  RETURN_PERMANENT_TO_HAND = 'RETURN_PERMANENT_TO_HAND',

  // internal effects
  ENTER_BATTLEFIELD = 'ENTER_BATTLEFIELD',
}
interface IEffectItemPassPriority extends IBaseEffectItem {
  type: EffectItemType.PASS_PRIORITY
  arguments: {
    playerId: string
  }
}

interface IEffectItemCastSpell extends IBaseEffectItem {
  type: EffectItemType.CAST_SPELL
  arguments: {
    cardId: string
  }
}

interface IEffectItemCastPermanent extends IBaseEffectItem {
  type: EffectItemType.CAST_PERMANENT
  arguments: {
    cardId: string
  }
}

interface IEffectItemDeclareAttack extends IBaseEffectItem {
  type: EffectItemType.DECLARE_ATTACK
  arguments: {
    attackingCardId: string
    defendingPlayerId: string
  }
}

interface IEffectItemDeclareBlock extends IBaseEffectItem {
  type: EffectItemType.DECLARE_BLOCK
  arguments: {
    blockingCardId: string
    attackingCardId: string
  }
}

interface IEffectItemDamageAny extends IBaseEffectItem {
  type: EffectItemType.DAMAGE_ANY
  arguments: {
    target: string
    amount: string
  }
}

interface IEffectItemEnterBattlefield extends IBaseEffectItem {
  type: EffectItemType.ENTER_BATTLEFIELD
  arguments: {
    cardId: string
  }
}

export type IEffectItem =
  | IEffectItemPassPriority
  | IEffectItemCastPermanent
  | IEffectItemCastSpell
  | IEffectItemDeclareAttack
  | IEffectItemDeclareBlock
  | IEffectItemDamageAny
  | IEffectItemEnterBattlefield

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
  // effects: IEffect[]
}

// ACTIONS

interface IBaseAction {
  type: ActionType
  controllerId: string
  costItems: ICostItem[]
  effectItems: IEffectItem[]
  arguments?: {
    [key: string]: string | number
  }
}

export enum ActionType {
  CAST_ACTION = 'CAST_ACTION',
  ATTACK_ACTION = 'ATTACK_ACTION',
  BLOCK_ACTION = 'BLOCK_ACTION',
  ABILITY_ACTION = 'ABILITY_ACTION',
  EFFECT_ACTION = 'EFFECT_ACTION',
  PRIORITY_ACTION = 'PRIORITY_ACTION',
}

interface IPriorityAction extends IBaseAction {
  type: ActionType.PRIORITY_ACTION
}

interface IAttackAction extends IBaseAction {
  type: ActionType.ATTACK_ACTION
  cardId: string
}

interface IBlockAction extends IBaseAction {
  type: ActionType.BLOCK_ACTION
  cardId: string
}

interface IAbilityAction extends IBaseAction {
  type: ActionType.ABILITY_ACTION
  abilityId: string
  cardId: string
}

interface ICastAction extends IBaseAction {
  type: ActionType.CAST_ACTION
  cardId: string
}

interface IEffectAction extends IBaseAction {
  type: ActionType.EFFECT_ACTION
}

export type IAction =
  | IPriorityAction
  | IAttackAction
  | IBlockAction
  | IAbilityAction
  | ICastAction
  | IEffectAction

// TRIGGERS

export interface ITrigger {
  // on: EffectType
  effectItems: IEffectItem[]
}

// STACK

export interface IStackItem {
  controllerId: string
  effectItem: IEffectItem
}
