import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pokemon, PokeRef, PokemonState } from '../interfaces/pokemonInterfaces';



const initialState: PokemonState = {
  pokemonList: [],
  loading: false,
  error: null,
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    fetchPokemonStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPokemonSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.pokemonList = action.payload;
    },
    fetchPokemonFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPokemonStart, fetchPokemonSuccess, fetchPokemonFailure } =
  pokemonSlice.actions;

export const fetchPokemon = () => async (dispatch: any) => {
  dispatch(fetchPokemonStart());

  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemonList = response.data.results;
  
    // Loop through each Pokemon and fetch its full details
    const pokemonDetailsPromises = pokemonList.map(async (pokemon:PokeRef) => {
      const pokemonDetailsResponse = await axios.get(pokemon.url);
      return pokemonDetailsResponse.data;
    });
  
    // Wait for all promises to resolve before dispatching the success action
    const pokemonDetails = await Promise.all(pokemonDetailsPromises);
    dispatch(fetchPokemonSuccess(pokemonDetails));
  } catch (error) {
    dispatch(fetchPokemonFailure(error.message));
  }
  
};

export default pokemonSlice.reducer;
