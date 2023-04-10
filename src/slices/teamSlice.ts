import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { Pokemon } from '../interfaces/pokemonInterfaces';

interface TeamState {
  selectedPokemon: Pokemon | null;
  team: Pokemon[];
  selectedMove: string;
  moveSet: string[];
  teamPresets:[][];
}

const initialState: TeamState = {
  selectedPokemon: null,
  team: [],
  selectedMove: '',
  moveSet: [],
  teamPresets:[],
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.selectedPokemon = action.payload;
      state.moveSet = [];
    },
    addToTeam: (state) => {
      const { moveSet, selectedPokemon, team } = state;
      if (selectedPokemon && team.length < 6 && moveSet.length === 4) {
        const pokemonWithMoveSet = {
          ...selectedPokemon,
          moveSet: [...moveSet],
        };
        state.team = [...team, pokemonWithMoveSet];
      }
    },
    removeFromTeam: (state, action: PayloadAction<number>) => {
      state.team = state.team.filter((pokemon, i) => i !== action.payload);
    },
    selectMove: (state, action: PayloadAction<string>) => {
      state.selectedMove = action.payload;
    },
    addToMoveSet: (state) => {
      if (state.selectedMove && state.moveSet.length < 4) {
        state.moveSet.push(state.selectedMove);
        state.selectedMove = '';
      }
    },
    removeFromMoveSet: (state, action: PayloadAction<number>) => {
      state.moveSet = state.moveSet.filter((move, i) => i !== action.payload);
    },
    saveTeamPreset(state:{team:Pokemon[]; teamPresets: Pokemon[][]}) {
        if (state.team.length > 1) { // only save if the team has more than one Pokemon
          state.teamPresets.push([...state.team]);
        }
      }
    },
  },
);

export const {
  selectPokemon,
  addToTeam,
  removeFromTeam,
  selectMove,
  addToMoveSet,
  removeFromMoveSet,
  saveTeamPreset,
} = teamSlice.actions;

export default teamSlice.reducer;
