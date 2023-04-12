import { UserTurn, Type, Stats, Move } from "./interfaceNotes";

// BATTLE TURN FUNCTIONS
//===============================================================================

//CALCULATE DAMAGE TAKES USER TURNS AND CALCULATES BASE DAMAGE
//==================================================================================

function calculateBaseDamage(
  attackerTurn: UserTurn,
  defenderTurn: UserTurn
): number {
  const attackerStats = attackerTurn.pokemonStats;
  const defenderStats = defenderTurn.pokemonStats;

  if (!attackerTurn.action?.power) {
    return 0;
  }

  const baseDamage =
    (((2 * attackerStats.lvl) / 5 + 2) *
      attackerTurn.action.power *
      (attackerStats.attack / defenderStats.defense)) /
      50 +
    2;

  const randomFactor = Math.floor(Math.random() * (255 - 217 + 1) + 217);
  const damage = Math.floor((baseDamage * randomFactor) / 255);

  return damage;
}

//STAGE MOD APPLICATOR- TAKES ATTACKER/DEFENDERTURN AND RETURNS NEW OBJECT WITH STAGES THAT WERE CHANGED
//==============================================================================================

//vvvv interface minimized here vvvv
interface StageModApplicatorReturn {
  attackerStatMods: Array<{
    attack?: number;
    defense?: number;
    specialAttk?: number;
    specialDef?: number;
    speed?: number;
  }>;
  defenderStatMods: Array<{
    attack?: number;
    defense?: number;
    specialAttk?: number;
    specialDef?: number;
    speed?: number;
  }>;
}
export function stageModApplicator(
  attackerTurn: UserTurn,
  defenderTurn: UserTurn
): StageModApplicatorReturn {
  const newAttackerTurn = { ...attackerTurn };
  const newDefenderTurn = { ...defenderTurn };
  let attackerStatMods = [];
  let defenderStatMods = [];

  switch (attackerTurn.action.stageMod?.name) {
    case "attack":
      if (attackerTurn.action.stageMod.target === "opponent") {
        defenderStatMods.push({ attack: -attackerTurn.action.stageMod.amount });
      }
      if (attackerTurn.action.stageMod.target === "self") {
        attackerStatMods.push({ attack: +attackerTurn.action.stageMod.amount });
      }
      break;

    case "defense":
      if (attackerTurn.action.stageMod.target === "opponent") {
        defenderStatMods.push({
          defense: -attackerTurn.action.stageMod.amount,
        });
      }
      if (attackerTurn.action.stageMod.target === "self") {
        attackerStatMods.push({
          defense: +attackerTurn.action.stageMod.amount,
        });
      }
      break;

    case "special-attack":
      if (attackerTurn.action.stageMod.target === "opponent") {
        defenderStatMods.push({
          specialAttk: -attackerTurn.action.stageMod.amount,
        });
      }
      if (attackerTurn.action.stageMod.target === "self") {
        attackerStatMods.push({
          specialAttk: +attackerTurn.action.stageMod.amount,
        });
      }
      break;

    case "special-defense":
      if (attackerTurn.action.stageMod.target === "opponent") {
        defenderStatMods.push({
          specialDef: -attackerTurn.action.stageMod.amount,
        });
      }
      if (attackerTurn.action.stageMod.target === "self") {
        attackerStatMods.push({
          specialDef: +attackerTurn.action.stageMod.amount,
        });
      }
      break;

    case "speed":
      if (attackerTurn.action.stageMod.target === "opponent") {
        defenderStatMods.push({ speed: -attackerTurn.action.stageMod.amount });
      }
      if (attackerTurn.action.stageMod.target === "self") {
        attackerStatMods.push({ speed: +attackerTurn.action.stageMod.amount });
      }
      break;
  }

  return { attackerStatMods, defenderStatMods };
}
//GET TYPE MULTIPLIER ACCEPTS TURN OBJECTS AND RETURNS MODIFIER
//=======================================================================================
function getTypeMultiplier(attackerTurn: UserTurn): number {
  const moveType = attackerTurn.action.type;
  const attackerTypes = attackerTurn.pokemonStats.type.userType;

  for (let i = 0; i < attackerTypes.length; i++) {
    if (attackerTypes[i] === moveType) {
      return 1.5;
    }
  }

  return 1;
}

