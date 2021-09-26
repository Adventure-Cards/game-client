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

import { buildTestGame, handleAction, processStackItem } from './game'
import type { Game, Action } from './game'

interface GameState {
  game: Game
}

const initialGameState: GameState = {
  game: buildTestGame(),
}

export const gameSlice = createSlice({
  name: 'app',
  initialState: initialGameState,
  reducers: {
    submitAction: (state, action: PayloadAction<Action>) => {
      state.game = handleAction(state.game, action.payload)
    },
    processStack: (state, action: PayloadAction<void>) => {
      state.game = processStackItem(state.game)
    },
  },
})

export const { submitAction, processStack } = gameSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    game: gameSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
