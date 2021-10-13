import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IGameStateForPlaytest } from '../types'

interface IPlaytestState {
  game: IGameStateForPlaytest
}

const initialPlaytestState: IPlaytestState = {
  game: null!,
}

const playtestSlice = createSlice({
  name: 'app',
  initialState: initialPlaytestState,
  reducers: {
    updatePlaytestGame: (state, action: PayloadAction<IGameStateForPlaytest>) => {
      state.game = action.payload
    },
  },
})

const { updatePlaytestGame } = playtestSlice.actions

export { playtestSlice, updatePlaytestGame }
