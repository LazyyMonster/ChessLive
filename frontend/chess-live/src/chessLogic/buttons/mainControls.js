import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { useChess } from "../chessGame";
import { useLichess } from "../../lichessAPI/lichessGame";

export default function MainControls() {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState("");
    const [loading, setLoading] = useState(false);

    const { resetGame, loadPreviewGame } = useChess();
    const { fetchOngoingGames, fetchGamePGN } = useLichess();

    const handleLoadGames = async () => {
        setLoading(true);
        try {
            const simplifiedGames = await fetchOngoingGames();
            if (simplifiedGames && simplifiedGames.length > 0) {
                setGames(simplifiedGames);
            } else {
                console.warn("No ongoing games found.");
                setGames([]);
            }
        } catch (error) {
            console.error("Failed to fetch ongoing games:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameSelection = (gameId) => {
        setSelectedGameId(gameId);
        console.log(fetchGamePGN(gameId));
    };

    return (
        <>
            <div>
                <Button variant="outlined" onClick={resetGame}>
                    Reset Game
                </Button>
                <Button variant="outlined" onClick={loadPreviewGame}>
                    Load Preview Game
                </Button>
            </div>

            <div>
                <h3>Ongoing Games</h3>

                <Button variant="outlined" onClick={handleLoadGames} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Load Ongoing Games"}
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
                            <MenuItem key={game.gameId} value={game.gameId}>
                                {`${game.opponentUsername} (${game.color})`}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    !loading && <p>No ongoing games available.</p>
                )}

                {selectedGameId && <p>Selected Game ID: {selectedGameId}</p>}
            </div>
        </>
    );
}
