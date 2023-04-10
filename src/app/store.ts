import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import  pokemonReducer from '../slices/pokemonSlice';
import teamReducer from '../slices/teamSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pokemon: pokemonReducer,
    team: teamReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
