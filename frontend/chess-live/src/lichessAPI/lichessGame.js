import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useChess } from '../chessLogic/chessGame';
import LichessOAuth from "./lichessOAuth";

const lichessHost = "https://lichess.org";

const LichessContext = createContext();

export const LichessProvider = ({ children }) => {

    const { token } = LichessOAuth();
    const { setGame, setFenAndLastMove } = useChess();
    const [ongoingGames, setOngoingGames] = useState([]);

    const fetchGamePGN = async (gameId) => {
        if (!token || !gameId) return null;

        try {
            const response = await fetch(`${lichessHost}/game/export/${gameId}`, {

            });

            if (!response.ok) {
                throw new Error("Failed to fetch PGN.");
            }

            const pgn = await response.text();

            if (!pgn) {
                console.error("No PGN data in response.");
                return null;
            }

            const movesRegex = /\n\n([\d\s\w\.\-\+x]*)(?=\s*\*)/;
            const match = pgn.match(movesRegex);

            if (match && match[1]) {
                return match[1].trim();
            } else {
                console.error("Failed to extract moves from PGN.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching PGN:", err);
            return null;
        }
    };

    const fetchOngoingGames = async () => {
        if (!token) { console.log('nima'); return; }

        try {
            const response = await fetch(`${lichessHost}/api/account/playing`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch ongoing games.");
            }

            const data = await response.json();

            if (data.nowPlaying) {
                const actualGames = data.nowPlaying.map((game) => ({
                    gameId: game.gameId,
                    opponentUsername: game.opponent?.username || "Unknown",
                    color: game.color,
                }));

                setOngoingGames(actualGames);
                console.log("Simplified ongoing games:", actualGames);
                return actualGames;
            } else {
                console.warn("No ongoing games found.");
                return [];
            }

        } catch (err) {
            console.error("Error fetching games:", err);
        }
    };

    useEffect(() => {
        if (token) {
            console.log('lama')
        }
    }, [token]);


    // useEffect(() => {
    //     if (ongoingGames.length > 0) {
    //         setGameFromLichess(ongoingGames[0].gameId);

    //     }
    // }, [ongoingGames]);




    // const [gameUpdates, setGameUpdates] = useState([]);
    // const activeStreams = useRef(new Set());

    // const startGameStream = (gameId) => {
    //     if (activeStreams.current.has(gameId)) {
    //         console.log(`Stream for game ${gameId} is already active.`);
    //         return;
    //     }

    //     console.log(`Starting stream for game ${gameId}`);
    //     activeStreams.current.add(gameId);

    //     const path = `/api/stream/game/${gameId}`;
    //     fetch(`${lichessHost}${path}`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     }).then((response) => {
    //         if (!response.body) {
    //             throw new Error("Readable stream not supported.");
    //         }

    //         readStream((update) => {
    //             setGameUpdates((prev) => [...prev, update]);
    //         })(response);
    //     })
    //         .catch((err) => {
    //             console.error(`Stream error for game ${gameId}:`, err);
    //         })
    // };

    // const readStream = (processLine) => (response) => {
    //     const stream = response.body.getReader();
    //     const decoder = new TextDecoder();
    //     let buffer = "";

    //     const loop = () => {
    //         stream.read().then(({ done, value }) => {
    //             if (done) {
    //                 if (buffer) processLine(JSON.parse(buffer));
    //                 return;
    //             }
    //             const chunk = decoder.decode(value, { stream: true });
    //             buffer += chunk;

    //             const lines = buffer.split(/\r?\n/);
    //             buffer = lines.pop();
    //             lines.filter(Boolean).forEach((line) => processLine(JSON.parse(line)));

    //             loop();
    //         });
    //     };
    //     loop();
    // };

    return (
        <LichessContext.Provider
            value={{
                fetchGamePGN,
                fetchOngoingGames
            }}
        >
            {children}
        </LichessContext.Provider>
    );
};

export const useLichess = () => useContext(LichessContext);