import type { RootState, AppDispatch } from './store'
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from 'react-redux'

export const useDispatch = () => useDispatchRedux<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux
