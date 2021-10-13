import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IGameStateForPlayer } from '../types'

interface IGameState {
  game: IGameStateForPlayer
}

const initialGameState: IGameState = {
  game: null!,
}

const gameSlice = createSlice({
  name: 'app',
  initialState: initialGameState,
  reducers: {
    updateGame: (state, action: PayloadAction<IGameStateForPlayer>) => {
      state.game = action.payload
    },
  },
})

const { updateGame } = gameSlice.actions

export { gameSlice, updateGame }
