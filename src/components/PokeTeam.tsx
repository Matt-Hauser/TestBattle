import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
} from "@mui/material";
import {
  addToTeam,
  removeFromTeam,
  addToMoveSet,
  selectMove,
  removeFromMoveSet,
  saveTeamPreset,
} from "../slices/teamSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Pokemon, Move } from "../interfaces/pokemonInterfaces";
import { ReactNode } from "react";

function PokeTeam() {
  const selectedPokemon = useSelector(
    (state: RootState) => state.team.selectedPokemon
  );
  const team = useSelector((state: RootState) => state.team.team);
  const selectedMove = useSelector(
    (state: RootState) => state.team.selectedMove
  );
  const moveSet = useSelector((state: RootState) => state.team.moveSet);
  const teamPresets = useSelector((state: RootState) => state.team.teamPresets);
  const dispatch = useDispatch();

  const handleRemoveFromTeam = (i: number) => {
    dispatch(removeFromTeam(i));
  };
  const handleSelectMove = (
    event: SelectChangeEvent<string>,
    child: ReactNode
  ) => {
    const moveName = event.target.value as string;
    dispatch(selectMove(moveName));
  };

  const handleAddToTeam = () => {
    dispatch(addToTeam());
  };
  const handleAddToMoveSet = () => {
    dispatch(addToMoveSet());
  };
  const handleRemoveFromMoveset = (i: number) => {
    dispatch(removeFromMoveSet(i));
  };
  const handleSaveTeamPreset = () => {
    dispatch(saveTeamPreset());
  };

  if (selectedPokemon !== null) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <h1>Pokemon Team Creator</h1>
        <h3>(Select 4 moves to add Pokemon to Team)</h3>
        <h2>{selectedPokemon.name}</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src={selectedPokemon.sprites.front_default!}
            alt="pokemon sprite"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "20px",
            }}
          >
            <div>
              Type(s):{" "}
              {selectedPokemon.types.map((type) => type.type.name).join(", ")}
            </div>
            <div>Stats:</div>
            <div style={{ marginLeft: "20px" }}>
              {selectedPokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  {stat.stat.name}: {stat.base_stat}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="move-select-label">Moves</InputLabel>
            <Select
              labelId="move-select-label"
              id="move-select"
              value={selectedMove}
              label="Moves"
              onChange={handleSelectMove}
            >
              {selectedPokemon.moves.map((move) => (
                <MenuItem key={move.move.name} value={move.move.name}>
                  {move.move.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleAddToMoveSet}
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
          >
            Add Move
          </Button>
        </div>
        <div style={{ display: "flex", marginTop: "20px" }}>
          <div style={{ marginRight: "50px" }}>
            <>
              <Button
                onClick={handleAddToTeam}
                variant="contained"
                color="primary"
              >
                Add Pokemon
              </Button>
              {"   "}
              <Button onClick={handleSaveTeamPreset} variant="contained">
                Save Team Preset
              </Button>
              {teamPresets.map((team, i) => {
                <p>Preset #{i}</p>;
              })}
              <p>Team Roster</p>
              {team.map((p: Pokemon, index: number) => {
                return (
                  <>
                    <Button
                      key={p.name}
                      onClick={() => handleRemoveFromTeam(index)}
                      style={{
                        display: "block",
                        margin: "10px auto",
                      }}
                      variant="contained"
                      color="secondary"
                    >
                      {p.name}
                    </Button>
                  </>
                );
              })}
            </>
          </div>
          <div>
            <p>Move Set</p>
            {moveSet.map((move: string, i: number) => {
              return (
                <Button
                  key={move}
                  onClick={() => handleRemoveFromMoveset(i)}
                  style={{
                    display: "block",
                    margin: "10px auto",
                  }}
                  variant="contained"
                  color="secondary"
                >
                  {move}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Pokemon Team Creator</h1>
        <h2>Select a Pokemon to begin</h2>

        {team.map((p: Pokemon, index: number) => {
          return (
            <Button
              key={p.name}
              onClick={() => handleRemoveFromTeam(index)}
              style={{
                display: "block",
                margin: "10px auto",
              }}
              variant="contained"
              color="secondary"
            >
              Remove {p.name}
            </Button>
          );
        })}
      </div>
    );
  }
}

export default PokeTeam;
