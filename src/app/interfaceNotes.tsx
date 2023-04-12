export interface CurrentTurnData {
  playerTurn: UserTurn;
  opponentTurn: UserTurn;
}

export interface UserTurn {
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
  action: Move | Item | Pokemon;
}
export interface Stats {
  lvl: number;
  hp: number;
  attack: number;
  defense: number;
  special: number;
  speed: number;
  type: Type;
  hasCondition?: boolean;
  condition?: string;
}

export interface Move {
  name: string;
  power: number | null;
  type: string;
  accuracy: number;
  priority: number;
  contact: boolean;
  hitType: string;
  stageMod: {
    name: string | null;
    amount: number | null;
    target: string;
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
export interface Item {
  name: string;
  type: string; //healing or stat boosting
  amount: number;
  priority: number;
}
export interface Pokemon {
  name: string;
  type: string[];
  image: string;
  imageBack: string;
  stats: Stats;
  moves: Move[];
}
export interface Type {
  resistance: string[];
  weakness: string[];
  userType: string[];
}
interface TurnRecord {
  turnNumber: number;
  playerTurn: UserTurn;
  opponentTurn: UserTurn;
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
