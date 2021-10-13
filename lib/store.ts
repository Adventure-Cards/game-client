import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch as _useDispatch, useSelector as _useSelector } from 'react-redux'

import { viewerSlice } from './deck-viewer/slice'
import { gameSlice } from './game/slice'
import { lobbySlice } from './lobby/slice'
import { playtestSlice } from './playtest/slice'

export const store = configureStore({
  reducer: {
    viewer: viewerSlice.reducer,
    game: gameSlice.reducer,
    lobby: lobbySlice.reducer,
    playtest: playtestSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useDispatch = () => _useDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector
