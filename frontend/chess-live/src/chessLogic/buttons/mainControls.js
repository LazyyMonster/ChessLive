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
    const [gameMoves, setGameMoves] = useState([]);

    const { resetGame, loadPreviewGame } = useChess();
    const { fetchOngoingGames, lichessStreamGame, setGameId } = useLichess();
    const {setGameFromLichess, makeMove, isPlayingOnline, setPlayerColor, getPgn } = useChess();

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
        setGameId(gameId);
        setGameMoves([]);
        let gameSetOnce = false;
        let playerColor = null; 
        let lastMoveCount = 0;
    
        lichessStreamGame((update) => {
            console.log("Update received:", update);
            if (update.type === "gameFull") {
                console.log("Handling 'gameFull' update...");

                const moves = update.state?.moves ? update.state.moves.split(" ") : [];
                const isWhitePlayer = update.white?.id !== undefined;
    
                playerColor = isWhitePlayer ? "white" : "black";
                setPlayerColor(playerColor);
    
    
                if (!gameSetOnce) {
                    gameSetOnce = true;
                    setGameFromLichess(moves);
                }
    
                setGameMoves(moves);
                lastMoveCount = moves.length;
            }
    
            console.log("Update type:", update.type);
    
            if (update.type === "gameState" && update.moves) {

                
                const moves = update.moves.split(" ");

            
                if (moves.length > lastMoveCount) {
                    const newMove = moves[moves.length - 1];
                    console.log(`New move detected: ${newMove}`);

                    const isOpponentTurn =
                        (playerColor === "white" && moves.length % 2 === 0) ||
                        (playerColor === "black" && moves.length % 2 !== 0);
            
                    console.log("Is opponent's turn:", isOpponentTurn);
            
                    if (isOpponentTurn) {
                        console.log(`Applying opponent's move: ${newMove}`);
                        makeMove({
                            from: newMove.slice(0, 2),
                            to: newMove.slice(2, 4),
                        });
                    }
        
                    console.log(`Updating lastMoveCount: ${lastMoveCount} -> ${moves.length}`);
                    lastMoveCount = moves.length;
                } else {
                    console.log("No new move detected.");
                }
                setGameMoves(moves);
            }
        }, gameId);
    
        console.log(`Started streaming updates for game: ${gameId}`);
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
                            !loading && <p>No ongoing games available.</p>
                        )}

                        {selectedGameId && (
                            <p>Selected Game ID: {selectedGameId}</p>
                        )}
                    </div>

                    {/* <div>
                        <h3>Moves</h3>
                        {gameMoves.length > 0 ? (
                            <ul>
                                {gameMoves.map((move, index) => (
                                    <li key={index}>{move}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No moves yet. Waiting for updates...</p>
                        )}
                    </div> */}
                </>
            )}
        </>
    );
}