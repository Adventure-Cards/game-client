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

import type { IGameStateForPlayer } from './newTypes'

interface IGameState {
  game: IGameStateForPlayer
}

const initialGameState: IGameState = {
  game: null!,
}

export const gameSlice = createSlice({
  name: 'app',
  initialState: initialGameState,
  reducers: {
    updateGame: (state, action: PayloadAction<IGameStateForPlayer>) => {
      state.game = action.payload
    },
  },
})

export const { updateGame } = gameSlice.actions

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