//PROCESS PRIORITY TAKES THE RESULT FROM THE PRIORITY CALCS AND HANDLES THEM
//==================================================================================
function processPriority(
  firstPriority: string,
  playerTurn: UserTurn,
  opponentTurn: UserTurn
) {
  if (firstPriority === "player") {
    //Handle player priority
    const attackerTurn = playerTurn;
    const defenderTurn = opponentTurn;
    calculateTurn(attackerTurn, defenderTurn);
    console.log("Processing player first");
  } else if (firstPriority === "opponent") {
    // Handle opponent priority
    const attackerTurn = opponentTurn;
    const defenderTurn = playerTurn;
    calculateTurn(attackerTurn, defenderTurn);
    console.log("Processing opponent first");
  } else {
    // Handle invalid input
    console.error("Invalid priority:", firstPriority);
  }
}
//CALCULATE PLAYERS TURNS ACCEPTS TURN OBJECTS AND HANDLES TURN STATE CALCULATIONS
//====================================================================================

//vvv interface minimized vvvv
interface TurnResult {
  baseDamage: number;
  stageMods: {
    attackerStatMods: Array<{
      attack?: number;
      defense?: number;
      specialAttk?: number;
      specialDef?: number;
      speed?: number;
    }>;
    defenderStatMods: Array<{
      attack?: number;
      defense?: number;
      specialAttk?: number;
      specialDef?: number;
      speed?: number;
    }>;
  };
}

function calculateTurn(
  attackerTurn: UserTurn,
  defenderTurn: UserTurn
): TurnResult {
  const { action: { type: attackerMoveType } = {} } = attackerTurn;
  const {
    pokemonStats: { type: defenderPType },
  } = defenderTurn;

  const typeMultiplier = getTypeMultiplier(attackerTurn);
  const stageMods = stageModApplicator(attackerTurn, defenderTurn);
  const baseDamage = calculateBaseDamage(attackerTurn, defenderTurn);
  const critMultiplier = rollCritChance();
  const stabMultiplier = getStabModifier(attackerTurn);
  //   const weatherMultiplier =
  //   const itemMultiplier =
  const finalDamage =
    baseDamage * critMultiplier * typeMultiplier * stabMultiplier; //*weatherMultiplier * itemMultiplier

  return { baseDamage, stageMods };
}

// function calculateOpponentTurn(
//   opponentTurn: UserTurn,
//   playerTurn: UserTurn
// ): number {
//   const attackerTurn = opponentTurn;
//   const defenderTurn = playerTurn;

//   const { action: { type: attackerMoveType } = {} } = attackerTurn;
//   const {
//     pokemonStats: { type: defenderPokemonType },
//   } = defenderTurn;

//   const stageMods = stageModApplicator(attackerTurn, defenderTurn);
//   const typeMultiplier = getTypeEffectiveness(
//     attackerTurn,
//     defenderPokemonType
//   );
//   const baseDamage = calculateBaseDamage(attackerTurn, defenderTurn);
//   const critMultiplier = rollCritChance();
//   const stabMultiplier = getStabModifier(attackerTurn);
//   const finalDamage =
//     baseDamage * critMultiplier * typeMultiplier * stabMultiplier;

//   return baseDamage;
// }

//ROLL CRIT CHANCE IS SELF EXPLANATORY
//====================================================================================
function rollCritChance(): number {
  // Generate a random number between 0 and 100
  const roll = Math.floor(Math.random() * 100);

  // Return 1.5 if the roll is less than or equal to 4.17, otherwise return 1
  return roll <= 4.17 ? 1.5 : 1;
}
//GET STAB MODIFIED ACCEPTS ATTACKERTURN AND CHECKS IF STAB DMG IS APPLIED (NUMBER)
//
function getStabModifier(attackerTurn: UserTurn): number {
  const moveType = attackerTurn.action.type;
  const attackerTypes = attackerTurn.pokemonStats.type.userType;

  for (let i = 0; i < attackerTypes.length; i++) {
    if (attackerTypes[i] === moveType) {
      return 1.5;
    }
  }

  return 1;
}
