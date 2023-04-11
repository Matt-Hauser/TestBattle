// moves need animation data objects and priority stats
//need call back functions abstracted away to clean up code:
//conditionApplier(); stageApplier(); superEffective(); criticalCalculator();
//damageCalculator(); priorityCalculator(); finalDamageCalculator();
//hitChanceCalculator();

//conditions are burn, freeze, paralysis, poison, bad poison, and sleep
//effects are more specific but can be really similar to conditions (ie Leech Seed)

const conditions = [
  "paralysis",
  "sleep",
  "burn",
  "freeze",
  "poison",
  "bad poison",
];
interface TurnRecord {
  turnNumber: number;
  playerMove: UserMove;
  opponentMove: UserMove;
  results: {
    dmgTaken: {
      player: number;
      opponent: number;
    };
    hpHealed: {
      player: number;
      opponent: number;
    };
    currentHP: {
      player: number;
      opponent: number;
    };
    StageMods: {
      raised: {
        player: {
          stat: string;
          level: number;
          source: string; //from move or item
        };
        opponent: {
          stat: string;
          level: number;
          source: string;
        };
      };
      lowered: {
        player: {
          stat: string;
          level: number;
          source: string; //from move or item
        };
        opponent: {
          stat: string;
          level: number;
          source: string;
        };
      };
    };
    conditions: {
      gained: {
        player: string;
        opponent: string;
      };
      removed: {
        player: string;
        opponent: string;
      };

      active: {
        player: string;
        opponent: string;
      };
      dmgTaken: {
        player: number;
        opponent: number;
      };
      hpHealed: {
        player: number;
        opponent: number;
      };
    };
    effects: {
      gained: {
        player: string;
        opponent: string;
      };
      active: {
        player: string;
        opponent: string;
      };
    };
    items: {
      Used: {
        player: string;
        opponent: string;
      };
      hpHealed: {
        player: number;
        opponent: number;
      };
    };
  };
}

interface UserMove {
  pokemonStats: Stats;
  stages: {
    attack: number;
    defense: number;
    specialAttk: number;
    specialDef: number;
    speed: number;
  };
  user: string;
  condition: string;
  action: Move | Item | Pokemon | null;
}

function calculatePriority(playerMove: UserMove, opponentMove: UserMove) {
  let firstPriority = "No Priority";

  const randomChoice = Math.floor(Math.random() * 100) + 1;
  let randomResult = null;
  if (randomChoice > 50) {
    randomResult = playerMove.user;
  } else {
    randomResult = opponentMove.user;
  }

  if (playerMove.action?.priority > opponentMove.action?.priority) {
    firstPriority = playerMove.user;
  } else if (playerMove.action?.priority < opponentMove.action?.priority) {
    firstPriority = opponentMove.user;
  } else {
    // If move priorities are equal, compare speeds
    if (playerMove.pokemonStats.speed > opponentMove.pokemonStats.speed) {
      firstPriority = playerMove.user;
    } else if (
      playerMove.pokemonStats.speed > opponentMove.pokemonStats.speed
    ) {
      firstPriority = opponentMove.user;
    } else {
      firstPriority = randomResult;
    }
  }

  return firstPriority;
}

// function priorityCalculator(turnObject) {
//     const [firstPriority, setFirstPriority] = useState('No Priority');
//     const randomChoice = Math.floor(Math.random() * 100) + 1;
//     let randomResult = null;
//     if (randomChoice > 50) {
//         randomResult = player;}
//         else {
//             randomResult = opponent
//         }

//     if (playerMove.priority > opponentMove.priority) {
//      setFirstPriority(player) }

//      else if (playerMove.priority < opponentMove.priority) {
//         setFirstPriority(opponent) }

//      else {
//         setFirstPriority("No Priority")
//      }

//     if (player.speed > opponent.speed && firstPriority === "No Priority") {
//         setFirstPriority(player) }
//         else if (player.speed < opponent.speed && firstPriority ==="No Priority") {
//             setFirstPriority(opponent)
//         }
//         else {
//             setFirstPriority(randomResult)
//         }

// }

// const priority = (playerMove.priority = opponentMove.priority) ? none:

//conditions are burn, freeze, paralysis, poison, bad poison, and sleep
//effects are more specific but can be really similar to conditions (ie Leech Seed)

//INTERFACES FOR NEW BATTLEAPP
interface CurrentTurnData {
  playerMove: UserMove;
  opponentMove: UserMove;
}

