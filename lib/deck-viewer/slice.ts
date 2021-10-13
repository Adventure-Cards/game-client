import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IAppState {
  deckId: number
  cardIdx: number
}

const initialAppState: IAppState = {
  deckId: 1,
  cardIdx: 0,
}

const viewerSlice = createSlice({
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

const { updateDeckId, updateCardIdx } = viewerSlice.actions

export { viewerSlice, updateDeckId, updateCardIdx }
