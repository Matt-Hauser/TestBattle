import { useSelector, useDispatch } from "react-redux";
import React, { useRef, useState } from "react";
import { RootState } from "../app/store";
import { useEffect } from "react";
import { fetchPokemon } from "../slices/pokemonSlice";
import { pokemonSeed, Move, typeAdvantage, Stats } from "../api/moveSeed";
import { useSpring, animated } from "react-spring";
import HealthBar from "./HealthBar";
import { border } from "@mui/system";
import { relative } from "path";
import { Button, Card, createTheme } from "@mui/material";
import { blue, green, red, yellow, grey } from "@mui/material/colors";

interface PokemonProps {
  id1: number;
  id2: number;
}

interface Turn {
  attacker: string;
  defender: string;
  moveUsed: Move | null;
}

interface SeedMoves {
  name: string;
  power: number | null;
  type: string;
  accuracy: number;
  statMod: "attack" | "defense" | null;
  statModPercentage: number | null;
  effects: {
    chanceToBurn?: number;
    chanceToFlinch?: number;
  } | null;
}

interface HealthBarProps {
  currentHP: number;
  originalHP: number;
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    normal: createColor("#999"),
    water: createColor("#53afe4"),
    grass: createColor("#53e475"),
    fire: createColor("#e47053"),
  },
});

// const HealthBar: React.FC<HealthBarProps> = ({ currentHP, originalHP }) => {
//   const percentage = (currentHP / originalHP) * 100;

//   return (
//     <div
//       style={{ display: "flex", justifyContent: "center", textAlign: "center" }}
//     >
//       <div
//         style={{
//           backgroundColor: "gray",
//           height: 10,
//           width: "50vw",
//           display: "flex",
//           justifySelf: "center",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "green",
//             height: 10,
//             width: `${percentage}%`,
//           }}
//         />
//       </div>
//       <div>
//         {currentHP}/{originalHP}
//       </div>
//     </div>
//   );
// };

