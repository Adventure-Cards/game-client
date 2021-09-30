import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// APP SLICE //
interface AppState {
  address: string
  deckId: number
  cardIdx: number
}

const initialAppState: AppState = {
  address: '0xd17d1BcDe2A28AaDe2b3B5012f93b8B079d0E86B',
  deckId: 1,
  cardIdx: 0,
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    updateAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    updateDeckId: (state, action: PayloadAction<number>) => {
      state.deckId = action.payload
    },
    updateCardIdx: (state, action: PayloadAction<number>) => {
      state.cardIdx = action.payload
    },
  },
})

export const { updateAddress, updateDeckId, updateCardIdx } = appSlice.actions

// GAME SLICE //

import { buildTestGame, submitAction as _submitAction, processStackItem as _processStackItem } from './game'
import type { IGame, IAction } from './game/types'
import { IDeck } from './types'

interface GameState {
  game: IGame
}

const initialGameState: GameState = {
  game: null!,
}

export const gameSlice = createSlice({
  name: 'app',
  initialState: initialGameState,
  reducers: {
    startGame: (state, action: PayloadAction<IDeck>) => {
      state.game = buildTestGame(action.payload)
    },
    submitAction: (state, action: PayloadAction<IAction>) => {
      state.game = _submitAction(state.game, action.payload)
    },
    processStack: (state, action: PayloadAction<void>) => {
      state.game = _processStackItem(state.game)
    },
  },
})

export const { startGame, submitAction, processStack } = gameSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    game: gameSlice.reducer,
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