interface UserMove {
  pokemonStats: Stats;
  stages: {
    attack: number;
    defense: number;
    specialAttk: number;
    specialDef: number;
    speed: number;
  };
  user: string;
  condition: string;
  action: Move | Item | Pokemon | null;
}

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
}

interface Type {
  resistance: string[];
  weakness: string[];
}

export interface Move {
  name: string;
  power: number | null;
  type: string;
  accuracy: number;
  priority: number;
  stageMod: {
    name: string | null;
    amount: number | null;
  };
  condition: {
    name: string | null;
    chance: number | null;
  };
  effects: {
    name: string | null;
    chance: number | null;
  };
  animationType: string;
  description: string;
}

interface Item {
  name: string;
  type: string; //healing or stat boosting
  amount: number;
  priority: number;
}

//MOVE OBJECT ARRAY
//add PP and dmgType(physical/special) to moves
const moves: Move[] = [
  {
    name: "Tackle",
    power: 40,
    type: "normal",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "physical",
    description:
      "A physical attack in which the user charges and slams into the target with its whole body.",
  },

  {
    name: "Thunderbolt",
    power: 90,
    type: "electric",
    accuracy: 100,
    priority: 0,
    stageMod: {
      name: null,
      amount: null,
    },
    condition: {
      name: "paralysis",
      chance: 10,
    },
    effects: {
      name: null,
      chance: null,
    },
    animationType: "special",
    description:
      "A strong electric attack that may also leave the target paralyzed. It has a one-in-ten chance of paralyzing the target.",
  },
  {
    name: "Psychic",
    power: 90,
    type: "psychic",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: "confusion", chance: 10 },
    effects: { name: null, chance: null },
    animationType: "special",
    description:
      "The target is hit by a strong telekinetic force. This may also lower the target's Sp. Def stat.",
  },
  {
    name: "Earthquake",
    power: 100,
    type: "ground",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "physical",
    description:
      "The user sets off an earthquake that strikes every Pokemon around it.",
  },
  {
    name: "Ice Beam",
    power: 90,
    type: "ice",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: "freeze", chance: 10 },
    effects: { name: null, chance: null },
    animationType: "special",
    description:
      "The target is struck with an icy-cold beam of energy. This may also leave the target frozen.",
  },
  {
    name: "Dragon Claw",
    power: 80,
    type: "dragon",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "physical",
    description: "The user slashes the target with huge, sharp claws.",
  },
  {
    name: "Bite",
    power: 60,
    type: "dark",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: "flinch", chance: 30 },
    animationType: "physical",
    description:
      "The user bites the target with its sharp teeth. This may also make the target flinch.",
  },
  {
    name: "Scratch",
    power: 40,
    type: "normal",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "physical",
    description:
      "Hard, pointed, and sharp claws rake the target to inflict damage.",
  },
  {
    name: "Fire Fang",
    power: 65,
    type: "fire",
    accuracy: 95,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: "burn", chance: 10 },
    effects: { name: "flinch", chance: 20 },
    animationType: "physical",
    description:
      "The user bites with flame-cloaked fangs. This may also make the target flinch or leave it with a burn.",
  },
  {
    name: "Leech Seed",
    power: 0,
    type: "grass",
    accuracy: 90,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: "leech seed", chance: null },
    animationType: "status",
    description:
      "A seed is planted on the target. It steals some HP from the target every turn.",
  },
  {
    name: "Air Slash",
    power: 75,
    type: "flying",
    accuracy: 95,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: "flinch", chance: 30 },
    animationType: "special",
    description:
      "The user attacks with a blade of air that slices even the sky. This may also make the target flinch.",
  },
  {
    name: "Smoke Screen",
    power: null,
    type: "normal",
    accuracy: 100,
    priority: 0,
    stageMod: { name: "accuracy", amount: -1 },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "status",
    description:
      "The user releases an obscuring cloud of smoke or ink. It reduces the target's accuracy.",
  },
  {
    name: "Slash",
    power: 70,
    type: "normal",
    accuracy: 100,
    priority: 0,
    stageMod: { name: null, amount: null },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "physical",
    description:
      "The target is attacked with a slash of claws or blades. Critical hits land more easily.",
  },
  {
    name: "Screech",
    power: null,
    type: "normal",
    accuracy: 85,
    priority: 0,
    stageMod: { name: "defense", amount: -2 },
    condition: { name: null, chance: null },
    effects: { name: null, chance: null },
    animationType: "status",
    description:
      "An ear-splitting screech harshly lowers the target's Defense stat.",
  },
];
//TYPES ARRAY
const types = [
  {
    name: "normal",
    resistance: ["ghost"],
    weakness: ["fighting"],
  },
  {
    name: "fire",
    resistance: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    weakness: ["water", "ground", "rock"],
  },
  {
    name: "water",
    resistance: ["fire", "water", "ice", "steel"],
    weakness: ["electric", "grass"],
  },
  {
    name: "electric",
    resistance: ["electric", "flying", "steel"],
    weakness: ["ground"],
  },
  {
    name: "grass",
    resistance: ["water", "electric", "grass", "ground"],
    weakness: ["fire", "ice", "poison", "flying", "bug"],
  },
  {
    name: "ice",
    resistance: ["ice"],
    weakness: ["fire", "fighting", "rock", "steel"],
  },
  {
    name: "fighting",
    resistance: ["bug", "rock", "dark"],
    weakness: ["flying", "psychic", "fairy"],
  },
  {
    name: "poison",
    resistance: ["grass", "fighting", "poison", "bug", "fairy"],
    weakness: ["ground", "psychic"],
  },
  {
    name: "ground",
    resistance: ["poison", "rock"],
    weakness: ["water", "grass", "ice"],
  },
  {
    name: "flying",
    resistance: ["grass", "fighting", "bug"],
    weakness: ["electric", "ice", "rock"],
  },
  {
    name: "psychic",
    resistance: ["fighting", "psychic"],
    weakness: ["bug", "ghost", "dark"],
  },
  {
    name: "bug",
    resistance: ["grass", "fighting", "ground"],
    weakness: ["fire", "flying", "rock"],
  },
  {
    name: "rock",
    resistance: ["normal", "fire", "poison", "flying"],
    weakness: ["water", "grass", "fighting", "ground", "steel"],
  },
  {
    name: "ghost",
    resistance: ["poison", "bug"],
    weakness: ["ghost", "dark"],
  },
  {
    name: "dragon",
    resistance: ["fire", "water", "electric", "grass"],
    weakness: ["ice", "dragon", "fairy"],
  },
  {
    name: "dark",
    resistance: ["ghost", "dark"],
    weakness: ["fighting", "bug", "fairy"],
  },
  {
    name: "steel",
    resistance: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    weakness: ["fire", "fighting", "ground"],
  },
  {
    name: "fairy",
    resistance: ["fighting", "bug", "dark"],
    weakness: ["poison", "steel"],
  },
];

