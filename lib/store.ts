import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch as _useDispatch, useSelector as _useSelector } from 'react-redux'

import { gameSlice } from './game/slice'
import { lobbySlice } from './lobby/slice'
import { playtestSlice } from './playtest/slice'

const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    lobby: lobbySlice.reducer,
    playtest: playtestSlice.reducer,
  },
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const useDispatch = () => _useDispatch<AppDispatch>()
const useSelector: TypedUseSelectorHook<RootState> = _useSelector

export { store, useDispatch, useSelector }
