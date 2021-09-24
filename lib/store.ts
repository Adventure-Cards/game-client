import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  address: string
  deckId: number
  cardIdx: number
}

const initialState: AppState = {
  address: '0xd17d1BcDe2A28AaDe2b3B5012f93b8B079d0E86B',
  deckId: 1,
  cardIdx: 0,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
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

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
