import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IAppState {
  deckId: number
}

const initialAppState: IAppState = {
  deckId: 1,
}

const viewerSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    updateDeckId: (state, action: PayloadAction<number>) => {
      state.deckId = action.payload
    },
  },
})

const { updateDeckId } = viewerSlice.actions

export { viewerSlice, updateDeckId }