const BattleApp: React.FC<PokemonProps> = () => {
  const dispatch = useDispatch();

  const [p1HP, setP1HP] = useState<number>(0);
  const [p2HP, setP2HP] = useState<number>(0);
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const [stats1, setStats1] = useState<Stats>(pokemonSeed[0].stats);
  const [stats2, setStats2] = useState<Stats>(pokemonSeed[2].stats);
  const [lastMoveUsed, setLastMoveUsed] = useState<Move | null>(null);
  const [hideButtons, setHideButtons] = useState(false);
  const initialTurnRecord = new Map<number, Turn>();
  const [turnRecord, setTurnRecord] = useState(initialTurnRecord);

  const [attacked, setAttacked] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isAninamting = useRef(false);

  //janky animation
  const springProps = useSpring({
    to: async (next, cancel) => {
      await next({ left: "calc(0% - 30px)" });
      await next({ left: "calc(0% - 10px)" });
      await next({ left: "calc(0% - 15px)" });
      await next({ left: "0" });
    },
    from: { left: "0%" },
    config: { tension: 300, friction: 10 },
  });
  useEffect(() => {
    if (attacked) {
      setShouldAnimate(true);
    }
  }, [attacked]);

  const props = useSpring({
    to: async (next) => {
      await next(attacked ? { marginLeft: -30 } : { marginLeft: 0 }); // slide to the left over 1 second
      await next(
        attacked
          ? { marginLeft: 50, config: { duration: 100 } }
          : { marginLeft: 0 }
      ); // jump back to the right by 50 pixels and bounce slightly over 0.5 seconds
      await next(attacked ? { marginLeft: -10 } : { marginLeft: 0 }); // return to starting position over 1 second
      setShouldAnimate(false);
      setAttacked(false);
    },
    from: { marginLeft: -10 },
    config: { tension: 300, friction: 20 }, // adjust these values for the desired animation effect
  });

  //   useEffect(() => {
  //     dispatch(fetchPokemon());
  //   }, [dispatch]);

  //   const pokemonSeed = useSelector((state: RootState) => state.pokemon.pokemonList);

  // set initial HP values based on Pokemon base stats
  useEffect(() => {
    if (pokemonSeed[0] && pokemonSeed[0].moves.length > 0) {
      setP1HP(pokemonSeed[0].stats.hp);
    }
    if (pokemonSeed[2] && pokemonSeed[2].moves.length > 0) {
      setP2HP(pokemonSeed[2].stats.hp);
    }
  }, [pokemonSeed]);

  function handleAddTurn(
    attacker: string,
    defender: string,
    moveUsed: Move | null
  ) {
    // Get the current number of turns in the turn record
    const numTurns = turnRecord.size;

    // Create the new turn object
    const newTurn: Turn = { attacker, defender, moveUsed };

    // Add the new turn object to the turn record
    const newTurnRecord = new Map(
      Array.from(turnRecord).concat([[numTurns, newTurn]])
    );

    setTurnRecord(newTurnRecord);
  }
  // this click handler does basically all of the logic.
  const handleMoveClick = (move: Move, source: string) => {
    let attackerStats = source === "p1" ? stats1 : stats2;
    let defenderStats = source === "p1" ? stats2 : stats1;

    setAttacked(true);

    //crit rate
    const criticalHitRate = (attackerStats.speed * 100) / 512;
    const isCriticalHit = Math.random() * 100 <= criticalHitRate + 5;
    // harcoded level for now. used in dmg equation
    let level = 5;
    if (isCriticalHit) {
      level = 10;
      console.log("Critical Hit");
    }
    //init damage to 0 and then calculate damage from stats and move
    let damage = 0;
    if (move.power) {
      console.log("lvl:", level);
      const baseDamage =
        (((2 * level) / 5 + 2) *
          move.power *
          (attackerStats.attack / defenderStats.defense)) /
          50 +
        2;
      //random dice roll for dmg
      const randomFactor = Math.floor(Math.random() * (255 - 217 + 1) + 217); // Generates a random integer between 217 and 255 (inclusive)
      damage = Math.floor((baseDamage * randomFactor) / 255);
      console.log("dmg:", damage);
      console.log("type:", move.type);
      console.log("weaknesses:", defenderStats.type.weakness);
    } else {
      damage = 0;
    }
    //condition conditional. sets condition on target in move has condition value(just leech for now. prob switch case later)
    if (defenderStats.hasCondition && defenderStats.condition === "leech") {
      const damageFraction = 1 / 16;
      const damage = Math.floor(defenderStats.hp * damageFraction);
      defenderStats.hp -= damage;
      attackerStats.hp += damage;
      setStats1(defenderStats);
    }

    if (move.condition) {
      switch (move.condition.name) {
        case "leech":
          if (source === "p1") {
            setStats2((prevState) => ({
              ...prevState,
              hasCondition: true,
              condition: "leech",
            }));
          }
          if (source === "p2") {
            setStats1((prevState) => ({
              ...prevState,
              hasCondition: true,
              condition: "leech",
            }));
          }

          break;
      }
    }
    // stage or stat mod logic.
    switch (move.statMod) {
      case "attack":
        const attackMod =
          defenderStats.attack - Math.ceil(defenderStats.attack * 0.1);
        if (source === "p1") {
          setStats2((prevState) => ({ ...prevState, attack: attackMod }));
        }
        if (source === "p2") {
          setStats1((prevState) => ({ ...prevState, attack: attackMod }));
        }

        break;
      case "defense":
        const defenseMod =
          defenderStats.defense - Math.ceil(defenderStats.defense * 0.1);
        if (source === "p1") {
          setStats2((prevState) => ({ ...prevState, defense: defenseMod }));
        }
        if (source === "p2") {
          setStats1((prevState) => ({ ...prevState, defense: defenseMod }));
        }
        break;
    }
    //type advantage logic
    if (defenderStats.type.weakness.includes(move.type)) {
      damage *= 2;
      console.log("TypeAdvDmg:", damage);
    }
    //final damage logic
    let hp = source === "p1" ? p2HP - damage : p1HP - damage;

    hp = Math.max(0, hp);
    let turn = {
      attacker: pokemonSeed[0].name,
      defender: pokemonSeed[2].name,
      moveUsed: lastMoveUsed,
    };
    // conditional damage application logic.
    if (source === "p1") {
      setHideButtons(true);
      setTimeout(() => setHideButtons(false), 3000);
      let conDMG = 0;
      if (stats2.hasCondition && stats2.condition === "leech") {
        const damageFraction = 1 / 16;
        conDMG = Math.floor(defenderStats.hp * damageFraction + 1);
      }

      setTimeout(() => setP2HP(hp - conDMG), 2000);
      if (p2HP < 0) {
        setTimeout(() => setP2HP(0), 2000);
      }
      if (p1HP > pokemonSeed[0].stats.hp) {
        setTimeout(() => setP1HP(pokemonSeed[0].stats.hp), 2000);
      } else {
        setTimeout(() => setP1HP(p1HP + conDMG), 2000);
      }

      setLastMoveUsed(move);
      handleAddTurn(pokemonSeed[0].name, pokemonSeed[2].name, move);
      setTimeout(() => setPlayerTurn(false), 3000);
    } else if (source === "p2") {
      setHideButtons(true);
      setTimeout(() => setHideButtons(false), 3000);
      let conDMG = 0;
      if (stats1.hasCondition && stats1.condition === "leech") {
        const damageFraction = 1 / 16;
        conDMG = Math.floor(defenderStats.hp * damageFraction + 1);
      }
      if (p2HP >= pokemonSeed[2].stats.hp) {
        setTimeout(() => setP2HP(pokemonSeed[2].stats.hp), 2000);
      } else {
        setTimeout(() => setP2HP(p2HP + conDMG), 2000);
      }
      setTimeout(() => setP1HP(hp - conDMG), 2000);
      if (p1HP < 0) {
        setTimeout(() => setP1HP(0), 2000);
      }
      setLastMoveUsed(move);
      handleAddTurn(pokemonSeed[2].name, pokemonSeed[0].name, move);
      setTimeout(() => setPlayerTurn(true), 3000);
    }

    console.log("move:", move); // do something with the move data
  };
  //sets initial health based on the chosen pokemons hp stat.
  useEffect(() => {
    setP1HP(pokemonSeed[0]?.stats.hp);
    setP2HP(pokemonSeed[2]?.stats.hp);
  }, [pokemonSeed]);

  function getColorByType(type: string) {
    switch (type) {
      case "fire":
        return red[500];
      case "water":
        return blue[500];
      case "grass":
        return green[500];
      case "normal":
        return grey[500];
      default:
        return grey[500];
    }
  }

  return (
    <div>
      {playerTurn ? (
        <div>
          <div>
            <div
              style={{ position: "relative", left: "-100px", color: "black" }}
            >
              {pokemonSeed[2]?.name}
            </div>
            <div>
              <HealthBar
                currentHP={p2HP}
                originalHP={pokemonSeed[2].stats.hp}
              />
              <img
                style={{ position: "relative", left: "70px" }}
                src={pokemonSeed[2]?.image}
                alt={pokemonSeed[2]?.name}
              />
            </div>
          </div>
          <div>
            <animated.img
              style={{
                position: "relative",
                right: "50px",
                zIndex: 1,
                width: "150px",
                height: "150px",

                ...props,
              }}
              src={pokemonSeed[0]?.imageBack}
              alt={pokemonSeed[0]?.name}
            />
            <div
              style={{ position: "relative", left: "100px", color: "black" }}
            >
              {pokemonSeed[0]?.name}
            </div>
            <div>
              <HealthBar
                currentHP={p1HP}
                originalHP={pokemonSeed[0].stats.hp}
              />
              <br />
              {!hideButtons ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                    width: "70%",
                    position: "relative",
                    left: "10%",
                  }}
                >
                  {pokemonSeed[0]?.moves.slice(0, 4).map((move) => (
                    <Button
                      variant="contained"
                      key={move.name}
                      onClick={() => handleMoveClick(move, "p1")}
                      style={{
                        backgroundColor: getColorByType(move.type),
                        height: "100%",
                      }}
                    >
                      {move.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div>
              {lastMoveUsed && attacked ? (
                <Card
                  style={{
                    border: "solid 2px",
                    width: "50%",
                    position: "relative",
                    left: "150px",
                  }}
                >
                  <p>
                    {pokemonSeed[0].name} used {lastMoveUsed.name}
                  </p>
                </Card>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <div
              style={{ color: "black", position: "relative", left: "-100px" }}
            >
              {pokemonSeed[0]?.name}
            </div>
            <div>
              <HealthBar
                currentHP={p1HP}
                originalHP={pokemonSeed[0].stats.hp}
              />
              <img
                style={{ position: "relative", left: "70px" }}
                src={pokemonSeed[0]?.image}
                alt={pokemonSeed[0]?.name}
              />
            </div>
          </div>
          <div>
            <animated.img
              style={{
                position: "relative",
                right: "50px",
                zIndex: 1,
                width: "150px",
                height: "150px",

                ...props,
              }}
              src={pokemonSeed[2]?.imageBack}
              alt={pokemonSeed[2]?.name}
            />
            <div
              style={{ position: "relative", left: "100px", color: "black" }}
            >
              {pokemonSeed[2]?.name}
            </div>
            <div>
              <HealthBar
                currentHP={p2HP}
                originalHP={pokemonSeed[2].stats.hp}
              />
              <br />
              {!hideButtons ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                    width: "70%",
                    position: "relative",
                    left: "10%",
                  }}
                >
                  {pokemonSeed[2]?.moves.slice(0, 4).map((move) => (
                    <Button
                      variant="contained"
                      key={move.name}
                      onClick={() => handleMoveClick(move, "p2")}
                      style={{
                        backgroundColor: getColorByType(move.type),
                        height: "100%",
                      }}
                    >
                      {move.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div>
              {lastMoveUsed && attacked ? (
                <Card
                  style={{
                    border: "solid 2px",
                    width: "50%",
                    position: "relative",
                    left: "150px",
                  }}
                >
                  <p>
                    {pokemonSeed[2].name} used {lastMoveUsed.name}
                  </p>
                </Card>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleApp;
