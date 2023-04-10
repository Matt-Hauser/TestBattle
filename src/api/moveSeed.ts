export interface Pokemon {
    name: string;
    type: string;
    image: string;
    imageBack: string;
    stats: Stats;
    moves: Move[];
   
  }

  export interface Stats {
    hp: number;
    attack: number;
    defense: number;
    special: number;
    speed: number;
    type: Type;
    hasCondition?: boolean;
    condition?: string;
  };
  
  export interface Move {
    name: string;
    power: number | null;
    type: string;
    accuracy: number;
    statMod: 'attack' | 'defense' | null;
    statModPercentage: number | null;
    effects: {
      chanceToBurn?: number;
      chanceToFlinch?: number;
    } | null;
    condition?: {
        name: string; 
        duration: number;
        damageFraction: number;
    } | null;
  }

  interface Type {
    resistance:string[];
    weakness:string[];
  }
  
  export const squirtleMoves: Move[] = [
    {
      name: 'watergun',
      power: 40,
      type: 'water',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: null,
    },
    {
        name: 'scratch',
        power: 40,
        type: 'normal',
        accuracy: 100,
        statMod: null,
        statModPercentage: null,
        effects: null,
      },
    {
      name: 'tailwhip',
      power: null,
      type: 'normal',
      accuracy: 100,
      statMod: 'defense',
      statModPercentage: -1,
      effects: null,
    },
    {
      name: 'bubblebeam',
      power: 65,
      type: 'water',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: {
        chanceToFlinch: 0.1,
      },
    },
  ];
  const squirtleStats = {
    hp: 22,
    attack: 12,
    defense: 16,
    special:13,
    speed: 11,
    type: {
        resistance: ["steel", "fire", "water", "ice"],
        weakness: ["electric", "grass"]
      },
    
  };
  
  export const charmanderMoves: Move[] = [
    {
      name: 'scratch',
      power: 40,
      type: 'normal',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: null,
    },
    {
      name: 'ember',
      power: 40,
      type: 'fire',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: null,
    },
    {
      name: 'leer',
      power: null,
      type: 'normal',
      accuracy: 100,
      statMod: 'defense',
      statModPercentage: -1,
      effects: null,
    },
    {
      name: 'fire fang',
      power: 65,
      type: 'fire',
      accuracy: 95,
      statMod: null,
      statModPercentage: null,
      effects: {
        chanceToBurn: 0.1,
        chanceToFlinch: 0.1,
      },
    },
  ];
  const charmanderStats = {
    hp: 18,
    attack: 17,
    defense: 13,
    special:15,
    speed: 13,
    type: {
        resistance: ["water", "rock", "fire", "dragon"],
        weakness: ["grass", "ice", "bug", "steel"]
      }
  };
  
  export const bulbasaurMoves: Move[] = [
    {
      name: 'tackle',
      power: 40,
      type: 'normal',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: null,
    },
    {
      name: 'vinewhip',
      power: 45,
      type: 'grass',
      accuracy: 100,
      statMod: null,
      statModPercentage: null,
      effects: null,
    },
    {
      name: 'growl',
      power: null,
      type: 'normal',
      accuracy: 100,
      statMod: 'attack',
      statModPercentage: -1,
      effects: null,
    },
    {
      name: 'leech seed',
      power: null,
      type: 'grass',
      accuracy: 90,
      statMod: null,
      statModPercentage: null,
      effects: null,
      condition: {
        name: 'leech',
        duration: 3,
        damageFraction: 1/16
      }
    },
  ];
  const bulbasaurStats = {
    hp: 20,
    attack: 14,
    defense: 13,
    special:12,
    speed: 11,
    type: {
        resistance: ["ground", "water", "grass", "electric"],
        weakness: ["fire", "ice", "poison", "flying", "bug"]
      }
  };
  

  
  export const pokemonSeed: Pokemon[] = [
    {
        name: 'Squirtle',
        type: 'water',
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        imageBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png",
        stats: squirtleStats,
        moves: squirtleMoves,
      },
    {
        name: 'Charmander',
        type: 'fire',
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        imageBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
        stats: charmanderStats,
        moves: charmanderMoves,
      },
        
    {
        name: 'Bulbasaur',
        type: 'grass',
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        imageBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        stats: bulbasaurStats,
        moves: bulbasaurMoves,
      },
  ];

  export const typeAdvantage = {
    fire: {
      resistance: ["water", "rock", "fire", "dragon"],
      weakness: ["grass", "ice", "bug", "steel"]
    },
    water: {
      resistance: ["steel", "fire", "water", "ice"],
      weakness: ["electric", "grass"]
    },
    grass: {
      resistance: ["ground", "water", "grass", "electric"],
      weakness: ["fire", "ice", "poison", "flying", "bug"]
    }
  }
  
  
  