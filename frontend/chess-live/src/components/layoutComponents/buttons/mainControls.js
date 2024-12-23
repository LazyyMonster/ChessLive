import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { useChess } from "../chessGame";
import { useLichess } from "../../lichessAPI/lichessGame";
import { showSnackbar } from "../../components/alerts/customSnackbar";

export default function MainControls() {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState("");
    const [loading, setLoading] = useState(false);

    const { resetGame, loadPreviewGame } = useChess();
    const { fetchOngoingGames, lichessStreamGame, setGameId } = useLichess();
    const { setGameFromLichess, makeMove, isPlayingOnline, setPlayerColor } = useChess();

    const handleReset = () => {
        resetGame();
        showSnackbar("Board is ready!", "info");
    }
    const handleLoadGames = async () => {
        if (!localStorage.getItem("lichessToken")) {
            showSnackbar("You must login to load games!", "warning");
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
            showSnackbar('Failed to fetch ongoing games!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGameSelection = (gameId) => {
        setSelectedGameId(gameId);
        setGameId(gameId);
        let gameSetOnce = false;
        let playerColor = null;

        lichessStreamGame((update) => {
            if (update.type === "gameFull") {
                const moves = update.state?.moves ? update.state.moves.split(" ") : [];
                const isWhitePlayer = update.white?.id !== undefined;

                playerColor = isWhitePlayer ? "white" : "black";
                setPlayerColor(playerColor);


                if (!gameSetOnce) {
                    gameSetOnce = true;
                    setGameFromLichess(moves);
                }
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

    return (
        <>
            <div>
                <Button variant="outlined" onClick={handleReset}>
                    Reset Game
                </Button>
                <Button variant="outlined" onClick={loadPreviewGame}>
                    Load Preview Game
                </Button>
            </div>

            {isPlayingOnline && (
                <>
                    <div>
                        <h3>Ongoing Games</h3>

                        <Button
                            variant="outlined"
                            onClick={handleLoadGames}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Load Ongoing Games"
                            )}
                        </Button>

                        {games.length > 0 ? (
                            <Select
                                value={selectedGameId}
                                onChange={(e) =>
                                    handleGameSelection(e.target.value)
                                }
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
                            !loading
                        )}

                        {selectedGameId && (
                            <p>Selected Game ID: {selectedGameId}</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
}