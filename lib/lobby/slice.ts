import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ILobbyState {
  games: { [gameId: string]: IGameMetadata }
}

export type IGameMetadata = {
  id: string
  status: IGameStatus
  players: {
    address: string
    status: IPlayerStatus
    deckId: number | null
  }[]
}

export enum IPlayerStatus {
  JOINED = 'JOINED',
  READY = 'READY',
}

export enum IGameStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLAYERS_JOINED = 'PLAYERS_JOINED',
  STARTED = 'STARTED',
}

const initialLobbyState: ILobbyState = {
  games: {},
}

const lobbySlice = createSlice({
  name: 'app',
  initialState: initialLobbyState,
  reducers: {
    updateLobby: (state, action: PayloadAction<ILobbyState>) => {
      state.games = action.payload.games
    },
  },
})

const { updateLobby } = lobbySlice.actions

export { lobbySlice, updateLobby }
