import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IGameStateForPlaytest, IAction, ICard } from '../types'

interface IPlaytestState {
  game: IGameStateForPlaytest
  selectingTargets: boolean
  selectingTargetsForCard: ICard | null
  selectingTargetsForAction: IAction | null
  target: string | null
}

const initialPlaytestState: IPlaytestState = {
  game: null!,
  selectingTargets: false,
  selectingTargetsForCard: null,
  selectingTargetsForAction: null,
  target: null,
}

const playtestSlice = createSlice({
  name: 'app',
  initialState: initialPlaytestState,
  reducers: {
    updatePlaytestGame: (state, action: PayloadAction<IGameStateForPlaytest>) => {
      state.game = action.payload
    },
    setSelectingTargets: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.selectingTargetsForCard = null
        state.target = null
      }
      state.selectingTargets = action.payload
    },
    setSelectingTargetsForCard: (state, action: PayloadAction<ICard>) => {
      state.selectingTargetsForCard = action.payload
    },
    setSelectingTargetsForAction: (state, action: PayloadAction<IAction>) => {
      state.selectingTargetsForAction = action.payload
    },
    selectTarget: (state, action: PayloadAction<string>) => {
      state.target = action.payload
    },
  },
})

const {
  updatePlaytestGame,
  setSelectingTargets,
  setSelectingTargetsForCard,
  setSelectingTargetsForAction,
  selectTarget,
} = playtestSlice.actions

export {
  playtestSlice,
  updatePlaytestGame,
  setSelectingTargets,
  setSelectingTargetsForCard,
  setSelectingTargetsForAction,
  selectTarget,
}
