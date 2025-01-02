import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useChess } from "../../../chessGame/chessGame";
import { useLichess } from "../../../lichessAPI/lichessGame";
import { showSnackbar } from "../../alerts/customSnackbar";
import { useGlobalVariables } from "../../../globalVariables/globalVariables";

export default function LichessButtons() {
  const [games, setGames] = useState([]);
  const { selectedGameId, setSelectedGameId } = useGlobalVariables();
  const [loading, setLoading] = useState(false);
  const stopStreamRef = useRef(null);
  const { fetchOngoingGames, lichessStreamGame, setGameId } = useLichess();
  const { setGameFromLichess, makeMove, setPlayerColor } = useChess();


  const handleLoadGames = async () => {
    if (!localStorage.getItem("lichessToken")) {
      showSnackbar("You must login to load games!", "warning");
      return;
    }
    setLoading(true);
    try {
      const simplifiedGames = await fetchOngoingGames();
      if (simplifiedGames && simplifiedGames.length > 0) {
        setGames(simplifiedGames);
      } else {
        setGames([]);
      }
    } catch (error) {
      showSnackbar("Failed to fetch ongoing games!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelection = (gameId) => {
    if (!localStorage.getItem("lichessToken")) {
      showSnackbar("You must login to load games!", "warning");
      return;
    }
    
    if (stopStreamRef.current) {
      stopStreamRef.current();
      stopStreamRef.current = null;
    }
    setSelectedGameId(gameId);
    setGameId(gameId);
    let playerColor = null;

    stopStreamRef.current = lichessStreamGame((update) => {
      if (update.type === "gameFull") {
        const moves = update.state?.moves ? update.state.moves.split(" ") : [];
        const isWhitePlayer = update.white?.id !== undefined;

        playerColor = isWhitePlayer ? "white" : "black";
        setPlayerColor(playerColor);
        setGameFromLichess(moves);
      }

      if (update.type === "gameState" && update.moves) {
        const moves = update.moves.split(" ");
        const newMove = moves[moves.length - 1];

        const isOpponentTurn =
          (playerColor === "white" && moves.length % 2 === 0) ||
          (playerColor === "black" && moves.length % 2 !== 0);

        if (isOpponentTurn) {
          makeMove({
            from: newMove.slice(0, 2),
            to: newMove.slice(2, 4),
          });
        }
      }
    }, gameId);
  };

  useEffect(() => {
    return () => {
      setSelectedGameId('');
      if (stopStreamRef.current) {
        stopStreamRef.current();
      }
    };
    
  }, []);


  return (
    <>
      <div>
        <h3>Ongoing Games</h3>

        <Button
          variant="outlined"
          onClick={handleLoadGames}
          disabled={loading}
        >
          Load Ongoing Games
        </Button>

        {games.length > 0 ? (
          <Select
            value={selectedGameId}
            onChange={(e) => handleGameSelection(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select a Game
            </MenuItem>
            {games.map((game) => (
              <MenuItem
                key={game.gameId}
                value={game.gameId}
              >
                {`${game.opponentUsername} (${game.color})`}
              </MenuItem>
            ))}
          </Select>
        ) : (
          !loading && <p>No games available</p>
        )}

        {selectedGameId && (
          <p>Selected Game ID: {selectedGameId}</p>
        )}
      </div>
    </>
  );
}