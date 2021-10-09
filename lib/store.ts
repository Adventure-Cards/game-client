import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// APP SLICE //
interface IAppState {
  deckId: number
  cardIdx: number
}

const initialAppState: IAppState = {
  deckId: 1,
  cardIdx: 0,
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    updateDeckId: (state, action: PayloadAction<number>) => {
      state.deckId = action.payload
    },
    updateCardIdx: (state, action: PayloadAction<number>) => {
      state.cardIdx = action.payload
    },
  },
})

export const { updateDeckId, updateCardIdx } = appSlice.actions

// GAME SLICE //

import { buildTestGame, submitAction as _submitAction, processStackItem as _processStackItem } from './game'
import { getGameStateForPlayer, IPlayerForPlayer, IOpponentForPlayer } from './game/state'
import type { IGame, IAction } from './game/types'
import { IDeck } from './types'

interface IGameState {
  game: IGame
  player: IPlayerForPlayer
  opponent: IOpponentForPlayer
}

const initialGameState: IGameState = {
  game: null!,
  player: null!,
  opponent: null!,
}

export const gameSlice = createSlice({
  name: 'app',
  initialState: initialGameState,
  reducers: {
    startGame: (state, action: PayloadAction<IDeck>) => {
      state.game = buildTestGame(action.payload)

      const { player, opponent } = getGameStateForPlayer(state.game)
      state.player = player
      state.opponent = opponent
    },
    submitAction: (state, action: PayloadAction<IAction>) => {
      state.game = _submitAction(state.game, action.payload)

      const { player, opponent } = getGameStateForPlayer(state.game)
      state.player = player
      state.opponent = opponent
    },
    processStack: (state, action: PayloadAction<void>) => {
      state.game = _processStackItem(state.game)

      const { player, opponent } = getGameStateForPlayer(state.game)
      state.player = player
      state.opponent = opponent
    },
  },
})

export const { startGame, submitAction, processStack } = gameSlice.actions

// LOBBY SLICE //

export interface ILobbyState {
  games: { [gameId: string]: IGameMetadata }
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

const initialLobbyState: ILobbyState = {
  games: {},
}

export const lobbySlice = createSlice({
  name: 'app',
  initialState: initialLobbyState,
  reducers: {
    updateLobby: (state, action: PayloadAction<ILobbyState>) => {
      state.games = action.payload.games
    },
  },
})

export const { updateLobby } = lobbySlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    game: gameSlice.reducer,
    lobby: lobbySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import {
  TypedUseSelectorHook,
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from 'react-redux'

export const useDispatch = () => useDispatchRedux<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux
