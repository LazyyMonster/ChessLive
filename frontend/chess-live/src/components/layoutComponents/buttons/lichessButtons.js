import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useChess } from "../../../chessGame/chessGame";
import { useLichess } from "../../../lichessAPI/lichessGame";
import { showSnackbar } from "../../alerts/customSnackbar";
import { useGlobalVariables } from "../../../globalVariables/globalVariables";

export default function LichessButtons() {
  const theme = useTheme();
  const [games, setGames] = useState([]);
  const { selectedGameId, setSelectedGameId } = useGlobalVariables();
  const [loading, setLoading] = useState(false);
  const stopStreamRef = useRef(null);
  const { fetchOngoingGames, lichessStreamGame, setGameId, setPlayerColor } = useLichess();
  const { setGameFromLichess, makeMove, setResult } = useChess();
  const lastMoveRef = useRef(null);

  const handleLoadGames = async () => {
    setSelectedGameId("");
    if (!sessionStorage.getItem("lichessToken")) {
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

  const handleGameSelection = (gameId, color) => {
    if (!sessionStorage.getItem("lichessToken")) {
      showSnackbar("You must login to load games!", "warning");
      return;
    }

    if (stopStreamRef.current) {
      stopStreamRef.current();
      stopStreamRef.current = null;
    }
    setSelectedGameId(gameId);
    setGameId(gameId);
    setPlayerColor(color);

    stopStreamRef.current = lichessStreamGame((update) => {
      if (update.type === "gameFull") {
        const moves = update.state?.moves ? update.state.moves.split(" ") : [];
        try {
          setGameFromLichess(moves);
          lastMoveRef.current = moves[moves.length - 1];
        }
        catch (err) {
          showSnackbar(`Invalid moves received: ${moves}`, "error");
        }
      }

      if (update.type === "gameState" && update.moves) {
        if (update.status === "resign") {
          const winner = update.winner;
          const loser = color === "white" && winner === "black" ? "White" : "Black";
          showSnackbar(`${loser} resigned. The winner is: ${winner}`, "info");
          setResult(winner + " won");
          return;
        }

        const moves = update.moves.split(" ");
        const newMove = moves[moves.length - 1];

        if (newMove !== lastMoveRef.current) {
          lastMoveRef.current = newMove;
          const isOpponentTurn =
            (color === "white" && moves.length % 2 === 0) ||
            (color === "black" && moves.length % 2 !== 0);

          if (isOpponentTurn) {
            makeMove({
              from: newMove.slice(0, 2),
              to: newMove.slice(2, 4),
            });
          }
        }

        if (update.status === "mate") {
          setResult(update.winner + " won");
          showSnackbar(`${update.winner} won by checkmate.`, "info");
          return;
        }
  
        if (update.status === "outoftime") {
          setResult(update.winner + " won");
          showSnackbar(`${update.winner} won on time.`, "info");
          return;
        }

        if (update.winner) {
          setResult(update.winner + " won");
          showSnackbar(`${update.winner} won.`, "info");
          return;
        }
      }

    }, gameId);
  };


  useEffect(() => {
    return () => {
      setSelectedGameId("");
      if (stopStreamRef.current) {
        stopStreamRef.current();
      }
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: theme.palette.primary.contrastText, marginBottom: "16px", textAlign: "center" }}
      >
        Load game from Lichess
      </Typography>

      <Button
        color="secondary"
        variant="contained"
        onClick={handleLoadGames}
        disabled={loading}
        sx={{
          width: "100%",
          marginBottom: "16px",
        }}
      >
        {loading ? "Loading..." : "Load Ongoing Games"}
      </Button>

      {games.length > 0 ? (
        <Select
          value={selectedGameId}
          onChange={(e) => {
            const selectedGame = games.find((game) => game.gameId === e.target.value);
            handleGameSelection(selectedGame.gameId, selectedGame.color);
          }}
          displayEmpty
          fullWidth
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
          }}
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
        !loading && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.contrastText, textAlign: "center" }}
          >
            No games available. Please start a game on Lichess and reload!
          </Typography>
        )
      )}

      {selectedGameId && (
        <Typography
          variant="body2"
          sx={{
            marginTop: "16px",
            color: theme.palette.primary.contrastText,
            textAlign: "center",
          }}
        >
          Selected Game ID: {selectedGameId}
        </Typography>
      )}
    </div>
  );
}