// export interface Pokemon {
//   name: string;
//   type: string;
//   image: string;
//   imageBack: string;
//   stats: Stats;
//   moves: Move[];
// }

// export interface Stats {
//   hp: number;
//   attack: number;
//   defense: number;
//   special: number;
//   speed: number;
//   type: Type;
//   hasCondition?: boolean;
//   condition?: string;
// }

// const charmanderStats = {
//   hp: 39,
//   attack: 52,
//   defense: 43,
//   specialAttack: 60,
//   specialDefense: 50,
//   speed: 65,
//   type: {
//     resistance: ["Water", "Rock", "Fire", "Dragon"],
//     weakness: ["Grass", "Ice", "Bug", "Steel"],
//   },
// };

// export const charmanderMoves: Move[] = [
//   {
//     name: "scratch",
//     power: 40,
//     type: "normal",
//     accuracy: 100,
//     statMod: null,
//     statModPercentage: null,
//     effects: null,
//   },
//   {
//     name: "ember",
//     power: 40,
//     type: "fire",
//     accuracy: 100,
//     statMod: null,
//     statModPercentage: null,
//     effects: null,
//   },
//   {
//     name: "leer",
//     power: null,
//     type: "normal",
//     accuracy: 100,
//     statMod: "defense",
//     statModPercentage: -1,
//     effects: null,
//   },
//   {
//     name: "fire fang",
//     power: 65,
//     type: "fire",
//     accuracy: 95,
//     statMod: null,
//     statModPercentage: null,
//     effects: {
//       chanceToBurn: 0.1,
//       chanceToFlinch: 0.1,
//     },
//   },
// ];

// export const pokemonSeed: Pokemon[] = [
//   {
//     name: "Charmander",
//     type: "Fire",
//     image:
//       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
//     imageBack:
//       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
//     stats: charmanderStats,
//     moves: charmanderMoves,
//   },
// ];
