import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import PokeApp from './components/PokeApp';
import BattleApp from './components/BattleApp';

function App() {
  return (
    <div className="App">
      <BattleApp id1={0} id2={3} />
    </div>
  );
}

export default App;
