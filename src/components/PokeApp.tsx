import { useDispatch, useSelector } from 'react-redux';
import { fetchPokemon } from '../slices/pokemonSlice';
import { useEffect } from 'react';
import '../styles/PokeApp.css';
import { RootState } from '../app/store';
import { selectPokemon } from '../slices/teamSlice';
import Button from '@mui/material/Button';
import PokeTeam from './PokeTeam';
import { Pokemon } from '../interfaces/pokemonInterfaces';




const PokeApp = () => {
  const dispatch = useDispatch();
  const pokemonList = useSelector((state) => state.pokemon.pokemonList);
  const loading = useSelector((state) => state.pokemon.loading);
  const error = useSelector((state) => state.pokemon.error);
  const selectedPokemon = useSelector((state: RootState) => state.team.selectedPokemon);
  const team = useSelector((state: RootState) => state.team.team);

  useEffect(() => {
    dispatch(fetchPokemon());
  }, [dispatch]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    dispatch(selectPokemon(pokemon));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (<>
  <PokeTeam />
    <div style={{maxHeight:'50vh', display: 'flex', flexWrap: 'wrap', rowGap: '5px'}} className='pokeList'>
      {pokemonList.map((pokemon:Pokemon) => (
        <Button onClick={() => handleSelectPokemon(pokemon)} style={{width:'150px'}} key={pokemon.name}>{pokemon.name}</Button>
      ))}
    </div>
    
    </>
  );
};
export default PokeApp;